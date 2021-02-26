<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");
// header("Content-Type: multipart/form-data; charset=UTF-8");

session_start();
$base_uri = __DIR__;

require __DIR__ . '/Config/Config.php';
require __DIR__ . '/Database/DB.php';
require __DIR__ . '/Config/Routes.php';
