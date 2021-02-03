<?php

include_once "./dbConnect.php";

$login = $_GET['login'];
$pass = $_GET['pass'];
$query = "select count(id) as amount from lm_auth where login='$login';";

if ($result = $mysqli->query($query))
{
    $arr = $result->fetch_array(MYSQLI_ASSOC);// для одной строки
    if($arr["amount"] == 0)
    {
        $query = "insert into lm_auth (login, pass) values ('$login', '$pass');";
        if ($result = $mysqli->query($query))
        {
            echo json_encode(array("answer"=>"done"));
        }
        else
        {
            echo json_encode(array("answer"=>"query insert error"));
        }
    }
    else
    {
        echo json_encode(array("answer"=>"busy"));
    }
}
else
{
    echo json_encode(array("answer"=>"query select error"));
}

$mysqli->close();
?>