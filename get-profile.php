<?php
header('Content-Type: application/json');
echo json_encode([
  'email'    => 'alice@example.com',
  'username' => 'alice123'
]);