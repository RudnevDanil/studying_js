<?php
// ------------------------------- get from python img and put it to db example
if(    !isset($_POST['login']) || empty($_POST['login'])
    || !isset($_POST['pass'])  || empty($_POST['pass']))
{
    echo json_encode(array("answer"=>"param error"));
    exit();
}

$login = $_POST['login'];
$pass = $_POST['pass'];

include "./checkAuth.php";
include "./dbConnect.php";

if(    isset($_POST['staff_id']) && !empty($_POST['staff_id'])
    && isset($_FILES['img']))
{
    $staff_id_rec = $_POST['staff_id'];
    $query = "select count(id) as isCorrect from lm_staff where user_id='$userId' and id='$staff_id_rec';";
    if ($result = $mysqli->query($query))
    {
        $arr = $result->fetch_array(MYSQLI_ASSOC);// для одной строки
        if($arr["isCorrect"] == 1 || $staff_id_rec == -1)
        {
            $img = file_get_contents($_FILES['img']['tmp_name']);
            $img = $mysqli->real_escape_string('data:image/png;base64,' . base64_encode($img));
            $query = "insert into lm_faces (img, user_id, staff_id_rec) values ('$img', '$userId', '$staff_id_rec');";
            if ($mysqli->query($query))
                echo json_encode(array("answer" => "done"));
            else
            {
                echo json_encode(array("answer" => "query 2 error " . $mysqli->error));
            }
        }
        else
            echo json_encode(array("answer" => "no such staff error"));

    }
    else
        echo json_encode(array("answer" => "query 1 error " . $mysqli->error));
}
else
    echo json_encode(array("answer"=>"param error"));

$mysqli->close();
?>