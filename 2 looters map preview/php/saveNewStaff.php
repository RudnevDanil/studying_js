<?php
$login = $_POST['login'];
$pass = $_POST['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

if(    isset($_POST['fullName']) && !empty($_POST['fullName'])
    && isset($_POST['position']) && !empty($_POST['position'])
    && isset($_POST['isBanned']) && !empty($_POST['isBanned'])
    && isset($_POST['arr']) && !empty($_POST['arr']) && count($arr = $_POST['arr']) != 0)
{
    $full_name = $_POST['fullName'];
    $position = $_POST['position'];
    $isBanned = $_POST['isBanned'] == "true" ? "1" : "0";
    $arr = $_POST['arr'];

    $query = "select count(id) as count from lm_staff where full_name='$full_name' and user_id='$userId'";
    if ($result = $mysqli->query($query))
    {
        $answer = $result->fetch_array(MYSQLI_ASSOC);// для одной строки
        //$answer = $result->fetch_all();// для всего массива
        $staffId = null;
        if($answer["count"] == 0)
        {
            $query = "insert into lm_staff (user_id, full_name, position, isBanned) values ('$userId','$full_name', '$position', '$isBanned');";
            if ($result = $mysqli->query($query))
            {
                //echo json_encode(array("answer"=>"new staff registered"));
            }
            else
            {
                echo json_encode(array("answer"=>"query insert new staff error"));
            }
        }

        $query = "select id from lm_staff where full_name='$full_name' and user_id='$userId'";
        if ($result = $mysqli->query($query))
        {
            $answer = $result->fetch_array(MYSQLI_ASSOC);
            $staffId = $answer["id"];
            $query = "update lm_staff set position='$position', isBanned='$isBanned' where full_name='$full_name' and user_id='$userId'";
            if ($result = $mysqli->query($query))
            {
                $query = "delete from lm_faces where staff_id='$staffId' and user_id='$userId'";
                if ($result = $mysqli->query($query))
                {
                    $errorsNumber = 0;

                    for($i = 0; $i < count($arr) ; $i++)
                    {
                        $img = $arr[$i];
                        $query = "insert into lm_faces (img, user_id, staff_id) values ('$img', '$userId', '$staffId');";
                        if ($result = $mysqli->query($query))
                        {
                            //echo json_encode(array("answer" => "done"));
                        }
                        else
                        {
                            $errorsNumber += 1;
                            print_r($query);
                        }
                    }
                    if($errorsNumber == 0)
                        echo json_encode(array("answer"=>"saving success"));
                    else
                        echo json_encode(array("answer"=>"saving error", "message"=>"$errorsNumber object was not saved"));
                }
                else
                {
                    echo json_encode(array("answer"=>"remove old error error"));
                }
            }
            else
            {
                echo json_encode(array("answer"=>"update error error"));
            }


        }
    }
}
else
{
    echo json_encode(array("answer"=>"params error"));
}
$mysqli->close();

?>
