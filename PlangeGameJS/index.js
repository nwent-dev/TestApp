const express = require('express');
const app = express();

// Настройка редиректа
app.get('/', (req, res) => {
    // Условие для редиректа
    const redirectCondition = true; // Измени это условие в зависимости от логики
    if (redirectCondition) {
        res.redirect('https://ya.ru'); // Перенаправляем на ya.ru
    } else {
        res.redirect('index.html'); // Перенаправляем на твой сайт
    }
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
