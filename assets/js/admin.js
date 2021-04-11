"use strict";

var token = 'I6cceP30vTfOjRgycyamdsXAFtY2';
var orderList = document.querySelector('.orderPage-table');
var deleteAllOrder = document.querySelector('.discardAllBtn');
var data;

function orderInit() {
  axios.get('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/chiayu/orders', {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    data = response.data.orders;
    console.log(data);
    renderOrder();
    d3Data();
  });
}

function renderOrder() {
  var orderStr = '';
  data.forEach(function (item) {
    var millisecond = Number(item.createdAt + "000");
    var date = new Date(millisecond);
    var day = "".concat(date.getFullYear(), "/").concat(date.getMonth() + 1, "/").concat(date.getDay() + 1);
    var product = item.products;
    var productName = '';
    var status;
    product.forEach(function (item) {
      var str = "<p>".concat(item.title, "</p>");
      productName += str;
    });

    if (item.paid == false) {
      status = '未處理';
    } else {
      status = '已處理';
    }

    var str = '';
    str = "  <tr>\n        <td>".concat(item.id, "</td>\n        <td>\n            <p>").concat(item.user.name, "</p>\n            <p>").concat(item.user.tel, "</p>\n        </td>\n        <td>").concat(item.user.address, "</td>\n        <td>").concat(item.user.email, "</td>\n        <td>\n           ").concat(productName, "\n        </td>\n        <td>").concat(day, "</td>\n        <td class=\"orderStatus\">\n            <a href=\"#\" data-paid=\"").concat(item.paid, "\" data-id= \"").concat(item.id, "\">").concat(status, "</a>\n        </td>\n        <td>\n            <input type=\"button\" class=\"delSingleOrder-Btn\" value=\"\u522A\u9664\" data-delete= \"").concat(item.id, "\">\n        </td>\n    </tr>");
    orderStr += str;
  });
  orderList.innerHTML = " <thead>\n    <tr>\n        <th>\u8A02\u55AE\u7DE8\u865F</th>\n        <th>\u806F\u7D61\u4EBA</th>\n        <th>\u806F\u7D61\u5730\u5740</th>\n        <th>\u96FB\u5B50\u90F5\u4EF6</th>\n        <th>\u8A02\u55AE\u54C1\u9805</th>\n        <th>\u8A02\u55AE\u65E5\u671F</th>\n        <th>\u8A02\u55AE\u72C0\u614B</th>\n        <th>\u64CD\u4F5C</th>\n    </tr>\n</thead>".concat(orderStr);
}

function updateOrder(obj) {
  axios.put('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/chiayu/orders', obj, {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    orderInit();
    alert('訂單狀態已修改');
  });
} //修改訂單


orderList.addEventListener('click', function (e) {
  e.preventDefault();
  var orderPaid = e.target.getAttribute('data-paid');
  var paidID = e.target.getAttribute('data-id');

  if (orderPaid == null) {
    return;
  }

  if (orderPaid == 'true') {
    orderPaid = false;
  } else {
    orderPaid = true;
  }

  console.log(orderPaid, paidID);
  var obj = {
    "data": {
      "id": paidID,
      "paid": orderPaid
    }
  };
  updateOrder(obj);
}); //刪除訂單

deleteAllOrder.addEventListener('click', function () {
  axios["delete"]('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/chiayu/orders', {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    console.log(response);
    alert('訂單記錄已清空');
    orderInit();
  });
});
orderList.addEventListener('click', function (e) {
  e.preventDefault();
  var orderID = e.target.getAttribute('data-delete');

  if (orderID == null) {
    return;
  }

  axios["delete"]('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/chiayu/orders/' + orderID, {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    console.log(response);
    orderInit();
  });
});
orderInit();

function d3Data() {
  var d3List = [];
  var d3 = {};
  var d3Obj = [];
  var d3Chart = [];
  var d3Final = [];
  var otherPrice = 0;
  data.forEach(function (item) {
    var product = item.products;
    product.forEach(function (item) {
      d3List.push(item);
    });
  });
  d3List.forEach(function (item) {
    if (d3[item.title] == undefined) {
      d3[item.title] = item.quantity * item.price;
    } else {
      d3[item.title] += item.quantity * item.price;
    }
  });
  var key = Object.keys(d3);
  key.forEach(function (item) {
    var obj = {};
    obj['product'] = item;
    obj['price'] = d3[item];
    d3Obj.push(obj);
  });
  d3Obj.sort(function (a, b) {
    return b['price'] - a['price'];
  });

  if (d3Obj.length > 3) {
    for (var i = 0; i < 3; i++) {
      d3Chart.push(d3Obj[i]);
    }

    for (var _i = 3; _i < d3Obj.length; _i++) {
      otherPrice += d3Obj[_i].price;
    }

    d3Chart.push({
      product: '其他',
      price: otherPrice
    });
  } else {
    d3Obj.forEach(function (item) {
      d3Chart.push(item);
    });
  }

  d3Chart.forEach(function (item) {
    var arr = [];
    arr.push(item.product, item.price);
    d3Final.push(arr);
  });
  renderC3(d3Final);
}

function renderC3(data) {
  var color = ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"];
  var chartColor = {};
  data.forEach(function (item, index) {
    chartColor[item[0]] = color[index];
  });
  var chart = c3.generate({
    bindto: '#chart',
    data: {
      type: "pie",
      columns: data,
      colors: chartColor
    }
  });
}
//# sourceMappingURL=admin.js.map
