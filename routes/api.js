//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
'use strict';

var Proxy = require('../proxy');
// var WebPageTest = require('webpagetest');
// var wpt = new WebPageTest('www.webpagetest.org', 'A.4bdf8363bbd0420c163f3567b637f96a');
// var request = require('request');
module.exports = function(router){
    router.use(function(res, req, next){
        //do loging
        console.log('Something is happening.');
        next();
    });

    //more routes for API wil happen here

    //on routes that end in /api/webPerf/upload
    //----------------------------------
    router.route('/test')
        .get((req, res) => {
            wpt.runTest('http://www.baidu.com/', (err, data) => {
                console.log(err || data);
                if(err) {
                    res.send(err);
                } else {
                    request(data.data.jsonUrl, (err, response, body) => {
                        console.log(body);
                        res.send(JSON.parse(body));
                    });
                }
            });
        });
}
   