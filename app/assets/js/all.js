
const products = document.querySelector('.productWrap');
const cartList = document.querySelector('.shoppingCart-table');
const productsCategory = document.querySelector('.productSelect');
const addCartBtn = document.querySelector('#addCardBtn');
const deleteAllCart = document.querySelector('.discardAllBtn');
const submit = document.querySelector('.orderInfo-btn');
const userName = document.querySelector('#customerName');
const phone = document.querySelector('#customerPhone');
const email = document.querySelector('#customerEmail');
const address = document.querySelector('#customerAddress');
const tradeWay = document.querySelector('#tradeWay');
let productData = [];
let cart;
let cartData;



function productInit() {
  axios.get('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/chiayu/products')
    .then(function (response) {
      productData = response.data.products;
      console.log(productData);
      renderProduct()
    });

}
function renderProduct() {
  let productDataStr = ''
  productData.forEach(function (item) {
    let str = '';

    str = ` <li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${item.images}"
          alt="">
      <a href="#" id="addCardBtn" data-id="${item.id}">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
    </li>`;
    productDataStr += str;
  })
  products.innerHTML = productDataStr;
}
function cartInit() {
  axios.get('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/chiayu/carts')
    .then(function (response) {
      cart = response.data;
      cartData = cart.carts
      console.log(cart);
      renderCart()
    });
}
function renderCart() {
  let cartDataStr = ''
  let length = cartData.length;

  if (length == 0) {
    cartList.innerHTML = '<p>購物車沒有商品，快去加入商品吧～</p>'
    return;
  }
  cartData.forEach(function (item) {
    let str = '';
    let total = item.product.price * item.quantity;
    str = `<tr><td><div class="cardItem-title"><img src="${item.product.images}" alt=""><p>${item.product.title}</p></div></td><td>NT$${item.product.price}</td><td><input class="quantity-input" data-quantityId="${item.id}" type="number" min="1" value="${item.quantity}"></td><td>NT$${total}</td><td class="discardBtn"><a href="#" class="material-icons" data-id="${item.id}">clear</a></td></tr>`;
    cartDataStr += str;
  })
  cartList.innerHTML = ` <tr>
  <th width="40%">品項</th>
  <th width="15%">單價</th>
  <th width="15%">數量</th>
  <th width="15%">金額</th>
  <th width="15%"></th>
  </tr>${cartDataStr} <tr>
  <td>
    <a href="#" class="discardAllBtn">刪除所有品項</a>
    </td>
  <td></td>
  <td></td>
  <td>
    <p>總金額</p>
  </td>
  <td>NT$${cart.finalTotal}</td>
  </tr>`

}
function addCart(obj) {
  axios.post('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/chiayu/carts', obj)
    .then(function (response) {
      cartInit()
    })
    .catch(function (error) {
      console.log(error);
    });
}
function formInit() {
  userName.value = '';
  phone.value = '';
  email.value = '';
  address.value = '';
  tradeWay.value = 'ATM';
}
productInit()
cartInit()



// 篩選功能
productsCategory.addEventListener('change', function (e) {
  let category = e.target.value;
  if (category == '全部') {
    renderProduct()
  } else {
    let productDataStr = ''
    productData.forEach(function (item) {
      if (item.category == category) {
        let str = '';

        str = ` <li class="productCard">
          <h4 class="productType">新品</h4>
          <img src="${item.images}"
              alt="">
          <a href="#" id="addCardBtn" data-id="${item.id}">加入購物車</a>
          <h3>${item.title}</h3>
          <del class="originPrice">NT$${item.origin_price}</del>
          <p class="nowPrice">NT$${item.price}</p>
        </li>`;
        productDataStr += str;
      }

    })
    products.innerHTML = productDataStr;
  }
})

//加入購物車

products.addEventListener('click', function (e) {
  e.preventDefault();
  let productID = e.target.getAttribute('data-id');
  let quantity = 1;
  if (productID == null) {
    return;
  }
  cartData.forEach(function (item) {
    let id = item.product.id;
    if (productID == id) {
      quantity = item.quantity + 1;
    }
  })
  let obj = {
    "data": {
      "productId": productID,
      "quantity": quantity
    }
  }
  addCart(obj);

})
// 更新購物車
cartList.addEventListener('change', function (e) {
  e.preventDefault();

  let quantityId = e.target.getAttribute('data-quantityid');
  let quantity = Number(document.querySelector(`[data-quantityid="${quantityId}"]`).value)
  console.log(quantityId, typeof (quantity))
  if (quantityId == null) {
    return;
  }
  axios.patch('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/chiayu/carts', {
    "data": {
      "id": quantityId,
      "quantity": quantity
    }
  })
    .then(function (response) {
      console.log(response)
      cartInit()
    });
})


// 刪除購物車
cartList.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.getAttribute('class') == 'discardAllBtn') {
    axios.delete('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/chiayu/carts')
      .then(function (response) {
        console.log(response)
        cartInit()
      });
    return
  };
  let cartID = e.target.getAttribute('data-id');
  if (cartID == null) {
    return;
  }
  axios.delete('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/chiayu/carts/' + cartID)
    .then(function (response) {
      console.log(response)
      cartInit()
    });
})
//
//送出訂單
submit.addEventListener('click', function (e) {
  e.preventDefault();
  let length = cartData.length;

  if (length == 0) {
    alert('購物車沒有任何商品，快去加入商品吧');
    return
  }
  if (userName.value == '' || phone.value == '' || email.value == '' || address.value == '') {
    alert('請填寫必填欄位喔');
    return
  }
  let obj = {
    "data": {
      "user": {
        "name": userName.value,
        "tel": phone.value,
        "email": email.value,
        "address": address.value,
        "payment": tradeWay.value
      }
    }
  }
  axios.post('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/chiayu/orders', obj)
    .then(function (response) {
      console.log(response)
      alert('訂單已送出，感謝您的訂購')
      cartInit()
      formInit()
    })
    .catch(function (error) {
      console.log(error);
    });
})
