const shimmerContainer = document.getElementsByClassName('shimmer-container')[0];
const paginationContainer = document.getElementById('pagination');
const sortPriceAsc = document.getElementById('sort-price-asc');
const sortPriceDesc = document.getElementById('sort-price-desc');
const sortVolumneAsc = document.getElementById('sort-volume-asc');
const sortVolumneDesc = document.getElementById('sort-volume-desc');
const searchBox = document.getElementById('search-box');

const options ={
    method: "GET",
    headers: {
        accept: "application/json",
        "x-cg-demo-api-key":"CG-mDVVqLm5xBDjvcVq523LnAmB",
    }
}

let coins = [];
const itemPerPage = 15;
let currentPage = 1;

// fetching the data from api
const fetchCoins = async () => {
    try{
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1', options);

        const coinsData = await response.json()
        return coinsData;
    }
    catch(err){
        console.log("Error occured while in fetching Coins");
        console.error(err);
    }
}

// favourite
const fetchFavouriteCoins = () => {
    return JSON.parse(localStorage.getItem('favourites')) || [];
};
const saveFavouriteCoins = (favourites) => {
    localStorage.setItem('favourites',JSON.stringify(favourites))
};
const removeFavouriteCoins = (favourites) => {
    localStorage.setItem('favourites',JSON.stringify(favourites))
};
// const handleFavClick = (element) => {
//     const favourites = fetchFavouriteCoins();
//     // if coin already present in fav remove it otherwise 
//     if(favourites.includes(element.dataset.id)){
//         // remove coin id
//         // element.classList.remove('favourite');
//         const newFavourites = favourites.filter((favourite)=>(
//             favourite !== element.dataset.id
//         ))
//         saveFavouriteCoins(newFavourites)
//     }else{
//         // save coin id
//         // element.classList.add('favourite');
//         favourites.push(element.dataset.id)
//         saveFavouriteCoins(favourites)
//     }
//     displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
// }
const handleFavClick = (coinId) => {
    const favourites = fetchFavouriteCoins();
    // if coin already present in fav remove it otherwise 
    if(favourites.includes(coinId)){
        // remove coin id
        // element.classList.remove('favourite');
        const newFavourites = favourites.filter((favourite)=>(
            favourite !== coinId
        ))
        saveFavouriteCoins(newFavourites)
    }else{
        // save coin id
        // element.classList.add('favourite');
        favourites.push(coinId)
        saveFavouriteCoins(favourites)
    }
    displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
};

// sorting functionality
// by price
const sortCoinsByPrice = (order) => {
    if(order === 'asc'){
        // asc
        coins.sort((a,b) => a.current_price - b.current_price)
    }else if(order === 'desc'){
        // desc
        coins.sort((a,b) => b.current_price - a.current_price)
    }
    currentPage = 1;
    displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
    renderPagination(coins)
};
sortPriceAsc.addEventListener('click',() => {
    sortCoinsByPrice('asc');
});
sortPriceDesc.addEventListener('click',() => {
    sortCoinsByPrice('desc');
});

// by Volumne
const sortCoinsByVol = (order) => {
    if(order === 'asc'){
        // asc
        console.log('coiuns',coins)
        coins.sort((a,b) => a.total_volume - b.total_volume);
    }else if(order === 'desc'){
        // desc
        coins.sort((a,b) => b.total_volume - a.total_volume);
    }
    currentPage = 1;
    displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
    renderPagination(coins)
};
sortVolumneAsc.addEventListener('click',() => {
    sortCoinsByVol('asc');
});
sortVolumneDesc.addEventListener('click',() => {
    sortCoinsByVol('desc');
});

// // by market cap
// const sortCoinsByMarket_Cap = (order) => {
//     if(order === 'asc'){
//         // asc
//         coins.sort((a,b) => a.current_price - b.current_price)
//     }else if(order === 'desc'){
//         // desc
//         coins.sort((a,b) => b.current_price - a.current_price)
//     }
//     currentPage = 1;
//     displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
//     renderPagination(coins)
// };
// sortMarket_CapAsc.addEventListener('click',() => {
//     sortCoinsByMarket_Cap('asc');
// });
// sortMarket_CapDesc.addEventListener('click',() => {
//     sortCoinsByMarket_Cap('desc');
// });

// search box
const handleSearch = (event) => {
    const searchQuery = searchBox.value.trim();
    const searchedCoins = coins.filter((coin)=>coin.name.toLowerCase().includes(searchQuery.toLowerCase()));
    currentPage = 1;
    displayCoins(getCoinsToDisplay(searchedCoins,currentPage),currentPage)
    renderPagination(searchedCoins);
}
searchBox.addEventListener('input',handleSearch);

// shimmer or loader
const showShimmer = () => {
    shimmerContainer.style.display='flex'
};
const hideShimmer = () => {
    shimmerContainer.style.display='none'
};

// show the data on the page
const getCoinsToDisplay = (coins,page) => {
    const start = (page - 1) * itemPerPage; //0 16 31
    const end = start + itemPerPage;
    return coins.slice(start,end);
};
const displayCoins = (coins,page) => {
    const favourites = fetchFavouriteCoins();

    const start = (page - 1) * itemPerPage + 1;
    const tableBody = document.getElementById('crypto-table-body')
    tableBody.innerHTML = "";
    coins.forEach((coin,index) => {
        const isfavourite = favourites.includes(coin.id) ? "favourite" : "";

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${start + index}</td>
                    <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"></td>
                    <td>${coin.name}</td>
                    <td>$${coin.current_price.toLocaleString()}</td>
                    <td>$${coin.total_volume.toLocaleString()}</td>
                    <td>$${coin.market_cap.toLocaleString()}</td>
                    <td>
                        <i class="fa-solid fa-star favourite-icon ${isfavourite}" data-id="${coin.id}"></i>
                    </td>`;
                    // <td>
                    //     <i class="fa-solid fa-star favourite-icon ${isfavourite}" data-id="${coin.id}" onclick="handleFavClick(this)"></i>
                    // </td>`;
        row.addEventListener('click',() => {
            window.open(`coin/coin.html?id=${coin.id}`,"_blank");
        })
        row
        .querySelector('.favourite-icon')
        .addEventListener('click',(event) => {
            event.stopPropagation();
            handleFavClick(coin.id);
        });
        tableBody.appendChild(row)
    })
};

// pagination
const renderPagination = (coins) => {
    const totalPage = Math.ceil(coins.length / itemPerPage)
    paginationContainer.innerHTML = "";

    for(let i = 1 ; i <= totalPage ; i++){
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;

        pageBtn.classList.add('page-btn')

        if(i === currentPage){
            pageBtn.classList.add('active');
        }

        // allow click over the btn
        pageBtn.addEventListener('click',() => {
            currentPage = i;
            updatePaginationButton();
            displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
        })
        paginationContainer.appendChild(pageBtn)
    }
};
const updatePaginationButton = () => {
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach((btn,index) => {
        if(index + 1 === currentPage){
            btn.classList.add('active')
        }else{
            btn.classList.remove('active')
        }
    })
};

// window.onload = fetchCoins();
document.addEventListener("DOMContentLoaded",async()=>{
    try{
        showShimmer();
        coins = await fetchCoins();
        displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
        renderPagination(coins)
    }catch(error){
        console.log("Error in fetch data",error)
    }    
    hideShimmer();
    
});