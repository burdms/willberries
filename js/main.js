const mySwiper = new Swiper(".swiper-container", {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

const buttonCart = document.querySelector(".button-cart");
const modalCart = document.querySelector("#modal-cart");
const more = document.querySelector(".more");
const navigationLink = document.querySelectorAll(".navigation-link");
const longGoodsList = document.querySelector(".long-goods-list");
const showAccessories = document.querySelectorAll(".show-accessories");
const showClothes = document.querySelectorAll(".show-clothes");
const cartTableGoods = document.querySelector(".cart-table__goods");
const cardTableTotal = document.querySelector(".card-table__total");

const getGoods = async () => {
  const result = await fetch("db/db.json");
  if (!result.ok) {
    throw `Ошибких: ${result.status}`;
  }
  return await result.json();
};

const cart = {
  cartGoods: [
    {
      id: "099",
      name: "Dior watch",
      price: 290,
      count: 3,
    },
    {
      id: "098",
      name: "Adidas sneakers",
      price: 29,
      count: 3,
    },
  ],
  renderCart() {
    cartTableGoods.textContent = "";
    this.cartGoods.forEach(({ id, name, price, count }) => {
      const trGood = document.createElement("tr");
      trGood.className = ".cart-item";
      trGood.dataset.id = id;
      trGood.innerHTML = `
        <td>${name}</td>
        <td>${price}$</td>
        <td><button class="cart-btn-minus" data-id="${id}">-</button></td>
        <td>${count}</td>
        <td><button class="cart-btn-plus" data-id="${id}">+</button></td>
        <td>${price * count}$</td>
        <td><button class="cart-btn-delete" data-id="${id}">x</button></td>
      `;
      cartTableGoods.append(trGood);
    });

    const totalPrice = this.cartGoods.reduce((sum, item) => {
      return sum + item.price * item.count;
    }, 0);

    cardTableTotal.textContent = `${totalPrice}$`;
  },
  deleteGood(id) {
    this.cartGoods = this.cartGoods.filter((item) => id !== item.id);
    this.renderCart();
  },
  minusGood(id) {},
  plusGood(id) {},
  addCartGoods(id) {},
};

cartTableGoods.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("cart-btn-delete")) {
    cart.deleteGood(target.dataset.id);
  }
});

// Cart

const openModal = () => {
  cart.renderCart();
  modalCart.classList.add("show");
};
const closeModal = () => {
  modalCart.classList.remove("show");
};

buttonCart.addEventListener("click", openModal);

modalCart.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("overlay") || target.classList.contains("modal-close")) {
    closeModal();
  }
});

// Smooth scroll

{
  const scrollLinks = document.querySelectorAll("a.scroll-link");

  for (const scrollLink of scrollLinks) {
    scrollLink.addEventListener("click", (event) => {
      event.preventDefault();
      const id = scrollLink.getAttribute("href");
      document.querySelector(id).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }
}

// Goods

const createCard = function ({ label, img, name, description, id, price }) {
  const card = document.createElement("div");
  card.className = "col-lg-3 col-sm-6";

  card.innerHTML = `
    <div class="goods-card">
      ${label ? `<span class="label">${label}</span>` : ""}
      <img src="db/${img}" alt="image: ${name}" class="goods-image" />
      <h3 class="goods-title">${name}</h3>
      <p class="goods-description">${description}</p>
      <button class="button goods-card-btn add-to-cart" data-id="${id}">
        <span class="button-price">$${price}</span>
      </button> 
    </div>
  `;

  return card;
};

const renderCards = function (data) {
  longGoodsList.textContent = "";
  const cards = data.map(createCard);
  longGoodsList.append(...cards);
  document.body.classList.add("show-goods");
};

more.addEventListener("click", function (event) {
  event.preventDefault();
  getGoods().then(renderCards);
});

const filterCards = function (field, value) {
  getGoods()
    .then((data) => data.filter((good) => good[field] === value))
    .then(renderCards);
};

navigationLink.forEach(function (link) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const field = link.dataset.field;
    const value = link.textContent;
    if (value == "All") {
      getGoods().then(renderCards);
    } else {
      filterCards(field, value);
    }
  });
});

showAccessories.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    filterCards("category", "Accessories");
  });
});
showClothes.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    filterCards("category", "Clothing");
  });
});
