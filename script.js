<?php
/**
 * Обработчик формы для кондитерской (альтернатива Formspree)
 * Сохраняет данные формы в файл и отправляет на email
 * 
 * @package FormHandler
 * @version 1.0.0
 */

// Настройки
$recipient_email = "info@eclat-douceur.ru"; // Замените на ваш email
$save_to_file = true; // Сохранять ли данные в файл
$log_file = "form-submissions.log"; // Файл для логов

// Получаем данные из формы
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
$phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : '';
$email = isset($_POST['email']) ? htmlspecialchars(trim($_POST['email'])) : '';
$service = isset($_POST['service']) ? htmlspecialchars(trim($_POST['service'])) : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

// Валидация
$errors = [];

if (empty($name)) {
    $errors[] = "Имя обязательно для заполнения";
}

if (empty($phone)) {
    $errors[] = "Телефон обязателен для заполнения";
} elseif (!preg_match('/^[\d\s\-\+\(\)]{10,20}$/', $phone)) {
    $errors[] = "Некорректный формат телефона";
}

if (empty($email)) {
    $errors[] = "Email обязателен для заполнения";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Некорректный формат email";
}

// Если есть ошибки, возвращаем их
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'errors' => $errors
    ]);
    exit;
}

// Подготовка данных для сохранения
$submission_data = [
    'date' => date('Y-m-d H:i:s'),
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'service' => $service,
    'message' => $message,
    'ip' => $_SERVER['REMOTE_ADDR']
];

// Сохранение в файл (если включено)
if ($save_to_file) {
    $log_entry = json_encode($submission_data, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}

// Отправка email
$email_subject = "Новая заявка с сайта Éclat de Douceur";
$email_body = "
Новая заявка с сайта:

Имя: $name
Телефон: $phone
Email: $email
Услуга: $service
Сообщение: $message

Дата: " . date('Y-m-d H:i:s') . "
IP: " . $_SERVER['REMOTE_ADDR'] . "
";

$email_headers = [
    'From: noreply@eclat-douceur.ru',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=utf-8',
    'X-Mailer: PHP/' . phpversion()
];

$mail_sent = mail($recipient_email, $email_subject, $email_body, implode("\r\n", $email_headers));

// Ответ клиенту
if ($mail_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Спасибо! Ваша заявка отправлена.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при отправке заявки. Пожалуйста, попробуйте позже.'
    ]);
}
?>
