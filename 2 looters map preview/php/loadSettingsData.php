<?php
// ------------------------------- get from db img and send it to python
$login = $_GET['login'];
$pass = $_GET['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

$query = "select cam_code, connecting_line, saving_skip_fr, class_skip_fr, cam_FPS, fr_in_one_avi, scaling from lm_cameras where user_id='$userId';";
if ($result = $mysqli->query($query))
{
    $arr = $result->fetch_all();// для всего массива
    echo json_encode(array("answer" => "done", "arr" => $arr));
}
else
    echo json_encode(array("answer" => "query error"));

$mysqli->close();
?>