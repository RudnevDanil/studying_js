<?php
$login = $_GET['login'];
$pass = $_GET['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

if(isset($_GET['full_name']) && !empty($_GET['full_name']))
{
    $full_name = $_GET['full_name'];

    $query = "select count(id) as count from lm_staff where user_id='$userId' and full_name='$full_name';";
    if ($result = $mysqli->query($query))
    {
        $result = $result->fetch_array(MYSQLI_ASSOC);// для одной строки
        //$arr = $result->fetch_all();// для всего массива
        //echo json_encode(array("answer"=>"done", "arr"=>$arr));
        if($result["count"] != 0)
        {
            $query = "select id, position, isBanned from lm_staff where user_id='$userId' and full_name='$full_name';";
            if ($result = $mysqli->query($query))
            {
                $result = $result->fetch_array(MYSQLI_ASSOC);// для одной строки
                $position = $result["position"];
                $id = $result["id"];
                $isBanned = $result["isBanned"];

                $query = "select img from lm_faces where user_id='$userId' and staff_id='$id';";
                if ($result = $mysqli->query($query))
                {
                    $arr = $result->fetch_all();// для всего массива
                    echo json_encode(array("answer"=>"done", "arr"=>$arr, "position"=>$position, "full_name"=>$full_name, "isBanned"=>$isBanned));
                }
                else
                    echo json_encode(array("answer"=>"query select error"));
            }
            else
                echo json_encode(array("answer"=>"query select error"));
        }
        else
            echo json_encode(array("answer"=>"wrong full_name"));
    }
    else
        echo json_encode(array("answer"=>"query select error"));
}
else
    echo json_encode(array("answer"=>"param error"));


$mysqli->close();
?>