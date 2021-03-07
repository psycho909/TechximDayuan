$(document).ready(function () {
    $('.collapseLayers').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function () {
                $BOX_PANEL.removeAttr('style');
                $('#collapseLayers').removeClass("col-md-1");
                $('#mapDiv').removeClass("col-md-11");
                $('#mapDiv').removeClass("col-sm-11");
                $('#collapseLayers').addClass("col-md-3");
                $('#collapseLayers').addClass("col-sm-3");
                $('#mapDiv').addClass("col-md-9");
                $('#mapDiv').addClass("col-sm-9");
                $('#toggleBtn').removeClass("fa-chevron-left");
                $('#toggleBtn').addClass("fa-chevron-right");
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
            $('#collapseLayers').removeClass("col-md-3");
            $('#collapseLayers').removeClass("col-sm-3");
            $('#mapDiv').removeClass("col-md-9");
            $('#mapDiv').removeClass("col-sm-9");
            $('#collapseLayers').addClass("col-md-1");
            $('#mapDiv').addClass("col-md-11");
            $('#mapDiv').addClass("col-sm-11");
            $('#toggleBtn').removeClass("fa-chevron-right");
            $('#toggleBtn').addClass("fa-chevron-left");
        }

    });
});