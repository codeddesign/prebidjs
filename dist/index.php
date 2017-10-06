<?php

require_once '../app/vendor/autoload.php';

// config: check
if (!trim(GATORIO_ACCESS_TOKEN)) {
    exit('Access token is missing from config.'.PHP_EOL);
}

// request: initiate
$request = Symfony\Component\HttpFoundation\Request::createFromGlobals();

// request: validate
if (!preg_match('/^\/campaign\/([0-9]{1,})/', $request->server->get('REQUEST_URI'), $matched)) {
    http_response_code(404);
    exit;
}

// campaign: validate
$campaign_path = './campaign/'.$matched[1].'.json';
if (!file_exists($campaign_path)) {
    http_response_code(404);
    exit;
}

// gator: initiate
$gator = new Gator\Gator(GATORIO_ACCESS_TOKEN);

// gator: fetch score response
$response = $gator->score(
    $request->server->get('REMOTE_ADDR') ?? '',
    $request->headers->get('User-Agent') ?? '',
    $request->server->get('HTTP_REFERER') ?? '',
    $request->get('referrer') ?? ''
);

// gator: validate score
if (($score = $response->data->score ?? 0) < GATORIO_MINIMUM_SCORE) {
    header('Content-Type: application/json', false, 401);
    echo json_encode(['score' => $score]);
    exit;
}

// campaign: response
header('Content-Type: application/json');
echo file_get_contents($campaign_path);
