<?php
// Moodle config — управляется переменными окружения (12-factor).
// На on-prem заказчика значения приходят из .env / секретов оркестратора.
unset($CFG);
global $CFG;
$CFG = new stdClass();

$CFG->dbtype    = 'pgsql';
$CFG->dblibrary = 'native';
$CFG->dbhost    = getenv('MOODLE_DB_HOST') ?: 'db';
$CFG->dbname    = getenv('MOODLE_DB_NAME') ?: 'moodle';
$CFG->dbuser    = getenv('MOODLE_DB_USER') ?: 'moodle';
$CFG->dbpass    = getenv('MOODLE_DB_PASS') ?: 'moodle';
$CFG->prefix    = 'mdl_';
$CFG->dboptions = [
    'dbpersist' => 0,
    'dbsocket'  => 0,
    'dbport'    => getenv('MOODLE_DB_PORT') ?: 5432,
];

$CFG->wwwroot   = getenv('MOODLE_WWWROOT') ?: 'http://localhost:8080';
$CFG->dataroot  = '/var/moodledata';
$CFG->admin     = 'admin';
$CFG->directorypermissions = 02777;

// Redis: общий кэш приложения + хранилище сессий (кластер-ready)
$CFG->session_handler_class = '\core\session\redis';
$CFG->session_redis_host    = getenv('MOODLE_REDIS_HOST') ?: 'cache';
$CFG->session_redis_port    = getenv('MOODLE_REDIS_PORT') ?: 6379;
$CFG->session_redis_prefix  = 'mdl_sess_';

// Ограничение одновременных сессий пользователя — п.12.2 ТЗ (до 100 на аккаунт уровень настраивается в UI)
$CFG->limitconcurrentlogins = 0; // настраивается per-policy после установки

require_once(__DIR__ . '/lib/setup.php');
