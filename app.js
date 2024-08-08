let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let cart = {};

const menuItems = {
    '1': { name: 'Воппер', price: 100 },
    '2': { name: 'Чизбургер', price: 200 },
    '3': { name: 'Наггетсы', price: 300 },
    '4': { name: 'Картофель фри', price: 400 },
    '5': { name: 'Кока-кола', price: 500 },
    '6': { name: 'Мороженое', price: 600 }
};

function updateMainButton() {
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    const totalCost = Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);
    
    if (totalItems > 0) {
        tg.MainButton.setText(`Заказать (${totalItems} шт., ${totalCost} руб.)`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

function addToCart(itemId) {
    if (cart[itemId]) {
        cart[itemId].quantity += 1;
    } else {
        cart[itemId] = { ...menuItems[itemId], quantity: 1 };
    }
    updateMainButton();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartElement = document.getElementById('cart');
    cartElement.innerHTML = '';
    
    for (const [itemId, item] of Object.entries(cart)) {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            ${item.name} - ${item.quantity} шт. 
            <button onclick="changeQuantity('${itemId}', -1)">-</button>
            <button onclick="changeQuantity('${itemId}', 1)">+</button>
        `;
        cartElement.appendChild(itemElement);
    }
}

function changeQuantity(itemId, delta) {
    cart[itemId].quantity += delta;
    if (cart[itemId].quantity <= 0) {
        delete cart[itemId];
    }
    updateMainButton();
    updateCartDisplay();
}

document.querySelectorAll('.menu-item').forEach(button => {
    button.addEventListener('click', () => addToCart(button.dataset.itemId));
});

Telegram.WebApp.onEvent("mainButtonClicked", function(){
    tg.sendData(JSON.stringify(cart));
});

let usercard = document.getElementById("usercard");
let p = document.createElement("p");
p.innerText = `${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;
usercard.appendChild(p);
