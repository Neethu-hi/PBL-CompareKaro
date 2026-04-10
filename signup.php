<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

$data     = json_decode(file_get_contents("php://input"), true);
$name     = trim($data['name']     ?? '');
$email    = trim($data['email']    ?? '');
$password =      $data['password'] ?? '';
$confirm  =      $data['confirm']  ?? '';

/* ── Validate ── */
if (!$name || !$email || !$password || !$confirm) {
  echo json_encode(["success" => false, "message" => "All fields are required."]);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(["success" => false, "message" => "Invalid email address."]);
  exit;
}

if (strlen($password) < 6) {
  echo json_encode(["success" => false, "message" => "Password must be at least 6 characters."]);
  exit;
}

if ($password !== $confirm) {
  echo json_encode(["success" => false, "message" => "Passwords do not match."]);
  exit;
}

/* ── Check if email already exists ── */
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
  echo json_encode(["success" => false, "message" => "An account with this email already exists."]);
  exit;
}

/* ── Save user ── */
$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt   = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->execute([$name, $email, $hashed]);

echo json_encode(["success" => true, "message" => "Account created successfully!"]);
?>