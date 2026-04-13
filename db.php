<?php
$host   = "localhost";
$dbname = "comparekarodb";
$user   = "root";
$pass   = "200608Dec"; 
$port   = "3307";

try {
  $pdo = new PDO("mysql:host=$host;dbname=$comparekarodb", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die(json_encode(["success" => false, "message" => $e->getMessage()]));
}
?>