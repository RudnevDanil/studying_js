<?php
/*
echo "Hello world!";
if (isset($_POST['a']) && !empty($_POST['a']))
    echo $_POST['a'];
*/
include "./dbConnect.php";
$query = "select img from lm_faces where staff_id='2';";
if ($result = $mysqli->query($query))
{
    //$arr = $result->fetch_array(MYSQLI_ASSOC);// для одной строки
    $arr = $result->fetch_all();// для всего массива
    echo json_encode(array("answer"=>"done", "arr"=>$arr));
    $result->close();
}
else
{
    echo json_encode(array("answer"=>"query select error"));
}
//$conn = mysqli_connect("localhost", "root", "111", "test");

//if ($conn == false) {echo "Ошибка: Невозможно подключиться к MySQL " , mysqli_connect_error();}
//else {echo "Соединение установлено успешно";}

/*
$sql = 'INSERT INTO cities SET name = "Санкт-Петербург"';
$result = mysqli_query($link, $sql);
if ($result == false) {echo "Произошла ошибка при выполнении запроса";}*/

//$conn->close();
?>