/*
** Scrum for Trello- https://github.com/Q42/TrelloScrum
** Adds Scrum to your Trello
**
** Original:
** Jasper Kaizer <https://github.com/jkaizer>
** Marcel Duin <https://github.com/marcelduin>
**
** Contribs:
** Paul Lofte <https://github.com/paullofte>
** Nic Pottier <https://github.com/nicpottier>
** Bastiaan Terhorst <https://github.com/bastiaanterhorst>
** Morgan Craft <https://github.com/mgan59>
** Frank Geerlings <https://github.com/frankgeerlings>
** Cedric Gatay <https://github.com/CedricGatay>
** Kit Glennon <https://github.com/kitglen>
** Samuel Gaus <https://github.com/gausie>
**
*/

//default story point picker sequence


//internals
var regp = /((?:^|\s))\{([a-zA-Z0-9\s]+)(\})\s?/m; //parse regexp- accepts digits, decimals and '?', surrounded by ()

//what to do when DOM loads
$(function(){
        //watch filtering
        $('.js-toggle-label-filter, .js-select-member, .js-due-filter, .js-clear-all').live('mouseup', calcListPoints);
        $('.js-input').live('keyup', calcListPoints);

        calcListPoints();

});

document.body.addEventListener('DOMNodeInserted',function(e){
        if(e.target.id=='board') setTimeout(calcListPoints);
        else if($(e.target).hasClass('list')) calcListPoints();
});

//calculate list totals
var ltooo;
function calcListPoints(){
        clearTimeout(ltooo);
        ltooo = setTimeout(function(){
                $('.list').each(function(){
                        if(!this.list) new List(this);
                        else if(this.list.calc) this.list.calc();
                });
        });
};

//.list pseudo
function List(el){
        if(el.list)return;
        el.list=this;

        var $list=$(el),
                busy = false,
                to,
                to2;

        function readCard($c){
                if($c.target) {
                        if(!/list-card/.test($c.target.className)) return;
                        $c = $($c.target).filter('.list-card:not(.placeholder)');
                }
                $c.each(function(){
                        if(!this.listCard)
                            new ListCard(this,'points');
                        else
                            setTimeout(this.listCard['points'].refresh);
                });
        };

        this.calc = function(e){
                if(e&&e.target&&!$(e.target).hasClass('list-card')) return;
                clearTimeout(to);
                to = setTimeout(function(){
                        var score=0,
                                        attr = 'points';
                                $list.find('.list-card:not(.placeholder):visible').each(function(){
                                        if(!this.listCard) return;
                                        if(!isNaN(Number(this.listCard[attr].project)))score+=Number(this.listCard[attr].project)
                                });
                });
        };

        $list.on('DOMNodeRemoved',this.calc).on('DOMNodeInserted',readCard);

        setTimeout(function(){
                readCard($list.find('.list-card'));
                setTimeout(el.list.calc);
        });
};

//.list-card pseudo
function ListCard(el, identifier){
        if(el.listCard && el.listCard[identifier]) return;

        //lazily create object
        if (!el.listCard){
                el.listCard={};
        }
        el.listCard[identifier]=this;

        var points=-1,
                consumed=false,
                regexp=regp,
                parsed,
                that=this,
                busy=false,
                ptitle='',
                $card=$(el),
                $badge=$('<div class="badge project" />'),
                to,
                to2;

        this.refresh=function(){
                if(busy) return;
                busy = true;
                clearTimeout(to);
                to = setTimeout(function(){
                        var $title=$card.find('a.list-card-title');
                        if(!$title[0])return;
                        var title=$title[0].childNodes[1].textContent;
                        if(title) el._title = $title;
                        if(title!=ptitle) {
                                ptitle = title;
                                parsed=title.match(regexp);
                                points=parsed?parsed[2]:-1;
                        }
                        clearTimeout(to2);
                        to2 = setTimeout(function(){
                                $badge
                                        .text(that.points)
                                        .prependTo($card.find('.badges'));

                                $title[0].childNodes[1].textContent = el._title = $.trim(el._title[0].text.replace(regp,'$1'));
                                var list = $card.closest('.list');
                                if(list[0]) list[0].list.calc();
                                busy = false;
                        })
                });
        };

        this.__defineGetter__('points',function(){
                return parsed?points:''
        });

        if(!consumed) el.addEventListener('DOMNodeInserted',function(e){
                if(/card-short-id/.test(e.target.className) && !busy)
                        that.refresh();
        });

        setTimeout(that.refresh);
};