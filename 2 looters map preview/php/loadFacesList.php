<?php

$login = $_GET['login'];
$pass = $_GET['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

$page = 0;
$startId = 0;
$pageSize = 30;
if( isset($_GET['page']) && !empty($_GET['page']) &&
    isset($_GET['pageSize']) && !empty($_GET['pageSize']) &&
    isset($_GET['startId']))
{
    $page = $_GET['page'] - 1;
    $pageSize = $_GET['pageSize'];
    $startId = empty($_GET['startId']) ? 0 : $_GET['startId'];

    $offset = 0;
    $dateCondition = "";
    if(isset($_GET['dateS']) && !empty($_GET['dateS']) && isset($_GET['dateE']) && !empty($_GET['dateE']))
    {
        $dateS = $_GET['dateS'];
        $dateE = $_GET['dateE'];
        $dateCondition = "and date>'$dateS' and date<'$dateE'";
    }

    $condition = "where user_id='$userId' and id <= (case when '$startId'='0' then (select max(id) from lm_faces where user_id='$userId') else '$startId' end) and staff_id IS NULL " . $dateCondition . " order by id desc";
    $query = "select count(id) as count from lm_faces " . $condition . ";";
    if ($answer = $mysqli->query($query))
    {
        $answer = $answer->fetch_array(MYSQLI_ASSOC);// для одной строки
        $offset = $pageSize * $page;
        $countAllRecords = $answer["count"];
        $query = "select id, staff_id_rec, (case when staff_id_rec=-1 or staff_id_rec IS NULL THEN '' ELSE (select full_name from lm_staff where lm_staff.user_id='$userId' and lm_staff.id=staff_id_rec) END) as full_name , (case when staff_id_rec=-1 or staff_id_rec IS NULL THEN '' ELSE (select position from lm_staff where lm_staff.user_id='$userId' and lm_staff.id=staff_id_rec) END) as position , img, (case when staff_id_rec=-1 or staff_id_rec IS NULL THEN '' ELSE (select isBanned from lm_staff where lm_staff.user_id='$userId' and lm_staff.id=staff_id_rec) END) as isBanned  from lm_faces " . $condition . " limit $pageSize offset $offset;";
        if ($answer = $mysqli->query($query))
        {
            $arr = $answer->fetch_all();// для всего массива
            echo json_encode(array("answer"=>"done", "count"=>$countAllRecords, "arr"=>$arr));
        }
        else echo json_encode(array("answer"=>"query 2 error " . $mysqli->error));
    }
    else echo json_encode(array("answer"=>"query 1 error " . $mysqli->error));
}
else echo json_encode(array("answer"=>"param error"));

$mysqli->close();
?>