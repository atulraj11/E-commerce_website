firebase.auth().onAuthStateChanged(function(user) {
    if(user.uid==="1KYUebMd5GTZRKdMVyrxGARG6iQ2") {
        show_new_orders()
    }
    else {
        document.write("<center><h1>Error: 401<br> Unauthorized Access</h1></center>")
    }
})

function show_new_orders() {
    var new_orders_Ref = firebase.database().ref('new_orders/')
    new_orders_Ref.once('value')
    .then((snapshot) => {
        var new_orders = snapshot.val()
        var new_orders_keys = Object.keys(new_orders)
        $('#new_orders_table tr').slice(1).remove()
        var table = document.getElementById('new_orders_table')
        new_orders_keys.forEach((item, i) => {
            var k = new_orders_keys[i]

            var user_id = new_orders[k].user_id
            var transaction_id = new_orders[k].transaction_id
            
            var userRef = firebase.database().ref('users/'+user_id)
            var orderRef = firebase.database().ref('users/'+user_id+'/Orders/'+transaction_id)

            var n = table.rows.length
            var row = table.insertRow(n)
            var name = row.insertCell(0)
            name.setAttribute('class', 'text-center')
            var date = row.insertCell(1)
            date.setAttribute('class', 'text-center')
            var time = row.insertCell(2)
            time.setAttribute('class', 'text-center')
            var amount = row.insertCell(3)
            amount.setAttribute('class', 'text-center')
            var view = row.insertCell(4)
            view.setAttribute('class', 'text-center')
            var delivered = row.insertCell(5)
            delivered.setAttribute('class', 'text-center')
            var paid = row.insertCell(6)
            paid.setAttribute('class', 'text-center')
            var remove = row.insertCell(7)
            remove.setAttribute('class', 'text-center')
            
            view.innerHTML = "<button class='btn btn-sm btn-success'>View</button>"
            view.children[0].setAttribute("id", user_id+" "+transaction_id)
            view.children[0].setAttribute("onclick", "view(this.id)")

            delivered.innerHTML = "<button class='btn btn-sm btn-warning'>Delivered</button>"
            delivered.children[0].setAttribute("id", user_id+" "+transaction_id)
            delivered.children[0].setAttribute("onclick", "delivered(this.id)")

            paid.innerHTML = "<button class='btn btn-sm btn-primary'>Paid</button>"
            paid.children[0].setAttribute("id", user_id+" "+transaction_id)
            paid.children[0].setAttribute("onclick", "paid(this.id)")

            remove.innerHTML = "<button class='btn btn-sm btn-danger'>Remove</button>"
            remove.children[0].setAttribute("id", user_id+" "+transaction_id)
            remove.children[0].setAttribute("onclick", "del(this.id)")

            userRef.once('value')
            .then((snapshot) => {
                name.innerHTML = snapshot.val().Name    
            })
            orderRef.once('value')
            .then((snapshot) => {
                date.innerHTML = snapshot.val().Date
                time.innerHTML = snapshot.val().Time
                amount.innerHTML = snapshot.val().Amount
            })
        })
    })
}

function view(info) {
    $('#downloadbtn').hide()
    var uid = info.split(' ')[0]
    var userRef = firebase.database().ref('users/'+uid)
    userRef.once('value')
    .then((snapshot) => {
        document.getElementById('customer_name').innerHTML = snapshot.val().Name
        document.getElementById('customer_address').innerHTML = snapshot.val().Address
        document.getElementById('customer_mobile_no').innerHTML = snapshot.val().Mobile_Number
    })
    
    var ordersRef = firebase.database().ref('users/'+uid+'/Orders/'+info.split(' ')[1])
    ordersRef.once('value')
    .then((snapshot) => {
        document.getElementById('transaction_id').innerHTML = info.split(' ')[1]
        document.getElementById('date').innerHTML = snapshot.val().Date
        document.getElementById('time').innerHTML = snapshot.val().Time

        var products = snapshot.val().Products
        var product_keys = Object.keys(products)
        var table = document.getElementById("bill-table")
        $('#bill-table tr').slice(1).remove()
        for(i=0; i<product_keys.length; i++) {
            var k = product_keys[i]
            var code = products[k].Product_Code
            var color = products[k].Color
            var quantity = products[k].Quantity
            var price_string = products[k].Price_String
            var cost = products[k].Cost

            var n = table.rows.length
            var row = table.insertRow(n)
            var sno_cell = row.insertCell(0)
            sno_cell.setAttribute('class', 'text-center')
            var code_cell = row.insertCell(1)
            code_cell.setAttribute('class', 'text-center')
            var color_cell = row.insertCell(2)
            color_cell.setAttribute('class', 'text-center')
            var qty_cell = row.insertCell(3)
            qty_cell.setAttribute('class', 'text-center')
            var price_cell = row.insertCell(4)
            price_cell.setAttribute('class', 'text-center')
            var amount_cell = row.insertCell(5)
            amount_cell.setAttribute('class', 'text-center')

            sno_cell.innerHTML = n
            code_cell.innerHTML = code
            color_cell.innerHTML = color
            qty_cell.innerHTML = quantity
            price_cell.innerHTML = price_string
            amount_cell.innerHTML = quantity*cost
        }

        document.getElementById('total_amount').innerHTML = snapshot.val().Amount
        $('#downloadbtn').show()
    })
}

function delivered(info) {
    var uid = info.split(' ')[0]
    var transaction_id = info.split(' ')[1]
    var ordersRef = firebase.database().ref('users/'+uid+'/Orders/'+transaction_id)
    ordersRef.child('Delivered').set(true)
    .then(() =>{
        window.alert("Delivery Status Updated Successfully")
    })
    .catch((err) => {
        window.alert(err)
    })
}

function paid(info) {
    var uid = info.split(' ')[0]
    var transaction_id = info.split(' ')[1]
    var ordersRef = firebase.database().ref('users/'+uid+'/Orders/'+transaction_id)
    ordersRef.child('Paid').set(true)
    .then(() =>{
        window.alert("Payment Status Updated Successfully")
    })
    .catch((err) => {
        window.alert(err)
    })
}

function del(info) {
    var transaction_id = info.split(' ')[1]
    var new_orders = firebase.database().ref('new_orders')
    var to_remove
    new_orders.once('value')
    .then((snapshot) => {
        orders = snapshot.val()
        keys = Object.keys(orders)
        for(var i=0; i<keys.length; i++) {
            var k = keys[i]
            if(orders[k].transaction_id===transaction_id) {
                to_remove = k
                break
            }
        }
    })
    .then(() => {
        new_orders.child(to_remove).remove()
    })
    .then(() => {
        show_new_orders()
        window.alert("Order removed from new orders list successfully!")
    })
    .catch((err) => {
        window.alert(err)
    })
}

$(document).ready(function() {
    $('#downloadbtn').click(function() {
        $("html, body").scrollTop($('#admin_bill').offset().top)
        html2canvas($("#admin_bill"), {
            onrendered: function(admin_bill) {
                var imgData = admin_bill.toDataURL('image/png')
                var doc = new jsPDF('p', 'mm', [297, 210])
                doc.addImage(imgData, 'PNG', 30, 0)
                doc.save('paramstore-bill.pdf')
            }
        })
    })
})