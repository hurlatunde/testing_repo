(function ($) {
    "use strict";

    // btn more
    $(document).on('click.site', '.btn-more', function (e) {
        var $dp = $(this).next('.dropdown-menu');
        if ($dp.html() == "") {
            $dp.append(
                '<button class="dropdown-item addToQueque" href="#"><i class="material-icons fa-fw text-left">sort </i> Add to Queque </button>' +
                '<button class="dropdown-item" href="#"><i class="material-icons fa-fw text-left">audiotrack </i> Go to Song </button>' +
                '<button class="dropdown-item" href="#"><i class="material-icons fa-fw text-left">account_circle </i> Go to Artist </button>' +
                '<button class="dropdown-item" href="#"><i class="material-icons fa-fw text-left">playlist_add</i> Add to Playlist</button>' +
                '<div class="dropdown-divider"></div>' +
                '<button class="dropdown-item" href="#"><i class="material-icons fa-fw text-left">share</i> Share</button>' +
                '<button class="dropdown-item" href="#"><i class="material-icons fa-fw text-left">share</i> Copy song link </button>' +
                '<button class="dropdown-item" href="#"><i class="material-icons fa-fw text-left">insert_link </i> Copy embed copy</button>'
            );
        }

        if ((e.pageY + $dp.height() + 60) > $('body').height()) {
            $dp.parent().addClass('dropup');
        }

        if (e.pageX < $dp.width()) {
            $dp.removeClass('pull-right');
        }
    });

    $(document).on('click.site', '#search-result a', function (e) {
        $(this).closest('.modal').modal('hide');
    });

    // Setup form validation only on the form having id "registration"
    // $.validate({
    //     form: '#flextreamSignup',
    //     modules: 'security',
    // });

})(jQuery);