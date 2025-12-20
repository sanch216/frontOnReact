# 🔴 CORS 401 Проблема

## Суть проблемы:

При запросе к защищенному эндпоинту (например `/order/initialize`):

1. Браузер сначала отправляет **OPTIONS** preflight запрос
2. Spring Security проверяет авторизацию **ДО** CORS фильтра
3. OPTIONS запрос **НЕ содержит** Authorization header
4. Бэк возвращает **401** без CORS заголовков
5. Браузер блокирует запрос: **"CORS Missing Allow Origin"**

## ✅ Временное решение на фронте:

1. **Отключили** `fetchUserInfo()` - не критично для работы
2. **Добавили** проверку токена перед отправкой заказа
3. **Добавили** автоматический редирект на login при 401

## ⚠️ Долгосрочное решение (для бэка):

Нужно добавить в `WebSecurityConfig.java`:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS ДО Security
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // OPTIONS без авторизации
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        // ... остальное
    return http.build();
}
```

## 🧪 Тестирование:

### Способ 1: Консоль браузера

Откройте консоль (F12) и выполните:

```javascript
// Скопируйте содержимое test-token.js
```

### Способ 2: curl

```bash
# Получить токен
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ssss@mail.ru","password":"12345678"}' \
  | jq -r '.accessToken')

echo "Token: $TOKEN"

# Создать заказ
curl -X POST http://localhost:8080/api/order/initialize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "srcAddress": "ул. Киевская 121, Бишкек",
    "destAddress": "пр. Чуй 265, Бишкек",
    "recipientFullName": "Тест Тестов",
    "recipientPhoneNumber": "+996555123456",
    "vehicleType": "MEDIUM"
  }'
```

### Способ 3: Постman/Insomnia

1. POST `http://localhost:8080/api/auth/login`
   - Body: `{"email":"ssss@mail.ru","password":"12345678"}`
   - Скопировать `accessToken`

2. POST `http://localhost:8080/api/order/initialize`
   - Header: `Authorization: Bearer <token>`
   - Body: JSON с адресами

## 📝 Что работает:

- ✅ Login (`/auth/login`) - работает, CORS настроен
- ✅ Registration (`/auth/client_signup`) - работает
- ❌ `/user/get_info` - 401 CORS (OPTIONS запрос блокируется)
- ❌ `/order/initialize` - 401 CORS (OPTIONS запрос блокируется)

## 🎯 Следующие шаги:

1. **Попробуйте создать заказ** - может сработать если токен валидный
2. Если всё равно 401 - **перелогиньтесь** (токен живёт 6 минут)
3. Если работает через curl, но не через браузер - **100% CORS проблема на бэке**

---

**P.S.** Временно UI будет работать с заглушками:
- Имя пользователя: "Пользователь" (вместо реального)
- Список заказов: [] (пустой массив)
