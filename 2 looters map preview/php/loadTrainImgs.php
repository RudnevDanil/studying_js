<?php
// ------------------------------- get from db img and send it to python
$login = $_GET['login'];
$pass = $_GET['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

$idsOnly = true;
if(isset($_GET['idsOnly']) && !empty($_GET['idsOnly']) && $_GET['idsOnly'] == "true")
    $query = "select id from lm_faces where user_id='$userId' and staff_id IS NOT NULL;";
else
{
    $query = "select id, img, staff_id from lm_faces where user_id='$userId' and staff_id IS NOT NULL;";
    $idsOnly = false;
}
//print_r("_".isset($_GET['idsOnly'])."_".!empty($_GET['idsOnly'])."_".($_GET['idsOnly'] == "true"));
if ($result = $mysqli->query($query))
{
    $arr = $result->fetch_all();// для всего массива
    $arr_f = [];
    $arr_n = [];
    $arr_ids = [];

    if(!$idsOnly)
    {
        for ($i = 0; $i < count($arr); $i++)
        {
            #array_push($arr_ids, $arr[$i][0]);
            array_push($arr_f, substr($arr[$i][1], 22));
            array_push($arr_n, $arr[$i][2]);
        }
        echo json_encode(array("answer" => "done", "arr" => $arr_f, "staff_id" => $arr_n/*, "ids" => $arr_ids*/));
    }
    else
    {
        for ($i = 0; $i < count($arr); $i++)
        {
            array_push($arr_ids, $arr[$i][0]);
        }
        echo json_encode(array("answer" => "done", "ids" => $arr_ids));
    }
}
else
    echo json_encode(array("answer" => "query error"));

$mysqli->close();
?>