# Тестирование создания заказа

## Что проверить в консоли браузера (F12):

### 1. При нажатии кнопки "Далее →" должно появиться:

```
[API REQUEST] {
  method: "post",
  url: "/order/initialize",
  baseURL: "http://localhost:8080/api",
  data: {
    srcAddress: "...",
    destAddress: "...",
    recipientFullName: "...",
    recipientPhoneNumber: "...",
    vehicleType: "MEDIUM"
  },
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ..."
  }
}
```

### 2. Если ошибка, смотрим:

```
[API ERROR] status: ???
[API ERROR] response.data: ???
```

## Частые ошибки:

### ❌ 400 Bad Request
**Причина:** Бэк не может распарсить JSON
**Решение:** Проверить, что все поля заполнены правильно

### ❌ 401 Unauthorized  
**Причина:** Токен не валидный или истёк
**Решение:** Перелогиниться

### ❌ 500 Internal Server Error
**Причина:** Ошибка на бэке (Redis, Google Maps API, база данных)
**Решение:** Проверить логи бэка (./mvnw spring-boot:run)

### ❌ 404 Not Found
**Причина:** Неправильный URL
**Решение:** Проверить `VITE_API_BASE` в .env

### ❌ Network Error / Timeout
**Причина:** Бэк не запущен или CORS
**Решение:** 
1. Запустить бэк: `./mvnw spring-boot:run`
2. Проверить CORS на бэке: `@CrossOrigin(origins = "http://localhost:5173")`

## Проверка вручную через curl:

```bash
# 1. Получить токен
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Ответ: {"accessToken":"...", "refreshToken":"..."}

# 2. Создать заказ (замените YOUR_TOKEN)
curl -X POST http://localhost:8080/api/order/initialize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "srcAddress": "ул. Киевская 121, Бишкек",
    "destAddress": "пр. Чуй 265, Бишкек",
    "recipientFullName": "Тест Тестов",
    "recipientPhoneNumber": "+996555123456",
    "vehicleType": "MEDIUM"
  }'
```

## Проверка формата данных:

**vehicleType** должен быть один из:
- `"SMALL"` - мотоцикл
- `"MEDIUM"` - легковой
- `"BIG"` - грузовой

**recipientPhoneNumber** должен быть в формате:
- `"+996555123456"` (с плюсом)
- Или `"0555123456"` (без плюса)

**srcAddress** и **destAddress** должны быть в формате:
- `"ул. Киевская 121, Бишкек"` (полный адрес с городом)
