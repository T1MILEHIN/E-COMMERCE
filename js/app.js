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

//<--------------------------- FETCHED DATA ---------------------------------->//
const FETCH = async function() {
    const fetchedData = await fetch('https://dummyjson.com/products?limit=0&skip=0')
    const DATA = await fetchedData.json();
    let productArr = DATA.products;
    // console.log(productArr);
    let allCartItems = JSON.parse(localStorage.getItem("cart-data")) || [];
    allCartItems = allCartItems.filter((x)=> x.item !== 0);
    let cartNum = document.querySelector(".cart-num");

    cartNum.textContent = allCartItems.map((x)=> x.item).reduce((acc, cur)=> acc + cur, 0);
    productArr.forEach((items, index, arr) => {

        let {id, title, price, images, thumbnail, description, discountPercentage, stock} = items;

        const productEL = document.createElement('div')
        productEL.innerHTML = `
            <div class="EACH-${id}">
                <span>${discountPercentage}% off</span>
                <img src=${images[0]} alt="">
                <h4>${title}</h4>
                <div class="price">
                    <P class="discount-price">$${(price -(discountPercentage/100 * price)).toFixed(2)}</P>
                    <P class="main-price">$${price.toFixed(2)}</P>
                </div>
                <div class="actions">
                    <div>
                        <i class="fa-sharp fa-solid fa-bag-shopping"></i>
                        <p>ADD TO BAG</p>
                    </div>
                    <div>
                        <i class="fa-regular fa-heart"></i>
                        <p>WISHLIST</p>
                    </div>
                    <div>
                        <i class="fa-sharp fa-solid fa-rotate"></i>
                        <p>COMPARE</p>
                    </div>
                    <div>
                        <i class="fa-solid fa-up-down-left-right"></i>
                        <p>VIEW MORE</p>
                    </div>
                </div>
            </div>
        `

        const wishlist = document.querySelectorAll(".fa-heart")

        wishlist.forEach((item, index, arr)=> {
            item.addEventListener("click", (e)=> {
                e.stopPropagation();
            })
        })
        
        
        const Electronics = document.querySelector(".electronics")
        const Perfume = document.querySelector(".beauty")
        const women = document.querySelector(".women")
        const Men = document.querySelector(".men")
        const watches = document.querySelector(".wrist-watch")
        const Food = document.querySelector(".food")
        const Decoration = document.querySelector(".ornament")

        if (index < 8) {
            Electronics.appendChild(productEL)
        }
        if (index > 9 && index < 18) {
            Perfume.appendChild(productEL)
        }
        if (index > 39 && index < 48) {
            women.appendChild(productEL)
        }
        if (index > 49 && index < 58) {
            Men.appendChild(productEL)
        }
        if (index > 59 && index < 68) {
            watches.appendChild(productEL)
        }
        if (index > 20 && index < 25) {
            Food.appendChild(productEL)
        }
        if (index > 25 && index < 34) {
            Decoration.appendChild(productEL)
        }
        
        const body = document.querySelector(".body")
        const productDisplay = document.querySelector(".product-display")
        
        productEL.addEventListener("click", DISPLAY_ALL)
        function DISPLAY_ALL (e) {
            e.stopPropagation();
            let productValue = 0;
            let search = allCartItems.find((x)=> x.id === id) || [];
            const clickedProduct = `
            <div class="more-about" id=${id}>
                <div>
                    <img src=${thumbnail}  alt="" >  
                </div>
                <div>
                    <h2>${title}</h2>
                    <h4></h4>
                    <h4>In stock: <span class="in-stock">${search.instock === undefined ? stock : search.instock}</span></h4>
                    <div class="price">
                        <P class="discount-price">$${(price -(discountPercentage/100 * price)).toFixed(2)}</P>
                        <P class="main-price">$${price.toFixed(2)} </P>
                    </div>
                    <div class="product-count">
                        <i class="fa-solid fa-minus"></i>
                        <span class="num-count">0</span>
                        <i class="fa-solid fa-plus"></i>
                    </div>
                    <h1>Total price: <span class="total"></span></h1>
                    <div class="card">
                        <button class="add-to-cart">ADD TO CART  <i class="fa-solid fa-cart-shopping"></i></button>  
                    </div>
                </div>
                <i class="fa-solid fa-xmark"></i>
            </div>`

            productDisplay.insertAdjacentHTML("beforeend", clickedProduct);
            body.classList.add("change");

            function totalPrice() {
                let search = productArr.find(x=> x.id === id)
                let total = (search.price -(search.discountPercentage/100 * search.price)) * productValue
                document.querySelector(".total").innerHTML = `$${(total).toLocaleString()}`
            }
            totalPrice();

            let cartValue = 0;
            const addToCardBtn = document.querySelector(".add-to-cart");
            const numEl = document.querySelector(".num-count");
            const minus = document.querySelector(".fa-minus");
            const plusEl = document.querySelector(".product-count>i:last-child");
            let inStock = document.querySelector(".in-stock");
            plusEl.addEventListener("click", increase, true);
            function increase(e) {
                e.stopPropagation();
                let search = allCartItems.find((x)=> x.id === id) || [];
                if (productValue < 10 && inStock.textContent > 0) {
                    productValue++;
                    cartValue++;
                    stock--;
                    // search.instock--;
                    inStock.textContent = inStock.textContent - 1;
                    numEl.innerHTML = productValue;
                }
                else {
                    numEl.classList.toggle("active");
                }
                totalPrice()
                localStorage.setItem("cart-data", JSON.stringify(allCartItems))
            }  
            minus.addEventListener("click", (e) => {
                e.stopPropagation();
                let search = allCartItems.find((x)=> x.id === id) || [];
                
                if (productValue === 0) {
                    numEl.classList.toggle("active");
                }
                else {
                    productValue--;
                    cartValue--;
                    stock++;
                    inStock.textContent = stock
                    numEl.textContent = productValue;
                }
                totalPrice();
                localStorage.setItem("cart-data", JSON.stringify(allCartItems))
            });
            const exit = document.querySelector(".more-about>i");
            exit.addEventListener("click", (e) => {
                e.stopPropagation();
                productDisplay.innerHTML = '';
                body.classList.remove("change");
                inStock.textContent = inStock
            });
            function addToCartBTN(e) {
                e.stopPropagation();
                let search = allCartItems.find((x)=> x.id === id)
                if (search === undefined) {
                    allCartItems.push({
                        id: id,
                        item: productValue,
                        instock: +inStock.textContent
                    })
                }
                else {
                    search.item += productValue
                    search.instock -= productValue;
                }
                let searchStorage = allCartItems.find((x)=> x.id === id) || [];

                numEl.textContent = productValue = 0;
                totalPrice()
                
                cartNum.textContent = searchStorage.item === undefined ? 0 : allCartItems.map((x)=> x.item).reduce((acc, cur)=> acc + cur, 0);
                localStorage.setItem("cart-data", JSON.stringify(allCartItems))
                productDisplay.innerHTML = '';
                body.classList.remove("change");
                
            }
            addToCardBtn.addEventListener("click", addToCartBTN);
        }

        const hotDeals = document.querySelector(".deals");
        const dealContent = document.createElement("div")
        if (index > 84 && index < 94) {
            dealContent.innerHTML  = `
            <div class="HOT_DEALS">
                <img src=${images[0]} alt="">
                <div>
                    <p>${title}</p>
                    <div>
                        <p>$${price}</p>
                        <p>$${(price -(discountPercentage/100 * price)).toFixed(2)}</p>
                    </div>
                </div>
            </div>
            `
            hotDeals.appendChild(dealContent)
        }
        dealContent.addEventListener("click", DISPLAY_ALL)
       
    })

    
    

}
FETCH();


//<----------------------------------- SLIDE --------------------------------------------->//

const nextBtn = document.querySelector("#gadgets>div i:nth-child(3)");
const prevBtn = document.querySelector("#gadgets>div i:nth-child(4)");
const sliderContainer = document.querySelector(".gadgets");
const slide = (document.querySelectorAll(".gadgets>div"));
const categoryDisplay = document.querySelector(".category")

let curSlide = 0;
const maxSlide = slide.length - 1;
const slideWidth = slide[0].clientWidth;

sliderContainer.style.transition = `all 500ms ease-in-out`;
sliderContainer.style.transform = `translateX(${-(slideWidth * curSlide)}px)`;
function category(cur) {
    switch (cur) {
        case 0:
            categoryDisplay.textContent = 'PHONES & LAPTOPS';
            break;
        case 1:
            categoryDisplay.textContent = 'BEAUTY PRODUCTS';
            break;
        case 2:
            categoryDisplay.textContent = 'WOMEN WEAR';
            break;
        case 3:
            categoryDisplay.textContent = 'MEN WEAR';
            break;
        case 4:
            categoryDisplay.textContent = 'WRIST WATCH';
            break;
        case 5:
            categoryDisplay.textContent = 'FOOD PRODUCTS';
            break;
        case 6:
            categoryDisplay.textContent = 'DECORATION/ORNAMENT';
            break;
        default:
            break;
    }
}

if (window.innerWidth > 601) {
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.style.display = 'none'
    function nextSlide() {
        if (curSlide === maxSlide) {
            nextBtn.style.display = 'none'
        }
        else {
            curSlide++
            category(curSlide);
            if (curSlide > 0) {
                prevBtn.style.display = 'block'
            }
        }
        sliderContainer.style.transform = `translateX(${-(slideWidth * curSlide)}px)`;
    }

    prevBtn.addEventListener("click", function () {
        if (curSlide === 0) {
            prevBtn.style.display = 'none'
        }
        else {
            curSlide--
            category(curSlide);
            if (curSlide < maxSlide) {
                nextBtn.style.display = 'block'
        }
    }
    sliderContainer.style.transform = `translateX(${-(slideWidth * curSlide)}px)`;
});
}

if (window.innerWidth < 600) {
    sliderContainer.style.overflow = "scroll";
    prevBtn.style.display = 'none'
    nextBtn.style.display = 'none'
    let isDown = false;
    let startX;
    let scrollLeft;
    
    sliderContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        sliderContainer.classList.add("active");
        startX = e.pageX - sliderContainer.offsetLeft;
        scrollLeft = sliderContainer.scrollLeft;
    })
    sliderContainer.addEventListener("mouseleave", ()=> {
        isDown = false;
        sliderContainer.classList.remove("active");
    })
    sliderContainer.addEventListener("mouseup", ()=>{
        isDown = false;
        sliderContainer.classList.remove("active");
    });
    sliderContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - sliderContainer.offsetLeft;
        const walk = (x - startX) * 3;
        sliderContainer.scrollLeft = scrollLeft - walk;
        let curr = Math.trunc(sliderContainer.scrollLeft / 350);
        console.log(curr);
        category(curr);
    })
    
    // <------------ SUBMENU ------------------> //
    const li = document.querySelectorAll(".main-menu>li");

    li.forEach((item, index) => {
        const sub = item.querySelector(".submenu")
        item.addEventListener("click", (e)=>{
            e.preventDefault();
            item.classList.toggle("active") 

            if (item.classList.contains("active")) {
                sub.style.height = `${sub.scrollHeight}px`;
            }
            else {
                sub.style.height = "0px";
            }
            removeOpen(index);
        }
    )});
}


//<----------------- COUNTDOWN ---------------->//

function countDown() {
    const dayEl = document.querySelector(".day")
    const hourEl = document.querySelector(".hour")
    const minEl = document.querySelector(".min")
    const secEl = document.querySelector(".sec")

    const futureDate = new Date('10 july 2023')
    const presentDate = new Date()

    const diff = futureDate - presentDate;

    const seconds = (diff/1000);

    let day = Math.trunc(seconds / 3600 / 24);
    let hour = Math.trunc((seconds / 3600) % 24);
    let min = Math.trunc((seconds / 60) % 60);
    let sec = Math.trunc(seconds % 60);

    dayEl.textContent = day;
    hourEl.textContent = formatDate(hour);
    minEl.textContent = formatDate(min);
    secEl.textContent = formatDate(sec)
}
function formatDate(date) {
    return date < 10 ? `0${date}` : date;
}

setInterval(countDown , 1000)
countDown()

//<------------------------- CAROUSEL SLIDE 2 ------------------------------>//

const sliderContainer2 = document.querySelector(".bend-down-select");
const slide2 = Array.from(document.querySelectorAll(".bend-down-select>div"));
const next = document.querySelector(".exclusive>div i:last-child")
const prev = document.querySelector(".exclusive>div i:first-child");

let curSlide2 = 1;
const max = slide2.length - 1;
const width = slide2[0].clientWidth;

sliderContainer2.style.transition = `all 500ms ease-in-out`;
sliderContainer2.style.transform = `translateX(-${curSlide2 * width}px)`;

next.addEventListener("click", NEXT);

function NEXT () {
    if (curSlide2 >= max) {return};
    curSlide2++;
    sliderContainer2.style.transition = `all 500ms ease-in-out`;
    sliderContainer2.style.transform = `translateX(-${width * curSlide2}px)`;
}


prev.addEventListener("click", ()=>{
    if (curSlide2 <= 0) {return};
    sliderContainer2.style.transition = `all 500ms ease-in-out`;
    curSlide2--;
    sliderContainer2.style.transform = `translateX(-${width * curSlide2}px) `;
});

sliderContainer2.addEventListener("transitionend", ()=>{
    if (slide2[curSlide2].id === "lastclone") {
        sliderContainer2.style.transition = "none";
        curSlide2 = slide2.length - 2;
        sliderContainer2.style.transform = `translateX(${-(width * curSlide2)}px)`;
    }
    if (slide2[curSlide2].id === "firstclone") {
        sliderContainer2.style.transition = "none";
        curSlide2 = slide2.length - curSlide2;
        sliderContainer2.style.transform = `translateX(${-(width * curSlide2)}px)`;
    }
});

const autoSlide = function() {
    setInterval(timer, 3000);
    function timer() {
    NEXT();
   }
}
autoSlide();




