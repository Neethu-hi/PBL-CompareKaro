<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

$data     = json_decode(file_get_contents("php://input"), true);
$email    = trim($data['email']    ?? '');
$password =      $data['password'] ?? '';

/* ── Validate ── */
if (!$email || !$password) {
  echo json_encode(["success" => false, "message" => "Email and password are required."]);
  exit;
}

/* ── Find user ── */
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

/* ── Check password ── */
if (!$user || !password_verify($password, $user['password'])) {
  echo json_encode(["success" => false, "message" => "Wrong email or password."]);
  exit;
}

/* ── Start session ── */
$_SESSION['user_id'] = $user['id'];
$_SESSION['name']    = $user['name'];
$_SESSION['email']   = $user['email'];

echo json_encode([
  "success" => true,
  "message" => "Logged in successfully!",
  "name"    => $user['name']
]);
?>