//Define an underscore template for the collapsible panel template
var panelTemplate = _.template('<div class="panel panel-primary">'
    + '<div class="panel-heading">'
    + '<h3 class="panel-title"><%= title %></h3>'
    + '<span class="pull-right clickable panel-collapsed"><i class="fa fa-chevron-down"></i></span>'
    + '</div>'
    + '<div class="panel-body" style="display:none;"><%= body %></div>'
    + '</div>');

//Create a sitewide shorthand for making a collapsible panel
$('.collapsible-panel').each(function () {
    $(this).html(panelTemplate({
        title: $(this).data('title'),
        body: $(this).html()
    }));
});

//Add a click event to expand or collapse the collapsible panel
$(document).on('click', '.panel-heading span.clickable', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    }
})