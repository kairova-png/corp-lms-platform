<?php
// SCSS-колбэки темы Corp LMS. Дизайн-система — UX/UI Pro («Trust & Authority»).
defined('MOODLE_INTERNAL') || die();

/**
 * Основной SCSS — пресет Boost как база.
 */
function theme_corplms_get_main_scss_content($theme) {
    global $CFG;
    return file_get_contents($CFG->dirroot . '/theme/boost/scss/preset/default.scss');
}

/**
 * Pre-SCSS — шрифты дизайн-системы и переопределение переменных ДО Boost.
 * Бренд-цвет берётся из настройки темы (перекрас под тендер без кода).
 */
function theme_corplms_get_pre_scss($theme) {
    $brand = get_config('theme_corplms', 'brandcolor');
    if (empty($brand)) {
        $brand = '#4F46E5'; // learning indigo (дизайн-система UX/UI Pro)
    }
    $pre = "";
    // Переменные ДО компиляции Boost. Шрифты подключаются через <head> (additionalhtmlhead),
    // а НЕ через @import в SCSS — CSS-импорт перед SCSS-импортами Boost ломает Dart Sass.
    $pre .= '$primary: ' . $brand . ";\n";
    $pre .= '$success: #22C55E;' . "\n";
    $pre .= "\$font-family-sans-serif: 'Source Sans 3', system-ui, -apple-system, sans-serif;\n";
    $pre .= "\$headings-font-family: 'Lexend', 'Source Sans 3', system-ui, sans-serif;\n";
    return $pre;
}

/**
 * Extra-SCSS — фирменные правила ПОСЛЕ переменных (можно использовать $primary и т.д.).
 */
function theme_corplms_get_extra_scss($theme) {
    return '
// Corp LMS — фирменные доработки поверх Boost (дизайн-система UX/UI Pro)
.navbar.fixed-top { background-color: $primary; box-shadow: 0 2px 8px rgba(49,46,129,.12); }
.navbar.fixed-top .navbar-brand,
.navbar.fixed-top .nav-link { color: #fff; }
h1, h2, h3, h4, h5, .h1, .h2, .h3 { font-family: $headings-font-family; letter-spacing: -0.01em; }
.btn { border-radius: 8px; font-weight: 600; }
.btn-success { background-color: #22C55E; border-color: #22C55E; }
.card { border-radius: 14px; border-color: #E5E7EB; }
// Фирменная подача страницы входа
#page-login-index { background: linear-gradient(160deg, #EEF2FF, #ffffff 60%); }
#page-login-index .card { border-radius: 18px; box-shadow: 0 24px 48px -28px rgba(49,46,129,.4); }
#page-login-index .login-heading, #page-login-index h1 { color: #312E81; }
';
}
