// s: shortcut for  querySelector
const s = (selector) => document.querySelector(selector);
const proxy = "https://cors-anywhere.herokuapp.com/";
const api = proxy + "https://tatimunizz.github.io/donutapi.json";

let donutID;
let cart = [];
let name;
let client = {
    name: "",
    payment: 0,
    order: []
};

fetch(api)
    .then((response) => response.json())
    .then((data) => {
        // map the donuts information (data) and mirror the values from there to the HTML donut template
        data.map((item) => {
            let donut = s(".template .donut-template").cloneNode(true);
            donut.querySelector(".d-img img").src = item.img;
            donut.querySelector(".d-price").innerHTML = `฿ ${item.price.toFixed(2)}`;
            donut.querySelector(".d-name").innerHTML = item.name;
            donut.querySelector(".d-description").innerHTML = item.description;
            donut.querySelector(".d-a-display").innerHTML = item.display;
            donut.querySelector(".d-a-more").addEventListener("click", (e) => {
                e.preventDefault();
                item.display++;
                donut.querySelector(".d-a-display").innerHTML = item.display;
                donutID = item.id;
                updateCart(item);
            });
            donut.querySelector(".d-a-less").addEventListener("click", (e) => {
                e.preventDefault();
                if (item.display > 0) {
                    item.display--;
                    donut.querySelector(".d-a-display").innerHTML = item.display;
                    donutID = item.id;
                }
                updateCart(item);
            });
            s(".donut-grid").append(donut);
        });

    });

function updateCartValues() {
    let subtotal = 0;
    let discount;
    let total = 0;
    for (let i in cart) {
        subtotal = subtotal + cart[i].price * cart[i].amount;
    }
    discount = subtotal * 0.1;
    total = subtotal - discount;
    s(".subtotal span").innerHTML = `฿ ${subtotal.toFixed(2)}`;
    s(".discount span").innerHTML = `฿ ${discount.toFixed(2)}`;
    s(".total span").innerHTML = `฿ ${total.toFixed(2)}`;

    if (total > 0) {
        s(".button").addEventListener("click", () => {
            // displays the pop-up area
            s(".pop-up").style.opacity = "0";
            s(".pop-up").style.display = "flex";
            setTimeout(() => {
                s(".pop-up").style.opacity = "1";
            });
            s(".total-pop-up span").innerHTML = `฿ ${total.toFixed(2)}`;
            client.payment = total.toFixed(2);
        });
        s("#client-input").addEventListener("input", () => {
            name = s("#client-input").value;
            client.name = name;
        });
    }
}


// store the donut id (ID), amount and price in the cart array
function updateCart(item) {
    let id = cart.findIndex((i) => i.id === item.id);
    if (id > -1) {
        cart[id].amount = item.display;
    } else {
        cart.push({
            id: item.id,
            amount: item.display,
            price: item.price
        });
    }
    // delete from the cart a donut with 0 amount
    for (let i in cart) {
        if (cart[i].amount === 0) {
            cart.splice(i, 1);
        }
    }
    updateCartValues();
}

//end section
s(".pop-up-button").addEventListener("click", (e) => {
    if (client.name.length < 1) {
        alert("Please enter your name");
    } else {
        e.preventDefault();
        s(".pop-up").style.display = "none";
        //store client's cart in client object
        for (let i in cart) {
            if (cart[i]) {
                client.order.push({
                    donutID: cart[i].id,
                    donutAmount: cart[i].amount
                });
            }
        }
        alert("Thank you for your order!");
    }
});


