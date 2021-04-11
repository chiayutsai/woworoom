const token = 'I6cceP30vTfOjRgycyamdsXAFtY2';
const orderList = document.querySelector('.orderPage-table');
const deleteAllOrder = document.querySelector('.discardAllBtn')
let data;


function orderInit() {
    axios.get('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/chiayu/orders',
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            data = response.data.orders;
            console.log(data)
            renderOrder()
            d3Data()
        });

}
function renderOrder() {
    let orderStr = '';
    data.forEach(function (item) {
        let millisecond = Number(item.createdAt + "000");
        let date = new Date(millisecond);
        let day = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay() + 1}`
        let product = item.products
        let productName = '';
        let status;
        product.forEach(function (item) {
            let str = `<p>${item.title}</p>`
            productName += str

        })
        if (item.paid == false) {
            status = '未處理'
        } else {
            status = '已處理'
        }

        let str = ''
        str = `  <tr>
        <td>${item.id}</td>
        <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
           ${productName}
        </td>
        <td>${day}</td>
        <td class="orderStatus">
            <a href="#" data-paid="${item.paid}" data-id= "${item.id}">${status}</a>
        </td>
        <td>
            <input type="button" class="delSingleOrder-Btn" value="刪除" data-delete= "${item.id}">
        </td>
    </tr>`
        orderStr += str
    })
    orderList.innerHTML = ` <thead>
    <tr>
        <th>訂單編號</th>
        <th>聯絡人</th>
        <th>聯絡地址</th>
        <th>電子郵件</th>
        <th>訂單品項</th>
        <th>訂單日期</th>
        <th>訂單狀態</th>
        <th>操作</th>
    </tr>
</thead>${orderStr}`
}
function updateOrder(obj) {
    axios.put('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/chiayu/orders', obj, {
        headers: {
            'Authorization': token
        }
    })
        .then(function (response) {
            orderInit()
            alert('訂單狀態已修改')

        });
}
//修改訂單
orderList.addEventListener('click', function (e) {
    e.preventDefault();
    let orderPaid = e.target.getAttribute('data-paid');
    let paidID = e.target.getAttribute('data-id');

    if (orderPaid == null) {
        return;
    }
    if (orderPaid == 'true') {
        orderPaid = false;
    } else {
        orderPaid = true
    }
    console.log(orderPaid, paidID)
    let obj = {
        "data": {
            "id": paidID,
            "paid": orderPaid
        }
    }
    updateOrder(obj)



})
//刪除訂單
deleteAllOrder.addEventListener('click', function () {
    axios.delete('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/chiayu/orders', {
        headers: {
            'Authorization': token
        }
    })
        .then(function (response) {
            console.log(response)
            alert('訂單記錄已清空')
            orderInit()
        });
})
orderList.addEventListener('click', function (e) {
    e.preventDefault();
    let orderID = e.target.getAttribute('data-delete');

    if (orderID == null) {
        return;
    }
    axios.delete('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/chiayu/orders/' + orderID, {
        headers: {
            'Authorization': token
        }
    })
        .then(function (response) {
            console.log(response)
            orderInit()
        });
})
orderInit()


function d3Data() {
    let d3List = [];
    let d3 = {};
    let d3Obj = [];
    let d3Chart = [];
    let d3Final = [];
    let otherPrice = 0;
    data.forEach(function (item) {
        let product = item.products;
        product.forEach(function (item) {
            d3List.push(item);
        })

    })
    d3List.forEach(function (item) {
        if (d3[item.title] == undefined) {
            d3[item.title] = item.quantity * item.price;

        } else {
            d3[item.title] += item.quantity * item.price;
        }
    })
    let key = Object.keys(d3);
    key.forEach(function (item) {
        let obj = {};
        obj['product'] = item;
        obj['price'] = d3[item]
        d3Obj.push(obj)
    })
    d3Obj.sort(function (a, b) {
        return b['price'] - a['price'];
    });
    if (d3Obj.length > 3) {
        for (let i = 0; i < 3; i++) {
            d3Chart.push(d3Obj[i])
        }
        for (let i = 3; i < d3Obj.length; i++) {
            otherPrice += d3Obj[i].price;
        }
        d3Chart.push({
            product: '其他',
            price: otherPrice
        })
    } else {
        d3Obj.forEach(function (item) {
            d3Chart.push(item)
        })
    }
    d3Chart.forEach(function (item) {
        let arr = [];
        arr.push(item.product, item.price);
        d3Final.push(arr)
    })
    renderC3(d3Final)
}

function renderC3(data) {
    let color = ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"]
    let chartColor = {};
    data.forEach(function (item, index) {
        chartColor[item[0]] = color[index]
    })
    let chart = c3.generate({
        bindto: '#chart',
        data: {
            type: "pie",
            columns: data,
            colors: chartColor
        },
    });
}