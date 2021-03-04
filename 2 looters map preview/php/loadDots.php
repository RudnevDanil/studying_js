<?php
$login = $_GET['login'];
$pass = $_GET['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

$query = "select camCode, id, staff_id_rec from lm_faces where user_id='$userId' and NOW() - date < 10;";// 300 is 5min and 86400 is a day

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