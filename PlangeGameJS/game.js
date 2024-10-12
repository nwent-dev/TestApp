const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Устанавливаем размеры холста
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Создаем объект Image для загрузки картинки самолетика
const planeImage = new Image();
planeImage.src = 'plane.png';  // Локальный путь к изображению

// Параметры самолетика
const plane = {
  x: canvas.width / 2 - 100,  // Подгонка по ширине (учитывая новую ширину)
  y: canvas.height / 2 - 100, // Подгонка по высоте (учитывая новую высоту)
  width: 200,  // Увеличенная ширина самолетика
  height: 200, // Временная высота, будет пересчитана
  speed: 5,
  dy: 0,
  angle: 0,  // Текущий угол самолетика
  targetAngle: 0,  // Целевой угол наклона
  angleSpeed: 0.02  // Уменьшенная скорость изменения угла для плавности
};

// Обработчики кнопок
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');

// Управление движением на компьютере и телефоне
function startMoveUp() {
  plane.dy = -plane.speed;
  plane.targetAngle = -0.4;  // Увеличенный угол наклона при движении вверх
}

function startMoveDown() {
  plane.dy = plane.speed;
  plane.targetAngle = 0.4;  // Увеличенный угол наклона при движении вниз
}

function stopMove() {
  plane.dy = 0;
  plane.targetAngle = 0;  // Возвращаем угол в исходное положение
}

// Для настольных устройств (мышь)
upBtn.addEventListener('mousedown', startMoveUp);
downBtn.addEventListener('mousedown', startMoveDown);
document.addEventListener('mouseup', stopMove);

// Для сенсорных устройств (тачскрин)
upBtn.addEventListener('touchstart', startMoveUp);
downBtn.addEventListener('touchstart', startMoveDown);
document.addEventListener('touchend', stopMove);

// Обновление положения и угла
function update() {
  plane.y += plane.dy;

  // Ограничение по границам экрана
  if (plane.y < 0) {
    plane.y = 0;
  } else if (plane.y + plane.height > canvas.height) {
    plane.y = canvas.height - plane.height;
  }

  // Плавное изменение угла, добавляем проверку, чтобы избегать лишних изменений
  if (Math.abs(plane.angle - plane.targetAngle) > 0.01) {
    if (plane.angle < plane.targetAngle) {
      plane.angle += plane.angleSpeed;  // Плавно увеличиваем угол
    } else if (plane.angle > plane.targetAngle) {
      plane.angle -= plane.angleSpeed;  // Плавно уменьшаем угол
    }
  } else {
    plane.angle = plane.targetAngle;  // Устанавливаем целевой угол при минимальной разнице
  }
}

// Отрисовка самолетика с вращением и зеркалированием
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст

  // Проверяем, что изображение загрузилось
  if (planeImage.complete) {
    // Рассчитываем соотношение сторон изображения
    const aspectRatio = planeImage.width / planeImage.height;

    // Подгоняем ширину и высоту с учетом соотношения сторон
    plane.height = plane.width / aspectRatio; // Высота с учетом соотношения

    // Сохраняем текущие настройки контекста
    ctx.save();

    // Перемещаем точку отсчета в центр самолетика
    ctx.translate(plane.x + plane.width / 2, plane.y + plane.height / 2);

    // Поворачиваем контекст на текущий угол
    ctx.rotate(plane.angle);

    // Отзеркаливаем изображение по горизонтали
    ctx.scale(-1, 1);

    // Отрисовываем изображение самолетика с учетом смещения точки отсчета
    ctx.drawImage(
      planeImage, 
      -plane.width / 2,  // Смещаем изображение относительно центра
      -plane.height / 2, 
      plane.width, 
      plane.height
    );

    // Восстанавливаем контекст в исходное состояние
    ctx.restore();
  }
}

// Основной цикл игры
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Начало игры после загрузки изображения
planeImage.onload = function() {
  gameLoop();
};
