const openBtn = document.querySelector('.music-button'); 
console.log('Кнопка открытия:', openBtn);

const modal = document.getElementById('musicModal'); 
const closeBtn = document.querySelector('#musicModal .modal__close'); // ← ИСПРАВЛЕНО

console.log('Модальное окно:', modal);
console.log('Кнопка закрытия:', closeBtn); // Должен найти элемент, а не null

openBtn.addEventListener('click', function() { 
    alert('Плеер открывается!');
    modal.classList.add('show');
    // document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', function() { 
    console.log('Кнопка закрытия сработала!'); // Для проверки
    modal.classList.remove('show');
    // document.body.style.overflow = '';
});

// Исправлено: закрытие только по фону, а не по любому клику
modal.addEventListener('click', function(e) {
    if (e.target === modal) { // Важно! Закрываем только при клике на фон
        modal.classList.remove('show'); 
        // document.body.style.overflow = '';
    }
});

const audio = new Audio()

const tracks = document.querySelectorAll('.track')
const currentTrack = document.getElementById('currentTrack') 

// находим ползунок громкости
const volumeSlider = document.getElementById('volumeSlider');

// устанавливаем начальную громкость (0.7 = 70%)
audio.volume = 0.7;

// слушаем изменение ползунка
volumeSlider.addEventListener('input', function() {
    const newVolume = this.value;
    audio.volume = newVolume;
    
    // Меняем иконку в зависимости от громкости
    const volumeIcon = document.querySelector('.volume-icon');
    if (newVolume == 0) {
        volumeIcon.textContent = '🔇';
    } else if (newVolume < 0.3) {
        volumeIcon.textContent = '🔈';
    } else if (newVolume < 0.7) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
});

tracks.forEach (track =>{
    track.addEventListener('click', function() {
    const src = this.getAttribute('data-src');
    const trackName = this.querySelector('.track_name').textContent;

    audio.src = src;
    progressFill.style.width = '0%'; // Сбрасываем прогресс-бар при смене трека
    currentTrack.textContent = trackName;

    tracks.forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    audio.play();
    })
})

const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');


playBtn.addEventListener('click', function() {
    if (audio.src) {
        audio.play();
    } else {
        alert ('Сначала выберите трек! :)')
    }
});

pauseBtn.addEventListener('click', function() { 
    audio.pause(); 
});

stopBtn.addEventListener('click', function() { 
    audio.pause();
    audio.currentTime = 0; 
});

// let message;
// message = 'колбаса';
// alert (message);

// ДОБАВЬТЕ ЭТОТ КОД В КОНЕЦ ВАШЕГО JS ФАЙЛА

// Элементы прогресс-бара
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const timeCurrent = document.querySelector('.time-current');
const durationElement = document.querySelector('.duration');

// Функция форматирования времени (секунды в MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Обновление прогресс-бара при воспроизведении
function updateProgress() {
    if (audio.duration && !isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        timeCurrent.textContent = formatTime(audio.currentTime);
    }
}

// Установка длительности трека
function setDuration() {
    if (audio.duration && !isNaN(audio.duration)) {
        durationElement.textContent = formatTime(audio.duration);
    }
}

// Перемотка при клике на прогресс-бар
function scrub(e) {
    if (audio.duration && !isNaN(audio.duration)) {
        const rect = progressBar.getBoundingClientRect();
        let clientX;
        
        // Определяем тип события (мышь или тач)
        if (e.type === 'touchmove' || e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
            e.preventDefault();
        } else {
            clientX = e.clientX;
        }
        
        const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        audio.currentTime = percent * audio.duration;
    }
}

// Drag & drop для прогресс-бара
let isDragging = false;

function handleDragStart(e) {
    isDragging = true;
    scrub(e);
}

function handleDragMove(e) {
    if (isDragging) {
        scrub(e);
    }
}

function handleDragEnd() {
    isDragging = false;
}

// События аудио
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', setDuration);
audio.addEventListener('canplay', setDuration);

// События для прогресс-бара (мышь)
progressBar.addEventListener('click', scrub);
progressBar.addEventListener('mousedown', handleDragStart);
window.addEventListener('mousemove', handleDragMove);
window.addEventListener('mouseup', handleDragEnd);

// События для мобильных устройств
progressBar.addEventListener('touchstart', handleDragStart);
progressBar.addEventListener('touchmove', handleDragMove);
progressBar.addEventListener('touchend', handleDragEnd);

tracks.forEach (track =>{
    track.addEventListener('click', function() {
    const src = this.getAttribute('data-src');
    const trackName = this.querySelector('.track_name').textContent;

    audio.src = src;
    currentTrack.textContent = trackName;
    
    // ДОБАВЬТЕ ЭТУ СТРОКУ:
    progressFill.style.width = '0%'; // Сбрасываем прогресс-бар
    
    tracks.forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    audio.play();
    })
})


modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('show'); 
        // document.body.style.overflow = ''; // И ЭТУ
    }
});

// Компактный выбор трека
const selectedTrackDiv = document.getElementById('selectedTrack');
const trackDropdown = document.getElementById('trackDropdown');
const compactTracks = document.querySelectorAll('.track-dropdown .track');
const selectedTrackNameSpan = document.querySelector('.selected-track-name');

// Открытие/закрытие выпадающего списка
selectedTrackDiv.addEventListener('click', function(e) {
    e.stopPropagation();
    const selector = document.querySelector('.compact-track-selector');
    selector.classList.toggle('open');
});

// Закрытие выпадающего списка при клике вне
document.addEventListener('click', function(e) {
    const selector = document.querySelector('.compact-track-selector');
    if (selector && !selector.contains(e.target)) {
        selector.classList.remove('open');
    }
});

// Обновляем обработчики для треков в компактном списке
compactTracks.forEach(track => {
    track.addEventListener('click', function(e) {
        const src = this.getAttribute('data-src');
        const trackName = this.querySelector('.track_name').textContent;
        const duration = this.querySelector('.track-duration').textContent;

        // Обновляем выбранный трек в заголовке
        selectedTrackNameSpan.textContent = trackName;
        
        // Устанавливаем аудио
        audio.src = src;
        currentTrack.textContent = trackName;
        
        // Сбрасываем прогресс-бар
        if (progressFill) progressFill.style.width = '0%';
        if (timeCurrent) timeCurrent.textContent = '00:00';
        
        // Обновляем активный класс
        compactTracks.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Закрываем выпадающий список
        document.querySelector('.compact-track-selector').classList.remove('open');
        
        // Воспроизводим трек
        audio.play();
    });
});

// Обновляем display duration при загрузке метаданных
audio.addEventListener('loadedmetadata', function() {
    if (durationElement) {
        durationElement.textContent = formatTime(audio.duration);
    }
});

// Если нужно сохранить старые обработчики треков - закомментируйте их
// или удалите старый код с tracks.forEach

// Добавьте в ваш код при открытии/закрытии модального окна
openBtn.addEventListener('click', function() { 
    modal.classList.add('show');
    // Убираем скролл на body
    // document.body.style.overflow = 'hidden';
    // Но добавляем кастомный скролл
    document.body.style.paddingRight = '6px'; // Компенсируем исчезновение скролла
});

closeBtn.addEventListener('click', function() { 
    modal.classList.remove('show');
    // Возвращаем скролл
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
});


// === ГАЛЕРЕЯ: ОТКРЫТИЕ КАРТИНОК ПРИ НАЖАТИИ ===
document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы модального окна
    const modalImage = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-image .close');
    
    // Находим все картинки в галерее
    const galleryImages = document.querySelectorAll('.galery__container img');
    
    // Проверяем, существуют ли элементы
    if (!modalImage || !modalImg) {
        console.error('Элементы модального окна не найдены!');
        return;
    }
    
    // Добавляем обработчик на каждую картинку
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            modalImage.style.display = 'block';
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            // Блокируем скролл страницы при открытом модальном окне
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Функция закрытия модального окна
    function closeModal() {
        modalImage.style.display = 'none';
        document.body.style.overflow = ''; // Возвращаем скролл
    }
    
    // Закрытие по кнопке ×
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Закрытие по клику на фон (на само модальное окно)
    modalImage.addEventListener('click', function(e) {
        if (e.target === modalImage) {
            closeModal();
        }
    });
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalImage.style.display === 'block') {
            closeModal();
        }
    });
});


// Добавьте в player.js для экономии трафика
if (window.innerWidth <= 426) {
    const musicBtn = document.querySelector('.music-button');
    musicBtn.addEventListener('click', function() {
        alert('Плеер доступен на планшетах и ПК');
    });
}