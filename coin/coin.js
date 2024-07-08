const coinContainer = document.getElementById('coin-container');
const shimmerContainer = document.querySelector('.shimmer-container');

const coinImage = document.getElementById('coin-image');
const coinName = document.getElementById('coin-name');
const coinDescription = document.getElementById('coin-description');
const coinRank = document.getElementById('coin-rank');
const coinPrice = document.getElementById('coin-price');
const coinMarketCap = document.getElementById('coin-market-cap');

const btnContainer = document.querySelectorAll('.button-container button');

// fetch
const options ={
    method: "GET",
    headers: {
        accept: "application/json",
        "x-cg-demo-api-key":"CG-mDVVqLm5xBDjvcVq523LnAmB",
    }
}

const urlParam = new URLSearchParams(window.location.search);
const coinId = urlParam.get('id');
// console.log(urlParam,coinId);

const fetchCoinData = async() => {
    try{
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
        const coinData = await response.json();
        displayCoinData(coinData);
    }catch(error){
        console.log("Error occured while in fetching Coins");
        console.error(err);
    }
}

const displayCoinData = (coinData) => {
    coinImage.src = coinData.image.large;
    coinImage.alt = coinData.name;
    coinDescription.textContent = coinData.description.en.split('.')[0];
    coinRank.textContent = coinData.market_cap_rank;
    coinPrice.textContent = `$${coinData.market_data.current_price.usd.toLocaleString()}`;
    coinMarketCap.textContent = `$${coinData.market_data.market_cap.usd.toLocaleString()}`;
    coinName.textContent = coinData.name;

}

// fetch the chart display all functionality 
const ctx = document.getElementById('myChart');

const coinChart = new Chart(ctx, {
type: 'line',
data: {
    labels: [],    //x-axis
    datasets: [{
    label: 'Price (usd)',
    data: [],   //y-axis
    borderWidth: 1,
    borderColor: '#eebc1d',
    fill:false,
    }]
},
});

// update chart data
const updateChart = (prices) => {
    // prices -> [[timestamp, price], [timestamp, price]]
    // y-axis -> data-> price x-axis-> labels->timestmap
    const data = prices.map(price=>price[1]);
    const labels = prices.map(price=>{
        let date = new Date(price[0])
        return date.toLocaleString()
    });
    coinChart.data.labels=labels;
    coinChart.data.datasets[0].data=data;
    coinChart.update();
}
// fetch chart data from api
const fetchChartData = async (days) => {
    try{
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,options);
        const chartData = await response.json();
        console.log("chartData",chartData)
        updateChart(chartData.prices);
    }catch(error){
        console.error("Error while fetching chart data",error);
    }
};
// to display the chart data
// on btn click fetch chart data and display it
btnContainer.forEach((button)=>{
    button.addEventListener('click',(event)=>{
        const days = event.target.id === "24h" ? 1 : event.target.id === "30d" ? 30 : 90;
        fetchChartData(days);
    })
})


// window.onload = fetchCoins();
document.addEventListener("DOMContentLoaded",async()=>{
    await fetchCoinData();
    // set the 24hrs as default
    document.getElementById("24h").click();
    
});