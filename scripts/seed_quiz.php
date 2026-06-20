<?php
// Сидер этапа 2: банк вопросов (GIFT-импорт, разные типы) + тест в каждом видеокурсе.
define('CLI_SCRIPT', true);
require('/var/www/html/config.php');
require_once($CFG->dirroot . '/course/modlib.php');
require_once($CFG->dirroot . '/lib/questionlib.php');
require_once($CFG->dirroot . '/question/format.php');
require_once($CFG->dirroot . '/question/format/gift/format.php');
require_once($CFG->dirroot . '/mod/quiz/locallib.php');

$GIFT = <<<'GIFT'
::Документ ОТ:: Какой кодекс регулирует охрану труда? {
=Трудовой кодекс
~Гражданский кодекс
~Налоговый кодекс
~Уголовный кодекс
}

::СИЗ обязательны:: Применение СИЗ на опасном производстве обязательно. {T}

::Шагов в ЧС:: Сколько основных шагов в типовом алгоритме действий при ЧС? {#4}

::Аббревиатура:: Назовите одним словом то, что защищает работника (СИЗ — это ... защиты)? {=средства}

::Соответствие СИЗ:: Сопоставьте средство защиты и назначение. {
=Каска -> Защита головы
=Перчатки -> Защита рук
=Очки -> Защита глаз
=Респиратор -> Защита дыхания
}

::Множественный выбор:: Что относится к СИЗ? {
~%50%Каска
~%50%Перчатки
~%-100%Письменный стол
~%-100%Офисное кресло
}

::Эссе ОТ:: Опишите порядок действий работника при обнаружении возгорания. {}
GIFT;

function import_questions($course, $gift) {
    global $CFG, $DB;
    $context = context_course::instance($course->id);
    question_make_default_categories([$context]);
    $cat = question_get_default_category($context->id);

    $tmp = make_request_directory() . '/q.gift';
    file_put_contents($tmp, $gift);

    $qformat = new qformat_gift();
    $qformat->setContexts([$context]);
    $qformat->setCourse($course);
    $qformat->setCategory($cat);
    $qformat->setFilename($tmp);
    $qformat->setRealfilename('q.gift');
    $qformat->setMatchgrades('error');
    $qformat->setCatfromfile(false);
    $qformat->setContextfromfile(false);
    $qformat->setStoponerror(false);
    $qformat->setCattofile(false);
    $qformat->setContexttofile(false);

    ob_start();
    $ok = $qformat->importpreprocess() && $qformat->importprocess() && $qformat->importpostprocess();
    ob_end_clean();

    $qids = $DB->get_fieldset_sql(
        "SELECT DISTINCT q.id
           FROM {question} q
           JOIN {question_versions} qv ON qv.questionid = q.id
           JOIN {question_bank_entries} qbe ON qbe.id = qv.questionbankentryid
          WHERE qbe.questioncategoryid = ?
       ORDER BY q.id", [$cat->id]);
    return $qids;
}

function create_quiz($course, $sectionnum, $name, $intro) {
    global $DB;
    $R = 69904; // 0x11110 — показывать во всех фазах review
    $mi = (object)[
        'modulename' => 'quiz', 'module' => $DB->get_field('modules', 'id', ['name' => 'quiz'], MUST_EXIST),
        'course' => $course->id, 'section' => $sectionnum,
        'visible' => 1, 'visibleoncoursepage' => 1,
        'name' => $name, 'intro' => $intro, 'introformat' => FORMAT_HTML,
        'timeopen' => 0, 'timeclose' => 0, 'timelimit' => 0, 'overduehandling' => 'autosubmit', 'graceperiod' => 0,
        'preferredbehaviour' => 'deferredfeedback', 'canredoquestions' => 0,
        'attempts' => 0, 'attemptonlast' => 0, 'grademethod' => 1,
        'decimalpoints' => 2, 'questiondecimalpoints' => -1,
        'reviewattempt' => $R, 'reviewcorrectness' => $R, 'reviewmarks' => $R,
        'reviewspecificfeedback' => $R, 'reviewgeneralfeedback' => $R,
        'reviewrightanswer' => $R, 'reviewoverallfeedback' => 4368,
        'questionsperpage' => 1, 'navmethod' => 'free', 'shuffleanswers' => 1,
        'sumgrades' => 0, 'grade' => 100, 'gradepass' => 70,
        'showuserpicture' => 0, 'showblocks' => 0,
        'quizpassword' => '', 'subnet' => '', 'browsersecurity' => '-',
        'delay1' => 0, 'delay2' => 0,
        'completionattemptsexhausted' => 0, 'completionminattempts' => 0,
        'cmidnumber' => '',
    ];
    $info = add_moduleinfo($mi, $course);
    return $DB->get_record('quiz', ['id' => $info->instance], '*', MUST_EXIST);
}

$courses = $DB->get_records_select('course', "shortname IN ('VID-OT','VID-PB','VID-CYBER')");
$log = ['quizzes' => 0, 'questions' => 0, 'slots' => 0, 'errors' => []];

foreach ($courses as $course) {
    if ($DB->record_exists('quiz', ['course' => $course->id])) { echo "skip quiz (exists): {$course->shortname}\n"; continue; }
    try {
        $qids = import_questions($course, $GIFT);
        $log['questions'] += count($qids);
        $secnum = $DB->get_field_sql("SELECT MAX(section) FROM {course_sections} WHERE course = ?", [$course->id]);
        $quiz = create_quiz($course, max(1, (int)$secnum), 'Итоговый тест', '<p>Проверьте знания по курсу. Проходной балл — 70%.</p>');
        $log['quizzes']++;
        foreach ($qids as $qid) { quiz_add_quiz_question($qid, $quiz, 0); $log['slots']++; }
        quiz_update_sumgrades($quiz);
        rebuild_course_cache($course->id, true);
        echo "quiz ok: {$course->shortname} (вопросов: " . count($qids) . ")\n";
    } catch (Throwable $e) {
        $log['errors'][] = "{$course->shortname}: " . $e->getMessage();
    }
}

echo "\n=== ИТОГ ===\n";
echo "тестов: {$log['quizzes']} | вопросов в банке: {$log['questions']} | прикреплено слотов: {$log['slots']}\n";
if ($log['errors']) { echo "ОШИБКИ:\n"; foreach ($log['errors'] as $e) echo "  - $e\n"; }
else echo "ошибок нет\n";
