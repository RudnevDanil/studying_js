<?php
include_once "./dbConnect.php";
$query = "select count(id) as isCorrect, id from lm_auth where login='$login' and pass='$pass' GROUP BY id;";
$answer = false;
$userId = null;
if ($result = $mysqli->query($query))
{
    $arr = $result->fetch_array(MYSQLI_ASSOC);// для одной строки
    //$arr = $result->fetch_all();// для всего массива
    $answer = $arr["isCorrect"] == 1;
    $userId = $arr["id"];
    $result->close();
}
$mysqli->close();
if(!$answer)
    exit();
?>