/* 
 * JAVASCRIPT ДЛЯ ПРОЕКТА "DRUPAL-CODER"
 * Mobile-first адаптивный сайт с интерактивными элементами
 * 
 * Функциональность:
 * 1. Адаптивное меню с анимацией
 * 2. AJAX отправка форм
 * 3. Модальное окно с requestAnimationFrame анимацией
 * 4. LocalStorage для сохранения данных
 * 5. History API для навигации
 * 6. Валидация и обработка ошибок
 */

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ =====
const API_URL = 'https://formspree.io/f/YOUR_FORM_ID'; // Заменить на свой Formspree ID

// ===== ОСНОВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Drupal-coder проект загружен');
    
    // Инициализация всех компонентов
    initNavigation();
    initForms();
    initModal();
    initScrollEffects();
    loadFromLocalStorage();
    
    // Тестовая анимация для демонстрации
    initTestAnimation();
});

// ===== НАВИГАЦИЯ И МЕНЮ =====
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mainNav = document.getElementById('mainNav');
    const dropdownToggleMobile = document.querySelector('.dropdown-toggle-mobile');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    
    let lastScrollTop = 0;
    let isMobileMenuOpen = false;
    
    // Открытие/закрытие мобильного меню
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            isMobileMenuOpen = !isMobileMenuOpen;
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Блокируем скролл тела при открытом меню
            document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
            
            // Добавляем/убираем класс для анимации
            if (isMobileMenuOpen) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
        
        // Закрытие меню при клике на ссылку
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Если это не выпадающее меню, закрываем
                if (!e.target.classList.contains('dropdown-toggle-mobile')) {
                    closeMobileMenu();
                }
            });
        });
        
        // Выпадающее меню в мобильной версии
        if (dropdownToggleMobile && mobileDropdown) {
            dropdownToggleMobile.addEventListener('click', function(e) {
                e.preventDefault();
                mobileDropdown.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
    }
    
    // Функция закрытия мобильного меню
    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
        isMobileMenuOpen = false;
    }
    
    // Скрытие/показа навигации при скролле
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Прячем навигацию при скролле вниз, показываем при скролле вверх
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            mainNav.classList.add('hidden');
        } else {
            mainNav.classList.remove('hidden');
        }
        
        // Показываем/скрываем кнопку "наверх" если нужно
        if (scrollTop > 500) {
            // Можно добавить кнопку "наверх"
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Закрытие мобильного меню при клике вне его
    document.addEventListener('click', function(e) {
        if (isMobileMenuOpen && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

// ===== ФОРМЫ ОБРАТНОЙ СВЯЗИ =====
function initForms() {
    const mainForm = document.getElementById('mainContactForm');
    const modalForm = document.getElementById('modalContactForm');
    
    // Основная форма
    if (mainForm) {
        mainForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this, 'main');
        });
        
        // Автосохранение в LocalStorage при изменении
        const inputs = mainForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                saveToLocalStorage('mainForm', {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value,
                    comment: document.getElementById('comment').value
                });
            });
        });
    }
    
    // Форма в модальном окне
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this, 'modal');
        });
    }
}

// ===== ОТПРАВКА ФОРМЫ (AJAX) =====
function submitForm(form, formType) {
    const submitBtn = form.querySelector('.submit-btn');
    const submitText = form.querySelector('#submitText');
    const loadingSpinner = form.querySelector('.loading-spinner');
    const messageDiv = form.querySelector('.message') || document.getElementById('formMessage');
    
    // Валидация формы
    if (!validateForm(form)) {
        showMessage('Пожалуйста, заполните все обязательные поля правильно', 'error', messageDiv);
        return;
    }
    
    // Блокируем кнопку и показываем индикатор загрузки
    submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Отправка...';
    if (loadingSpinner) loadingSpinner.style.display = 'inline-block';
    
    // Собираем данные формы
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Для демонстрации - имитация отправки
    // В реальном проекте раскомментировать fetch код ниже
    
    console.log('📨 Отправка данных формы:', data);
    
    // Имитация AJAX-запроса (2 секунды)
    setTimeout(() => {
        // Успешная отправка
        handleFormSuccess(form, formType, submitBtn, submitText, loadingSpinner, messageDiv);
        
        // В РЕАЛЬНОМ ПРОЕКТЕ ИСПОЛЬЗОВАТЬ ЭТОТ КОД:
        /*
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            handleFormSuccess(form, formType, submitBtn, submitText, loadingSpinner, messageDiv);
        })
        .catch(error => {
            handleFormError(error, submitBtn, submitText, loadingSpinner, messageDiv);
        });
        */
        
    }, 2000);
}

// ===== ВАЛИДАЦИЯ ФОРМЫ =====
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.classList.remove('error');
        
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        }
        
        // Валидация email
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                field.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// ===== ОБРАБОТКА УСПЕШНОЙ ОТПРАВКИ =====
function handleFormSuccess(form, formType, submitBtn, submitText, loadingSpinner, messageDiv) {
    // Разблокируем кнопку
    submitBtn.disabled = false;
    if (submitText) submitText.textContent = 'Отправить заявку';
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    
    // Показываем сообщение об успехе
    showMessage('✅ Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success', messageDiv);
    
    // Очищаем форму
    form.reset();
    
    // Очищаем LocalStorage для этой формы
    if (formType === 'main') {
        localStorage.removeItem('mainForm');
    }
    
    // Если это модальная форма - закрываем модальное окно
    if (formType === 'modal') {
        setTimeout(() => {
            closeModal();
        }, 1500);
    }
}

// ===== ОБРАБОТКА ОШИБКИ ОТПРАВКИ =====
function handleFormError(error, submitBtn, submitText, loadingSpinner, messageDiv) {
    console.error('❌ Ошибка при отправке формы:', error);
    
    // Разблокируем кнопку
    submitBtn.disabled = false;
    if (submitText) submitText.textContent = 'Отправить заявку';
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    
    // Показываем сообщение об ошибке
    showMessage('❌ Ошибка при отправке формы. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.', 'error', messageDiv);
}

// ===== ПОКАЗ СООБЩЕНИЙ =====
function showMessage(text, type, container) {
    if (!container) return;
    
    container.textContent = text;
    container.className = 'message ' + type;
    
    // Автоматически скрываем сообщение через 5 секунд
    if (type === 'success') {
        setTimeout(() => {
            container.className = 'message';
            container.textContent = '';
        }, 5000);
    }
}

// ===== LOCALSTORAGE ФУНКЦИИ =====
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Ошибка сохранения в LocalStorage:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('mainForm');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Заполняем поля основной формы
            if (document.getElementById('name')) document.getElementById('name').value = data.name || '';
            if (document.getElementById('phone')) document.getElementById('phone').value = data.phone || '';
            if (document.getElementById('email')) document.getElementById('email').value = data.email || '';
            if (document.getElementById('comment')) document.getElementById('comment').value = data.comment || '';
            
            console.log('📂 Данные формы загружены из LocalStorage');
        }
    } catch (e) {
        console.error('Ошибка загрузки из LocalStorage:', e);
    }
}

// ===== МОДАЛЬНОЕ ОКНО =====
function initModal() {
    const contactBtns = document.querySelectorAll('#contactBtn, #contactBtnMobile, #heroContactBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModal');
    
    // Открытие модального окна
    contactBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
            
            // Добавляем запись в историю браузера
            history.pushState({ modalOpen: true }, '', '#contact-modal');
        });
    });
    
    // Закрытие модального окна
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Закрытие по клику на оверлей
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Обработка кнопки "Назад" в браузере
    window.addEventListener('popstate', function(e) {
        if (window.location.hash === '#contact-modal' || (e.state && e.state.modalOpen)) {
            openModal();
        } else {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
            closeModal();
        }
    });
}

// ===== АНИМАЦИЯ МОДАЛЬНОГО ОКНА (requestAnimationFrame) =====
function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('contactModal');
    
    if (!modalOverlay || !modal) return;
    
    // Показываем оверлей
    modalOverlay.style.display = 'flex';
    
    // Сбрасываем стили анимации
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9) translateY(20px)';
    
    // Анимация через requestAnimationFrame
    let startTime = null;
    const duration = 400; // 400ms
    
    function animateModal(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing функция для плавности (easeOutBack)
        const easeOutBack = function(t) {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };
        
        const easedPercentage = easeOutBack(percentage);
        
        // Анимируем
        modal.style.opacity = percentage;
        modal.style.transform = `scale(${0.9 + easedPercentage * 0.1}) translateY(${20 - easedPercentage * 20}px)`;
        
        if (progress < duration) {
            requestAnimationFrame(animateModal);
        }
    }
    
    requestAnimationFrame(animateModal);
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('contactModal');
    
    if (!modalOverlay || !modal) return;
    
    // Анимация закрытия через requestAnimationFrame
    let startTime = null;
    const duration = 300;
    
    function animateClose(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing функция (easeInBack)
        const easeInBack = function(t) {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return c3 * t * t * t - c1 * t * t;
        };
        
        const easedPercentage = easeInBack(percentage);
        
        modal.style.opacity = 1 - percentage;
        modal.style.transform = `scale(${1 - easedPercentage * 0.1}) translateY(${easedPercentage * 20}px)`;
        
        if (progress < duration) {
            requestAnimationFrame(animateClose);
        } else {
            modalOverlay.style.display = 'none';
            
            // Возвращаем нормальные стили
            modal.style.opacity = '';
            modal.style.transform = '';
            
            // Убираем hash из URL
            if (window.location.hash === '#contact-modal') {
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        }
    }
    
    requestAnimationFrame(animateClose);
}

// ===== SCROLL ЭФФЕКТЫ =====
function initScrollEffects() {
    // Параллакс-эффект для шапки
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.getElementById('header');
        
        if (header) {
            const speed = 0.5;
            header.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками
    document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
        observer.observe(card);
    });
}

// ===== ТЕСТОВАЯ АНИМАЦИЯ ДЛЯ ДЕМОНСТРАЦИИ =====
function initTestAnimation() {
    // Создаем тестовый элемент для демонстрации requestAnimationFrame
    const testElement = document.createElement('div');
    testElement.id = 'testAnimation';
    testElement.innerHTML = `
        <style>
            #testAnimation {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #ff6b6b, #ff5252);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
                user-select: none;
                text-align: center;
                padding: 5px;
            }
            
            #testAnimation:hover {
                transform: scale(1.1);
            }
            
            .animation-active {
                animation: pulse 1s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        </style>
        RAF<br>TEST
    `;
    
    document.body.appendChild(testElement);
    
    // Добавляем анимацию по клику
    testElement.addEventListener('click', function() {
        testElement.classList.add('animation-active');
        
        // Запускаем кастомную анимацию через requestAnimationFrame
        animateTestElement(testElement);
        
        // Убираем пульсацию через 2 секунды
        setTimeout(() => {
            testElement.classList.remove('animation-active');
        }, 2000);
    });
    
    function animateTestElement(element) {
        let startTime = null;
        const duration = 2000; // 2 секунды
        const startColor = '#ff6b6b';
        const endColor = '#26d0ce';
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Плавное изменение цвета
            const r1 = parseInt(startColor.slice(1, 3), 16);
            const g1 = parseInt(startColor.slice(3, 5), 16);
            const b1 = parseInt(startColor.slice(5, 7), 16);
            
            const r2 = parseInt(endColor.slice(1, 3), 16);
            const g2 = parseInt(endColor.slice(3, 5), 16);
            const b2 = parseInt(endColor.slice(5, 7), 16);
            
            const r = Math.round(r1 + (r2 - r1) * percentage);
            const g = Math.round(g1 + (g2 - g1) * percentage);
            const b = Math.round(b1 + (b2 - b1) * percentage);
            
            element.style.background = `rgb(${r}, ${g}, ${b})`;
            
            // Круговое движение
            const angle = percentage * Math.PI * 2;
            const radius = 50;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            element.style.transform = `translate(${x}px, ${y}px) rotate(${percentage * 360}deg)`;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                // Возвращаем в исходное положение
                element.style.transform = '';
                element.style.background = '';
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// ===== ОБРАБОТКА ОШИБОК =====
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
    
    // Можно отправить ошибку на сервер для логирования
    // fetch('/api/log-error', { method: 'POST', body: JSON.stringify(e.error) });
});

// Обработка неотловленных промисов
window.addEventListener('unhandledrejection', function(e) {
    console.error('Необработанный промис:', e.reason);
});

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

// Плавный скролл к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Активация пунктов меню при скролле
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-menu a, .mobile-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Инициализация года в футере
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});