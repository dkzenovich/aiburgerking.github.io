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
    
    let orderBtn = document.getElementById('order-btn');
    if (total > 0) {
        orderBtn.style.display = 'block';
    } else {
        orderBtn.style.display = 'none';
    }
}

function placeOrder() {
    tg.MainButton.text = "Оплатить";
    tg.MainButton.show();
}

Telegram.WebApp.onEvent('mainButtonClicked', function(){
    tg.sendData(JSON.stringify({
        cart: cart,
        total: total
    }));
});

tg.onEvent('viewportChanged', function(){
    console.log('Viewport changed');
});

console.log('Web App initialized');
