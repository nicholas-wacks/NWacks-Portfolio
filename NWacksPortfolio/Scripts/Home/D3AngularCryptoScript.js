///<reference path="../underscore-min.js" />

/* Sample API data for reference
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

//Generates a pseudo random hexcode color from a seed string, which will return the same result
//  for a given string every time it's passed in. Used to create unique colors for each currency
function getRandomColorFromSeedString(seed) {
    //Convert seed string to number based on ascii code values
    var num = 0;
    for (var i = 0; i < seed.length; i++) {
        num += seed.charCodeAt(i);
    }

    //Generates a "random" number from the seed string's number by taking the sin of it, then normalizes 
    //  that random number to a valid hexcode color and returns it as a hexadecimal string
    return Math.floor((Math.abs(Math.sin(parseInt(num)) * 16777215)) % 16777215).toString(16)
}

//Handle D3 graphs
function initializeD3(cryptoObj) {
    //Initialize the D3 data as a subset of the master data
    var d3Data = cryptoObj.slice(0, 15);

    d3Data.forEach(function (element) {
        element.color = "#" + getRandomColorFromSeedString(element.symbol);
    });

    //Setup Bar Graph
    var x = d3.scaleLinear()
        .domain([0, d3.max(d3Data.map(function (o) { return Number(o.price_usd); }))])
        .range([160, 860]);

    //Creates the bars of the chart as colored divs, and then creates a tooltip for each bar to be shown on hover
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
    var width = 920;
    var height = 640;
    var radius = Math.min(width, height) / 2;
    var inner = radius * 0.55;

    //Create the svg shell
    var svg = d3.select('.market-cap-pie-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height + 50)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + ((height + 50) / 2) + ')');

    //Define the standard and hover-over donut arc sizes
    var arc = d3.arc()
        .innerRadius(inner)
        .outerRadius(radius);

    var hoverArc = d3.arc()
        .innerRadius(inner * 0.95)
        .outerRadius(radius * 1.05);

    //Set market cap to be the relevant value for pie slice sizes
    var pie = d3.pie()
        .value(function (d) { return d.market_cap_usd; })
        .sort(null);

    //Create the slices and set colors
    var path = svg.selectAll('path')
        .data(pie(d3Data))
        .enter()
        .append('path')
        .attr('fill', function (d, i) {
            return d.data.color;
        })
        .attr('d', arc);

    var tooltip = d3.select('.market-cap-pie-chart')
        .append('div')
        .attr('class', 'pie-tooltip');

    tooltip.append('div')
        .attr('class', 'tooltip-label');

    //When hovering over a slice, show the tooltip with the relevant data for that slice, and slightly enlarge the slice
    path.on('mouseover', function (d) {
        var total = d3.sum(d3Data.map(function (d) {
            return d.market_cap_usd;
        }));

        var percent = Math.round(1000 * d.data.market_cap_usd / total) / 10;
        tooltip.select('.tooltip-label').html(d.data.name + "<br />$" + d.data.market_cap_usd + "<br />" + percent + '%');
        tooltip.style('display', 'block');

        //Enlarges the slice over .275s
        d3.select(this).transition()
            .duration(275)
            .attr("d", hoverArc);
    });

    //When not hovering over a slice, hide the tooltip and shrink the slice to the original size
    path.on('mouseout', function (d) {
        tooltip.style('display', 'none');

        d3.select(this).transition()
            .duration(275)
            .attr("d", arc);
    });

    //Make the tooltip follow the mouse while hovering over a slice
    path.on('mousemove', function (d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
            .style('left', (d3.event.layerX + 10) + 'px');
    });

    //Define the resizing function attribute
    path.append('text')
        .attr('transform', function (d) {
            var c = arc.centroid(d);
            return "translate(" + c[0] + "," + c[1] + ")";
        });
}

//Handle Angular table
function initializeAngular(cryptoObj) {
    //Define the module
    var cryptoApp = angular.module('cryptoApp', []);

    //Define the controller on the module
    cryptoApp.controller('CryptoController', function CryptoController($scope) {
        $scope.currencies = cryptoObj;
        $scope.page = 1;
        $scope.recordsPerPage = 10;
        $scope.sortValue = 'rank';

        //Allows the ceil method to be used for determining max pages
        $scope.ceiling = function (value) {
            return Math.ceil(value);
        }

        $scope.setSortValue = function (value) {
            if ($scope.sortValue == value)
                $scope.sortValue = '-' + value;
            else
                $scope.sortValue = value;
        }
    });
}

//Handle Underscore cards
function initializeUnderscore(cryptoObj) {
    //TODO: include real data
    var cardTemplate = _.template('<div class="underscore-card">'
        + '<div class="card-head">'
        + '<h4>Title</h4>'
        + '</div > '
        + 'Body'
        + '</div > ');

    var innerContent = '';

    _.each(cryptoObj, function (value, index, list) {
        innerContent += cardTemplate();
    });

    $('#underscoreContainer').html(innerContent);
}

//Convert sorting fields to numbers
//  Avoids situations where '10' is sorted before '9'
function cleanDataTypes(dataList) {
    _.each(dataList, function (value, index, list) {
        value.rank = parseInt(value.rank);
        value.price_usd = parseFloat(value.price_usd);
        value.market_cap_usd = parseFloat(value.market_cap_usd);
    });
}

//Initialize page
showErrorIfDataInvalid(cryptoData);
if (verifyCryptoData(cryptoData)) {
    cleanDataTypes(cryptoObj);
    initializeD3(cryptoObj);
    initializeAngular(cryptoObj);
    initializeUnderscore(cryptoObj);
}

//