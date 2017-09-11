var cryptoData = $('#cryptoData').val();

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
        var errorMessage = JSON.parse(data).Error;
        $('#errorMessage').text(errorMessage);
        $('#mainView').hide();
        $('#errorView').show();
    }
}

showErrorIfDataInvalid(cryptoData);