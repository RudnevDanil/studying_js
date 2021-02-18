<?php
$login = $_GET['login'];
$pass = $_GET['pass'];

include "./checkAuth.php";
include "./dbConnect.php";


if(isset($_GET['page']) && !empty($_GET['page']) &&
   isset($_GET['pageSize']) && !empty($_GET['pageSize']))
{
    $page = $_GET['page'];
    $pageSize = $_GET['pageSize'];

    $query = "select count(id) as count from lm_staff where user_id='$userId';";
    if ($answer = $mysqli->query($query))
    {
        $answer = $answer->fetch_array(MYSQLI_ASSOC);// для одной строки
        $count = $answer["count"];
        $arr = array();
        if($count !== 0)
        {
            $offset = ($page - 1) * $pageSize;
            $query = "select full_name, position, (select img from lm_faces where lm_faces.user_id='$userId' and staff_id=lm_staff.id LIMIT 1) from lm_staff where user_id='$userId' order by id LIMIT $pageSize OFFSET $offset";
            if ($answer = $mysqli->query($query))
            {
                $arr = $answer->fetch_all();// для всего массива
                echo json_encode(array("answer"=>"done", "arr"=>$arr, "count"=>$count));
            }
            else echo json_encode(array("answer"=>"query error"));
        }
        else echo json_encode(array("answer"=>"count error"));
    }
    else echo json_encode(array("answer"=>"query error"));
}
else echo json_encode(array("answer"=>"param error"));

$mysqli->close();
?>