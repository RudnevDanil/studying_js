<?php
// ------------------------------- get from db img and send it python

include "./dbConnect.php";
//print_r(isset($_GET['id']));
if(isset($_GET['id']) && !empty($_GET['id']))
{
    $id = $_GET['id'];
    $query = "select img from lm_faces where id='$id';";
    if ($result = $mysqli->query($query))
    {
        $el = $result->fetch_array(MYSQLI_ASSOC);
        $el = substr($el["img"], 22);
        //$el = base64_decode($el);
        echo json_encode(array("answer" => "done", "el" => $el));
    }
    else
        echo json_encode(array("answer" => "query error"));
}

$mysqli->close();
?>