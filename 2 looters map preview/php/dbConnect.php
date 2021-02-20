<?php
    $mysqli = new mysqli("localhost", "root", "111", "lm");

    // проверяем соединение
    if (mysqli_connect_errno() || !$mysqli) {
        echo "Connect failed: ", mysqli_connect_error();
        exit();
    }
?>