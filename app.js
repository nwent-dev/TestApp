const express = require('express');
const path = require('path');
const app = express();

// Указываем папку для статических файлов (например, папка с index.html)
// app.use(express.static(path.join(__dirname, 'public')));

// Настройка редиректа
app.get('/', (req, res) => {
    // Условие для редиректа
    console.log('Redirect condition:', redirectCondition); // Логируем значе
    const redirectCondition = true; // Измени это условие в зависимости от логики
    if (redirectCondition) {
        res.redirect('https://ya.ru'); // Перенаправляем на ya.ru
    } else {
        res.redirect('/index.html'); // Перенаправляем на index.html
    }
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
