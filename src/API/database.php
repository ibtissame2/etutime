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

$acceptedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $acceptedOrigins)) {
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

/**
 * Execute a prepared SQL statement with optional parameters and return the result.
 *
 * @param mysqli        $db      The open MySQLi database connection. {{ $db = openDatabase() }}
 * @param string        $sql     The SQL query to execute (can contain "?" placeholders).
 * @param array         $params  (Optional) Parameters to bind to the SQL statement "?" placeholders.
 * @param bool          $encode  (Optional) If true, returns JSON-encoded string for SELECT queries; otherwise use false to return a PHP array. Default: true.
 *
 * @return mixed Returns:
 *   - For SELECT queries: (array of associative arrays if $encode is false) (or JSON string if $encode is true).
 *   - For INSERT queries: the inserted row ID as integer number.
 *   - For UPDATE/DELETE queries: true on success.
 *
 * @throws Exception If SQL preparation or execution fails.
 */
function executeSQL($db, $sql, $params = [], $encode = true)
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
                $entries = $result->fetch_all(MYSQLI_ASSOC);
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