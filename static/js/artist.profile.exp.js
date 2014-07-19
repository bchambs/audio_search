/* JSLint */
/* jslint browser: true */
/* global $, jQuery */
// TODO: move all 'use strict' to top of files

/**
    Utility functions for loading and displaying artist resources.
*/

/**
    Iterate over profile object and inject into html.
    @param {object} data Object containing artist profile information.
*/
function display_profile(data, rtype) {
    'use strict';

    $('#spinner').hide();

    $.each(data[rtype], function (key, value) {
        switch(key) {
            case 'tiles':
                // prepare banner images: wrap, resize, append
                $.each(value, function () {

                    // create image, set class, run on load
                    var image = $('<img />', {
                        id: this[0],
                        class: 'tile-image'
                        }).attr('src', this[1]).load(function () {
                        var wrapper = $('<div />', {
                            class: 'tile-wrapper'
                        });

                        wrapper.append(image);
                        $("#image-banner").append(wrapper);
                    });
                });
                break;

            default:
                $("#" + key).html(value).hide().fadeIn(FADE_DELAY);
        }
    });
}


/**
    Iterate over songs object and inject into html.
    @param {list} data Object containing songs information.
*/
function display_songs(data, rtype) {
    'use strict';

    // append entire table so we traverse DOM once instead of len(songs) times if we append row by row
    var tb = $('<tbody />');
    $.each(data[rtype], function (rank, song) {
        var row;

        if (rank % 2 == 0) {
            row = $('<tr>', {class:"row-even"});
        }
        else {
            row = $('<tr>', {class:"row-odd"});
        }

        row.append($('<td>').text(++rank));
        row.append($('<td>').text(song['title']));
        row.append($('<td>').text(song['song_hotttnesss']));
        tb.append(row).fadeIn(FADE_DELAY);
    });
    
    $("#song-table").append(tb).fadeIn(FADE_DELAY);

    // append 'view more' link
    if (data['total_pages'] > 1) {
        var more_url = "/artist/songs?q=" + data['q'] + "&page=1",
        more_link = $('<a>', {href: more_url});
        more_link.append("view more");
        $("#songs-view-more").append(more_link).fadeIn(FADE_DELAY);
    }
}


/**
    Iterate over similar artists object and inject into html.
    @param {list} data Object containing similar artists information.
*/
function display_similar(data, rtype) {
    'use strict'
    var tb = $('<tbody />');

    $.each(data[rtype], function (index, artist) {
        if (++index > 3) {
            return false;
        }
        var row,
            td_ = $('<td>', {class:"preview-image-width"}), 
            out_div = $('<div>', {class:"preview-container"}), 
            image = $('<img>', {
                class:"preview-image",
                src: artist['preview_url']
            }), 
            in_div = $('<div>', {class:"preview-text"}), 
            span = $('<span>', {class:"preview-terms"}).text(artist['terms']);

        if (++index % 2 == 0) {
            row = $('<tr>', {class:"row-even"});
        }
        else {
            row = $('<tr>', {class:"row-odd"});
        }

        // preview image col
        in_div.append(span);
        out_div.append(image);
        out_div.append(in_div);
        td_.append(out_div);
        row.append(td_);

        // info col
        var info_table_ = $('<table />', {class:"preview-songs-table"}),
            info_tbody_ = $('<tbody>'),
            info_row1 = $('<tr />'),
            info_row2 = $('<tr />');

        info_row1.append($('<th>', {class:"preview-name-title"}).text(artist['name']));

        $.each(artist['songs'], function (nested_index, song) {
            var nested = ($('<tr>'));
            nested.append($('<td>').text(song));
            info_row2.append(nested);
        });
        info_tbody_.append(info_row1);
        info_tbody_.append(info_row2);
        info_table_.append(info_tbody_);
        var temp_td = $('<td>');
        temp_td.append(info_table_);
        row.append(temp_td);

        tb.append(row).fadeIn(FADE_DELAY);
    });
    $("#similar-table").append(tb).fadeIn(FADE_DELAY);

    // append 'view more' link
    if (data['total_pages'] > 1) {
        var more_url = "/artist/similar?q=" + data['q'] + "&page=1",
        more_link = $('<a>', {href: more_url});
        more_link.append("view more");
        $("#similar-view-more").append(more_link).fadeIn(FADE_DELAY);
    }
}




