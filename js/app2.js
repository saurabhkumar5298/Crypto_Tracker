const shimmerContainer = document.getElementsByClassName('shimmer-container')[0];
const paginationContainer = document.getElementById('pagination');

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
    }
};

let coins = [];
const itemPerPage = 15;
let currentPage = 1;

// Fetching the data from API
const fetchCoins = async () => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1', options);
        const coinsData = await response.json();
        return coinsData;
    } catch (err) {
        console.log("Error occurred while fetching Coins");
        console.error(err);
    }
};

// Favourite functions
const fetchFavouriteCoins = () => {
    return JSON.parse(localStorage.getItem('favourites')) || [];
};

const saveFavouriteCoins = (favourites) => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
};

const handleFavClick = (coinId) => {
    console.log("fav");
    const favourites = fetchFavouriteCoins();
    favourites.push(coinId);
    saveFavouriteCoins(favourites);
};

// Shimmer functions
const showShimmer = () => {
    shimmerContainer.style.display = 'flex';
};

const hideShimmer = () => {
    shimmerContainer.style.display = 'none';
};

// Utility functions
const getCoinsToDisplay = (coins, page) => {
    const start = (page - 1) * itemPerPage;
    const end = start + itemPerPage;
    return coins.slice(start, end);
};

// Show the data on the page
const displayCoins = (coins, page) => {
    const start = (page - 1) * itemPerPage + 1;
    const tableBody = document.getElementById('crypto-table-body');
    tableBody.innerHTML = "";
    coins.forEach((coin, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price}</td>
            <td>$${coin.total_volume}</td>
            <td>$${coin.market_cap}</td>
            <td>
                <i class="fa-solid fa-star favourite-icon" data-id="${coin.id}"></i>
            </td>
        `;

        // Add event listener to the favourite icon
        const favIcon = row.querySelector('.favourite-icon');
        // console.log("favIcon", favIcon);
        favIcon.addEventListener('click', (event) => {
            // event.stopPropagation();
            // handleFavClick(coin.id);
            console.log('clickcc');
        });
        tableBody.appendChild(row);
    });
};

// Pagination
const renderPagination = (coins) => {
    const totalPage = Math.ceil(coins.length / itemPerPage);
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add('page-btn');

        if (i === currentPage) {
            pageBtn.classList.add('active');
        }

        // Allow click over the button
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            updatePaginationButton();
            displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
        });
        paginationContainer.appendChild(pageBtn);
    }
};

const updatePaginationButton = () => {
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach((btn, index) => {
        if (index + 1 === currentPage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

// Initialize and fetch data on DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
    try {
        showShimmer();
        coins = await fetchCoins();
        displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
        renderPagination(coins);
    } catch (error) {
        console.log("Error in fetching data", error);
    }
    hideShimmer();
});
