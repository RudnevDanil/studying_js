<?php
$login = $_POST['login'];
$pass = $_POST['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

// first let's free map
$query = "delete from lm_map_objects where user_id='$userId'";
if ($result = $mysqli->query($query))
{
    if(isset($_POST['arr']) && !empty($_POST['arr']) && count($arr = $_POST['arr']) != 0)
    {
        $arr = $_POST['arr'];
        $errorsNumber = 0;
        $types = array('wall', 'cam', 'door', 'window');
        for($i = 0; $i < count($arr) ; $i++)
        {
            $type = -1;
            for($j = 0; $j < count($types); $j++)
                if($types[$j] == $arr[$i]['type'])
                    $type = $j;
            if($j == -1)
                $errorsNumber += 1;
            else
            {
                $x = $arr[$i]['x'];
                $y = $arr[$i]['y'];
                $w = $arr[$i]['w'];
                $h = $arr[$i]['h'];
                $r = $arr[$i]['r'];
                $d = 0.0;//$arr[$i]['d'];
                $query = "insert into lm_map_objects (type, user_id, x, y, w, h, r, d) values ('$type', '$userId', '$x', '$y', '$w', '$h', '$r', '$d');";
                if ($result = $mysqli->query($query))
                {
                    //echo json_encode(array("answer" => "done"));
                }
                else
                {
                    $errorsNumber += 1;
                    //print_r($query);
                }
            }
        }
        if($errorsNumber != 0)
            echo json_encode(array("answer"=>"saving error", "message"=>"$errorsNumber object was not saved"));
        else
            echo json_encode(array("answer"=>"saving success"));
    }
    else
    {
        echo json_encode(array("answer"=>"array error"));
    }
}
else
{
    echo json_encode(array("answer"=>"remove error"));
}
$mysqli->close();
?>