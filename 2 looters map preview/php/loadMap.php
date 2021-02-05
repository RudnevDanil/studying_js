<?php
$login = $_GET['login'];
$pass = $_GET['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

$query = "select type, x, y , w, h ,r, d from lm_map_objects where user_id='$userId';";

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