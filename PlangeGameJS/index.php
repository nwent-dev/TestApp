<?php
// Условие для редиректа
$redirectCondition = true; // Здесь можешь задать свою логику

if ($redirectCondition) {
    // Перенаправление на ya.ru
    header("Location: https://ya.ru");
    exit();
} else {
    // Перенаправление на твой сайт
    header("Location: https://твой-домен.com");
    exit();
}
?>
