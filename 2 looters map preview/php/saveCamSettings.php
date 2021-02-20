<?php
$login = $_POST['login'];
$pass = $_POST['pass'];
include "./checkAuth.php";
include "./dbConnect.php";
// first let's remove old cameras
$query = "delete from lm_cameras where user_id='$userId'";

if ($result = $mysqli->query($query))
{
    if(isset($_POST['arr']) && !empty($_POST['arr']) && count($arr = $_POST['arr']) != 0)
    {
        $arr = $_POST['arr'];
        $errorsNumber = 0;

        for($i = 0; $i < count($arr) ; $i++)
        {
            $v0 = $arr[$i][0];
            $v1 = $arr[$i][1];
            $v2 = $arr[$i][2];
            $v3 = $arr[$i][3];
            $v4 = $arr[$i][4];
            $v5 = $arr[$i][5];
            $v6 = $arr[$i][6];
            $v7 = $arr[$i][7];

            $query = "insert into lm_cameras (user_id, cam_code, description, connecting_line, saving_skip_fr, class_skip_fr, cam_FPS, fr_in_one_avi, scaling) values ('$userId', '$v0', '$v1', '$v2', '$v3', '$v4', '$v5', '$v6', '$v7');";
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
        if($errorsNumber != 0)
            echo json_encode(array("answer"=>"saving error", "message"=>"$errorsNumber object was not saved"));
        else
            echo json_encode(array("answer"=>"saving success"));
    }
    else
    {
        echo json_encode(array("answer"=>"saving success"));
    }
}
else
{
    echo json_encode(array("answer"=>"remove error"));
}
$mysqli->close();
?>
