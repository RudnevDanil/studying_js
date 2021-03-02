<?php
$login = $_POST['login'];
$pass = $_POST['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

if(isset($_POST['arr']) && !empty($_POST['arr']) && count($arr = $_POST['arr']) != 0)
{
    $arr = $_POST['arr'];
    $errorsNumber = 0;
    foreach($arr as $elem)
    {
        $query = "delete from lm_faces where user_id='$userId' and staff_id IS NULL and id='$elem'";
        if ($result = $mysqli->query($query))
        {
            //echo json_encode(array("answer" => "done"));
        }
        else
            $errorsNumber += 1;
    }
    if($errorsNumber != 0)
        echo json_encode(array("answer"=>"remove error", "message"=>"$errorsNumber object was not removed"));
    else
        echo json_encode(array("answer"=>"done"));
}
else
    echo json_encode(array("answer"=>"params error"));
$mysqli->close();