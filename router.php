<?php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $path;

if (is_file($file)) {
  return false; // serve static files normally
}

// route .php files
if (file_exists(__DIR__ . $path . '.php')) {
  require __DIR__ . $path . '.php';
  exit;
}

return false;
?>