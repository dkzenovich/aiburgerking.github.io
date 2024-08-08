let tg = window.Telegram.WebApp;

tg.expand();

let cart = [];
let total = 0;

function addToCart(item, price) {
    cart.push({name: item, price: price});
    total += price;
    updateCart();
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
    } else {
        tg.MainButton.hide();
    }
}

Telegram.WebApp.onEvent('mainButtonClicked', function(){
    console.log('MainButton clicked');
    tg.sendData(JSON.stringify({
        cart: cart,
        total: total
    }));
});

tg.onEvent('viewportChanged', function(){
    console.log('Viewport changed');
});

// Добавим обработчик для кнопки "Оплатить" в HTML
document.getElementById('pay-button').addEventListener('click', function() {
    console.log('Pay button clicked');
    tg.MainButton.setText("Оплатить");
    tg.MainButton.show();
});

console.log('Web App initialized');
