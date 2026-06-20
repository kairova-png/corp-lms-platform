<?php
// Corp LMS — брендируемая корпоративная тема (дочерняя к Boost).
defined('MOODLE_INTERNAL') || die();

$plugin->component   = 'theme_corplms';
$plugin->version     = 2026062100;
$plugin->requires    = 2024100700;          // Moodle 4.5
$plugin->dependencies = ['theme_boost' => 2024100700];
$plugin->maturity    = MATURITY_ALPHA;
$plugin->release     = '0.1.0';
