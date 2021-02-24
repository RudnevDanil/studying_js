<?php
// ------------------------------- get from db img and send it to python
$login = $_GET['login'];
$pass = $_GET['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

$query = "select img, staff_id from lm_faces where user_id='$userId' and staff_id IS NOT NULL;";
if ($result = $mysqli->query($query))
{
    $arr = $result->fetch_all();// для всего массива
    $arr_f = [];
    $arr_n = [];

    for ($i = 0; $i < count($arr); $i++)
    {
        array_push($arr_f, substr($arr[$i][0], 22));
        array_push($arr_n, $arr[$i][1]);
    }

    echo json_encode(array("answer" => "done", "arr" => $arr_f, "staff_id" => $arr_n));
}
else
    echo json_encode(array("answer" => "query error"));

$mysqli->close();
?>