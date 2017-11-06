'use strict';

var Proxy = require('../proxy');
var superagent = require('superagent');
var cheerio = require('cheerio');

module.exports = function(router){
    router.use(function(res, req, next){
        //do loging
        console.log('Something is happening.');
        next();
    });

    //more routes for API wil happen here
    //on routes that end in /api/webPerf/upload
    //----------------------------------
    // 获取 stream 昵称
    router.route('/getStreamAcount').get((req, res, next) => {
        console.log('/getStreamAcount');
        superagent.get('https://pubgtracker.com/pubg/search?steamId=76561198320144940').redirects(5)
        .end(function (err, sres) {
            if (err) {
                console.log('err status:',err.status);
                return next(err);
            }
            console.log(sres.text);
        });
    });

    // 获取赛季数据
    router.route('/getGameSession').get((req, res, next) => {
        console.log('req.query:', req.query);
        superagent.get('https://pubg.me/player/'+ req.query.username)
        .end(function (err, sres) {
            if (err) {
                return next(err);
            }
            var $ = cheerio.load(sres.text);
            var items = {};
            var curSession = '';
            $('.page-container .dropdown-menu-profile-overview .dropdown-item.d-flex').each(function (idx, element) {
                var $element = $(element);
                if($element.prev('.dropdown-item.disabled').text() && !items[$element.prev('.dropdown-item.disabled').text()]){
                    curSession = '赛季'+$element.prev('.dropdown-item.disabled').text().match(/#(\d)/)[1];
                    items[curSession] = [];
                }
                items[curSession].push({
                    title: $element.find('.region').text(),
                    detail: {
                        rank: $element.find('.rating').text(),
                        link: 'https://pubg.me' + $element.attr('href'),
                        prevtitle: $element.prev('.dropdown-item.disabled').text()
                    }
                });
            });
            if(req.query.callback){
                res.send(req.query.callback +'('+JSON.stringify(items) +')');
            }else{
                res.jsonp(items);
            }

        });
    });

    // 优先获取战绩
    router.route('/getGameScoreFrist').get((req, res, next) => {
        console.log('req.query:', req.query);
        var arrStr = ['单排','单排FPP','双排','双排FPP','四排','四排FPP'];
        var sessionArr = [];
        superagent.get('https://dak.gg/profile/'+ req.query.username)
        .end(function (err, sres) {
            if (err) {
                return next(err);
            }
            var $ = cheerio.load(sres.text);
            var items = {};
            $('.regions li').each(function (idx, element) {
                var $element = $(element);
                if($element.hasClass('played_0')){

                }else{
                    sessionArr.push();
                }
            });
            $('.mode-section').each(function (idx, element) {
                var $element = $(element);

                items[idx]= {
                    title: arrStr[idx],
                    detail: {
                        rank: $element.find('.desc').find('.rank').text(),
                        RATING: $element.find('.rating').find('.value').text(),
                        KDR: $element.find('.kd').find('.value').text(),
                        WINS: $element.find('.winratio').find('.value').text(),
                        MATCHES: $element.find('.games').find('.value').text(),
                        SEASON: $element.find('.desc').find('.rank').text(),
                        ADR: $element.find('.mostkills').find('.value').text(),
                        TOP10: $element.find('.top10s').find('.value').text()
                    }
                };
            });
            if(req.query.callback){
                res.send(req.query.callback +'('+JSON.stringify(items) +')');
            }else{
                res.jsonp(items);
            }

        });
    });

    // 获取战绩
    router.route('/getGameScore').get((req, res, next) => {
        console.log('req.query: decodeURIComponent(req.query.apiurl)', decodeURIComponent(req.query.apiurl));
        var items = {};
        if(req.query.apiurl){
            superagent.get(decodeURIComponent(req.query.apiurl)).end(function (err, sres) {
                if (err) {
                    return next(err);
                }
                var $ = cheerio.load(sres.text);
                $('.profile-match-overview').each(function (idx, element) {
                    var $element = $(element);
                    var tmpName = $element.find('.profile-match-overview-name .value').text();
                    var tmpSubName = '';
                    if(/solo/i.test(tmpName)){
                        tmpSubName = '单排';
                    }else if(/duo/i.test(tmpName)){
                        tmpSubName = '双排';
                    }else if(/squad/i.test(tmpName)){
                        tmpSubName = '四排';
                    }
                    if(/ffp/i.test(tmpName)){
                        tmpSubName += ' FFP';
                    }
                    items[idx]= {
                        title: tmpName,
                        subTitle: tmpSubName, // solo 单排 duo 双人 squad 四排
                        detail: {
                            rank: $element.find('.profile-overview-stat-row > .row .col').eq(0).find('.value').text(),
                            RATING: $element.find('.profile-overview-stat-row > .row .col').eq(1).find('.value').text(),
                            KDR: $element.find('.profile-overview-stat-row > .row .col').eq(2).find('.value').text(),
                            WINS: $element.find('.profile-overview-stat-row > .row .col').eq(3).find('.value').text(),
                            MATCHES: $element.find('.profile-overview-stat-row-small > .row .col').eq(0).find('.value').text(),
                            SEASON: $element.find('.profile-overview-stat-row-small > .row .col').eq(1).find('.value').text(),
                            ADR: $element.find('.profile-overview-stat-row-small > .row .col').eq(2).find('.value').text(),
                            TOP10: $element.find('.profile-overview-stat-row-small > .row .col').eq(3).find('.value').text()
                        }
                    };
                });
                if(req.query.callback){
                    res.send(req.query.callback +'('+JSON.stringify(items) +')');
                }else{
                    res.jsonp(items);
                }
            });
        }else{
            res.jsonp(items);
        }
    });
}
   