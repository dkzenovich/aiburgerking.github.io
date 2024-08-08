let tg = window.Telegram.WebApp;

function debugLog(message) {
    console.log(message);
    let debugInfo = document.getElementById('debug-info');
    debugInfo.textContent += message + '\n';
}

debugLog('Web App initializing...');

tg.expand();

let cart = [];
let total = 0;

function addToCart(item, price) {
    cart.push({name: item, price: price});
    total += price;
    updateCart();
    debugLog(`Added to cart: ${item} - ${price} руб.`);
}

function updateCart() {
    let cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        let itemElement = document.createElement('p');
        itemElement.textContent = `${item.name} - ${item.price} руб.`;
        cartItems.appendChild(itemElement);
    });
    document.getElementById('total').textContent = total;
    
    if (total > 0) {
        tg.MainButton.setText("Оплатить");
        tg.MainButton.show();
        debugLog('MainButton shown');
    } else {
        tg.MainButton.hide();
        debugLog('MainButton hidden');
    }
}

tg.onEvent('mainButtonClicked', function(){
    debugLog('MainButton clicked');
    sendOrder();
});

document.getElementById('pay-button').addEventListener('click', function() {
    debugLog('Pay button clicked');
    sendOrder();
});

function sendOrder() {
    let data = {
        cart: cart,
        total: total
    };
    debugLog('Attempting to send data to bot: ' + JSON.stringify(data));
    try {
        tg.sendData(JSON.stringify(data));
        debugLog('Data sent successfully');
    } catch (error) {
        debugLog('Error sending data: ' + error.message);
    }
    debugLog('tg.initDataUnsafe: ' + JSON.stringify(tg.initDataUnsafe));
    debugLog('tg.initData: ' + tg.initData);
}

// Инициализация
debugLog('Web App initialized');
debugLog('Telegram WebApp version: ' + tg.version);
debugLog('Platform: ' + tg.platform);

// Добавим обработчик для закрытия веб-приложения
tg.onEvent('viewportChanged', function(){
    debugLog('Viewport changed');
});

tg.onEvent('backButtonClicked', function(){
    debugLog('Back button clicked');
    tg.close();
});

// Отобразим MainButton, если корзина не пуста
if (total > 0) {
    tg.MainButton.setText("Оплатить");
    tg.MainButton.show();
}
