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
