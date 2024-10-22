const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

const targetUrl = 'https://opedunkes.beget.app/K5TrzQ';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/redirect', async (req, res) => {
  try {
    // Делаем запрос к внешнему сайту
    const response = await axios.get(targetUrl);

    // Если статус ответа не 404, перенаправляем пользователя
    if (response.status !== 404) {
      return res.redirect(targetUrl);
    }
  } catch (error) {
    // Если произошла ошибка (например, 404), делаем другой редирект
    if (error.response && error.response.status === 404) {
      return res.redirect('/index.html');
    }
    // Обработка других ошибо
  }
});

// Настройка редиректа


// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
