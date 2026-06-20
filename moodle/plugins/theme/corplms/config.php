<?php
// Конфигурация темы Corp LMS (child of Boost).
defined('MOODLE_INTERNAL') || die();

$THEME->name = 'corplms';
$THEME->parents = ['boost'];
$THEME->sheets = [];
$THEME->editor_sheets = [];
$THEME->usefallback = true;

// SCSS: база — пресет Boost, плюс наши переменные (pre) и правила (extra).
$THEME->scss = function($theme) {
    return theme_corplms_get_main_scss_content($theme);
};
$THEME->prescsscallback = 'theme_corplms_get_pre_scss';
$THEME->extrascsscallback = 'theme_corplms_get_extra_scss';

$THEME->rendererfactory = 'theme_overridden_renderer_factory';
$THEME->haseditswitch = true;
$THEME->usescourseindex = true;
$THEME->iconsystem = \core\output\icon_system::FONTAWESOME;
