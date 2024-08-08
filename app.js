let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

const items = {
    1: { name: "Чизбургер", price: 50 },
    2: { name: "Гамбургер", price: 45 },
    3: { name: "Кока-кола", price: 25 },
    4: { name: "Картофель фри", price: 35 },
    5: { name: "Наггетсы", price: 40 },
    6: { name: "Мороженое", price: 20 }
};

let cart = {};

function updateMainButton() {
    let total = Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);
    let count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    
    if (count > 0) {
        tg.MainButton.setText(`Оформить заказ (${count} шт, ${total} руб)`);
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
    updateMainButton();
    updateButtonText(id);
}

function updateButtonText(id) {
    let btn = document.getElementById(`btn${id}`);
    if (btn) {
        btn.textContent = cart[id] ? `Добавить еще (${cart[id].quantity})` : 'Добавить';
    }
}

for (let i = 1; i <= 6; i++) {
    let btn = document.getElementById(`btn${i}`);
    if (btn) {
        btn.textContent = 'Добавить';
        btn.addEventListener("click", () => addToCart(i));
    } else {
        console.error(`Button with id btn${i} not found`);
    }
}

tg.MainButton.onClick(() => {
    let orderDetails = Object.values(cart).map(item => 
        `${item.name} x${item.quantity} - ${item.price * item.quantity} руб`
    ).join('\n');
    
    let total = Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);
    
    let message = `Новый заказ:\n${orderDetails}\n\nИтого: ${total} руб`;
    
    tg.sendData(JSON.stringify({
        action: 'order',
        order: cart,
        total: total
    }));
    
    tg.close();
});

let usercard = document.getElementById("usercard");
if (usercard) {
    let p = document.createElement("p");
    p.innerText = `${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;
    usercard.appendChild(p);
} else {
    console.error("Element with id 'usercard' not found");
}
