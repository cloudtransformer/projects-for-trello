$(function() {
    $('.js-toggle-label-filter, .js-select-member, .js-due-filter, .js-clear-all').live('mouseup', showLabels);
    $('.js-input').live('keyup', showLabels);
    showLabels();
});


var colorList = ["blue", "red", "green", "MediumVioletRed ", "gray", "orange"];
var defaultColor = "#801b00";
var usedColors = colorList.slice(0);


document.body.addEventListener('DOMNodeInserted', function(e) {
    if (e.target.id == 'board')
        setTimeout(showLabels);
    else if ($(e.target).hasClass('list'))
        showLabels();
});

var labelTimeout;
function showLabels() {
    clearTimeout(labelTimeout);
    labelTimeout = setTimeout(function() {
        $('.list').each(function() {
            if (!this.list)
                new List(this);
        });
    });
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


function List(el) {
    if (el.list)
        return;
    el.list = this;

    var $list = $(el);
    var busy = false;

    function readCard($c) {
        if ($c.target) {
            if (!/list-card/.test($c.target.className))
                return;
            $c = $($c.target).filter('.list-card:not(.placeholder)');
        }
        $c.each(function() {
            if (!this.listCard)
                new ListCard(this);
            else
                setTimeout(this.listCard.refresh);
        });
    };

    $list.on('DOMNodeInserted', readCard);

    setTimeout(function() {
        readCard($list.find('.list-card'));
    });
};

function ListCard(el) {
    if (el.listCard)
        return;
    el.listCard = this;

    var regexp = /\{([^{}]+)\}/;
    var label = -1;
    var parsed;
    var that = this;
    var busy = false;
    var ptitle = '';
    var $card = $(el);
    var to;
    var to2;

    this.refresh = function() {
        if (busy)
            return;
        busy = true;

        $card.find(".project").remove();

        clearTimeout(to);
        to = setTimeout(function() {
            var $title=$card.find('span.list-card-title');
            if(!$title[0])
                return;

            // var title = $title[0].innerText;
      var title = $title[0].childNodes[1].textContent;
      if (title)
                el._title = title;

      var ptitle = $title.data('parsed-title');
      if (title != ptitle){
                if(title != ptitle){
                           $title.data('orig-title', title); // store the non-mutilated title (with all of the estimates/time-spent in it).
                        }
                parsed=title.match(regexp);
                label=parsed ? parsed : -1;
            } else {
                var origTitle = $title.data('orig-title');
                el._title = origTitle;
                parsed=origTitle.match(regexp);
                label=parsed ? parsed : -1;
            }

            clearTimeout(to2);

            to2 = setTimeout(function() {
                function recursiveReplace() {
                    if (label != -1) {

                        var tmp = $('<div class="badge project""  />');

                        tmp.text(that.label[1]).appendTo($card.find('.badges'));
                        ptitle = $.trim(el._title.replace(label[0],''));
                        el._title = ptitle;
                        $title.data('parsed-title', ptitle);
                        // $title[0].innerText = ptitle;
                        $title[0].childNodes[1].textContent = ptitle;
                        parsed = ptitle.match(regexp);
                        label = parsed ? parsed : -1;



                        if (tmp!=undefined && tmp.text()!="")
                        {
                            tmp.addClass(tmp.text());
                            var _tmp = {};
                            _tmp[tmp.text()] = defaultColor;

                            chrome.storage.sync.get(_tmp,
                                function(items) {
                                // default color #801b00

                                var colorSet = items[tmp.text()];
                                if (items[tmp.text()]==defaultColor)
                                {

                                    var colorSet=usedColors.pop();

                                    if (colorSet==undefined){
                                        usedColors = shuffle(colorList.slice(0));
                                        colorSet = usedColors.pop();

                                    }
                                    var _tmp = {}
                                    _tmp[tmp.text()] = colorSet;
                                    chrome.storage.sync.set(_tmp, function() {

                                      });

                                }
 if (tmp!=undefined)
                                    tmp.attr("style", "background-color: " + colorSet+ " !important");
                              });
                        }


                        //tmp.css("background-color", colorArray[tmp.text()] );
                        if (label != -1) {
                            el._title = ptitle;
                            recursiveReplace();
                        }



                    }
                };
                recursiveReplace();

                var list = $card.closest('.list');
                busy = false;
            })
        });
    };


    this.__defineGetter__('label', function() {
        return parsed ? label : '';
    });

    el.addEventListener('DOMNodeInserted', function(e) {
        if (/card-short-id/.test(e.target.className) && !busy)
            that.refresh();
    });

    setTimeout(that.refresh);
};
