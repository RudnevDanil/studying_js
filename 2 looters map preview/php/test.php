<?php
echo "Привет мир!";

$link = mysqli_connect("localhost", "root", "111", "test");

if ($link == false) {echo "Ошибка: Невозможно подключиться к MySQL " , mysqli_connect_error();}
else {echo "Соединение установлено успешно";}

$sql = 'INSERT INTO cities SET name = "Санкт-Петербург"';
$result = mysqli_query($link, $sql);

if ($result == false) {echo "Произошла ошибка при выполнении запроса";}
?>