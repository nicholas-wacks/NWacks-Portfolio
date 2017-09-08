$("#buttonTest").click(function () {
    $('html, body').animate({
        scrollTop: $("#tarjay").offset().top - 75
    }, 2000);
});