let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

const items = {
    1: { name: "Воппер", price: 100 },
    2: { name: "Чизбургер", price: 50 },
    // Добавьте остальные товары здесь
};

let cart = {};

function updateCart() {
    let cartElement = document.getElementById('cart');
    let total = 0;
    let cartHTML = '<h2>Корзина</h2>';

    for (let id in cart) {
        let item = cart[id];
        total += item.price * item.quantity;
        cartHTML += `<p>${item.name} x${item.quantity} - ${item.price * item.quantity} руб.</p>`;
    }

    cartHTML += `<p><strong>Итого: ${total} руб.</strong></p>`;
    cartElement.innerHTML = cartHTML;

    updateMainButton(total);
}

function updateMainButton(total) {
    if (total > 0) {
        tg.MainButton.setText(`Оформить заказ (${total} руб)`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

function addToCart(id) {
    if (cart[id]) {
        cart[id].quantity++;
    } else {
        cart[id] = { ...items[id], quantity: 1 };
    }
    updateCart();
}

// Добавьте обработчики событий для кнопок "Добавить в корзину"
for (let id in items) {
    let btn = document.getElementById(`add-to-cart-${id}`);
    if (btn) {
        btn.addEventListener('click', () => addToCart(id));
    }
}

tg.MainButton.onClick(() => {
    if (Object.keys(cart).length === 0) {
        tg.showAlert("Ваша корзина пуста. Пожалуйста, добавьте товары в корзину.");
        return;
    }

    let orderDetails = Object.values(cart).map(item => 
        `${item.name} x${item.quantity} - ${item.price * item.quantity} руб`
    ).join('\n');
    
    let total = Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);
    
    tg.sendData(JSON.stringify({
        action: 'order',
        order: cart,
        total: total
    }));
    
    tg.close();
});

// Начальное обновление корзины
updateCart();
