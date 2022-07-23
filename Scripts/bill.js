firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $('#downloadbtn').hide()
        var uid = user.uid
        var userRef = firebase.database().ref('users/'+uid)
        userRef.once('value')
        .then((snapshot) => {
            document.getElementById('customer_name').innerHTML = snapshot.val().Name
            document.getElementById('customer_address').innerHTML = snapshot.val().Address
            document.getElementById('customer_mobile_no').innerHTML = snapshot.val().Mobile_Number
        })
        
        var ordersRef = firebase.database().ref('users/'+uid+'/Orders')
        ordersRef.once('value')
        .then((snapshot) => {
            var orders = snapshot.val()
            var order_keys = Object.keys(orders)
            var new_order_key = order_keys[order_keys.length-1]
            document.getElementById('transaction_id').innerHTML = new_order_key
            document.getElementById('date').innerHTML = orders[new_order_key].Date
            document.getElementById('time').innerHTML = orders[new_order_key].Time

            var products = orders[new_order_key].Products
            var product_keys = Object.keys(products)
            var table = document.getElementById("bill-table")
            $('#bill-table tr').slice(1).remove()
            var total_amount = 0
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
                
                total_amount = total_amount+(quantity*cost)
            }

            document.getElementById('total_amount').innerHTML = total_amount
            $('#downloadbtn').show()
        })
        .catch((err) => {
            console.log(err)
            window.alert("Your order have been placed successsfully! Some problem occurred while generating bill!")
        })
    }
})

$(document).ready(function() {
    $('#downloadbtn').click(function() {
        window.scrollTo(0,0)
        html2canvas($("#bill"), {
            onrendered: function(bill) {
                var imgData = bill.toDataURL('image/png')
                var doc = new jsPDF('p', 'mm', [297, 210])
                doc.addImage(imgData, 'PNG', 30, 0)
                doc.save('paramstore-bill.pdf')
                window.location = 'index.html'
            }
        })
    })
})