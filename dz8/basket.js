'use strict';

const basketEl = document.querySelector('.basket');
const cartIconWrapEl = document.querySelector('.cartIconWrap');


cartIconWrapEl.addEventListener('click', event => {
    basketEl.classList.toggle('hidden');
});

const buttonEls = document.querySelectorAll('.addToCart');
buttonEls.forEach(bottom => {
    bottom.addEventListener('click', event => {
        let item = event.target.closest('.featuredItem');
        myBasket.addItem(+item.dataset.id, item.dataset.name,
            1, +item.dataset.price);
    });
});

document.getElementById('cleanButton').addEventListener('click', event => {
    myBasket.cleanAll();
});


basketEl.addEventListener('click', event => {

    if (event.target.classList.contains('deleteRow')) {
        let item = event.target.closest('.basketRow');
        let curId = +item.dataset.id;
        myBasket.popItem(curId, 1);
        if (!myBasket.basket[curId]) {
            item.remove();
        }
    }
});

class BasketClass {
    constructor() {
        this.basket = {};
        this.total = 0;
        this.count = 0;
        this.basketCounterEl = document.querySelector('.cartIconWrap span');
        this.basketTotalEl = document.querySelector('.basketTotal');
        this.basketTotalValueEl = document.querySelector('.basketTotalValue');
    }
    showInfo() {
        this.basketCounterEl.textContent = this.count;
        this.basketTotalValueEl.textContent = this.total.toFixed(2);
    }
    addItem(id, name, amount = 1, price) {

        if (id in this.basket) {
            this.basket[id].amount += amount;
        } else { // первичное заполнение
            this.basket[id] = { id: id, name: name, amount, price: price };
        }
        this.total += price * amount;
        this.count += amount;
        this.renderProductInBasket(id);
        this.showInfo();

    }

    popItem(id, amount = 1) {
        this.total -= this.basket[id].price * amount;
        this.count -= amount;

        if (this.basket[id].amount <= amount) {
            delete this.basket[id];
        } else {
            this.basket[id].amount -= amount;;
            this.renderProductInBasket(id);
        }

        this.showInfo();

    }

    cleanAll() {
        document.querySelectorAll('.basketbody').forEach(row => {
            row.remove();
        });
        this.basket = {};
        this.total = 0;
        this.count = 0;
        this.showInfo();

    }

    renderProductInBasket(productId) {

        const basketRowEl = basketEl
            .querySelector(`.basketRow[data-id="${productId}"]`);
        if (!basketRowEl) {
            this.renderNewProductInBasket(productId);
            return;
        }

        const product = myBasket.basket[productId];
        basketRowEl.querySelector('.productCount').textContent = product.amount;
        basketRowEl
            .querySelector('.productTotalRow')
            .textContent = (product.price * product.amount).toFixed(2);
    }

    renderNewProductInBasket(productId) {
        const productRow = `
    <div class="basketRow basketbody" data-id="${productId}">
      <div>${this.basket[productId].name}</div>
      <div>
        <span class="productCount">${this.basket[productId].amount}</span> шт.
      </div>
      <div>$${this.basket[productId].price}</div>
      <div>
        $<span class="productTotalRow">${(this.basket[productId].price * this.basket[productId].amount).toFixed(2)}</span>
      </div>
      <button class="deleteRow">
          Удалить
      </button>
    </div>
    `;
        this.basketTotalEl.insertAdjacentHTML("beforebegin", productRow);
    }
}
const myBasket = new BasketClass();