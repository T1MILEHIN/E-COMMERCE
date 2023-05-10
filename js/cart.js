'use strict'

const header = document.querySelector(".header");
const search = document.querySelector(".fa-magnifying-glass");
const searchBar = document.querySelector(".search")
const exitSearch = document.querySelector(".search>i")

//<-------------------------- STICKY HEADER ------------------>//
const fixed = header.offsetTop;

window.addEventListener("scroll", function() {
    if (window.pageYOffset > fixed) {
        header.classList.add("sticky")
    }
    else if (window.pageYOffset == 0) {
        header.classList.remove("sticky");
    }
    else {
        header.classList.remove("sticky")
    }
});

search.addEventListener("click", ()=>{
    if (!searchBar.classList.contains("active")) {
        searchBar.classList.add("active")
        search.classList.add("active")
    }else {
        searchBar.classList.remove("active")
        search.classList.remove("active")
    }
    exitSearch.addEventListener("click", ()=>{
        searchBar.classList.remove("active")
        search.classList.remove("active")
    })
})

// <------------- HAMBURGER MENU ---------------------------------> //

const menuContainer = document.querySelector(".menu")
const menu = document.querySelector(".menu>i"); 

menuContainer.addEventListener("click", ()=>{
    if (!header.classList.contains("active")) {
        menuContainer.innerHTML = `<i class="fa-solid fa-xmark"></i>`
        header.classList.add("active")
    }
    else {
        menuContainer.innerHTML = `<i class="fa-solid fa-bars"></i>`
        header.classList.remove("active")
    }
})
let allCartItems = JSON.parse(localStorage.getItem("cart-data")) || [];
let cartTotal = document.querySelector(".cart-total")
const displayContent = document.querySelector(".display-content")



function comma(x) {
    return x.toLocaleString();
}

//<---------------- DISPLAY CART ----------------->//

const CART = async function() {
    const fetchedData = await fetch('https://dummyjson.com/products?limit=0&skip=0');
    const DATA = await fetchedData.json()
    let productArr = DATA.products;

    
    function totalAmount () {
        if (allCartItems.length !== 0) {
            let amount = allCartItems.map((x) => {
                let {id, item, instock} = x
                let search = productArr.find((y) => y.id === id) || [];
                return item * ((search.price - search.discountPercentage/100 * search.price))
            }).reduce((acc, cur)=> acc + cur)
            localStorage.setItem("cart-data", JSON.stringify(allCartItems));
            cartTotal.innerHTML = `$${comma((amount))}`
            
        }else return;
    }
    
    totalAmount()
   
    if (allCartItems.length !== 0) {
        displayContent.innerHTML = allCartItems.map((x) => {
            let {id, item, instock} = x;

            let search = productArr.find((y)=> y.id === id) || []
            return`
            <div class="item">
                <div>
                    <div>
                        <img src=${search.images[0]} alt="">
                    </div>
                    <div>
                        <p>${search.description}</p>
                    </div>
                    <div class="price">
                        <div>
                            <P class="discount-price">$${(search.price -(search.discountPercentage/100 * search.price)).toFixed(2)}</P>
                            <P class="main-price">$${((search.price).toFixed(2))} </P>
                        </div>
                        <h4>Total: <span class="total">$${(item * (search.price -(search.discountPercentage/100 * search.price))).toFixed(2)}</span></h4>
                        <h4>In Stock: <span class=>${instock}</span></h4>
                    </div>
                </div>
                
                <div class="action">
                    <div onclick="removeItem(${id})">
                        <i class="fa-solid fa-trash">REMOVE</i>
                    </div>
                    <div class="product-count">
                        <i class="fa-solid fa-minus" onclick="decrease(${id})"></i>
                        <span class="num-count" id=${id}>${item}</span>
                        <i class="fa-solid fa-plus" onclick="increase(${id})"></i>
                    </div>
                </div>
            </div>
            `
        }).join('');
    }
    else {
        displayContent.innerHTML = `
        <div class="empty">
            <h2>Cart is Empty</h2>
            <a href="index.html">
                <button>Back to Home</button>
            </a>
        </div>
        `
    }
}
CART();

function increase (id) {
    let selectedItem = id;
    let search = allCartItems.find((x) => x.id === selectedItem)

    if (search === undefined) {
        allCartItems.push({
            id: selectedItem,
            item: 1,
            instock: 1
        })
    }
    else if (search.instock > 0) {
        search.item += 1
        search.instock -= 1
    }
    else return;
    update(selectedItem);
    localStorage.setItem("cart-data", JSON.stringify(allCartItems))
}

function decrease (id) {
    let selectedItem = id;
    let search = allCartItems.find((x) => x.id === selectedItem);

    if (search === undefined) return;
    else if (search.item === 0) return;
    else {
        search.item -= 1;
        search.instock += 1
    }
    update(selectedItem);
    allCartItems = allCartItems.filter((x)=> x.item !== 0)
    localStorage.setItem("cart-data", JSON.stringify(allCartItems))
}

function update(id) {
    let search = allCartItems.find((x)=> x.id === id)
    document.getElementById(id).innerHTML = search.item
    shopTotal();
    CART();
}

function clearCart() {
    allCartItems = [];
    CART();
    shopTotal();
    let amount = allCartItems.map((x) => {
        let {id, item} = x
        let search = productArr.find((y) => y.id === id) || [];

        return item * ((search.price - search.discountPercentage/100 * search.price)).toFixed(2)
    }).reduce((acc, cur)=> acc + cur, 0)
    cartTotal.innerHTML = `$${(amount).toFixed(2)}`
    localStorage.setItem("cart-data", JSON.stringify(allCartItems));
}

function shopTotal() {
    let cartNum = document.querySelector(".cart-num");
    cartNum.innerHTML = allCartItems.map((x)=> x.item).reduce((acc, cur)=> acc + cur, 0);
}
shopTotal()

function removeItem(id) {
    let selectedItem = id
    allCartItems = allCartItems.filter((x) => x.id !== selectedItem)
    CART();
    shopTotal();
    localStorage.setItem("cart-data", JSON.stringify(allCartItems))
}


