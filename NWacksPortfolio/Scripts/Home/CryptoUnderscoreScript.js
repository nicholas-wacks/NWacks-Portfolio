///<reference path="../underscore-min.js" />

//Handle Underscore cards
function initializeUnderscore(cryptoObj) {
    var cardTemplate = _.template('<div class="col-md-4 col-sm-6 col-xs-12">'
        + '<div class="underscore-card panel panel-info">'
        + '<div class="panel-heading">'
        + '<h4><%= title %></h4>'
        + '</div >'
        + '<div class="panel-body">'
        + '<b>Current Rank:</b> <%= rank %><br />'
        + '<b>Current Value:</b> $<%= value %><br />'
        + '<b>Current Market Cap:</b> $<%= marketCap %><br />'
        + '</div >'
        + '</div >'
        + '</div >');

    var innerContent = '';

    _.each(cryptoObj, function (value, index, list) {
        innerContent += cardTemplate({
            title: value.symbol + ' - ' + value.name,
            rank: value.rank,
            value: value.price_usd,
            marketCap: value.market_cap_usd
        });
    });

    $('#underscoreContainer').html(innerContent);
}