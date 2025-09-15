// Select all "Add" buttons
const addButtons = document.querySelectorAll('.table a');

// Initialize cart
let cart = [];

// Create floating cart button
let cartButton = document.createElement('button');
cartButton.id = 'cart-button';
cartButton.innerText = `Cart (0)`;
cartButton.style.position = 'fixed';
cartButton.style.bottom = '20px';
cartButton.style.right = '20px';
cartButton.style.background = '#ff9f43';
cartButton.style.color = '#fff';
cartButton.style.padding = '12px 20px';
cartButton.style.border = 'none';
cartButton.style.borderRadius = '25px';
cartButton.style.fontWeight = 'bold';
cartButton.style.cursor = 'pointer';
cartButton.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
document.body.appendChild(cartButton);

// Update cart button count
function updateCartButton() {
    cartButton.innerText = `Cart (${cart.length})`;
}

// Create cart modal
const cartModal = document.createElement('div');
cartModal.id = 'cart-modal';
cartModal.style.position = 'fixed';
cartModal.style.top = '0';
cartModal.style.left = '0';
cartModal.style.width = '100%';
cartModal.style.height = '100%';
cartModal.style.background = 'rgba(0,0,0,0.6)';
cartModal.style.display = 'none';
cartModal.style.justifyContent = 'center';
cartModal.style.alignItems = 'center';
cartModal.style.zIndex = '1000';

cartModal.innerHTML = `
<div style="background:#fff; padding:30px; border-radius:12px; width:90%; max-width:500px; text-align:center; position:relative;">
    <h2>Your Order</h2>
    <div id="cart-items" style="margin:20px 0;"></div>
    <h3 id="cart-total"></h3>
    <button id="place-order" style="background:#28a745; color:#fff; padding:12px 25px; border:none; border-radius:25px; cursor:pointer; margin-top:15px;">Place Order</button>
    <button id="close-cart" style="position:absolute; top:10px; right:10px; background:#ff3b2d; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">X</button>
</div>
`;
document.body.appendChild(cartModal);

const cartItemsDiv = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const placeOrderBtn = document.getElementById('place-order');
const closeCartBtn = document.getElementById('close-cart');

// Add items to cart
addButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const row = button.parentElement.parentElement;
        const itemName = row.children[1].innerText;
        const itemPriceText = row.children[3].innerText;
        let itemPrice = parseFloat(itemPriceText.replace(/[^0-9.]/g, ''));
        if (isNaN(itemPrice)) itemPrice = 0; // Handle text prices

        cart.push({ name: itemName, price: itemPrice });

        // Feedback
        button.innerText = "Added ✔";
        button.style.background = "#28a745";
        setTimeout(() => {
            button.innerText = "Add";
            button.style.background = "#ff6f61";
        }, 1500);

        updateCartButton();
    });
});

// Open/Close cart modal
cartButton.addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'flex';
});

closeCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Render cart items
function renderCart() {
    cartItemsDiv.innerHTML = '';
    let total = 0;
    if(cart.length === 0){
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.innerText = '';
        return;
    }
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.marginBottom = '10px';
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <button style="background:#ff3b2d; color:#fff; border:none; border-radius:5px; cursor:pointer;">Remove</button>
        `;
        // Remove item
        itemDiv.querySelector('button').addEventListener('click', () => {
            cart.splice(index, 1);
            renderCart();
            updateCartButton();
        });
        cartItemsDiv.appendChild(itemDiv);
        total += item.price;
    });
    cartTotal.innerText = `Total: $${total.toFixed(2)}`;
}

// Web Notification Permission
if ("Notification" in window) {
    Notification.requestPermission();
}

// Place order → ask for address
placeOrderBtn.addEventListener('click', () => {
    if(cart.length === 0){
        alert("Cart is empty!");
        return;
    }

    // Address modal
    const addressModal = document.createElement('div');
    addressModal.style.position = 'fixed';
    addressModal.style.top = '0';
    addressModal.style.left = '0';
    addressModal.style.width = '100%';
    addressModal.style.height = '100%';
    addressModal.style.background = 'rgba(0,0,0,0.6)';
    addressModal.style.display = 'flex';
    addressModal.style.justifyContent = 'center';
    addressModal.style.alignItems = 'center';
    addressModal.style.zIndex = '1001';
    addressModal.innerHTML = `
    <div style="background:#fff; padding:30px; border-radius:12px; width:90%; max-width:400px; text-align:center; position:relative;">
        <h2>Delivery Address</h2>
        <textarea id="delivery-address" placeholder="Enter your address" style="width:100%; padding:10px; border-radius:8px; border:2px solid #ff9f43; margin:15px 0;"></textarea>
        <br>
        <button id="confirm-order" style="background:#28a745; color:#fff; padding:12px 25px; border:none; border-radius:25px; cursor:pointer;">Confirm Order</button>
        <button id="close-address" style="position:absolute; top:10px; right:10px; background:#ff3b2d; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">X</button>
    </div>
    `;
    document.body.appendChild(addressModal);

    // Close address modal
    addressModal.querySelector('#close-address').addEventListener('click', () => {
        addressModal.remove();
    });

    // Confirm order
    addressModal.querySelector('#confirm-order').addEventListener('click', () => {
        const address = document.getElementById('delivery-address').value.trim();
        if(address === '') {
            alert("Please enter your address!");
            return;
        }

        // Order Summary Modal
        const summaryModal = document.createElement('div');
        summaryModal.style.position = 'fixed';
        summaryModal.style.top = '0';
        summaryModal.style.left = '0';
        summaryModal.style.width = '100%';
        summaryModal.style.height = '100%';
        summaryModal.style.background = 'rgba(0,0,0,0.6)';
        summaryModal.style.display = 'flex';
        summaryModal.style.justifyContent = 'center';
        summaryModal.style.alignItems = 'center';
        summaryModal.style.zIndex = '1002';

        const itemsList = cart.map(item => `${item.name} - $${item.price.toFixed(2)}`).join('\n');
        const totalPrice = cart.reduce((sum,item)=> sum+item.price,0).toFixed(2);

        summaryModal.innerHTML = `
        <div style="background:#fff; padding:30px; border-radius:12px; width:90%; max-width:400px; text-align:center; position:relative;">
            <h2>Order Placed Successfully!</h2>
            <pre style="text-align:left;">Items:\n${itemsList}\nTotal: $${totalPrice}\n\nDelivery Address:\n${address}</pre>
            <button id="close-summary" style="background:#28a745; color:#fff; padding:12px 25px; border:none; border-radius:25px; cursor:pointer; margin-top:15px;">Close</button>
        </div>
        `;
        document.body.appendChild(summaryModal);

        summaryModal.querySelector('#close-summary').addEventListener('click', () => {
            summaryModal.remove();
        });

        // Browser Notification
        if(Notification.permission === "granted") {
            new Notification("Malnad Iyengar Bakery 🍰", {
                body: `Order Placed!\nTotal: $${totalPrice}\nAddress: ${address}`,
                icon: "./logo.png" // optional
            });
        }

        // Clear cart
        cart = [];
        renderCart();
        updateCartButton();
        cartModal.style.display = 'none';
        addressModal.remove();
    });
});
