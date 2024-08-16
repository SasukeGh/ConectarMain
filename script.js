function getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    document.getElementById('latitude').value = position.coords.latitude;
                    document.getElementById('longitude').value = position.coords.longitude;
                    document.getElementById('location-input').value = "Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude;
                }, function() {
                    alert("Unable to retrieve your location.");
                });
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }

        function addToCart(dishName, price) {
            let cartList = document.getElementById('cart-items');
            let itemExists = false;
            
            document.querySelector('.cart-sidebar').classList.add('show');

            for (let item of cartList.children) {
                if (item.dataset.dish === dishName) {
                    let quantityInput = item.querySelector('input');
                    quantityInput.value = parseInt(quantityInput.value,10) + 1;
                    itemExists = true;
                    break;
                }
            }

            if (!itemExists) {
                let cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.dataset.dish = dishName;
                cartItem.dataset.price = price;
                cartItem.innerHTML = `
                    <p>${dishName} - ${price} Cedis</p>
                    <input type="number" value="1" min="1" onchange="updateCartTotal()">
                    <button onclick="removeFromCart(this)">Remove</button>
                `;
                cartList.appendChild(cartItem);
            }

            updateCartTotal();
        }

        function updateCartTotal() {
            let cartList = document.getElementById('cart-items');
            let total = 0;
            
            for (let item of cartList.children) {
                let quantity = parseInt(item.querySelector('input').value,10);
                let price = parseInt(item.dataset.price,10);

                console.log('Item:',item.dataset.dish,'Quantity:',quantity, 'Price:',price);
                
                if (isNaN(quantity) || quantity <= 0) {
                    quantity = 1;
                    }
                
                if (isNaN(price)) {
                    price = 0;
                    }
                total += price * quantity;
            }
            
            total += 20; // Delivery fee
            document.getElementById('cart-total').innerText = 'Total: ' + total + ' Cedis';
        }

        function removeFromCart(button) {
            let item = button.parentElement;
            item.remove();
            updateCartTotal();
        }

    function closeCart() {
        document.querySelector('.cart-sidebar').classList.remove('show');
    }

        function showOrderFormModal() {
            console.log('ShowOrderFormModal called');
            let cartList = document.getElementById('cart-items');
            if (cartList.children.length === 0) {
                alert('Your cart is empty.');
                return;
            }
            populateOrderFormModal();
            document.getElementById('order-form-modal').classList.add('show');
        }

            
            // Populate the order form with the cart items 
            function populateOrderFormModal(){
                let cartList = document.getElementById('cart-items');
            let orderDetails = document.getElementById('order-details');
            orderDetails.innerHTML = ''; // Clear existing order details
                document.getElementById('order-form-modal').style.display = 'block';

            for (let item of cartList.children) {
                let dishName = item.dataset.dish;
                let quantity = item.querySelector('input').value;
                let dishElement = document.createElement('p');
                dishElement.textContent = `${dishName}: ${quantity}`;
                orderDetails.appendChild(dishElement);
            }
        }

        function showPopup(message) {
            let popup = document.getElementById('popup');
            document.getElementById('popup-message').innerText = message;
            popup.style.display = 'block';
        }

  function handleFormSubmit(event) {
    event.preventDefault(); // Prevent form submission
    
    let formData = new FormData(event.target);
    let orderItems = [];

    let cartList = document.getElementById('cart-items');
    for (let item of cartList.children) {
        let dishName = item.dataset.dish;
        let quantity = item.querySelector('input').value;
        orderItems.push(`${dishName}: ${quantity}`);
    }

    formData.append('order', orderItems.join('\n')); // Join order items with a newline

    // Log FormData for debugging
    console.log('Form data:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
      let user = formData.get('name');
    // Make sure the form is properly submitted
    fetch(event.target.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
              
  .then(function(response) { return response.json(); })
    .then(data => {
        alert("Congratulations! "+user+",your order has been submitted. We will contactyou soon.");
        // Optionally, handle success, e.g., redirect or show a confirmation message
    })
    .catch(function(error) {
                alert("Sorry! "+user+"Your order failed.Please try again later")
        console.error('Error:', error);
        // Optionally, handle error, e.g., show an error message
    });
}
