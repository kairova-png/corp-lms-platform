<?php
// Capabilities плагина local_corplms.
defined('MOODLE_INTERNAL') || die();

$capabilities = [
    // Доступ к панели администрирования расширений Corp LMS.
    'local/corplms:manage' => [
        'captype'      => 'write',
        'contextlevel' => CONTEXT_SYSTEM,
        'archetypes'   => [
            'manager' => CAP_ALLOW,
        ],
    ],
    // Просмотр аналитических дашбордов (охват, IDP, KPI) — п.3.7/8 ТЗ.
    'local/corplms:viewdashboards' => [
        'captype'      => 'read',
        'contextlevel' => CONTEXT_SYSTEM,
        'archetypes'   => [
            'manager'        => CAP_ALLOW,
            'coursecreator'  => CAP_ALLOW,
        ],
    ],
];
