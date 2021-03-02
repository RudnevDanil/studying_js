<?php
$login = $_GET['login'];
$pass = $_GET['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

$query = "select cam_code, description, connecting_line, saving_skip_fr, class_skip_fr, cam_FPS, fr_in_one_avi, scaling, map_cam_id_code from lm_cameras where user_id='$userId';";

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