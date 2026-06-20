<?php
// Сидер этапа 3: сертификат (customcert) с элементами + completion=view в каждом видеокурсе.
define('CLI_SCRIPT', true);
require('/var/www/html/config.php');
require_once($CFG->dirroot . '/course/modlib.php');

function add_element($pageid, $element, $name, $data, $posx, $posy, $fontsize, $width, $align) {
    global $DB;
    $row = (object)[
        'pageid' => $pageid, 'name' => $name, 'element' => $element, 'data' => $data,
        'font' => 'helvetica', 'fontsize' => $fontsize, 'colour' => '#1F2430',
        'posx' => $posx, 'posy' => $posy, 'width' => $width, 'refpoint' => 0,
        'alignment' => $align, 'sequence' => 0, 'timecreated' => time(), 'timemodified' => time(),
    ];
    // 'alignment' появилась не во всех версиях — подстрахуемся.
    try { return $DB->insert_record('customcert_elements', $row); }
    catch (Throwable $e) { unset($row->alignment); return $DB->insert_record('customcert_elements', $row); }
}

function create_cert($course, $sectionnum) {
    global $DB;
    $mi = (object)[
        'modulename' => 'customcert', 'module' => $DB->get_field('modules', 'id', ['name' => 'customcert'], MUST_EXIST),
        'course' => $course->id, 'section' => $sectionnum,
        'visible' => 1, 'visibleoncoursepage' => 1,
        'name' => 'Сертификат о прохождении', 'intro' => '<p>Доступен после прохождения курса.</p>', 'introformat' => FORMAT_HTML,
        'emailstudents' => 0, 'emailteachers' => 0, 'emailothers' => '',
        'protection' => '', 'requiredtime' => 0, 'verifyany' => 0, 'deliveryoption' => 'inline',
        'completion' => 2, 'completionview' => 1, // completion = view
        'cmidnumber' => '',
    ];
    $info = add_moduleinfo($mi, $course);
    $cert = $DB->get_record('customcert', ['id' => $info->instance], '*', MUST_EXIST);
    // дефолтная страница шаблона
    $pageid = $DB->get_field('customcert_pages', 'id', ['templateid' => $cert->templateid], IGNORE_MULTIPLE);
    if ($pageid) {
        add_element($pageid, 'text', 'Заголовок', 'СЕРТИФИКАТ', 105, 40, 28, 0, 'C');
        add_element($pageid, 'text', 'Подзаголовок', 'настоящим подтверждается, что', 105, 60, 12, 0, 'C');
        add_element($pageid, 'studentname', 'Имя', '', 105, 75, 24, 0, 'C');
        add_element($pageid, 'coursename', 'Курс', 'fullname', 105, 100, 14, 0, 'C');
        add_element($pageid, 'date', 'Дата', '1', 105, 120, 11, 0, 'C'); // 1 = дата выдачи
    }
    return [$info, $pageid];
}

$courses = $DB->get_records_select('course', "shortname IN ('VID-OT','VID-PB','VID-CYBER')");
$log = ['certs' => 0, 'elements_pages' => 0, 'errors' => []];

foreach ($courses as $course) {
    if ($DB->record_exists('customcert', ['course' => $course->id])) { echo "skip cert (exists): {$course->shortname}\n"; continue; }
    try {
        $secnum = $DB->get_field_sql("SELECT MAX(section) FROM {course_sections} WHERE course = ?", [$course->id]);
        [$info, $pageid] = create_cert($course, max(1, (int)$secnum));
        $log['certs']++;
        if ($pageid) $log['elements_pages']++;
        rebuild_course_cache($course->id, true);
        echo "cert ok: {$course->shortname} (page=" . ($pageid ?: 'нет') . ")\n";
    } catch (Throwable $e) {
        $log['errors'][] = "{$course->shortname}: " . $e->getMessage();
    }
}

echo "\n=== ИТОГ ===\n";
echo "сертификатов: {$log['certs']} | с элементами: {$log['elements_pages']}\n";
if ($log['errors']) { echo "ОШИБКИ:\n"; foreach ($log['errors'] as $e) echo "  - $e\n"; }
else echo "ошибок нет\n";
