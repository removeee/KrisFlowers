/* KrisFlowers — Main Application */
const Cart = {
  key: 'krisflowers_cart',

  get() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  },

  save(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
    this.updateBadge();
  },

  add(productId, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty });
    }
    this.save(items);
    return items;
  },

  remove(productId) {
    const items = this.get().filter(i => i.id !== productId);
    this.save(items);
    return items;
  },

  setQty(productId, qty) {
    const items = this.get();
    const item = items.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
      this.save(items);
    }
    return items;
  },

  clear() {
    localStorage.removeItem(this.key);
    this.updateBadge();
  },

  count() {
    return this.get().reduce((sum, i) => sum + i.qty, 0);
  },

  total() {
    return this.get().reduce((sum, item) => {
      const product = getProductById(item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  },

  updateBadge() {
    document.querySelectorAll('.cart-badge').forEach(badge => {
      const count = this.count();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

function showToast(message, icon = '🌸') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<span class="toast__icon"></span><span class="toast__text"></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast__icon').textContent = icon;
  toast.querySelector('.toast__text').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function initHeader() {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.nav-overlay');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('open');
      overlay?.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    overlay?.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('open');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  Cart.updateBadge();
}

function initPetals() {
  const container = document.querySelector('.petals');
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (8 + Math.random() * 12) + 's';
    petal.style.animationDelay = Math.random() * 10 + 's';
    petal.style.width = (12 + Math.random() * 16) + 'px';
    petal.style.height = petal.style.width;
    container.appendChild(petal);
  }
}

function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

function initProductActions() {
  document.addEventListener('click', e => {
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = Number(addBtn.dataset.add);
      const product = getProductById(id);
      if (product) {
        Cart.add(id);
        showToast(`«${product.name}» добавлен в корзину`, '💐');
        addBtn.style.transform = 'scale(1.3)';
        setTimeout(() => { addBtn.style.transform = ''; }, 300);
      }
      return;
    }

    const quickBtn = e.target.closest('[data-quick]');
    if (quickBtn) {
      e.preventDefault();
      e.stopPropagation();
      openQuickView(Number(quickBtn.dataset.quick));
      return;
    }

    const card = e.target.closest('.product-card');
    if (card && !e.target.closest('button')) {
      openQuickView(Number(card.dataset.id));
    }
  });
}

function openQuickView(id) {
  const product = getProductById(id);
  if (!product) return;

  let overlay = document.querySelector('.modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal" role="dialog"></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
  }

  const modal = overlay.querySelector('.modal');
  modal.innerHTML = `
    <button class="modal__close" aria-label="Закрыть">&times;</button>
    <img class="modal__img" src="${product.image}" alt="${product.name}">
    <div class="modal__body">
      <div class="modal__category">${CATEGORIES[product.category]}</div>
      <h2 class="modal__title">${product.name}</h2>
      <p class="modal__desc">${product.desc}</p>
      <div class="modal__price">${formatPrice(product.price)}</div>
      <button class="btn btn--primary" data-add="${product.id}">Добавить в корзину</button>
    </div>
  `;

  modal.querySelector('.modal__close').addEventListener('click', closeModal);
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function initCatalogFilters() {
  const grid = document.querySelector('.products-grid');
  const tabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.querySelector('.search-box input');
  if (!grid) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function filterProducts() {
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach(card => {
      const cat = card.dataset.category;
      const name = card.querySelector('.product-card__name')?.textContent.toLowerCase() || '';
      const matchCat = activeCategory === 'all' || cat === activeCategory;
      const matchSearch = !searchQuery || name.includes(searchQuery);
      card.style.display = matchCat && matchSearch ? '' : 'none';
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.filter;
      filterProducts();
    });
  });

  searchInput?.addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterProducts();
  });
}

function initCartPage() {
  const container = document.querySelector('.cart-items');
  const summary = document.querySelector('.cart-summary');
  const empty = document.querySelector('.cart-empty');
  const layout = document.querySelector('.cart-layout');
  if (!container) return;

  function render() {
    const items = Cart.get();

    if (items.length === 0) {
      container.innerHTML = '';
      empty?.classList.remove('hidden');
      layout?.classList.add('hidden');
      return;
    }

    empty?.classList.add('hidden');
    layout?.classList.remove('hidden');

    container.innerHTML = items.map(item => {
      const product = getProductById(item.id);
      if (!product) return '';
      return `
        <div class="glass-card cart-item" data-cart-id="${item.id}">
          <img class="cart-item__img" src="${product.image}" alt="${product.name}">
          <div class="cart-item__info">
            <h3 class="cart-item__name">${product.name}</h3>
            <div class="cart-item__price">${formatPrice(product.price)}</div>
            <div class="qty-control">
              <button class="qty-btn" data-qty-minus="${item.id}">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-qty-plus="${item.id}">+</button>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:600;color:var(--pink-deep);margin-bottom:0.5rem">${formatPrice(product.price * item.qty)}</div>
            <button class="cart-item__remove" data-remove="${item.id}">Удалить</button>
          </div>
        </div>
      `;
    }).join('');

    updateSummary();
  }

  function updateSummary() {
    const subtotal = Cart.total();
    const delivery = subtotal >= 5000 ? 0 : 490;
    const total = subtotal + delivery;

    document.querySelector('.summary-subtotal')?.replaceChildren(document.createTextNode(formatPrice(subtotal)));
    document.querySelector('.summary-delivery')?.replaceChildren(document.createTextNode(delivery === 0 ? 'Бесплатно' : formatPrice(delivery)));
    document.querySelector('.summary-total')?.replaceChildren(document.createTextNode(formatPrice(total)));
  }

  container.addEventListener('click', e => {
    const minus = e.target.closest('[data-qty-minus]');
    const plus = e.target.closest('[data-qty-plus]');
    const remove = e.target.closest('[data-remove]');

    if (minus) {
      const id = Number(minus.dataset.qtyMinus);
      const item = Cart.get().find(i => i.id === id);
      if (item && item.qty > 1) Cart.setQty(id, item.qty - 1);
      else Cart.remove(id);
      render();
    }
    if (plus) {
      Cart.setQty(Number(plus.dataset.qtyPlus), Cart.get().find(i => i.id === Number(plus.dataset.qtyPlus)).qty + 1);
      render();
    }
    if (remove) {
      Cart.remove(Number(remove.dataset.remove));
      showToast('Товар удалён из корзины');
      render();
    }
  });

  document.querySelector('[data-apply-promo]')?.addEventListener('click', () => {
    const code = document.querySelector('.promo-input input')?.value.trim().toUpperCase();
    if (code === 'KRIS20') {
      showToast('Промокод KRIS20 применён! Скидка 20% на checkout', '🎀');
    } else if (code === 'LOVE15') {
      showToast('Промокод LOVE15 применён! Скидка 15%', '💕');
    } else {
      showToast('Промокод не найден', '❌');
    }
  });

  render();
}

function initCheckoutPage() {
  const form = document.querySelector('.checkout-form');
  const itemsContainer = document.querySelector('.checkout-items');
  if (!form) return;

  const items = Cart.get();
  if (items.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  if (itemsContainer) {
    itemsContainer.innerHTML = items.map(item => {
      const product = getProductById(item.id);
      if (!product) return '';
      return `
        <div class="checkout-item">
          <img class="checkout-item__img" src="${product.image}" alt="${product.name}">
          <div style="flex:1">
            <div>${product.name}</div>
            <div style="color:var(--text-muted);font-size:0.82rem">× ${item.qty}</div>
          </div>
          <div style="font-weight:600">${formatPrice(product.price * item.qty)}</div>
        </div>
      `;
    }).join('');
  }

  const subtotal = Cart.total();
  const delivery = subtotal >= 5000 ? 0 : 490;
  document.querySelector('.checkout-subtotal')?.replaceChildren(document.createTextNode(formatPrice(subtotal)));
  document.querySelector('.checkout-delivery')?.replaceChildren(document.createTextNode(delivery === 0 ? 'Бесплатно' : formatPrice(delivery)));
  document.querySelector('.checkout-total')?.replaceChildren(document.createTextNode(formatPrice(subtotal + delivery)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const orderNum = 'KF-' + Date.now().toString().slice(-6);
    Cart.clear();
    form.closest('.checkout-layout')?.classList.add('hidden');
    document.querySelector('.order-success')?.classList.remove('hidden');
    document.querySelector('.order-number')?.replaceChildren(document.createTextNode(orderNum));
    showToast('Заказ успешно оформлен!', '🎉');
  });
}

function initContactForm() {
  const form = document.querySelector('.contact-form form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Спасибо! Мы свяжемся с вами в течение часа', '💌');
    form.reset();
  });
}

function initMoodMatcher() {
  const moods = document.querySelectorAll('.mood-btn');
  const result = document.querySelector('.mood-result');
  if (!moods.length || !result) return;

  const moodMap = {
    romantic: { text: 'Для романтики идеально подойдут «Красная страсть» или «Романтический вечер»', ids: [4, 13] },
    happy: { text: 'Поднимут настроение «Солнечный день» и «Детская радость»!', ids: [5, 14] },
    elegant: { text: 'Элегантный выбор — «Белая классика» и «Парижское утро»', ids: [10, 2] },
    luxury: { text: 'Для особого случая — «VIP-коллекция» и «Свадебная нежность»', ids: [16, 7] }
  };

  moods.forEach(btn => {
    btn.addEventListener('click', () => {
      moods.forEach(m => m.classList.remove('active'));
      btn.classList.add('active');
      const mood = moodMap[btn.dataset.mood];
      if (!mood) return;

      result.innerHTML = `<p>${mood.text}</p><div class="mood-products"></div>`;
      const container = result.querySelector('.mood-products');
      mood.ids.forEach(id => {
        const product = getProductById(id);
        if (product) {
          container.innerHTML += `
            <a href="catalog.html" class="mood-product-link">
              <img src="${product.image}" alt="${product.name}">
              <span>${product.name}</span>
            </a>
          `;
        }
      });
      result.classList.add('visible');
    });
  });
}

function initCountdown() {
  const el = document.querySelector('.delivery-countdown');
  if (!el) return;

  function update() {
    const now = new Date();
    const deadline = new Date();
    deadline.setHours(20, 0, 0, 0);
    if (now > deadline) deadline.setDate(deadline.getDate() + 1);

    const diff = deadline - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  update();
  setInterval(update, 1000);
}

function initSubscriptionForm() {
  document.querySelector('.subscription-form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Вы подписались на цветочную подписку! 🌷', '🎀');
    e.target.reset();
  });
}

function initNewsletterForm() {
  document.querySelector('.newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Добро пожаловать в семью KrisFlowers!', '💐');
    e.target.reset();
  });
}

function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initPetals();
  initReveal();
  initProductActions();
  initCatalogFilters();
  initCartPage();
  initCheckoutPage();
  initContactForm();
  initMoodMatcher();
  initCountdown();
  initSubscriptionForm();
  initNewsletterForm();
  setActiveNav();
});
