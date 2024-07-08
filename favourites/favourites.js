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

// fetching the data from api
const fetchFavouriteCoins = async (coinIds) => {
    try{
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(",")}`, options);

        const coinsData = await response.json()
        return coinsData;
    }
    catch(err){
        console.log("Error occured while in fetching Coins");
        console.error(err);
    }
}

// favourite
const getFavouriteCoins = () => {
    return JSON.parse(localStorage.getItem('favourites')) || [];
};

// shimmer or loader
const showShimmer = () => {
    shimmerContainer.style.display='flex'
};
const hideShimmer = () => {
    shimmerContainer.style.display='none'
};

// render coins
const displayFavouriteCoins = (favCoins) => {
    const tableBody = document.getElementById('favourites-table-body');
    tableBody.innerHTML = "";
    favCoins.forEach((coin,index) => {

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${index}</td>
                    <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"></td>
                    <td>${coin.name}</td>
                    <td>$${coin.current_price.toLocaleString()}</td>
                    <td>$${coin.total_volume.toLocaleString()}</td>
                    <td>$${coin.market_cap.toLocaleString()}</td>`;
        row.addEventListener('click',() => {
            window.open(`../coin/coin.html?id=${coin.id}`,"_blank");
        });
        
        tableBody.appendChild(row)
    })
};

// window.onload = fetchCoins();
document.addEventListener("DOMContentLoaded",async()=>{
    
    try{
        showShimmer();
        const favourite = getFavouriteCoins();
        if(favourite.length > 0){
            const favouriteCoins = await fetchFavouriteCoins(favourite);
            displayFavouriteCoins(favouriteCoins);
        }else{
            const noFavMsg = document.getElementById('no-favourite')
            noFavMsg.style.display = 'block';
        }
    }catch(error){
        console.log("Error in fetch data",error)
    }    
    hideShimmer();
    
});