<?php
$login = $_POST['login'];
$pass = $_POST['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

if(    isset($_POST['fullName']) && !empty($_POST['fullName'])
    && isset($_POST['position']) && !empty($_POST['position']))
{
    $full_name = $_POST['fullName'];
    $position = $_POST['position'];
    $query = "select count(id) as count from lm_staff where full_name='$full_name' and position='$position' and user_id='$userId'";
    if ($result = $mysqli->query($query))
    {
        $answer = $result->fetch_array(MYSQLI_ASSOC);// для одной строки
        //$answer = $result->fetch_all();// для всего массива
        $staffId = null;
        if($answer["count"] == 1)
        {
            $query = "delete from lm_staff where full_name='$full_name' and position='$position' and user_id='$userId'";
            if ($result = $mysqli->query($query))
            {
                echo json_encode(array("answer"=>"done"));
            }
            else
                echo json_encode(array("answer"=>"query error"));
        }
        else
            echo json_encode(array("answer"=>"no user with this param error"));
    }
    else
        echo json_encode(array("answer"=>"query error"));
}
else
    echo json_encode(array("answer"=>"params error"));
$mysqli->close();