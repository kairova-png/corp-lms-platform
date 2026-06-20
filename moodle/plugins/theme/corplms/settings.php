<?php
// Настройки темы Corp LMS (вкладки в Администрировании → Внешний вид → Темы).
defined('MOODLE_INTERNAL') || die();

if ($ADMIN->fulltree) {
    $settings = new theme_boost_admin_settingspage_tabs(
        'themesettingcorplms',
        get_string('configtitle', 'theme_corplms')
    );

    $page = new admin_settingpage('theme_corplms_general', get_string('generalsettings', 'theme_corplms'));

    // Бренд-цвет — главный рычаг переброса под другой тендер без правки кода.
    $page->add(new admin_setting_configcolourpicker(
        'theme_corplms/brandcolor',
        get_string('brandcolor', 'theme_corplms'),
        get_string('brandcolor_desc', 'theme_corplms'),
        '#4F46E5'
    ));

    $settings->add($page);
}
