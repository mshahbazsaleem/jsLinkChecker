(function($) {
    $.fn.extend({
        linkchecker: function(options) {
            var settings = $.extend({
                masktext: 'Enter Some URL',
                speed: 200
            }, options);
            return this.each(function() {
                var rechecking = false;
                var wrapper = $(this);
                wrapper.addClass('link-checker-container');
                wrapper.append($('<div/>').addClass('link-checker-contents')
                        .append($('<div/>').addClass('link-checker-header').html('Link Checker <img id="link-checker-close" src="close.png" />'))
                        .append($('<div/>').addClass('link-checker-content')
                                            .append($('<div/>').addClass('link-checker-input-wrapper')
                                                .append($('<div/>').addClass('link-checker-input-div')
                                                                    .append($('<div/>').addClass('input')
                                                                        .append($('<input/>').attr('type', 'text').attr('id', 'txt-url').attr('value', settings.masktext)))
                                                                     .append($('<div/>').addClass('add-button-wrapper')
                                                                        .append($('<div/>').attr('id', 'link-checker-browse-button').addClass('button').html('+')))))
                                                 .append($('<div/>').addClass('link-checker-links-container')
                                                                     .append($('<div/>').addClass('link-checker-page-detail-head').html('Links detail for index.html'))
                                                                     .append($('<div/>').addClass('links-wrapper'))
                                                                     .append($('<div/>').addClass('links-total').attr('id', 'total-links'))
                                                                     .append($('<div/>').addClass('link-checker-re-check')
                                                                                        .append($('<a/>').attr('href', '#').attr('id', 're-check').html('Re-Check'))))))
                        .append($('<div/>').html('Verify Links').addClass('link-checker-button'));
                $('#txt-url').focus(function() { if ($(this).val() == settings.masktext) $(this).val(''); });
                $('#txt-url').blur(function() { if ($(this).val() == '') $(this).val(settings.masktext); });
                var lcheight = $('.link-checker-contents').height();
                $('.link-checker-contents').css('height', '0px');
                $('.link-checker-button').click(function() { $('.link-checker-contents').animate({ height: lcheight }, settings.speed); validateLinks(); });
                $('#link-checker-close').click(function() { $('.link-checker-contents').animate({ height: 0 }, settings.speed); });
                $('#re-check').click(function() { validateLinks(); });
                //              
                function validateLinks() {
                    var pageurl = '';
                    $('.links-wrapper').find('div').remove();
                    $('#total-links').html('');
                    var url = $('#txt-url').val();
                    var links;
                    if (url == settings.masktext) {
                        links = $('a , img');
                        processLinks(links, window.location.href);
                    }
                    else {
                        $.ajax({
                            url: url,
                            type: 'GET',
                            async: false,
                            success: function(html) {
                                html = html.replace(/<script/g, 'script1');
                                var d = $('<div/>').html(html);
                                links = $(d.get(0)).find('a');
                                $(d.get(0)).find('img').each(function(index, link) {
                                    links.push(link);
                                });
                                processLinks(links, url);
                            }
                        });
                    }

                }
                function processLinks(links, pageurl) {
                    var pageurlpaths = pageurl.split('/');
                    var linkName = pageurlpaths[pageurlpaths.length - 1];
                    $('.link-checker-page-detail-head').html('Links detail for ' + linkName + '');
                    $('#total-links').html('Total (' + links.length + ')');
                    $.each(links, function(index, link) {
                        var url;
                        var text;
                        link = $(link);
                        var islink = link.attr('href');
                        if (islink != null || islink != undefined) {//this is
                            text = link.html();
                            url = link.attr('href');
                            if (text == '')
                                text = link.attr('title');
                            if (text == '')
                                text = url;
                        }
                        else {
                            text = link.attr('alt');
                            url = link.attr('src');
                            if (text == '')
                                text = url;
                        }

                        $('.links-wrapper').append($('<div/>').addClass('link-item').append($('<div/>').addClass('link-container').append($('<a/>').attr('href', url).attr('target', '_blank').html(text)))
                                                                                     .append($('<div/>').addClass('link-status-container').append($('<img/>').attr('src', 'checking.gif').addClass('status'))
                                                                                                                                          .append($('<a/>').attr('href', url).css('display', 'none').attr('target', '_blank').append($('<img/>').attr('src', 'anchor.jpg').css('border', 'none').css({ width: 14, height: 14 })))));
                        checkLink(url, index);

                    });
                }
                function checkLink(url, index) {
                    try {
                        if (url == "#") {
                            $('.link-item:eq(' + index + ') .status').attr('src', 'ok.png').css({ width: 12, height: 11 });
                            $('.link-item:eq(' + index + ') a').css('display', '');
                            return;
                        }
                        $.ajax({
                            url: url,
                            type: 'GET',
                            async: true,
                            success: function() {
                                $('.link-item:eq(' + index + ') .status').attr('src', 'ok.png').css({ width: 12, height: 11 });
                                $('.link-item:eq(' + index + ') a').css('display', '');
                            },
                            error: function(msg) {
                                $('.link-item:eq(' + index + ') .status').attr('src', 'broken.png').css({ width: 10, height: 11 });
                            }
                        });
                    } catch (e) { }
                }
                function animateAndClose(el, lcheight) {
                    if (el.height() == 0) {
                        el.animate({ height: lcheight }, settings.speed);
                    }
                    else {
                        el.animate({ height: 0 }, settings.speed);
                    }
                }
            });
        }
    });
})(jQuery);