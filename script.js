let dessertsList = [];
let cartItems = [];
let totalQuantity = 0;  
let totalPrice;

const bodyElement = document.querySelector('body');

function renderBasicHTML(){
          bodyElement.innerHTML = 
          `
            <div class="container">
              <div class=wrapper> 
                <h1 class="title">Desserts</h1>
                <ul class="desserts-list"></ul>
              </div>
              <div class="cart"></div>
            </div>
            <div id="overlay"></div>
          `  
}
renderBasicHTML();

const containerElement = document.querySelector('.container');
const wrapperElement = document.querySelector('.wrapper');
const titleElement = document.querySelector('.title');
const dessertsListElement = document.querySelector('.desserts-list');  
const cartElement = document.querySelector('.cart'); 
const overlayElement = document.getElementById('overlay');


const renderDataToHTML = () => {
        dessertsListElement.innerHTML = '';
        let id = 0;
        dessertsList.forEach(dessert =>{
          let newDessert = document.createElement('li');
              newDessert.classList.add('dessert-card');
              newDessert.dataset.id = id++;
              newDessert.innerHTML = 
              `
                <div class="img-container">
                  <picture>
                    <source media="(max-width: 570px)"srcSet="${dessert.image.mobile}">
                    <source media="(min-width: 571px)"srcSet="${dessert.image.desktop}">
                    <img src="${dessert.image.mobile}" 
                    srcSet="${dessert.image.mobile}, ${dessert.image.desktop}" alt=""/>
                  </picture>
                  <button class="addToCart-button">
                    <img src="assets/images/icon-add-to-cart.svg" alt="icon-add-to-cart.svg">
                    Add to Cart
                  </button>
                  <button class="selected-button">
                    <span class="minus">
                      <img class="img-minus" src="assets/images/icon-decrement-quantity.svg" alt="icon-decrement">
                    </span>
                    <span class="quantity"></span>
                    <span class="plus">
                      <img class="img-plus" src="assets/images/icon-increment-quantity.svg" alt="icon-increment">
                    </span>
                  </button>
                </div>
                <div class="dessert-info">
                  <p class="kind">${dessert.category}</p>
                  <p class="name">${dessert.name}</p>
                  <p class="price">$${parseFloat(dessert.price).toFixed(2)}</p>
                </div>
            ` 
            cartItems.forEach(item =>{
              if(dessert.name === item.name && item.isSelected){
                newDessert.children[0].classList.add('dessert-selected');
                newDessert.children[0].children[2].children[1].innerText = `${item.quantity}`;
                }  
            })
            dessertsListElement.appendChild(newDessert);
        }); 
              cartElement.innerHTML = 
        `
        <h2 class="cart-headline">Your Cart (${totalQuantity})</h2>
        <img class="cart-img" src="/assets/images/illustration-empty-cart.svg" 
                                                    alt="illustration-empty-cart.svg">
        <p class="cart-message">Your added items will appear here</p>
        `
} 

function initApp(){
          fetch('data.json')
          .then(response => response.json())
          .then(data => {
                dessertsList = data;
                console.log(dessertsList);
                if(localStorage.getItem('shoppingCart')){
                  cartItems = JSON.parse(localStorage.getItem('shoppingCart'));
                  updateTotalQuantity();
                  calculateTotalPrice();
                  renderDataToHTML();
                  updateShoppingCartDataHTML();
               } 
               else{
                   renderDataToHTML();
               }
          })
}

initApp();

function setItemQuantityProperty(dessert){
          dessert.quantity=0;
          dessert.isSelected=true;
}

function updateItemQuantity(dessert, symbol){
          switch(symbol){
                case'+':
                dessert.quantity++;
                break;
                case'-':
                dessert.quantity--;
                break;
          }
}

function getItemQuantity(name){
          let quantity;
          cartItems.forEach(dessert=>{
            if(dessert.name === name){ 
              console.log(dessert.quantity);
              quantity = dessert.quantity;
              return quantity;
            }
          })
          return quantity;
}

function updateTotalQuantity(){
          totalQuantity = 0;
          cartItems.forEach(dessert =>{
          totalQuantity+=dessert.quantity;
        })
}

function getTotalQuantity(){
          return totalQuantity; 
}

function calculateTotalPrice(){
          let totalPrice = 0;
          cartItems.forEach(item =>{
                  totalPrice = totalPrice + (item.price*item.quantity);
          })
          setTotalPrice(totalPrice);
}

function setTotalPrice(totalprice){
          totalPrice = totalprice;
}

function getTotalPrice(){
          return totalPrice;
}

function calculateItemTotal(quantity, price){
          let itemTotalPrice = (quantity*price).toFixed(2);
          return itemTotalPrice;
}

function retrieveAltText(text){
          let altText = text.substring(text.lastIndexOf('/')+1);
          console.log(altText);
          return altText;
}

function updateShoppingCartDataHTML(){
          cartElement.innerHTML = '';
          cartElement.innerHTML = 
          `
          <h2 class="cart-headline">Your Cart (${getTotalQuantity()})</h2>
          `
          let id= 0;
              cartItems.forEach(cartItem =>{
          let itemTotal = calculateItemTotal(cartItem.quantity, cartItem.price)
          let newCartDessert = document.createElement('div');
              newCartDessert.classList.add('item');
              newCartDessert.dataset.id = id++;
              newCartDessert.innerHTML = 
              `
                <div class="item-details">
                  <div class="name">${cartItem.name}</div>
                  <div class="dessert-cart-info">
                    <span class="quantity">${cartItem.quantity}x</span>
                    <span class="price">@$${cartItem.price.toFixed(2)}</span>
                    <span class="price-summary">$${itemTotal}</span>
                  </div>
                </div> 
                <button class="remove-button">
                  <img class="cross" src="assets/images/icon-remove-item.svg" 
                  alt="icon-remove-item.svg">
                </button>
              `
              cartElement.appendChild(newCartDessert);
              });
          let orderTotalElement = document.createElement('div');
              orderTotalElement.classList.add('order-total');
              orderTotalElement.innerHTML = 
              `
                <div class="order-details">
                  <span class="text">Order Total</span>
                  <span class="total-price">$${getTotalPrice().toFixed(2)}</span>
                </div>
                <div class="eco-message">
                  <img src="assets/images/icon-carbon-neutral.svg" 
                       alt="icon-carbon-neutral.svg">
                  <p>This is a <span>carbon-neutral</span> delivery</p>
                </div> 
                <button class="confirm-button">Confirm Order</button>
              `
              cartElement.appendChild(orderTotalElement);
}

function addItemtoMemory(){
          localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
}

function addItemToShoppingCart(dessert){
          cartItems.push(dessert);
}

function removeItemfromShoppingCart(dessertName){
          let index = cartItems.findIndex(item => item.name === dessertName);
              cartItems.splice(index,1); 
           if (cartItems.length < 1){
              localStorage.clear();
              renderDataToHTML();
              }
         else {
              addItemtoMemory();
              calculateTotalPrice();
              updateShoppingCartDataHTML();
             }
}

function updateShoppingCartData(name, symbol){
          if(cartItems.length < 1){
              dessertsList.forEach(dessert=>{
                if(dessert.name === name){
                  let selectedDessert = Object.assign({}, dessert);
                  setItemQuantityProperty(selectedDessert);
                  updateItemQuantity(selectedDessert, symbol);
                  addItemToShoppingCart(selectedDessert);
                }
              })
          }
          else if(cartItems.some((item) => item.name === name)){
                  let index = cartItems.map(item => item.name).indexOf(name);
                  let selectedDessert = cartItems[index];
                  updateItemQuantity(selectedDessert, symbol);
          }
          else {
                dessertsList.forEach(dessert=>{
                  if(dessert.name === name){
                    let selectedDessert = Object.assign({}, dessert);
                        setItemQuantityProperty(selectedDessert);
                        updateItemQuantity(selectedDessert, symbol);
                        addItemToShoppingCart(selectedDessert);
                  }
                })
          }
          updateTotalQuantity();
          calculateTotalPrice();
          addItemtoMemory();
}

function addDessertSelectedClass(clickedTarget){
          clickedTarget.parentElement.classList.add('dessert-selected');
}

function removeDessertSelectedClassHTML(clickedTarget){
          let itemClass = clickedTarget.getAttribute('class');
          if(itemClass === 'minus'){
            clickedTarget.parentElement.parentElement.classList.remove('dessert-selected');
          }
          if(itemClass === 'img-minus'){
            clickedTarget.parentElement.parentElement.parentElement.classList.remove('dessert-selected');
          }
}

function restoreDefaultButtonHTML(dessertName){
          let index = dessertsList.findIndex(dessert=> dessert.name === dessertName);
          dessertsListElement.children[index].firstElementChild.classList.remove('dessert-selected'); 
}

function updateItemQuantityHTML(clickedTarget, itemName){
          let itemClass = clickedTarget.getAttribute('class');
          if(itemClass === 'addToCart-button'){
            clickedTarget.nextElementSibling.children[1].innerText=`${getItemQuantity(itemName)}`;
          }
          if(itemClass === 'minus'){
            clickedTarget.nextElementSibling.innerText=`${getItemQuantity(itemName)}`;
          }
          if(itemClass === 'img-minus'){
            clickedTarget.parentElement.nextElementSibling.innerText=`${getItemQuantity(itemName)}`;
          }
          if(itemClass === 'plus'){
            clickedTarget.previousElementSibling.innerText=`${getItemQuantity(itemName)}`;
          }
          if(itemClass === 'img-plus'){
            clickedTarget.parentElement.previousElementSibling.innerText=`${getItemQuantity(itemName)}`;
          }
}

function orderConfirmedHTML(screen_size){
          let screenSize = screen_size;
              console.log(screenSize);
            if(screenSize < 570){
                containerElement.classList.add('order-confirmed-mobile');
            }
  
          let orderConfirmedElement = document.createElement('div');
              orderConfirmedElement.classList.add('order-confirmed-card');
              orderConfirmedElement.innerHTML =
              `
                <img class="icon-confirmed" src="assets/images/icon-order-confirmed.svg" 
                    alt="icon-order-confirmed.svg">
                <h1>Order Confirmed</h1>
                <p>We hope you enjoy your food!</p>
              ` 
          let confirmedItems = document.createElement('ul');
              confirmedItems.classList.add('confirmed-items');
              confirmedItems.innerHTML = '';
              cartItems.forEach(item => {
              let itemTotal = calculateItemTotal(item.quantity, item.price);
              let itemImg_alt = retrieveAltText(item.image['thumbnail']);
              let newItem = document.createElement('li');
                  newItem.classList.add('confirmed-item-card');
                  newItem.innerHTML = 
                  `
                    <div class="item-wrapper">
                      <img src="${item.image["thumbnail"]}" alt="${itemImg_alt}">
                      <div class="confirmed-item-info">
                        <div class="confirmed-item-name">${item.name}</div>
                        <div class="quantity-price-div">
                          <span class="confirmed-item-quantity"> ${item.quantity}x</span>
                          <span class="confirmed-item-price">@$${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div class="confirmed-item-price-summary">$${itemTotal}</div>
                  `
                  confirmedItems.appendChild(newItem);
              })
          let orderTotal = document.createElement('div');
              orderTotal.classList.add('order-confirmed-total-price');
              orderTotal.innerHTML = 
              `
                <span class="text">Order Total</span>
                <span class="total-price">$${getTotalPrice().toFixed(2)}</span>
              `
          let startNewOrderButton = document.createElement('button');
              startNewOrderButton.classList.add('start-new-order-button');
              startNewOrderButton.innerText =
              ` Start New Order
              `
              orderConfirmedElement.appendChild(confirmedItems);
              orderConfirmedElement.appendChild(orderTotal);
              orderConfirmedElement.appendChild(startNewOrderButton);
              if (screenSize < 570){
                  dessertsListElement.style.display = 'none';
                  cartElement.style.display = 'none';
                }
              if (screenSize >= 570){
                    containerElement.classList.remove('order-confirmed-mobile');
                    dessertsListElement.style.display = 'grid';
                    cartElement.style.display = 'block';
                }
              bodyElement.appendChild(orderConfirmedElement);
              overlayElement.style.display = 'block';
}


function updateItemDataOnClickEvent(clickedTarget) {
          let itemClass = clickedTarget.getAttribute('class');
          const plus = "+";
          const minus = "-";
        
          if(itemClass === 'addToCart-button'){
              let itemName = clickedTarget.parentElement.
                            nextElementSibling.children[1].innerText;
                  addDessertSelectedClass(clickedTarget);
                  updateShoppingCartData(itemName, plus);
                  updateItemQuantityHTML(clickedTarget, itemName);
                  updateShoppingCartDataHTML();
          }

          if(itemClass === 'minus'){
              let itemName = clickedTarget.parentElement.parentElement.
                              nextElementSibling.children[1].innerText;
                  updateShoppingCartData(itemName, minus);
              if (getItemQuantity(itemName) < 1){
                  removeDessertSelectedClassHTML(clickedTarget);
                  removeItemfromShoppingCart(itemName);
                  updateShoppingCartDataHTML();
                  }
              if (cartItems.length < 1){
                  renderDataToHTML();
                  }
            else{
                  updateItemQuantityHTML(clickedTarget, itemName);
                  updateShoppingCartDataHTML();
            }
          } 
          
          if(itemClass === 'img-minus'){
              let itemName = clickedTarget.parentElement.parentElement.
                            parentElement.nextElementSibling.children[1].innerText;
                  updateShoppingCartData(itemName, minus);
              if (getItemQuantity(itemName) < 1){
                  removeDessertSelectedClassHTML(clickedTarget);
                  removeItemfromShoppingCart(itemName);
                  updateShoppingCartDataHTML();
              }
              if(cartItems.length < 1){
                  renderDataToHTML();
              }
              else{
                  updateItemQuantityHTML(clickedTarget, itemName);
                  updateShoppingCartDataHTML();
              }
          }

          if (itemClass === 'plus'){
              let itemName = clickedTarget.parentElement.parentElement.nextElementSibling.children[1].innerText;
                  updateShoppingCartData(itemName, plus);
                  updateItemQuantityHTML(clickedTarget, itemName);
                  updateShoppingCartDataHTML();
          }

          if (itemClass === 'img-plus'){
               let itemName = clickedTarget.parentElement.parentElement.
                             parentElement.nextElementSibling.children[1].innerText;
                   updateShoppingCartData(itemName, plus);
                   updateItemQuantityHTML(clickedTarget, itemName);
                   updateShoppingCartDataHTML();
          }
          
          if (itemClass === 'remove-button'){
              let itemName = clickedTarget.previousElementSibling.children[0].innerText;
              totalQuantity = totalQuantity - getItemQuantity(itemName);
              removeItemfromShoppingCart(itemName);
              restoreDefaultButtonHTML(itemName);
          }

          if (itemClass === 'cross'){
              let itemName = clickedTarget.parentElement.previousElementSibling.children[0].innerText;
              totalQuantity = totalQuantity - getItemQuantity(itemName);  
              removeItemfromShoppingCart(itemName);
              restoreDefaultButtonHTML(itemName);
          }

          if (itemClass === 'confirm-button'){
              let screenSize = window.innerWidth;
                  orderConfirmedHTML(screenSize);
          }
          
          if (itemClass === 'start-new-order-button'){
               localStorage.clear();
               window.location.reload(); 
          }
}

bodyElement.addEventListener('click', (e)=>{
    let positionClicked = e.target;
        updateItemDataOnClickEvent(positionClicked);
    } 
)











