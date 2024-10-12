const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Настройка редиректа
app.get('/redirect', (req, res) => {
    // Условие для редиректа
    const redirectCondition = true; // Измени это условие в зависимости от логики
    if (redirectCondition) {
        res.redirect('https://yandex.ru'); // Перенаправляем на ya.ru
    } else {
        res.redirect('/index.html'); // Перенаправляем на твой сайт
    }
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
