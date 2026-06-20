<?php
// Сидер демо-контента (этап 1): категории + видеокурсы (Udemy-стиль) + задания.
// Идемпотентно по shortname курса. Запуск в контейнере: php /tmp/seed_content.php
define('CLI_SCRIPT', true);
require('/var/www/html/config.php');
require_once($CFG->dirroot . '/course/lib.php');
require_once($CFG->dirroot . '/course/modlib.php');
require_once($CFG->dirroot . '/lib/resourcelib.php');

$VID = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
];

// --- категория ---
function ensure_category($name) {
    $existing = core_course_category::get_all();
    foreach ($existing as $c) { if ($c->name === $name) return $c->id; }
    return core_course_category::create((object)['name' => $name])->id;
}

// --- видеоурок (mod_page с HTML5-плеером) ---
function add_video_lesson($course, $sectionnum, $name, $videourl, $desc) {
    global $DB;
    $html = '<div class="ratio ratio-16x9 mb-3"><video controls preload="metadata" style="width:100%;border-radius:12px" '
          . 'src="' . $videourl . '"></video></div><p>' . s($desc) . '</p>';
    $mi = (object)[
        'modulename' => 'page',
        'module' => $DB->get_field('modules', 'id', ['name' => 'page'], MUST_EXIST),
        'course' => $course->id, 'section' => $sectionnum,
        'visible' => 1, 'visibleoncoursepage' => 1,
        'name' => $name, 'intro' => '', 'introformat' => FORMAT_HTML,
        'content' => $html, 'contentformat' => FORMAT_HTML,
        'display' => RESOURCELIB_DISPLAY_AUTO,
        'printheading' => 1, 'printintro' => 0, 'printlastmodified' => 1,
        'cmidnumber' => '',
    ];
    return add_moduleinfo($mi, $course);
}

// --- интро раздела (label) ---
function add_section_label($course, $sectionnum, $html) {
    global $DB;
    $mi = (object)[
        'modulename' => 'label',
        'module' => $DB->get_field('modules', 'id', ['name' => 'label'], MUST_EXIST),
        'course' => $course->id, 'section' => $sectionnum,
        'visible' => 1, 'visibleoncoursepage' => 1,
        'name' => 'Раздел', 'intro' => $html, 'introformat' => FORMAT_HTML,
        'cmidnumber' => '',
    ];
    return add_moduleinfo($mi, $course);
}

// --- задание (assign) ---
function add_assignment($course, $sectionnum, $name, $intro) {
    global $DB;
    $mi = (object)[
        'modulename' => 'assign',
        'module' => $DB->get_field('modules', 'id', ['name' => 'assign'], MUST_EXIST),
        'course' => $course->id, 'section' => $sectionnum,
        'visible' => 1, 'visibleoncoursepage' => 1,
        'name' => $name, 'intro' => $intro, 'introformat' => FORMAT_HTML,
        'alwaysshowdescription' => 1, 'submissiondrafts' => 0,
        'requiresubmissionstatement' => 0,
        'sendnotifications' => 0, 'sendlatenotifications' => 0, 'sendstudentnotifications' => 1,
        'duedate' => 0, 'cutoffdate' => 0, 'gradingduedate' => 0, 'allowsubmissionsfromdate' => 0,
        'grade' => 100, 'completionsubmit' => 0,
        'teamsubmission' => 0, 'requireallteammemberssubmit' => 0, 'teamsubmissiongroupingid' => 0,
        'blindmarking' => 0, 'markingworkflow' => 0, 'markingallocation' => 0,
        'maxattempts' => -1, 'attemptreopenmethod' => 'none', 'preventsubmissionnotingroup' => 0,
        'assignsubmission_onlinetext_enabled' => 1,
        'assignsubmission_file_enabled' => 1, 'assignsubmission_file_maxfiles' => 1,
        'assignsubmission_file_maxsizebytes' => 0, 'assignsubmission_file_filetypes' => '',
        'assignfeedback_comments_enabled' => 1,
        'cmidnumber' => '',
    ];
    return add_moduleinfo($mi, $course);
}

// ====== КАТАЛОГ ======
$catid = ensure_category('Видеокурсы Corp LMS');
$courses = [
    [
        'shortname' => 'VID-OT', 'fullname' => 'Охрана труда: базовый видеокурс',
        'summary' => 'Видеокурс по охране труда: от основ до аттестации. Уроки, практическое задание, тест и сертификат.',
        'sections' => [
            ['Введение в охрану труда', [['Знакомство с курсом', 0, 'Чему вы научитесь и как устроен курс.'], ['Зачем нужна охрана труда', 1, 'Роль ОТ в производственной безопасности.']]],
            ['Основы безопасности', [['Средства индивидуальной защиты', 2, 'Виды СИЗ и правила применения.'], ['Действия при ЧС', 3, 'Алгоритмы поведения в чрезвычайных ситуациях.']]],
        ],
        'assignment' => ['Практика: чек-лист рабочего места', 'Загрузите заполненный чек-лист оценки рабочего места по видеоинструкции.'],
    ],
    [
        'shortname' => 'VID-PB', 'fullname' => 'Промышленная безопасность: видеокурс',
        'summary' => 'Промбезопасность на опасных производственных объектах: видеоуроки, задание, тест, сертификат.',
        'sections' => [
            ['Опасные производственные объекты', [['Классификация ОПО', 1, 'Категории и требования.'], ['Идентификация рисков', 2, 'Как выявлять опасности.']]],
            ['Производственный контроль', [['Система ПК', 3, 'Организация производственного контроля.']]],
        ],
        'assignment' => ['Кейс: оценка риска', 'Опишите оценку риска для предложенного сценария и приложите файл.'],
    ],
    [
        'shortname' => 'VID-CYBER', 'fullname' => 'Кибербезопасность для сотрудников',
        'summary' => 'Базовая кибергигиена: фишинг, пароли, данные. Короткие видео, задание, тест, сертификат.',
        'sections' => [
            ['Угрозы и фишинг', [['Что такое фишинг', 0, 'Как распознать фишинговое письмо.'], ['Социальная инженерия', 1, 'Манипуляции и защита.']]],
            ['Гигиена доступа', [['Надёжные пароли и 2FA', 2, 'Парольная политика и двухфакторка.']]],
        ],
        'assignment' => ['Задание: разбор фишингового письма', 'Найдите признаки фишинга в приложенном письме и опишите их.'],
    ],
];

$log = ['courses' => 0, 'videos' => 0, 'labels' => 0, 'assignments' => 0, 'errors' => []];

foreach ($courses as $cdef) {
    if ($DB->record_exists('course', ['shortname' => $cdef['shortname']])) {
        echo "skip (exists): {$cdef['shortname']}\n";
        continue;
    }
    $course = create_course((object)[
        'category' => $catid, 'fullname' => $cdef['fullname'], 'shortname' => $cdef['shortname'],
        'summary' => $cdef['summary'], 'summaryformat' => FORMAT_HTML,
        'format' => 'topics', 'visible' => 1, 'numsections' => count($cdef['sections']),
        'enablecompletion' => 1,
    ]);
    $log['courses']++;
    course_create_sections_if_missing($course, range(0, count($cdef['sections'])));

    $sn = 1;
    foreach ($cdef['sections'] as $sec) {
        [$sectitle, $lessons] = $sec;
        // переименовать раздел
        $DB->set_field('course_sections', 'name', $sectitle, ['course' => $course->id, 'section' => $sn]);
        try { add_section_label($course, $sn, '<h4>' . s($sectitle) . '</h4><p class="text-muted">Видеоуроки раздела</p>'); $log['labels']++; }
        catch (Throwable $e) { $log['errors'][] = "label {$cdef['shortname']}/$sn: " . $e->getMessage(); }

        foreach ($lessons as $les) {
            [$lname, $vidx, $desc] = $les;
            try { add_video_lesson($course, $sn, $lname, $GLOBALS['VID'][$vidx % count($GLOBALS['VID'])], $desc); $log['videos']++; }
            catch (Throwable $e) { $log['errors'][] = "video {$cdef['shortname']}/$lname: " . $e->getMessage(); }
        }
        $sn++;
    }

    // задание — в последний раздел
    try { add_assignment($course, count($cdef['sections']), $cdef['assignment'][0], $cdef['assignment'][1]); $log['assignments']++; }
    catch (Throwable $e) { $log['errors'][] = "assign {$cdef['shortname']}: " . $e->getMessage(); }

    rebuild_course_cache($course->id, true);
    echo "created: {$cdef['shortname']} ({$cdef['fullname']})\n";
}

echo "\n=== ИТОГ ===\n";
echo "курсов: {$log['courses']} | видеоуроков: {$log['videos']} | лейблов: {$log['labels']} | заданий: {$log['assignments']}\n";
if ($log['errors']) { echo "ОШИБКИ (" . count($log['errors']) . "):\n"; foreach ($log['errors'] as $e) echo "  - $e\n"; }
else echo "ошибок нет\n";
