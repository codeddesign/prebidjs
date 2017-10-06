<?php

$access_token = ''; // edit
$minimum_score = 0; // edit

if (!defined('GATORIO_ACCESS_TOKEN')) {
    define('GATORIO_ACCESS_TOKEN', $access_token, true);
}

if (!defined('GATORIO_MINIMUM_SCORE')) {
    define('GATORIO_MINIMUM_SCORE', $minimum_score, true);
}
