let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let cart = [];
let total = 0;

const items = [
    { id: 1, name: "Воппер", price: 100 },
    { id: 2, name: "Чизбургер", price: 200 },
    { id: 3, name: "Наггетсы", price: 300 },
    { id: 4, name: "Картофель фри", price: 400 },
    { id: 5, name: "Кока-кола", price: 500 },
    { id: 6, name: "Мороженое", price: 600 }
];

function updateCart() {
    let cartText = "Корзина:\n";
    cart.forEach(item => {
        cartText += `${item.name} - ${item.price} руб.\n`;
    });
    cartText += `\nИтого: ${total} руб.`;
    document.getElementById('usercard').innerText = cartText;
    
    if (total > 0) {
        document.getElementById('checkout').style.display = 'block';
    } else {
        document.getElementById('checkout').style.display = 'none';
    }
}

for (let i = 1; i <= 6; i++) {
    document.getElementById(`btn${i}`).addEventListener("click", function() {
        const item = items[i-1];
        cart.push(item);
        total += item.price;
        updateCart();
    });
}

document.getElementById('checkout').addEventListener('click', function() {
    tg.MainButton.setText("Оплатить");
    tg.MainButton.show();
});

Telegram.WebApp.onEvent("mainButtonClicked", function(){
    tg.sendData(JSON.stringify({
        cart: cart,
        total: total
    }));
});

let p = document.createElement("p");
p.innerText = `${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;
document.getElementById("usercard").appendChild(p);
