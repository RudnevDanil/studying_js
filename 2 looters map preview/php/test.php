<?php
// ------------------------------- get from python img and put it to db example
include "./dbConnect.php";

echo json_encode(array("dbcheck"=>"".!(mysqli_connect_errno() || !$mysqli)));
echo json_encode(array("isset"=>"".isset($_FILES['img'])));

if(isset($_FILES['img']))
{
    $img = file_get_contents($_FILES['img']['tmp_name']);
    $img = $mysqli->real_escape_string('data:image/png;base64,' . base64_encode($img));
    $query = "insert into lm_faces (img, user_id, staff_id) values ('$img', '777', '777');";
    if ($mysqli->query($query))
        echo json_encode(array("answer" => "done"));
    else
        echo json_encode(array("answer" => "query error"));
}
else
    echo json_encode(array("answer"=>"param error"));

$mysqli->close();
?>