///<reference path="../underscore-min.js" />
///<reference path="./CryptoD3Script.js" />
///<reference path="./CryptoAngularScript.js" />
///<reference path="./CryptoUnderscoreScript.js" />

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

//Returns true if the passed in string is not a JSON error message
function verifyCryptoData(data) {
    return !(data.substring(2, 7) == 'Error')
}

//Handles the display of the error or main view depending on data validity
function showErrorIfDataInvalid(data) {
    if (verifyCryptoData(data)) {
        $('#mainView').show();
        $('#errorView').hide();
    }
    else {
        var errorObj = JSON.parse(data);
        var errorMessage = errorObj.Error;
        $('#errorMessage').text(errorMessage);
        $('#mainView').hide();
        $('#errorView').show();
    }
}

//Calls the server side API and resets the page with returned data
function callCryptoApi(countLimit = 100, cryptoId = '', d3Count = 15) {
    $.ajax({
        url: "/api/PortfolioApi/GetCryptoCurrencyData",
        data: {
            limit: countLimit,
            crypto: cryptoId
        },
        success: function (data, textStatus, jqXHR) {
            initializePage(data, d3Count);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            initializePage('{"Error": "' + errorThrown + '"}');
        }
    });
}

//Handle Ajax Buttons Section
function initializeAjaxButtons() {
    $('.retry-button').click(function () {
        callCryptoApi();
    });

    $('#limitsApiButton').click(function () {
        callCryptoApi($('#limitInput').val(), '',$('#d3ChartLimitInput').val());
    });

    $('#bitcoinButton').click(function () {
        callCryptoApi(1, 'bitcoin');
    });

    $('#ethereumButton').click(function () {
        callCryptoApi(1, 'ethereum');
    });

    $('#litecoinButton').click(function () {
        callCryptoApi(1, 'litecoin');
    });

    $('#errorButton').click(function () {
        callCryptoApi(100, 'fakeCoinShouldCauseError');
    });
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
function initializePage(cryptoData, d3Count = 15) {

    showErrorIfDataInvalid(cryptoData);
    if (verifyCryptoData(cryptoData)) {
        var cryptoObj = JSON.parse(cryptoData);
        cleanDataTypes(cryptoObj);
        initializeD3(cryptoObj, d3Count);
        initializeAngular(cryptoObj);
        initializeUnderscore(cryptoObj);
    }
}
var cryptoData = $('#cryptoData').val();
initializePage(cryptoData);
initializeAjaxButtons();