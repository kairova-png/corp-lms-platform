// Серверный клиент Moodle Web Services.
// node:http (а не fetch) — чтобы выставить Host-заголовок: Moodle редиректит при Host != wwwroot.
import http from "node:http";

const BASE = process.env.MOODLE_WS_BASE ?? "http://localhost:8080";
const HOST = process.env.MOODLE_WS_HOST ?? "";
const TOKEN = process.env.MOODLE_WS_TOKEN ?? "";

function call(fn: string, params: Record<string, string | number> = {}): Promise<any> {
  const base = new URL(BASE);
  const qs = new URLSearchParams({
    wstoken: TOKEN,
    wsfunction: fn,
    moodlewsrestformat: "json",
  });
  for (const [k, v] of Object.entries(params)) qs.set(k, String(v));
  const path = `/webservice/rest/server.php?${qs.toString()}`;
  const headers: Record<string, string> = {};
  if (HOST) headers["Host"] = HOST;

  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: base.hostname, port: base.port || 80, path, method: "GET", headers },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try {
            const data = JSON.parse(body);
            if (data && data.exception) {
              return reject(new Error(`${data.errorcode}: ${data.message}`));
            }
            resolve(data);
          } catch {
            reject(new Error("Moodle WS: невалидный JSON — " + body.slice(0, 160)));
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

export type MoodleCourse = {
  id: number;
  shortname: string;
  fullname: string;
  summary: string;
  progress?: number | null;
  lastaccess?: number;
  enrolledusercount?: number;
};

export type SiteInfo = {
  userid: number;
  fullname: string;
  sitename: string;
  release: string;
  userpictureurl?: string;
};

export const getSiteInfo = (): Promise<SiteInfo> =>
  call("core_webservice_get_site_info");

export const getMyCourses = (userid: number): Promise<MoodleCourse[]> =>
  call("core_enrol_get_users_courses", { userid });

// --- Каталог и страница курса ---
export type ContentModule = {
  id: number;            // cmid
  name: string;
  modname: string;       // page | quiz | assign | customcert | label | url ...
  url?: string;          // ссылка на активность в Moodle
  description?: string;
};
export type ContentSection = {
  id: number;
  name: string;
  section: number;
  summary?: string;
  modules: ContentModule[];
};

export const getAllCourses = (): Promise<any[]> =>
  call("core_course_get_courses_by_field").then((r) =>
    (r.courses ?? []).filter((c: any) => c.id !== 1)
  );

export const getCourseById = (id: number): Promise<any> =>
  call("core_course_get_courses_by_field", { field: "id", value: id }).then(
    (r) => (r.courses ?? [])[0]
  );

export const getCourseContents = (courseid: number): Promise<ContentSection[]> =>
  call("core_course_get_contents", { courseid });

// Контент страниц (mod_page) с HTML — оттуда достаём ссылку на видео.
export const getCoursePages = (courseid: number): Promise<any[]> =>
  call("mod_page_get_pages_by_courses", { "courseids[0]": courseid }).then(
    (r) => r.pages ?? []
  );

// Статус прохождения активностей (для прогресс-бара).
export const getCompletion = (courseid: number, userid: number): Promise<any[]> =>
  call("core_completion_get_activities_completion_status", { courseid, userid })
    .then((r) => r.statuses ?? [])
    .catch(() => []);

// Профиль пользователя.
export const getUser = (userid: number): Promise<any> =>
  call("core_user_get_users_by_field", { field: "id", "values[0]": userid }).then(
    (r) => (Array.isArray(r) ? r[0] : null)
  );

// Оценки по курсу.
export const getGrades = (courseid: number, userid: number): Promise<any[]> =>
  call("gradereport_user_get_grade_items", { courseid, userid })
    .then((r) => r.usergrades?.[0]?.gradeitems ?? [])
    .catch(() => []);

// Ближайшие события (календарь).
export const getCalendarEvents = (): Promise<any[]> =>
  call("core_calendar_get_action_events_by_timesort", { limitnum: 30 })
    .then((r) => r.events ?? [])
    .catch(() => []);

// Уведомления.
export const getNotifications = (userid: number): Promise<any[]> =>
  call("message_popup_get_popup_notifications", { useridto: userid })
    .then((r) => r.notifications ?? [])
    .catch(() => []);

// --- Тест (mod_quiz): реальная попытка ---
export const quizGetId = (courseid: number, cmid: number): Promise<number | undefined> =>
  call("mod_quiz_get_quizzes_by_courses", { "courseids[0]": courseid }).then((r) => {
    const list = r.quizzes ?? [];
    return (list.find((q: any) => q.coursemodule === cmid) ?? list[0])?.id;
  });

export const quizUnfinished = (quizid: number): Promise<number | null> =>
  call("mod_quiz_get_user_attempts", { quizid, status: "unfinished" })
    .then((r) => r.attempts?.[0]?.id ?? null)
    .catch(() => null);

export const quizStart = (quizid: number): Promise<number> =>
  call("mod_quiz_start_attempt", { quizid }).then((r) => r.attempt?.id);

export const quizGetData = (attemptid: number, page: number): Promise<any> =>
  call("mod_quiz_get_attempt_data", { attemptid, page });

export const quizProcess = (
  attemptid: number,
  data: { name: string; value: string }[],
  finish: boolean
): Promise<any> => {
  const params: Record<string, string | number> = { attemptid, finishattempt: finish ? 1 : 0 };
  data.forEach((d, i) => {
    params[`data[${i}][name]`] = d.name;
    params[`data[${i}][value]`] = d.value;
  });
  return call("mod_quiz_process_attempt", params);
};

export const quizReview = (attemptid: number): Promise<any> =>
  call("mod_quiz_get_attempt_review", { attemptid });

export const quizBestGrade = (quizid: number): Promise<number> =>
  call("mod_quiz_get_user_best_grade", { quizid })
    .then((r) => Number(r.grade ?? 0))
    .catch(() => 0);

// --- Задание (mod_assign): реальная сдача online-текста ---
export const assignGetId = (courseid: number, cmid: number): Promise<number | undefined> =>
  call("mod_assign_get_assignments", { "courseids[0]": courseid }).then((r) => {
    for (const c of r.courses ?? []) {
      for (const a of c.assignments ?? []) if (a.cmid === cmid) return a.id;
    }
    return r.courses?.[0]?.assignments?.[0]?.id;
  });

export const assignStatus = (assignid: number): Promise<any> =>
  call("mod_assign_get_submission_status", { assignid });

export const assignSave = (assignid: number, text: string): Promise<any> =>
  call("mod_assign_save_submission", {
    assignmentid: assignid,
    "plugindata[onlinetext_editor][text]": text,
    "plugindata[onlinetext_editor][format]": 1,
    "plugindata[onlinetext_editor][itemid]": 0,
  });

// Нормализованный статус сдачи.
export async function assignFullStatus(courseid: number, cmid: number) {
  const assignid = await assignGetId(courseid, cmid);
  if (!assignid) return { assignid: null, state: "new", text: "", grade: null, feedback: "" };
  const st = await assignStatus(assignid);
  const sub = st.lastattempt?.submission;
  const text =
    sub?.plugins?.find((p: any) => p.type === "onlinetext")?.editorfields?.[0]?.text ?? "";
  const fb = st.feedback ?? {};
  return {
    assignid,
    state: sub?.status ?? "new",
    text,
    grade: fb.grade?.grade ?? null,
    feedback: fb.plugins?.find((p: any) => p.type === "comments")?.editorfields?.[0]?.text ?? "",
  };
}
