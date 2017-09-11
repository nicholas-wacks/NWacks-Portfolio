var cryptoData = $('#cryptoData').val();
var cryptoObj = JSON.parse(cryptoData);

//Returns true if the passed in string is not a JSON error message
function verifyCryptoData(data) {
    return !(data.substring(2, 7) == 'Error') 
}

//Handles the display of the error or main view depending on data validity
function showErrorIfDataInvalid(data) {
    if (verifyCryptoData(cryptoData)) {
        $('#mainView').show();
        $('#errorView').hide();
    }
    else {
        var errorMessage = cryptoObj.Error;
        $('#errorMessage').text(errorMessage);
        $('#mainView').hide();
        $('#errorView').show();
    }
}

function getRandomColorFromSeedString(seed) {
    var num = 0;
    for (var i = 0; i < seed.length; i++) {
        num += seed.charCodeAt(i);
    }
    
    return Math.floor((Math.abs(Math.sin(parseInt(num)) * 16777215)) % 16777215).toString(16)
}

/* sample data
        "id": "bitcoin",
        "name": "Bitcoin",
        "symbol": "BTC",
        "rank": "1",
        "price_usd": "4184.51",
        "price_btc": "1.0",
        "24h_volume_usd": "1540110000.0",
        "market_cap_usd": "69290200564.0",
        "available_supply": "16558737.0",
        "total_supply": "16558737.0",
        "percent_change_1h": "-0.48",
        "percent_change_24h": "0.39",
        "percent_change_7d": "-1.7",
        "last_updated": "1505152478"
*/

//Handle D3 section
function initializeD3() {
    var d3Data = cryptoObj.slice(0, 15);

    d3Data.forEach(function (element) {
        element.color = "#" + getRandomColorFromSeedString(element.symbol);
    });

    //Setup Bar Graph
    var x = d3.scaleLinear()
        .domain([0, d3.max(d3Data.map(function (o) { return Number(o.price_usd); }))])
        .range([120, 860]);

    d3.select(".current-value-graph")
        .selectAll("div")
        .data(d3Data)
        .enter().append("div")
        .style("width", function (d) { return x(d.price_usd) + "px"; })
        .style("background-color", function (d) { return d.color })
        .text(function (d) { return d.symbol + ": $" + d.price_usd })
        .append("span")
        .html(function (d) { return d.name + "<br />Rank: " + d.rank + "<br />Current USD Value: $" + d.price_usd + "<br />Current USD Market Cap: $" + d.market_cap_usd });

    //Setup Pie Chart
    var width = 720;
    var height = 720;
    var radius = Math.min(width, height) / 2;
    var inner = radius - 180;

    var svg = d3.select('.market-cap-pie-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    var arc = d3.arc()
        .innerRadius(inner)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) { return d.market_cap_usd; })
        .sort(null);

    //TODO: Data figuring out
    var path = svg.selectAll('path')
        .data(pie(d3Data))
        .enter()
        .append('path')
        .attr('fill', function (d, i) {
            return d.data.color;
        })
        .attr('d', arc)
        .text(function (d) { return d.data.symbol + ": $" + d.data.price_usd })
        .append("span")
        .html(function (d) { return d.data.name + "<br />Rank: " + d.data.rank + "<br />Current USD Value: $" + d.data.price_usd + "<br />Current USD Market Cap: $" + d.data.market_cap_usd });;
}

//Handle Angular section

//Initialize page
showErrorIfDataInvalid(cryptoData);
if (verifyCryptoData(cryptoData)) {
    initializeD3();
}