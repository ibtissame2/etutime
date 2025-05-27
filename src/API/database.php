<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'etutime_test_1');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Content-Length, Accept-Encoding, X-CSRF-Token");
header("Access-Control-Max-Age: 1000");
header('Content-Type: application/json');

session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);

function startUserSession($user)
{
    $_SESSION['user'] = [
        'id' => $user['id'],
        'email' => $user['email'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'level' => $user['level'],
        'logged_in' => true
    ];
}

session_start();

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], ['http://localhost:5173'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

function getPostData()
{
    $json = file_get_contents('php://input');
    if (empty($json)) {
        return [];
    }
    return json_decode($json, true);
}

function openDatabase()
{
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

    if ($conn->connect_error) {
        throw new Exception("Erreur de connexion à la base de données: " . $conn->connect_error);
    }

    $conn->set_charset("utf8mb4");
    return $conn;
}

// Fonction database2.php (nouvelle version)
function executeSQL($db, $sql, $params = [], $returnId = false)
{
    $statement = $db->prepare($sql);
    if (!$statement) {
        throw new Exception('SQL Prepare failed: ' . $db->error);
    }

    if (!empty($params)) {
        $types = str_repeat('s', count($params));
        $statement->bind_param($types, ...$params);
    }

    if (!$statement->execute()) {
        throw new Exception('SQL Execute failed: ' . $statement->error);
    }

    if ($returnId) {
        return $statement->insert_id;
    }

    $result = $statement->get_result();
    if ($result) {
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    return true;
}

// Fonction database.php (ancienne version) - renommée pour éviter les conflits
function exequteSQL($db, $sql, $params = [], $encode = true)
{
    $response = true;
    $statment = $db->prepare($sql);
    if (!$statment) {
        throw new Exception('SQL Prepare failed: ' . $db->error);
    }
    if (!empty($params)) {
        $types = '';
        foreach ($params as $param) {
            if (is_int($param)) {
                $types .= 'i';
            } elseif (is_float($param)) {
                $types .= 'd';
            } elseif (is_string($param)) {
                $types .= 's';
            } else {
                $types .= 's';
            }
        }
        $statment->bind_param($types, ...$params);
    }
    if (!$statment->execute()) {
        throw new Exception('SQL Execute failed: ' . $statment->error);
    } else {
        if (stripos($sql, 'INSERT') === 0) {
            $response = $statment->insert_id;
        } else {
            $result = $statment->get_result();
            if (!is_bool($result)) {
                $entries = array();
                while ($row = $result->fetch_assoc()) {
                    $entries[] = $row;
                }
                $response = $encode ? json_encode($entries) : $entries;
            }
        }
    }
    $statment->close();
    return $response;
}

function handleError($message, $code = 500)
{
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}
?>