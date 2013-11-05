$(function() {
    $('.js-toggle-label-filter, .js-select-member, .js-due-filter, .js-clear-all').live('mouseup', showLabels);
    $('.js-input').live('keyup', showLabels);
    showLabels();
});

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

function List(el) {
    if (el.list)
        return;
    el.list = this;
    
    var $list = $(el);
    var busy = false;
    var to;
    var to2;
    
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
    
    var regexp = /((?:^|\s))\{([a-zA-Z0-9\s]+)(\})\s?/m;
    var label = -1;
    var parsed;
    var that = this;
    var busy = false;
    var ptitle = '';
    var $card = $(el);
    var $badge = $('<div class="badge project" />');
    var to;
    var to2;

    this.refresh = function() {
        if (busy) 
            return;
        busy = true;
        
        clearTimeout(to);
        to = setTimeout(function() {
            var $title = $card.find('a.list-card-title');
            if(!$title[0])
                return;
            
            var title = $title[0].childNodes[1].textContent;
            if (title) 
                el._title = $title;
            
            if (title != ptitle) {
                ptitle = title;
                parsed = title.match(regexp);
                label = parsed ? parsed[2] : -1;
            }
            
            clearTimeout(to2);
            
            to2 = setTimeout(function() {
                $badge.text(that.label).prependTo($card.find('.badges'));
                $title[0].childNodes[1].textContent = el._title = $.trim(el._title[0].text.replace(regexp,'$1'));
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