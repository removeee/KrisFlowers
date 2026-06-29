const PRODUCTS = [
  {
    id: 1,
    name: 'Нежность роз',
    category: 'roses',
    price: 4990,
    oldPrice: 5990,
    badge: 'Хит',
    image: 'assets/20.jpg',
    desc: '25 розовых роз премиум-класса в авторской упаковке с атласной лентой. Идеальный подарок для самых дорогих.'
  },
  {
    id: 2,
    name: 'Парижское утро',
    category: 'bouquets',
    price: 6490,
    badge: 'Новинка',
    image: 'assets/21.jpg',
    desc: 'Авторский букет из пионов, роз и эвкалипта в пастельных тонах. Создан нашим флористом вручную.'
  },
  {
    id: 3,
    name: 'Лавандовый сон',
    category: 'bouquets',
    price: 3890,
    image: 'assets/22.jpg',
    desc: 'Нежный букет из лаванды, белых хризантем и полевых цветов. Аромат Прованса у вас дома.'
  },
  {
    id: 4,
    name: 'Красная страсть',
    category: 'roses',
    price: 7290,
    badge: 'Premium',
    image: 'assets/23.jpg',
    desc: '51 красная роза Ecuador Premium 70 см. Роскошная коробка и персональная открытка в подарок.'
  },
  {
    id: 5,
    name: 'Солнечный день',
    category: 'seasonal',
    price: 3290,
    image: 'assets/24.jpg',
    desc: 'Яркий букет из подсолнухов, ромашек и зелени. Подарит летнее настроение в любое время года.'
  },
  {
    id: 6,
    name: 'Орхидея в горшке',
    category: 'plants',
    price: 4590,
    image: 'assets/25.jpg',
    desc: 'Белая фаленопсис в дизайнерском керамическом горшке. Живёт до 3 месяцев при правильном уходе.'
  },
  {
    id: 7,
    name: 'Свадебная нежность',
    category: 'wedding',
    price: 12990,
    badge: 'Wedding',
    image: 'assets/26.jpg',
    desc: 'Роскошный свадебный букет из белых роз, пионов и гортензий. Индивидуальный дизайн под ваш образ.'
  },
  {
    id: 8,
    name: 'Монобукет тюльпанов',
    category: 'seasonal',
    price: 2790,
    oldPrice: 3490,
    badge: '-20%',
    image: 'assets/27.jpg',
    desc: '25 свежих голландских тюльпанов в подарочной упаковке. Символ весны и новых начинаний.'
  },
  {
    id: 9,
    name: 'Коробка счастья',
    category: 'boxes',
    price: 5490,
    badge: 'Хит',
    image: 'assets/28.jpg',
    desc: 'Шляпная коробка с розами, макаронс и шоколадом. Тройное удовольствие в одном подарке.'
  },
  {
    id: 10,
    name: 'Белая классика',
    category: 'roses',
    price: 4190,
    image: 'assets/29.jpg',
    desc: '15 белых роз Avalanche в матовой упаковке. Элегантность и чистота в каждом лепестке.'
  },
  {
    id: 11,
    name: 'Тропический рай',
    category: 'exotic',
    price: 6890,
    badge: 'Exotic',
    image: 'assets/30.jpg',
    desc: 'Экзотическая композиция из стрелиции, анthurium и тропической зелени. Для смелых и ярких.'
  },
  {
    id: 12,
    name: 'Мини-сад',
    category: 'plants',
    price: 3590,
    image: 'assets/31.jpg',
    desc: 'Миниатюрный сад в стеклянной вазе: суккуленты, мох и декоративные камни. Живёт годами.'
  },
  {
    id: 13,
    name: 'Романтический вечер',
    category: 'bouquets',
    price: 5790,
    image: 'assets/32.jpg',
    desc: 'Букет из бордовых роз, альstroemeria и бархатной зелени. Для особых вечеров вдвоём.'
  },
  {
    id: 14,
    name: 'Детская радость',
    category: 'gift',
    price: 2490,
    badge: 'Gift',
    image: 'assets/33.jpg',
    desc: 'Яркий букет из разноцветных gerbera с игрушкой-мишкой. Идеальный подарок для маленьких принцесс.'
  },
  {
    id: 15,
    name: 'Гортензия в облаках',
    category: 'bouquets',
    price: 4690,
    image: 'assets/34.jpg',
    desc: 'Пышные голубые гортензии с белыми розами. Объёмный букет, который запомнится надолго.'
  },
  {
    id: 16,
    name: 'VIP-коллекция',
    category: 'boxes',
    price: 15990,
    badge: 'VIP',
    image: 'assets/35.jpg',
    desc: 'Эксклюзивная композиция в брендовой коробке KrisFlowers: 101 роза, шampanское, персональная открытка.'
  }
];

const CATEGORIES = {
  all: 'Все',
  roses: 'Розы',
  bouquets: 'Букеты',
  seasonal: 'Сезонные',
  wedding: 'Свадебные',
  plants: 'Растения',
  boxes: 'В коробках',
  exotic: 'Экзотика',
  gift: 'Подарки'
};

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function getPopularProducts(limit = 8) {
  return PRODUCTS.filter(p => p.badge).slice(0, limit);
}

function renderProductCard(product) {
  const badgeHtml = product.badge
    ? `<span class="product-card__badge">${product.badge}</span>`
    : '';
  const oldPriceHtml = product.oldPrice
    ? `<small style="text-decoration:line-through;color:var(--text-muted);font-size:0.9rem;margin-right:0.5rem">${formatPrice(product.oldPrice)}</small>`
    : '';

  return `
    <article class="glass-card product-card reveal" data-id="${product.id}" data-category="${product.category}">
      <div class="product-card__img-wrap">
        <img class="product-card__img" src="${product.image}" alt="${product.name}" loading="lazy">
        ${badgeHtml}
        <button class="btn btn--glass btn--sm product-card__quick" data-quick="${product.id}">Быстрый просмотр</button>
      </div>
      <div class="product-card__body">
        <div class="product-card__category">${CATEGORIES[product.category] || product.category}</div>
        <h3 class="product-card__name">${product.name}</h3>
        <div class="product-card__footer">
          <div class="product-card__price">${oldPriceHtml}${formatPrice(product.price)}</div>
          <button class="add-btn" data-add="${product.id}" aria-label="Добавить в корзину">+</button>
        </div>
      </div>
    </article>
  `;
}
