<?php

include_once "./dbConnect.php";

/*$mysqli = new mysqli("localhost", "root", "111", "test");

// проверяем соединение
if (mysqli_connect_errno()) {
    echo "Connect failed: ", mysqli_connect_error();
    exit();
}*/

/*
$content = array('абвгд', 'abcdefg', '12345');
echo json_encode($content);
*/

$login = $_GET['login'];
$pass = $_GET['pass'];
$query = "select count(id) as isCorrect from lm_auth where login='$login' and pass='$pass';";

if ($result = $mysqli->query($query))
{
    $arr = $result->fetch_array(MYSQLI_ASSOC);// для одной строки
    //$arr = $result->fetch_all();// для всего массива
    echo json_encode(array("answer"=>($arr["isCorrect"] == 0 ? "wrong" : "done")));
    $result->close();
}
else
{
    echo json_encode(array("answer"=>"query select error"));
}

$mysqli->close();
?>