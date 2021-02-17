<?php
$login = $_GET['login'];
$pass = $_GET['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

$query = "select full_name, position from lm_staff where user_id='$userId';";

if ($result = $mysqli->query($query))
{
    //$arr = $result->fetch_array(MYSQLI_ASSOC);// для одной строки
    $arr = $result->fetch_all();// для всего массива
    echo json_encode(array("answer"=>"done", "arr"=>$arr));
    $result->close();
}
else
{
    echo json_encode(array("answer"=>"query select error"));
}

$mysqli->close();
?>