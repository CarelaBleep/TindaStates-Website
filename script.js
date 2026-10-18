// --- CONFIGURATION ---
// Replace 'YOUR_FB_PAGE_USERNAME' with your actual Facebook page handle or ID (e.g., 'ToteShopPH')
const FB_PAGE_USERNAME = "tindastates"; // Example: 'ToteShopPH' or '1234567890'

// --- PRODUCT DATA ---
const products = [
    {
        id: 1,
        name: "Trader Joe's Mini Tote - Lavender",
        originalPrice: 630,
        price: 549,
        image: "img/tj/miniviolet.png",
        category: "trader-joes"
    },
    {
        id: 2,
        name: "Trader Joe's Mini Tote - Pink",
        originalPrice: 630,
        price: 549,
        image: "img/tj/minipink.png",
        category: "trader-joes"
    },
    {
        id: 3,
        name: "Trader Joe's Mini Tote - Blue",
        originalPrice: 630,
        price: 549,
        image: "img/tj/miniblue.png",
        category: "trader-joes"
    },
    {
        id: 4,
        name: "Trader Joe's Large Tote - Violet",
        originalPrice: 670,
        price: 599,
        image: "img/tj/largeviolet.png",
        category: "trader-joes"
    },
    {
        id: 5,
        name: "Trader Joe's Large Tote - Navy",
        originalPrice: 670,
        price: 599,
        image: "img/tj/largeblue.png",
        category: "trader-joes"
    },
    {
        id: 6,
        name: "Michael Kors Jet Set Crossbody",
        price: 6000,
        image: "img/mk/mkbeige.png",
        category: "mk"
    },
    {
        id: 7,
        name: "Michael Kors Jet Set Crossbody Black",
        price: 6000,
        image: "img/mk/mkblk.png",
        soldOut: true,
        category: "mk"
    },
    {
        id: 8,
        name: "Michael Kors - Classic Medium Backpack",
        price: 6000,
        image: "img/mk/mkbag.png",
        category: "mk"
    },
    {
        id: 9,
        name: "Michael Kors Black Leather Crossbody Bag with Tech Attachment Case",
        price: 6000,
        image: "img/mk/mkblack.png",
        category: "mk"
    },
    {
        id: 10,
        name: "Michael Kors Jet Set Crossbody - Moss",
        price: 6000,
        image: "img/mk/mkmoss.png",
        category: "mk"
    },
    {
        id: 11,
        name: "Crate & Kids Blue 13\"Backpack",
        originalPrice: 1149,
        price: 899,
        image: "img/kidsbag/smlblue.jpg",
        category: "kids"
    },
    {
        id: 12,
        name: "Cat & Jack Dino Camo 17\" Backpack",
        originalPrice: 1149,
        price: 899,
        image: "img/kidsbag/medblue.jpg",
        category: "kids"
    },
    {
        id: 13,
        name: "Children Place Camo 16\"Backpack",
        originalPrice: 1149,
        price: 899,
        image: "img/kidsbag/camo.jpg",
        category: "kids"
    },
    {
        id: 20,
        name: "Old Navy Tshirt (xs to xl)",
        originalPrice: 379,
        price: 279,
        image: "img/salesale/onsale.jpg",
        category: "offers"
    },
    {
        id: 14,
        name: "Gray Smokey Bear T-Shirt (M only)",
        originalPrice: 249,
        price: 199,
        image: "img/salesale/graytshirt.jpg",
        category: "offers"
    },
    {
        id: 15,
        name: "Unisex Long Sleeve Pocket Tees (M only)",
        originalPrice: 399,
        price: 299,
        image: "img/salesale/lgray.jpg",
        category: "offers"
    },
    {
        id: 16,
        name: "Unisex Long Sleeve Pocket Tees (M only)",
        originalPrice: 399,
        price: 299,
        image: "img/salesale/lcream.jpg",
        category: "offers"
    },
    {
        id: 17,
        name: "Kids' Jogger",
        originalPrice: 349,
        price: 249,
        image: "img/salesale/kidsjogger.jpg",
        category: "offers"
    },
    {
        id: 18,
        name: "Black Off-Shoulder Dress (S only)",
        originalPrice: 449,
        price: 375,
        image: "img/salesale/offshoulderdressblk.jpg",
        category: "offers"
    },
    {
        id: 19,
        name: "Pink Off-Shoulder Dress (S only)",
        originalPrice: 449,
        price: 375,
        image: "img/salesale/offshoulderdresspnk.jpg",
        category: "offers"
    }
];

// Shopping Cart state array
const CART_STORAGE_KEY = "tindastates-cart";

function loadCart() {
    try {
        if (typeof window === "undefined" || !window.localStorage) {
            return [];
        }

        const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!savedCart) {
            return [];
        }

        const parsedCart = JSON.parse(savedCart);
        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
        return [];
    }
}

function saveCart() {
    try {
        if (typeof window === "undefined" || !window.localStorage) {
            return;
        }

        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        // Ignore storage errors so cart actions still work in-memory
    }
}

let cart = loadCart();

// Initialize website on load
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartUI();
    document.getElementById("product-search").addEventListener("input", event => {
        renderProducts(event.target.value);
    });
});

// Render Product Cards on the webpage
function renderProducts(searchTerm = "") {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const matchingProducts = products.filter(product =>
        product.name.toLowerCase().includes(normalizedSearchTerm)
    );

    if (matchingProducts.length === 0) {
        ["product-grid", "mk-product-grid", "kids-product-grid", "offers-product-grid"].forEach(gridId => {
            document.getElementById(gridId).innerHTML =
                `<p class="no-results">No products found.</p>`;
        });
        return;
    }

    renderProductGroup("product-grid", matchingProducts.filter(product => product.category === "trader-joes"));
    renderProductGroup("mk-product-grid", matchingProducts.filter(product => product.category === "mk"));
    renderProductGroup("kids-product-grid", matchingProducts.filter(product => product.category === "kids"));
    renderProductGroup("offers-product-grid", matchingProducts.filter(product => product.category === "offers"));
}

function renderProductGroup(gridId, groupProducts) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = "";

    groupProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-img-container">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                ${product.soldOut
                    ? `<span class="sold-out-badge">Sold out</span>`
                    : `<button class="quick-add-btn" type="button" onclick="addToCart(${product.id}, this)" aria-label="Add ${product.name} to cart">
                           <img src="1.ico" alt="" aria-hidden="true">
                           <span aria-hidden="true">+</span>
                       </button>`}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">
                    ${product.originalPrice
                        ? `<span class="original-price">₱${product.originalPrice.toLocaleString()}</span>
                           <span class="sale-price">₱${product.price.toLocaleString()}</span>`
                        : `₱${product.price.toLocaleString()}`}
                </p>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.scrollProductGroup = function (gridId, direction) {
    const grid = document.getElementById(gridId);
    const scrollAmount = grid.clientWidth * 0.85;
    grid.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
};

// Add item to cart or increase quantity if it already exists
function addToCart(productId, button) {
    const product = products.find(p => p.id === productId);
    if (!product || product.soldOut) return;

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();

    const cartButton = document.querySelector(".cart-icon-container");
    cartButton.classList.remove("cart-added");
    void cartButton.offsetWidth;
    cartButton.classList.add("cart-added");

    if (button) {
        clearTimeout(button.addedTimeout);
        button.textContent = "Added to Cart!";
        button.classList.add("added");
        button.addedTimeout = setTimeout(() => {
            button.innerHTML = `<img src="1.ico" alt="Cart" style="width: 20px; height: 20px; vertical-align: middle;">`;
            button.classList.remove("added");
        }, 1200);
    }
}

// Change quantity in cart (+ or -)
function changeQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    cartItem.quantity += change;
    if (cartItem.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    saveCart();
    updateCartUI();
}

// Toggle Cart Slide-out Modal
function toggleCartModal() {
    const modal = document.getElementById("cart-modal");
    modal.classList.toggle("hidden");
}

// Update Cart View, Badges, and Total
function updateCartUI() {
    const cartCount = document.getElementById("cart-count");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-fb-btn");

    // Total item count for badge
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;

    if (cart.length === 0) {
        cartItemsList.innerHTML = `<p class="empty-cart-msg">Your cart is empty.</p>`;
        cartTotal.textContent = `₱0.00`;
        checkoutBtn.disabled = true;
        return;
    }

    // Render list of cart items
    cartItemsList.innerHTML = "";
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        const itemRow = document.createElement("div");
        itemRow.className = "cart-item-row";
        itemRow.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₱${item.price} × ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        cartItemsList.appendChild(itemRow);
    });

    cartTotal.textContent = `₱${totalPrice.toLocaleString()}`;
    checkoutBtn.disabled = false;
}

function createOrderMessage() {
    let message = "Hi! I would like to place an order for:\n\n";
    let totalPrice = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalPrice += subtotal;
        message += `${item.quantity}x ${item.name} - ₱${subtotal.toLocaleString()}\n`;
    });

    message += `\nProduct total: ₱${totalPrice.toLocaleString()}`;
    message += "\nShipping fee: To be confirmed based on location";
    message += "\n\nPlease let me know how to proceed with payment and shipping.";
    return message;
}

async function copyOrderToClipboard(message) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message);
        return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = message;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    textArea.remove();

    if (!copied) {
        throw new Error("Clipboard access was not available.");
    }
}

// Open a direct Messenger conversation with the order details
async function checkoutViaMessenger() {
    if (cart.length === 0) return;

    const orderMessage = createOrderMessage();
    const messengerUrl = `https://m.me/61577091522099?text=${encodeURIComponent(orderMessage)}`;

    try {
        await copyOrderToClipboard(orderMessage);
        window.open(messengerUrl, "_blank", "noopener,noreferrer");
        const checkoutButton = document.getElementById("checkout-fb-btn");
        checkoutButton.textContent = "Order Ready - Click Send";
        setTimeout(() => {
            checkoutButton.innerHTML = '<span aria-hidden="true">💬</span> Message TindaStates';
        }, 2500);
    } catch (error) {
        window.open(messengerUrl, "_blank", "noopener,noreferrer");
        alert("Messenger opened. If the order is not prefilled, paste the copied order details into the chat before sending.");
    }
}