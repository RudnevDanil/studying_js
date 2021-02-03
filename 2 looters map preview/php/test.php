<?php
echo "Привет мир!";

$conn = mysqli_connect("localhost", "root", "111", "test");

if ($conn == false) {echo "Ошибка: Невозможно подключиться к MySQL " , mysqli_connect_error();}
else {echo "Соединение установлено успешно";}

/*
$sql = 'INSERT INTO cities SET name = "Санкт-Петербург"';
$result = mysqli_query($link, $sql);
if ($result == false) {echo "Произошла ошибка при выполнении запроса";}*/

$conn->close();
?>