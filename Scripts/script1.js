window.addEventListener("hashchange", function () {
    window.scrollTo(window.scrollX, window.scrollY - 60);
});

function open_cart() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            var cartRef = firebase.database().ref('users/'+uid+'/Cart')
            cartRef.once('value')
            .then((snapshot) => {
                // console.log(snapshot.val())
                var products = snapshot.val()
                var keys = Object.keys(products)
                //console.log(keys)
                var table = document.getElementById("cart-table")
                var sum = 0
                $('#cart-table tr').slice(1).remove()
                for(i=0; i<keys.length; i++) {
                    var k = keys[i]
                    var code = products[k].Product_Code
                    var color = products[k].Color
                    var quantity = products[k].Quantity
                    var price_string = products[k].Price_String
                    var cost = products[k].Cost
                    // console.log(code, color, quantity, price_string,  cost)

                    var n = table.rows.length
                    var row = table.insertRow(n)
                    var code_cell = row.insertCell(0)
                    code_cell.setAttribute('class', 'text-center')
                    var color_cell = row.insertCell(1)
                    color_cell.setAttribute('class', 'text-center')
                    var qty_cell = row.insertCell(2)
                    qty_cell.setAttribute('class', 'text-center')
                    var price_cell = row.insertCell(3)
                    price_cell.setAttribute('class', 'text-center')
                    var remove_cell = row.insertCell(4)         //Button for Removal from cart to be implemented
                    remove_cell.setAttribute('class', 'text-center')

                    code_cell.innerHTML = code
                    color_cell.innerHTML = color
                    qty_cell.innerHTML = quantity
                    price_cell.innerHTML = price_string
                    
                    remove_cell.innerHTML = "<button class='btn btn-sm btn-danger'>Remove</button>"
                    remove_cell.children[0].setAttribute("id", k)
                    remove_cell.children[0].setAttribute("onclick", "remove_from_cart(this.id)")

                    sum = sum+cost*quantity
                }
                document.getElementById('buy_cost').innerHTML = "Rs "+sum
            })
            .then(() => {
                $('.add_product_btn').attr("disabled", true)
                $('.cart').css({'visibility':'visible'})
            })
            .catch((err) => {
                $('#cart-table tr').slice(1).remove()
                document.getElementById('buy_cost').innerHTML = "Rs 0"
                $('.add_product_btn').attr("disabled", true)
                $('.cart').css({'visibility':'visible'})
            })
        }
    })
}

function addToCart(btn) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $('.add_product_btn').attr("disabled", true)
            var btnId = "#"+btn
            var code = $(btnId).closest('.card').find('.code').html()
            var price = $(btnId).closest('.card').find('.price').html()
            $('#code').html(code)
            $('#price').html(price)
            $('.addCart').css({'visibility':'visible'})        
        }
        else {
            window.location = "signin.html"
        }
    })
}

function actualAddition() {
    var code = document.getElementById('code').innerHTML
    var color = document.getElementById('color').value
    if (color.trim()==null || color.trim()==""|| color===" ") {
        window.alert('Please specify some colour or write default')
        return
    }
    var qty = document.getElementById('qty').value
    if(qty=='') {
        window.alert('Please specify some quantity')
        return
    }
    if(parseInt(qty)<=0) {
        window.alert('Least quantity you can add is 1')
        return
    }
    var price_string = document.getElementById('price').innerHTML
    var cost = parseInt(price_string.split(' ')[1].split('/')[0])

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid
            var cartRef = firebase.database().ref('users/'+uid+'/Cart')
            cartRef.push({
                "Color": color,
                "Cost": cost,
                "Price_String": price_string,
                "Product_Code": code,
                "Quantity": qty
            })
            .then(() => {
                $('.addCart').css({'visibility':'hidden'})
                $('.add_product_btn').attr("disabled", false)
            })
            .catch((err) => {
                window.alert(err)
            })
        }
    }) 
}

function cancel_add() {
    $('.addCart').css({'visibility':'hidden'})
    $('.add_product_btn').attr("disabled", false)
}

function close_cart() {
    $('.cart').css({'visibility':'hidden'})
    $('.add_product_btn').attr("disabled", false)
}

function place_order() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid
            var cartRef = firebase.database().ref('users/'+uid+'/Cart')
            var ordersRef = firebase.database().ref('users/'+uid+'/Orders')
            var d = new Date()
            var dateStr = d.toUTCString().split(' ')
            date = dateStr[0]+" "+dateStr[1]+" "+dateStr[2]+" "+dateStr[3]
            time = d.toTimeString().split(' ')[0]
            cartRef.once('value')
            .then((snapshot) => {
                var Products = snapshot.val()
                var amount = 0
                var keys = Object.keys(Products)
                for(i=0; i<keys.length; i++) {
                    var k = keys[i]
                    var qty = Products[k].Quantity
                    var cost = Products[k].Cost
                    amount = amount+qty*cost
                }
                var transaction_id = ordersRef.push({
                    Products,
                    "Date": date,
                    "Time": time,
                    "Delivered": false,
                    "Paid": false,
                    "Amount": amount
                }).getKey()
                firebase.database().ref('new_orders/').push({
                    "user_id": uid,
                    "transaction_id": transaction_id                
                })
            })
            .then(() => {
                $('.cart').css({'visibility':'hidden'})
                $('.add_product_btn').attr("disabled", false)
                var cartRef = firebase.database().ref('users/'+uid+'/Cart')
                cartRef.remove()
            })
            .then(() => {
                $('#cart-table tr').slice(1).remove()
                document.getElementById('buy_cost').innerHTML = "Rs 0"
                //Redirect to bill Page
                window.location = "bill.html"
            })
            .catch((err) => {
                console.log(err)
                window.alert("Your Cart is Empty.")
            })
        }
    })
}

function remove_from_cart(remove_id) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid
            var productRef = firebase.database().ref('users/'+uid+'/Cart/'+remove_id)
            productRef.remove()
            .then(() => {
                open_cart()
            })
        }
    })
}