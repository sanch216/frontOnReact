// Тест для проверки токена в консоли браузера
// Откройте консоль (F12) и выполните эти команды:

// 1. Проверить наличие токена
console.log('Access Token:', localStorage.getItem('token'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));

// 2. Декодировать JWT токен (для проверки срока жизни)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

const token = localStorage.getItem('token');
if (token) {
    const payload = parseJwt(token);
    console.log('Token Payload:', payload);
    console.log('Issued At:', new Date(payload.iat * 1000).toLocaleString());
    console.log('Expires At:', new Date(payload.exp * 1000).toLocaleString());
    console.log('Is Valid:', Date.now() < payload.exp * 1000);
} else {
    console.log('Токен отсутствует!');
}

// 3. Тест запроса к /order/initialize
async function testOrderInit() {
    try {
        const response = await fetch('http://localhost:8080/api/order/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                srcAddress: "ул. Киевская 121, Бишкек",
                destAddress: "пр. Чуй 265, Бишкек",
                recipientFullName: "Тест Тестов",
                recipientPhoneNumber: "+996555123456",
                vehicleType: "MEDIUM"
            })
        });

        console.log('Status:', response.status);
        console.log('Headers:', [...response.headers.entries()]);

        if (response.ok) {
            const data = await response.json();
            console.log('Response:', data);
        } else {
            const text = await response.text();
            console.error('Error:', text);
        }
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

// Запустить тест:
// testOrderInit();
