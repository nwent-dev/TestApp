const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

const targetUrl = 'https://opedunkes.beget.app/K5TrzQ';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/redirect', async (req, res) => {
  try {
    // Делаем запрос к внешнему сайту, имитируя запрос браузера
    const response = await axios.get(targetUrl);

    // Если статус ответа не 404, перенаправляем пользователя
    if (response.status !== 404) {
      return res.redirect(targetUrl);
    }
  } catch (error) {
    // Логируем детали ошибки для диагностики
    console.error('Произошла ошибка:', error.message);
    if (error.response) {
      console.error('Статус ошибки:', error.response.status);
    }

    // Если произошла ошибка (например, 404), делаем другой редирект
    if (error.response && error.response.status === 404) {
      return res.redirect('/index.html');
    } else {
      // Обработка других ошибок и отправка ответа
      return res.status(500).send('Произошла ошибка на сервере');
    }
  }
});



// Настройка редиректа


// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
