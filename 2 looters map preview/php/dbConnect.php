<?php
    $mysqli = new mysqli("localhost", "root", "111", "test");

    // проверяем соединение
    if (mysqli_connect_errno()) {
        echo "Connect failed: ", mysqli_connect_error();
        exit();
    }
?>