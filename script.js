/**
 * Éclat de Douceur - Премиум кондитерская
 * Основной JavaScript файл (ИСПРАВЛЕННАЯ ВЕРСИЯ)
 * 
 * Исправления:
 * 1. Слайдер команды теперь работает правильно
 * 2. FAQ аккордеон теперь открывается/закрывается
 * 3. Добавлена инициализация текущего года в футере
 * 
 * @version 2.0.0
 */

// ============================================================================
// DOMContentLoaded - ОЖИДАНИЕ ЗАГРУЗКИ DOM
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM полностью загружен, инициализация скриптов...');
    
    // Инициализация всех компонентов
    initMobileMenu();
    initDropdownMenu();
    initTeamSlider(); // ИСПРАВЛЕННЫЙ СЛАЙДЕР
    initFAQ(); // ИСПРАВЛЕННЫЙ FAQ
    initForm();
    initScrollAnimations();
    initVideoFallback();
    initCurrentYear(); // Инициализация текущего года
    
    // Анимация при загрузке страницы
    requestAnimationFrame(function() {
        document.body.classList.add('loaded');
    });
});

// ============================================================================
// МОБИЛЬНОЕ МЕНЮ
// ============================================================================

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuContainer = document.getElementById('mobileMenuContainer');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-list a');
    
    if (!mobileMenuToggle || !mobileMenuOverlay) return;
    
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuContainer.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    mobileMenuToggle.addEventListener('click', openMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileMenuContainer.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// ============================================================================
// ВЫПАДАЮЩЕЕ МЕНЮ ДЛЯ ДЕСКТОПА
// ============================================================================

function initDropdownMenu() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!link || !menu) return;
        
        function showMenu() {
            requestAnimationFrame(() => {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            });
        }
        
        function hideMenu() {
            setTimeout(() => {
                menu.style.opacity = '';
                menu.style.visibility = '';
                menu.style.transform = '';
            }, 100);
        }
        
        dropdown.addEventListener('mouseenter', showMenu);
        dropdown.addEventListener('mouseleave', hideMenu);
        
        link.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const isVisible = menu.style.visibility === 'visible';
            
            document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.style.opacity = '';
                    otherMenu.style.visibility = '';
                    otherMenu.style.transform = '';
                }
            });
            
            if (isVisible) {
                hideMenu();
            } else {
                showMenu();
            }
        });
    });
    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.opacity = '';
                menu.style.visibility = '';
                menu.style.transform = '';
            });
        }
    });
}

// ============================================================================
// ИСПРАВЛЕННЫЙ СЛАЙДЕР КОМАНДЫ
// ============================================================================

function initTeamSlider() {
    const slider = document.getElementById('teamSlider');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!slider || !prevBtn || !nextBtn) {
        console.warn('Элементы слайдера не найдены');
        return;
    }
    
    const slides = slider.querySelectorAll('.slide');
    let currentSlide = 0;
    let autoSlideInterval;
    
    // Функция для создания точек-индикаторов
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === currentSlide) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            
            dotsContainer.appendChild(dot);
        });
    }
    
    // Функция перехода к конкретному слайду
    function goToSlide(slideIndex) {
        // Скрываем все слайды
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Обновляем текущий слайд
        currentSlide = slideIndex;
        
        // Показываем текущий слайд
        slides[currentSlide].classList.add('active');
        
        // Обновляем точки
        updateDots();
        
        // Перезапускаем автопрокрутку
        restartAutoSlide();
    }
    
    // Функция обновления точек-индикаторов
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Функция для следующего слайда
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0; // Возвращаемся к первому слайду
        }
        goToSlide(nextIndex);
    }
    
    // Функция для предыдущего слайда
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1; // Переходим к последнему слайду
        }
        goToSlide(prevIndex);
    }
    
    // Функция автопрокрутки
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000); // 5 секунд между слайдами
    }
    
    // Функция остановки автопрокрутки
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // Функция перезапуска автопрокрутки
    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Создаем точки
    createDots();
    
    // Назначаем обработчики кнопок
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Запускаем автопрокрутку
    startAutoSlide();
    
    // Останавливаем автопрокрутку при наведении на слайдер
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    
    // Для мобильных устройств
    slider.addEventListener('touchstart', stopAutoSlide);
    slider.addEventListener('touchend', () => {
        setTimeout(startAutoSlide, 3000);
    });
    
    // Инициализация первого слайда
    goToSlide(0);
}

// ============================================================================
// ИСПРАВЛЕННЫЙ FAQ АККОРДЕОН
// ============================================================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
        console.warn('FAQ элементы не найдены');
        return;
    }
    
    // Функция закрытия всех FAQ кроме указанного
    function closeOtherFaqItems(exceptItem) {
        faqItems.forEach(item => {
            if (item !== exceptItem && item.classList.contains('active')) {
                item.classList.remove('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = null;
                }
            }
        });
    }
    
    // Добавляем обработчики клика на каждый FAQ
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Закрываем все другие FAQ
            closeOtherFaqItems(item);
            
            // Переключаем текущий FAQ
            if (isActive) {
                // Закрываем
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                // Открываем
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
        
        // Для клавиатурной навигации
        question.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                question.click();
            }
        });
    });
    
    // Открываем первый FAQ по умолчанию (опционально)
    // if (faqItems.length > 0) {
    //     const firstItem = faqItems[0];
    //     const firstAnswer = firstItem.querySelector('.faq-answer');
    //     firstItem.classList.add('active');
    //     firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    // }
}

// ============================================================================
// ФОРМА ОБРАТНОЙ СВЯЗИ
// ============================================================================

function initForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!contactForm) {
        console.warn('Форма обратной связи не найдена');
        return;
    }
    
    // Элементы формы для валидации
    const formInputs = {
        name: document.getElementById('name'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email'),
        consent: document.getElementById('consent')
    };
    
    const errorElements = {
        name: document.getElementById('nameError'),
        phone: document.getElementById('phoneError'),
        email: document.getElementById('emailError'),
        consent: document.getElementById('consentError')
    };
    
    const formMessage = document.getElementById('formMessage');
    
    // Валидация в реальном времени
    Object.keys(formInputs).forEach(key => {
        const input = formInputs[key];
        const error = errorElements[key];
        
        if (input && error) {
            input.addEventListener('blur', function() {
                validateField(input, error);
            });
            
            input.addEventListener('input', function() {
                if (error.textContent) {
                    error.textContent = '';
                }
            });
        }
    });
    
    // Валидация поля
    function validateField(input, errorElement) {
        let isValid = true;
        let message = '';
        
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            message = 'Это поле обязательно для заполнения';
        }
        
        if (isValid && input.value.trim()) {
            switch (input.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        message = 'Введите корректный email адрес';
                    }
                    break;
                    
                case 'tel':
                    const phoneDigits = input.value.replace(/\D/g, '');
                    if (phoneDigits.length < 10) {
                        isValid = false;
                        message = 'Введите корректный номер телефона';
                    }
                    break;
            }
        }
        
        if (input.type === 'checkbox' && !input.checked) {
            isValid = false;
            message = 'Необходимо ваше согласие';
        }
        
        errorElement.textContent = message;
        
        if (message) {
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#ddd';
        }
        
        return isValid;
    }
    
    // Валидация всей формы
    function validateForm() {
        let isValid = true;
        
        Object.keys(formInputs).forEach(key => {
            const input = formInputs[key];
            const error = errorElements[key];
            
            if (input && error) {
                if (!validateField(input, error)) {
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    // Показать сообщение формы
    function showFormMessage(message, type) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
        
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Отправка формы (симуляция)
    async function submitForm(formData) {
        // В реальном проекте здесь должен быть URL вашего бэкенда
        // Например: 'https://your-backend.com/api/contact'
        const formSubmitUrl = 'https://formspree.io/f/xbjnerjn'; // Замените на ваш URL
        
        // Симуляция задержки сети
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // В реальном проекте здесь должен быть fetch запрос
        // try {
        //     const response = await fetch(formSubmitUrl, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(formData)
        //     });
        //     
        //     if (response.ok) {
        //         return { success: true };
        //     } else {
        //         throw new Error('Ошибка сервера');
        //     }
        // } catch (error) {
        //     return { 
        //         success: false, 
        //         message: error.message 
        //     };
        // }
        
        // Для демонстрации возвращаем успех
        return { success: true };
    }
    
    // Обработчик отправки формы
    async function handleFormSubmit(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            showFormMessage('Пожалуйста, исправьте ошибки в форме', 'error');
            return;
        }
        
        // Блокируем кнопку отправки
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Подготавливаем данные формы
        const formData = {
            name: formInputs.name.value,
            phone: formInputs.phone.value,
            email: formInputs.email.value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value,
            date: new Date().toISOString()
        };
        
        // Сохраняем данные в LocalStorage
        try {
            localStorage.setItem('lastContactFormData', JSON.stringify({
                name: formData.name,
                phone: formData.phone,
                email: formData.email
            }));
        } catch (e) {
            console.warn('Не удалось сохранить данные в LocalStorage:', e);
        }
        
        // Отправляем форму
        const result = await submitForm(formData);
        
        // Обрабатываем результат
        if (result.success) {
            showFormMessage('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
            contactForm.reset();
        } else {
            showFormMessage(result.message || 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
        }
        
        // Разблокируем кнопку отправки
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
    
    // Загрузка сохраненных данных из LocalStorage
    function loadSavedFormData() {
        try {
            const savedData = localStorage.getItem('lastContactFormData');
            if (savedData) {
                const data = JSON.parse(savedData);
                if (formInputs.name && data.name) formInputs.name.value = data.name;
                if (formInputs.phone && data.phone) formInputs.phone.value = data.phone;
                if (formInputs.email && data.email) formInputs.email.value = data.email;
            }
        } catch (e) {
            console.warn('Не удалось загрузить данные из LocalStorage:', e);
        }
    }
    
    // Назначаем обработчик отправки формы
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Загружаем сохраненные данные
    loadSavedFormData();
}

// ============================================================================
// АНИМАЦИИ ПРИ СКРОЛЛЕ
// ============================================================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');
    
    if (!animatedElements.length) return;
    
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    function handleScrollAnimation() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }
    
    handleScrollAnimation();
    
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                scrollTimeout = null;
                handleScrollAnimation();
            }, 100);
        }
    });
}

// ============================================================================
// ОБРАБОТКА ВИДЕО
// ============================================================================

function initVideoFallback() {
    const video = document.getElementById('headerVideo');
    const videoContainer = document.querySelector('.video-container');
    
    if (!video) return;
    
    const canPlayMP4 = video.canPlayType('video/mp4');
    
    if (!canPlayMP4) {
        videoContainer.classList.add('no-video');
        return;
    }
    
    video.addEventListener('error', function() {
        console.warn('Ошибка загрузки видео, показываем фолбэк');
        videoContainer.classList.add('no-video');
    });
    
    video.addEventListener('loadeddata', function() {
        if (video.readyState >= 2) {
            console.log('Видео успешно загружено');
        }
    });
    
    video.play().catch(error => {
        console.warn('Автовоспроизведение видео заблокировано:', error);
    });
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ТЕКУЩЕГО ГОДА
// ============================================================================

function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ============================================================================
// ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '#!') return;
        
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
            e.preventDefault();
            
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Учитываем высоту шапки
                behavior: 'smooth'
            });
            
            // Обновляем URL без перезагрузки страницы
            if (history.pushState) {
                history.pushState(null, null, href);
            }
        }
    });
});

// ============================================================================
// ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ОШИБОК
// ============================================================================

window.addEventListener('error', function(event) {
    console.error('JavaScript ошибка:', event.error);
});

window.addEventListener('load', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Ошибка загрузки изображения:', this.src);
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGMEYwRjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjODA4MDgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
        });
    });
});
