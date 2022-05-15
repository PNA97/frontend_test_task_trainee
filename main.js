async function getProducts() {
    let response = await fetch('https://dummyjson.com/products')
    let data = await response.json()

    return data.products;
}

document.addEventListener('DOMContentLoaded', async () => {
    const productsData = await getProducts();

    renderProductCards(productsData);
    setRating(productsData);
    initCardButtonEvent();
})

function renderProductCards(data) {
    const cardTemplate = `
    <div class="card">
            <img class="card__image" src="%imageSrc%" alt="image">
            <div class="rating rating_set">
                <div class="rating__body">
                    <div class="rating__active"></div>
                    <div class="rating__items">
                        <span class="rating__item"></span>
                        <span class="rating__item"></span>
                        <span class="rating__item"></span>
                        <span class="rating__item"></span>
                        <span class="rating__item"></span>
                    </div>
                </div>
                <div class="rating__amount">
                   %rating%
                </div>
            </div>
            <h4 class="card__title">
                %title%
            </h4>
            <div class="card__price-block">
                <p class="card__price">
                    %price% ₽
                </p>
                <span class="card__discount-percentage">-%discountPercentage%%</span>
            </div>
            <p class="card__price-with-discount">
                %priceWithDiscount% ₽
            </p>
            <button class="card__button">
                В корзину
            </button>
        </div>
    `;

    const result = [];

    data.forEach((product) => {
        const preparedCardTemplate = cardTemplate
            .replace('%imageSrc%', product.thumbnail)
            .replace('%title%', product.title)
            .replace('%price%', Math.ceil(product.price + product.price * product.discountPercentage / 100))
            .replace('%rating%', product.rating)
            .replace('%priceWithDiscount%', product.price)
            .replace('%discountPercentage%', Math.ceil(product.discountPercentage));


        result.push(preparedCardTemplate);
    });

    const productCardsNode = document.getElementById('product-cards');
    productCardsNode.innerHTML = result.join('');
}


function setRating(products) {
    const cardItemNodes = document.querySelectorAll('.card');

    cardItemNodes.forEach((item, index) => {
        const ratingItemNodes = item.querySelectorAll('.rating__item');
        const ceilValue = Math.ceil(products[index].rating);

        for (let index = 0; index < ceilValue; index++) {
            ratingItemNodes[index].classList.add('rating__item_active');
        }
    })
}

function initCardButtonEvent() {
    const productsBtn = document.querySelectorAll('.card__button');

    productsBtn.forEach(el => {
        el.closest('.card').setAttribute('data-id', randomId());
        el.addEventListener('click', (e) => {
            let self = e.currentTarget;
            let parent = self.closest('.card');
            let id = parent.dataset.id;
            let img = parent.querySelector('.card__image').getAttribute('src');
            let title = parent.querySelector('.card__title').textContent;
            let priceString = parent.querySelector('.card__price-with-discount').textContent;
            let priceNumber = parseInt(priceWithoutSpaces(parent.querySelector('.card__price-with-discount').textContent));

            plusFullPrice(priceNumber);
            printFullPrice();
            //add
            // cartProductsList.querySelector('.basket__list').insertAdjacentHTML('afterend', generateCartProduct(img, title, priceNumber, id));
            // printAmount();

            self.disabled = true;
        });
    });
}

//Basket
const cartProductsList = document.querySelector('.basket__list');
const cart = document.querySelector('.header__button');
const cartAmount = document.querySelector('.header__button-amount');
const fullPrice = document.querySelector('.header__button-price');
let price = 0;

const randomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const priceWithoutSpaces = (str) => {
    return str.replace(/\s/g, '');
};

const normalPrice = (str) => {
    return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

const plusFullPrice = (currentPrice) => {
    return price += currentPrice;
};

const printAmount = () => {
    let productsListLength = cartProductsList.querySelector('.basket__list').children.length;
    cartAmount.textContent = productsListLength;
    productsListLength > 0 ? cart.classList.add('active') : cart.classList.remove('active');
};

const printFullPrice = () => {
    fullPrice.textContent = `${normalPrice(price)}  ₽`;
};


const generateCartProduct = (img, title, price, id) => {
    return `
    
     <div class="product" data-id="${id}">
            <img class="product__image" src="${img}" alt="image">
            <h4 class="product__title">
                ${title}
            </h4>
            <p class="product_price">
                ${normalPrice(price)} ₽
            </p>
            <button class="product__button">
                Купить
            </button>
        </div>
        
        `;
}


