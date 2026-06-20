<?php
// Bootstrap для headless-фронта:
//  - включает Web Services + REST + mobile-сервис
//  - создаёт демо-курс и демо-студента, записывает студента на курс
//  - выпускает WS-токен для СТУДЕНТА (не админа — админам токены WS запрещены)
// Запуск внутри контейнера: php /tmp/ws_bootstrap.php
define('CLI_SCRIPT', true);
require('/var/www/html/config.php');
require_once($CFG->dirroot . '/lib/externallib.php');
require_once($CFG->dirroot . '/course/lib.php');
require_once($CFG->dirroot . '/user/lib.php');

set_config('enablewebservices', 1);
set_config('enablemobilewebservice', 1);
set_config('webserviceprotocols', 'rest');

// REST-капабилити для роли «Аутентифицированный пользователь» (иначе accessexception).
$urole = $DB->get_record('role', ['shortname' => 'user'], '*', MUST_EXIST);
assign_capability('webservice/rest:use', CAP_ALLOW, $urole->id, context_system::instance()->id, true);
// Включить запись mobile-сервиса (CLI set_config не дёргает колбэк активации).
$DB->set_field('external_services', 'enabled', 1, ['shortname' => 'moodle_mobile_app']);
context_system::instance()->mark_dirty();

// --- демо-курс ---
$shortname = 'DEMO101';
if (!$course = $DB->get_record('course', ['shortname' => $shortname])) {
    $course = create_course((object)[
        'category'  => 1,
        'fullname'  => 'Демо: Охрана труда и техника безопасности',
        'shortname' => $shortname,
        'summary'   => 'Демонстрационный курс для headless-фронта Corp LMS.',
        'format'    => 'topics',
        'visible'   => 1,
    ]);
}

// второй демо-курс для наглядности каталога
$shortname2 = 'DEMO102';
if (!$DB->get_record('course', ['shortname' => $shortname2])) {
    create_course((object)[
        'category'  => 1,
        'fullname'  => 'Демо: Промышленная безопасность',
        'shortname' => $shortname2,
        'summary'   => 'Второй демо-курс.',
        'format'    => 'topics',
        'visible'   => 1,
    ]);
}

// --- демо-студент ---
$username = 'demo1';
if (!$user = $DB->get_record('user', ['username' => $username])) {
    $uid = user_create_user((object)[
        'username'  => $username,
        'auth'      => 'manual',
        'confirmed' => 1,
        'mnethostid'=> $CFG->mnet_localhost_id,
        'firstname' => 'Айгерим',
        'lastname'  => 'Демо',
        'email'     => 'demo1@corp-lms.kz',
    ], false, false);
    $user = $DB->get_record('user', ['id' => $uid]);
    $authman = get_auth_plugin('manual');
    $authman->user_update_password($user, 'Demo#User2026');
}

// --- запись студента на курс ---
$studentrole = $DB->get_record('role', ['shortname' => 'student'], '*', MUST_EXIST);
$manual = enrol_get_plugin('manual');
if (!$instance = $DB->get_record('enrol', ['courseid' => $course->id, 'enrol' => 'manual'])) {
    $iid = $manual->add_default_instance($DB->get_record('course', ['id' => $course->id]));
    $instance = $DB->get_record('enrol', ['id' => $iid]);
}
$manual->enrol_user($instance, $user->id, $studentrole->id);

// --- WS-токен для студента на mobile-сервисе ---
$service = $DB->get_record('external_services', ['shortname' => 'moodle_mobile_app'], '*', MUST_EXIST);
$context = context_system::instance();
$args = [EXTERNAL_TOKEN_PERMANENT, $service, $user->id, $context, 0, ''];
$token = class_exists('\core_external\util')
    ? \core_external\util::generate_token(...$args)
    : external_generate_token(...$args);

echo "TOKEN=" . $token . "\n";
echo "WSUSER=" . $username . " / Demo#User2026\n";
echo "COURSE=" . $course->fullname . " (id " . $course->id . ")\n";
