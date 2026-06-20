<?php
// Страница настроек плагина в Администрировании сайта.
defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    $settings = new admin_settingpage('local_corplms', get_string('settings', 'local_corplms'));
    $ADMIN->add('localplugins', $settings);

    $settings->add(new admin_setting_heading(
        'local_corplms/generalheading',
        get_string('generalsettings', 'local_corplms'),
        ''
    ));

    // Заготовка: включение модуля автоназначения по оргструктуре (гэп ТЗ п.6).
    $settings->add(new admin_setting_configcheckbox(
        'local_corplms/enable_orgassign',
        get_string('orgintegration', 'local_corplms'),
        get_string('orgintegration_desc', 'local_corplms'),
        0
    ));
}
