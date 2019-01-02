'use strict';
var superagent = require('superagent');
var cheerio = require('cheerio');

module.exports = function(router){
    // 获取赛季数据
    router.route('/getcards').get((req, res, next) => {
        console.log('req.query:', req.query);
        var resultJSON = {};
        var staticUri = [];
        superagent.get('https://statsroyale.com/zh/cards')
        .end(function (err, sres) {
            if (err) {
                return next(err);
            }
            var $ = cheerio.load(sres.text);
            var items = {};
            var curSession = '';
            var dirname=['army', 'building', 'spell']
            items.groupLength = $('.cards__group').length
            items.groupData = []
            $('.cards__group').each(function (idx, element) {
                var $element = $(element);
                var cardData = {}
                cardData.cards = []
                cardData.index = idx
                cardData.groupName = $element.find('.ui__headerSmall').text()
                cardData.cardLenght = $element.find('.cards__card').length
                $element.find('.cards__card').each(function(sidx, selement) {
                    var $util = $(selement)
                    cardData.cards.push({
                        cost: $util.attr('data-elixir'),
                        rarity: $util.attr('data-rarity'),
                        priority: $util.attr('data-priority'),
                        imgsrc: $util.find('img').attr('src'),
                        href: $util.find('a').attr('href'),
                        name: $util.find('.ui__tooltip').text().replace(/\n/g,''),
                        staticsrc: $util.find('img').attr('src').replace('//cdn.statsroyale.com/images/cards/full/', 'static/img/' + dirname[idx] + '/')
                    })
                    staticUri.push($util.find('img').attr('src').replace('//cdn.statsroyale.com/images/cards/full/', 'static/img/' + dirname[idx] + '/'))
                })
                items.groupData.push(cardData)
            });
            resultJSON = {
                code: 0,
                data: items,
                playTime: '',
                staticUri: staticUri
            }
            if(req.query.callback){
                res.send(req.query.callback +'('+JSON.stringify(resultJSON) +')');
            }else{
                res.jsonp(resultJSON);
            }
        });
    });
}