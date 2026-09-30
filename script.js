const products = [
  {
    id: 1,
    name: 'Organic Apples',
    category: 'fruits',
    price: 4.99,
    description: 'Crisp, sweet, and perfect for healthy snacking.',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Avocado',
    category: 'fruits',
    price: 2.49,
    description: 'Rich and creamy avocados picked for peak ripeness.',
    image: 'https://images.unsplash.com/photo-1519162808019-d98e5f1a8b7f?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Spinach Mix',
    category: 'vegetables',
    price: 3.29,
    description: 'Fresh leafy greens packed with nutrients and flavor.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'Bell Peppers',
    category: 'vegetables',
    price: 3.99,
    description: 'Colorful peppers ideal for salads, stir-fries, and roasting.',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    name: 'Farm Milk',
    category: 'dairy',
    price: 2.79,
    description: 'Fresh whole milk sourced from trusted local farms.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    name: 'Greek Yogurt',
    category: 'dairy',
    price: 5.49,
    description: 'Creamy, protein-rich yogurt for breakfast or smoothies.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 7,
    name: 'Brown Rice',
    category: 'pantry',
    price: 6.99,
    description: 'Natural and wholesome rice made for easy meal prep.',
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 8,
    name: 'Olive Oil',
    category: 'pantry',
    price: 8.49,
    description: 'Cold-pressed extra virgin olive oil for cooking and drizzling.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80'
  }
];

const cart = [];

const productGrid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeModal = document.getElementById('close-modal');
const checkoutForm = document.getElementById('checkout-form');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function renderProducts(activeCategory = 'all') {
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category === activeCategory);

  productGrid.innerHTML = filteredProducts
    .map(
      product => `
        <article class="product-card" data-category="${product.category}">
          <img src="${product.image}" alt="${product.name}" class="product-image" />
          <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <span class="product-price">${formatCurrency(product.price)}</span>
              <button class="add-to-cart-btn" data-id="${product.id}">Add</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.id)));
  });
}

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find(item => item.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function updateQuantity(productId, change) {
  const item = cart.find(entry => entry.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    const index = cart.findIndex(entry => entry.id === productId);
    cart.splice(index, 1);
  }

  renderCart();
}

function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
  }
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty. Add some fresh groceries!</div>';
  } else {
    cartItems.innerHTML = cart
      .map(
        item => `
          <div class="cart-item">
            <img class="cart-item-image" src="${item.image}" alt="${item.name}" />
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">${formatCurrency(item.price)}</div>
            </div>
            <div class="cart-item-quantity">
              <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
            </div>
            <button class="remove-btn" data-id="${item.id}">Remove</button>
          </div>
        `
      )
      .join('');
  }

  document.querySelectorAll('.qty-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const action = button.dataset.action;
      updateQuantity(id, action === 'increase' ? 1 : -1);
    });
  });

  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', () => removeFromCart(Number(button.dataset.id)));
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.08;
  const grandTotal = total + tax;

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  subtotalEl.textContent = formatCurrency(total);
  taxEl.textContent = formatCurrency(tax);
  totalEl.textContent = formatCurrency(grandTotal);
}

function setupCategoryFilters() {
  document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderProducts(button.dataset.category);
    });
  });
}

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Add at least one item to your cart before checking out.');
    return;
  }
  checkoutModal.classList.remove('hidden');
  checkoutModal.classList.add('show');
});

closeModal.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
  checkoutModal.classList.remove('show');
});

checkoutForm.addEventListener('submit', event => {
  event.preventDefault();
  alert('Order placed successfully! Fresh groceries are on the way.');
  checkoutForm.reset();
  checkoutModal.classList.add('hidden');
  checkoutModal.classList.remove('show');
});

setupCategoryFilters();
renderProducts();
renderCart();
