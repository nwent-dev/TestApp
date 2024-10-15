const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Устанавливаем размеры холста
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Создаем объект Image для загрузки картинки самолетика
const planeImage = new Image();
planeImage.src = 'plane.png';  // Локальный путь к изображению

// Создаем объект Image для облаков
const cloudImage = new Image();
cloudImage.src = 'cloud.png';  // Локальный путь к изображению облаков

// Параметры самолетика
const plane = {
  x: canvas.width / 2 - 100,
  y: canvas.height / 2 - 100,
  width: 200,
  height: 200,
  speed: 5,
  dy: 0,
  angle: 0,
  targetAngle: 0,
  angleSpeed: 0.02
};

// Параметры для облаков (создание эффекта движения)
const clouds = [
  { x: 0, y: 100, speed: 1 },
  { x: canvas.width / 2, y: 200, speed: 1.5 },
  { x: canvas.width / 4, y: 300, speed: 1.2 },
];

// Массив для препятствий
let obstacles = [];
let gameRunning = true; // Изначально игра идет

// Добавляем функцию для создания препятствий
function createObstacle() {
  const gapHeight = 300;  // Увеличиваем расстояние между верхней и нижней частью препятствия
  const obstacleWidth = 50;
  const obstacleHeight = Math.floor(Math.random() * (canvas.height - gapHeight));

  obstacles.push({
    x: canvas.width,
    width: obstacleWidth,
    topHeight: obstacleHeight,
    bottomHeight: canvas.height - obstacleHeight - gapHeight,
  });
}

// Обработчики кнопок
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');

// Управление движением на компьютере и телефоне
function startMoveUp() {
  plane.dy = -plane.speed;
  plane.targetAngle = -0.4;
}

function startMoveDown() {
  plane.dy = plane.speed;
  plane.targetAngle = 0.4;
}

function stopMove() {
  plane.dy = 0;
  plane.targetAngle = 0;
}

// Для настольных устройств (мышь)
upBtn.addEventListener('mousedown', startMoveUp);
downBtn.addEventListener('mousedown', startMoveDown);
document.addEventListener('mouseup', stopMove);

// Для сенсорных устройств (тачскрин)
upBtn.addEventListener('touchstart', startMoveUp);
downBtn.addEventListener('touchstart', startMoveDown);
document.addEventListener('touchend', stopMove);

// Обновление положения самолетика, препятствий и облаков
function update() {
  if (!gameRunning) return;

  // Обновляем позицию самолетика
  plane.y += plane.dy;

  if (plane.y < 0) {
    plane.y = 0;
  } else if (plane.y + plane.height > canvas.height) {
    plane.y = canvas.height - plane.height;
  }

  // Плавное изменение угла самолетика
  if (Math.abs(plane.angle - plane.targetAngle) > 0.01) {
    if (plane.angle < plane.targetAngle) {
      plane.angle += plane.angleSpeed;
    } else if (plane.angle > plane.targetAngle) {
      plane.angle -= plane.angleSpeed;
    }
  } else {
    plane.angle = plane.targetAngle;
  }

  // Обновляем позицию облаков
  clouds.forEach(cloud => {
    cloud.x -= cloud.speed;
    if (cloud.x + cloudImage.width < 0) {
      cloud.x = canvas.width;
    }
  });

  // Обновляем позицию препятствий
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= 2;  // Уменьшенная скорость движения преград

    // Удаление препятствия, если оно уходит за экран
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
    }

    // Проверка на столкновение с самолетом
    if (plane.x < obstacle.x + obstacle.width && plane.x + plane.width > obstacle.x) {
      if (plane.y < obstacle.topHeight || plane.y + plane.height > canvas.height - obstacle.bottomHeight) {
        endGame();
      }
    }
  });
}

// Отрисовка облаков, самолетика и препятствий
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Отрисовка облаков
  clouds.forEach(cloud => {
    ctx.drawImage(cloudImage, cloud.x, cloud.y);
  });

  // Отрисовка препятствий
  obstacles.forEach(obstacle => {
    // Верхняя часть препятствия
    ctx.fillStyle = 'green';
    ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);

    // Нижняя часть препятствия
    ctx.fillRect(obstacle.x, canvas.height - obstacle.bottomHeight, obstacle.width, obstacle.bottomHeight);
  });

  // Отрисовка самолетика с фоном
  if (planeImage.complete) {
    ctx.save();
    ctx.translate(plane.x + plane.width / 2, plane.y + plane.height / 2);
    ctx.rotate(plane.angle);
    ctx.scale(-1, 1);
    ctx.drawImage(planeImage, -plane.width / 2, -plane.height / 2, plane.width, plane.height);
    ctx.restore();
  }

  // Если игра завершена, показываем кнопку "Начать заново"
  if (!gameRunning) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Игра окончена', canvas.width / 2 - 100, canvas.height / 2 - 50);
    ctx.fillText('Нажмите для перезапуска', canvas.width / 2 - 150, canvas.height / 2 + 50);
    canvas.addEventListener('click', resetGame);
  }
}

// Основной игровой цикл
function gameLoop() {
  if (gameRunning) {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}

// Завершение игры
function endGame() {
  gameRunning = false;
}

// Перезапуск игры
function resetGame() {
  gameRunning = true;
  plane.y = canvas.height / 2 - 100;
  obstacles = [];
  canvas.removeEventListener('click', resetGame);
  createObstacle();
}

// Начало игры после загрузки изображений
planeImage.onload = function() {
  createObstacle();
  setInterval(createObstacle, 5000);  // Увеличен интервал появления препятствий до 5 секунд
  gameLoop();
};
cloudImage.onload = function() {
  gameLoop();
};
