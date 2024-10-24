document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('gameCanvas')
	const ctx = canvas.getContext('2d')

	//   // Адаптивность для мобильных устройств
	//   canvas.width = window.innerWidth;
	//   canvas.height = window.innerHeight;

	function adjustCanvasSize() {
		const canvas = document.getElementById('gameCanvas')
		const body = document.body

		// Устанавливаем ширину и высоту канваса в 100% от доступного пространства
		canvas.width = body.clientWidth
		canvas.height = body.clientHeight
	}

	document.addEventListener('selectstart', function (event) {
		event.preventDefault()
	})

	document.addEventListener('contextmenu', function (e) {
		e.preventDefault()
	})

	document.addEventListener('visibilitychange', function () {
		if (document.hidden) {
			backgroundMusic.pause() // Остановить музыку, если приложение свернуто
		} else {
			backgroundMusic.play() // Включить музыку снова, когда приложение активно
		}
	})

	// Загружаем текстуры
	const airplaneImg = new Image()
	airplaneImg.src = 'airplane.png' // Путь к изображению самолета

	const cloudImg = new Image()
	cloudImg.src = 'cloud.svg' // Путь к изображению облака

	const soundOnImg = new Image()
	soundOnImg.src = 'soundOn.svg'

	const soundOffImg = new Image()
	soundOffImg.src = 'soundOff.svg'

	const enemyImages = [
		new Image(), // Первое изображение врага
		new Image(), // Второе изображение врага
		new Image(), // Третье изображение врага
	]

	enemyImages[0].src = 'enemy1.svg' // Путь к первому изображению врага
	enemyImages[1].src = 'enemy2.svg' // Путь ко второму изображению врага
	enemyImages[2].src = 'enemy3.svg' // Путь к третьему изображению врага

	const backgroundImg = new Image()
	backgroundImg.src = 'background.svg' // Путь к изображению фона

	// Звуки
	const backgroundMusic = new Audio('background.mp3') // Путь к фоновому звуку
	const gameOverSound = new Audio('gameover.mp3') // Путь к звуку окончания игры
	const pointSound = new Audio('pointsound.mp3') // Путь к звуку увеличения очков

	let airplane = {
		x: 50,
		y: canvas.height / 2,
		width: 1,
		height: 1,
		speedY: 0,
	}

	// Положение фона
	let backgroundX = 0
	let cloudSpeed = 2
	let clouds = []

	// Генерируем облака
	function createCloud() {
		const cloud = {
			x: canvas.width, // Появляется справа за экраном
			y: Math.random() * (canvas.height / 3), // Облака появляются в верхней трети экрана
			width: 100 + Math.random() * 100, // Разные размеры облаков
			height: 50 + Math.random() * 50,
			speedX: cloudSpeed + Math.random() * 2,
		}
		clouds.push(cloud)
	}

	// Движение облаков
	function drawClouds() {
		clouds = clouds.filter(cloud => {
			cloud.x -= cloud.speedX // Двигаем облако влево
			ctx.drawImage(cloudImg, cloud.x, cloud.y, cloud.width, cloud.height)

			// Удаляем облако, если оно вышло за левую границу экрана
			return cloud.x + cloud.width > 0
		})

		// Появление новых облаков с некоторой вероятностью
		if (Math.random() < 0.01) {
			createCloud()
		}
	}

	let score = 0
	let gameOver = false
	let gameSpeed = 3

	let muted = true // Переменная для отслеживания состояния звука

	// Координаты кнопки звука
	const soundButton = {
		x: canvas.width - 50, // В правом верхнем углу
		y: 10,
		width: 40,
		height: 40,
	}

	upBtn = document.getElementById('up')
	downBtn = document.getElementById('down')
	const scoreDisplay = document.getElementById('scoreDisplay')

	// Добавляем кнопки управления
	upBtn.addEventListener('touchstart', () => {
		airplane.speedY = -5 // Увеличиваем скорость вверх
	})
	downBtn.addEventListener('touchstart', () => {
		airplane.speedY = 5 // Увеличиваем скорость вниз
	})
	upBtn.addEventListener('touchend', () => {
		airplane.speedY = 0 // Останавливаем движение
	})
	downBtn.addEventListener('touchend', () => {
		airplane.speedY = 0 // Останавливаем движение
	})

	// Отключение выделения элементов
	document.addEventListener('selectstart', e => {
		e.preventDefault() // Предотвращаем выделение текста или элементов
	})

	// Отрисовка фона
	function drawBackground() {
		const bgWidth = canvas.width * (backgroundImg.width / canvas.width)

		ctx.drawImage(backgroundImg, backgroundX, 0, bgWidth, canvas.height)
		ctx.drawImage(
			backgroundImg,
			backgroundX + bgWidth,
			0,
			bgWidth,
			canvas.height
		)

		backgroundX -= gameSpeed // Фон движется влево

		if (backgroundX <= -bgWidth) {
			backgroundX = 0
		}
	}

	// Создание врагов
	function createEnemy() {
		const randomIndex = Math.floor(Math.random() * enemyImages.length)
		let enemy = {
			x: canvas.width,
			y: Math.random() * (canvas.height - airplane.height), // Изменяем позицию по Y
			width: airplane.width, // Устанавливаем ширину врага равной ширине самолета
			height: airplane.height, // Устанавливаем высоту врага равной высоте самолета
			speedX: gameSpeed + Math.random() * 2,
			img: enemyImages[randomIndex], // Сохраняем выбранное изображение врага
		}
		enemies.push(enemy)
	}

	toggleSoundInGameBtn = document.getElementById('toggleSoundGameBtn')
	if (muted === false) toggleSoundInGameBtn.src = 'soundOn.svg'
	if (muted === true) toggleSoundInGameBtn.src = 'soundOff.svg'

	function updateSoundBtn() {
		if (muted === true) {
			backgroundMusic.pause()
			gameOverSound.pause()
			pointSound.pause()
			toggleSoundInGameBtn.src = 'soundOff.svg'
		} else {
			backgroundMusic.play()
			toggleSoundInGameBtn.src = 'soundOn.svg'
		}
	}

	toggleSoundInGameBtn.addEventListener('click', () => {
		muted = !muted
		updateSoundBtn()
	})

	// Обновление игры
	function update() {
		if (gameOver) return

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// Прокручивающийся фон
		drawBackground()

		// Прокручивающиеся облака
		drawClouds()

		// Движение самолета
		airplane.y += airplane.speedY
		if (airplane.y < 0) airplane.y = 0
		if (airplane.y + airplane.height > canvas.height)
			airplane.y = canvas.height - airplane.height

		ctx.drawImage(
			airplaneImg,
			airplane.x,
			airplane.y,
			airplane.width,
			airplane.height
		)

		// Движение врагов
		enemies = enemies.filter(enemy => {
			enemy.x -= enemy.speedX
			ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height) // Используем выбранное изображение врага

			// Проверка на столкновение
			if (
				airplane.x < enemy.x + enemy.width &&
				airplane.x + airplane.width > enemy.x &&
				airplane.y < enemy.y + enemy.height &&
				airplane.y + airplane.height > enemy.y
			) {
				gameOver = true
				backgroundMusic.pause()
				if (!muted) gameOverSound.play()
				document.getElementById('menu').style.display = 'flex'
			}

			if (enemy.x + enemy.width <= 0) {
				score += 10
				if (score % 100 === 0 && score != 0) {
					if (!muted) pointSound.play()
				}
			}

			return enemy.x + enemy.width > 0
		})

		if (Math.random() < 0.01) createEnemy()

		// Обновляем текст счёта в отдельном элементе
		scoreDisplay.innerText = score

		requestAnimationFrame(update)
	}

	// Перезапуск игры
	function startGame() {
		gameOver = false
		score = 0
		airplane.y = canvas.height / 2
		clouds = [] // Сбрасываем облака
		enemies = []
		document.getElementById('menu').style.display = 'none' // Скрыть меню
		if (!muted) backgroundMusic.play() // Включаем фоновую музыку, если звук не отключен
		update() // Начать игру
	}

	// Меню
	document.getElementById('startButton').addEventListener('click', startGame)

	function updateSoundMenuBtn() {
		if (muted === true) {
			toggleSoundBtn.src = 'soundOffMenu.svg'
		} else {
			toggleSoundBtn.src = 'soundOnMenu.svg'
		}
	}

	toggleSoundBtn = document.getElementById('toggleSoundButton')
	toggleSoundBtn.addEventListener('click', () => {
		muted = !muted // Переключаем состояние звука
		updateSoundMenuBtn()

		if (muted) {
			backgroundMusic.pause() // Останавливаем фоновую музыку, если звук отключен
			gameOverSound.pause() // Останавливаем звук окончания игры
			pointSound.pause() // Останавливаем звук увеличения очков
		} else {
			backgroundMusic.play() // Включаем фоновую музыку, если звук включен
		}

		updateSoundBtn() // Обновляем кнопку звука в самой игре
	})

	// Инициализация правильной кнопки звука при загрузке страницы
	updateSoundMenuBtn()

	// Ждем, пока текстуры загрузятся, перед началом игры
	airplaneImg.onload = () => {
		const aspectRatio = airplaneImg.height / airplaneImg.width
		airplane.width = canvas.width / 6 // Задаем ширину самолета относительно ширины холста
		airplane.height = airplane.width * aspectRatio // Сохраняем пропорции самолета

		document.getElementById('menu').style.display = 'flex'
	}

	cloudImg.onload = () => {
		// Когда загружено изображение облака
	}

	// Слушаем событие изменения размера окна
	window.addEventListener('resize', adjustCanvasSize)

	// Первоначальная установка при загрузке страницы
	adjustCanvasSize()
})
