'use strict';
var superagent = require('superagent');
var cheerio = require('cheerio');

var detailArrayTest = [
    "Three+Musketeers",
    "Golem",
    "Royal+Recruits"
]

var detailArray = [
    "Three+Musketeers",
    "Golem",
    "Royal+Recruits",
    "P.E.K.K.A",
    "Lava+Hound",
    "Mega+Knight",
    "Royal+Giant",
    "Elite+Barbarians",
    "Giant+Skeleton",
    "Goblin+Giant",
    "Sparky",
    "Barbarians",
    "Minion+Horde",
    "Rascals",
    "Balloon",
    "Witch",
    "Prince",
    "Bowler",
    "Executioner",
    "Cannon+Cart",
    "Electro+Dragon",
    "Ram+Rider",
    "Giant",
    "Wizard",
    "Royal+Hogs",
    "Baby+Dragon",
    "Dark+Prince",
    "Hunter",
    "Lumberjack",
    "Inferno+Dragon",
    "Electro+Wizard",
    "Night+Witch",
    "Magic+Archer",
    "Valkyrie",
    "Musketeer",
    "Mini+P.E.K.K.A",
    "Hog+Rider",
    "Battle+Ram",
    "Flying+Machine",
    "Zappies",
    "Knight",
    "Archers",
    "Minions",
    "Bomber",
    "Goblin+Gang",
    "Skeleton+Barrel",
    "Skeleton+Army",
    "Guards",
    "Ice+Wizard",
    "Princess",
    "Miner",
    "Bandit",
    "Royal+Ghost",
    "Mega+Minion",
    "Dart+Goblin",
    "Goblins",
    "Spear+Goblins",
    "Fire+Spirits",
    "Bats",
    "Ice+Golem",
    "Skeletons",
    "Ice+Spirit",
    "Barbarian+Hut",
    "X-Bow",
    "Elixir+Collector",
    "Goblin+Hut",
    "Inferno+Tower",
    "Mortar",
    "Tesla",
    "Bomb+Tower",
    "Furnace",
    "Cannon",
    "Tombstone",
    "Lightning",
    "Rocket",
    "Graveyard",
    "Freeze",
    "Poison",
    "Fireball",
    "Arrows",
    "Goblin+Barrel",
    "Tornado",
    "Clone",
    "Heal",
    "Zap",
    "Giant+Snowball",
    "Rage",
    "Barbarian+Barrel",
    "The+Log",
    "Mirror"
    ];

async function fizz(arr) {
    let rs={}
    await arr.reduce((p, e, i) => p.then(async () => {
        console.log(`----begin----${e}`);
        rs[e] = await getCardDetail(e);
        console.log(`----done----${e}`);
    }), Promise.resolve());
    return rs
}

function getCardDetail(item){
    return new Promise(resolve => {
        superagent.get(`https://statsroyale.com/zh/card/${item}`).end(function (err, sres) {
            if (err) {
                resolve(null)
            } else {
                var $ = cheerio.load(sres.text);
                let curItem = {
                    cardname: $('.card__cardName').text(),
                    description: $('.card__description').text(), // 简介
                    rarity: $('.card__rarity').text(), // 军衔
                    rare: $('.card__rarityCaption .card__count').text(), // 稀有度
                }
                curItem.cardUnit = [] // 卡牌常规属性
                $('.card__metrics').each(function(eindex, eitem){
                    curItem.cardUnit.push({
                        card__spawnCount: $(eitem).find('.card__spawnCount .card__count').text(),
                        card__target: $(eitem).find('.card__target .card__count').text(),
                        card__range: $(eitem).find('.card__range .card__count').text(),
                        card__hitSpeed: $(eitem).find('.card__hitSpeed .card__count').text(),
                        card__movementSpeed:  $(eitem).find('.card__movementSpeed .card__count').text()
                    })
                })
                curItem.unitName = [] // 卡牌所包含单位名称集合
                $('div[data-target=".statistics__tabContainer"]').find('.ui__tab').each(function(eindex, eitem){
                    curItem.unitName.push($(eitem).text())
                })
                curItem.levelData = [] // 卡牌等级数据
                resolve(curItem)
            }                
        })
    }).catch(error => console.log('caught', error.message))
}

module.exports = function(router){
    // 获取卡片详情
    router.route('/getCardDetail').get(async (req, res, next) => {
        let resultJSON = {};
        let items = await fizz(detailArrayTest);
        resultJSON = {
            code: 0,
            data: items,
            playTime: '',
        }
        console.log('resultJSON', resultJSON)
        if(req.query.callback){
            res.send(req.query.callback +'('+JSON.stringify(resultJSON) +')');
        }else{
            res.jsonp(resultJSON);
        }
    })

    // 获取卡片列表
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
                    //staticUri.push($util.find('a').attr('href').replace('https://statsroyale.com/zh/card/', ''))
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