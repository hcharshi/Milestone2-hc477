<?php
require_once('path.inc');
require_once('get_host_info.inc');
require_once('rabbitMQLib.inc');

$cfg = require __DIR__ . '/config.inc';

function login($user, $pass) {
global $cfg;
$mysqli = new mysqli(
$cfg['db_host'],
$cfg['db_user'],
$cfg['db_password'],
$cfg['db_name']
);
if ($mysqli->connect_error) {
return ['success'=>false, 'message'=>'DB connect failed: '.$mysqli->connect_error];
}

$stmt = $mysqli->prepare(
'SELECT password_hash FROM users WHERE username = ? OR email = ?'
);
$stmt->bind_param('ss', $user, $user);
$stmt->execute();
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()) {
if (password_verify($pass, $row['password_hash'])) {
return ['success'=>true, 'session_id'=>session_id()];
}
}

return ['success'=>false, 'message'=>'Invalid credentials'];
}

function validate_session($session_id) {
return ['success'=>false, 'message'=>'Session validation not implemented'];
}

function request_processor($req) {
if (!isset($req['type'])) {
return ['success'=>false, 'message'=>'Error: unsupported message type'];
}

switch ($req['type']) {
case 'login':
return login($req['username'], $req['password']);
case 'validate_session':
return validate_session($req['session_id']);
case 'echo':
return ['success'=>true, 'message'=>'Echo: '.$req['message']];
default:
return ['success'=>false, 'message'=>'Unknown type'];
}
}

$server = new rabbitMQServer("testRabbitMQ.ini", "sampleServer");
echo "Rabbit MQ Server Start\n";
$server->process_requests('request_processor');
echo "Rabbit MQ Server Stop\n";
exit();
?>