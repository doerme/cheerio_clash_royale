var router = require('express').Router();  //get an instance of the express Router
var API = require('./api');
var User = require('./user');

//data Module
var test = require('../proxy/report');

router.use(function(req, res, next){
    console.log('index router');
    next();
});

router.get('/', function(req, res){
    res.send('Birds home page');
});

router.get('/favicon.ico', function(req, res) {
    res.status(204);
});

API(router);
User(router);

module.exports = router;

    // router.route('/api/:bear_id')
    //     //get a single bear
    //     .get(function(req, res){

    //         Bear.findById(req.params.bear_id, function(err, bear){
    //             if(err)
    //                 res.send(err);
                
    //             res.json(bear);
    //         });
    //     })
    //     //updated bears
    //     .put(function(req, res){

    //         Bear.findById(req.params.bear_id, function(err, bear){

    //             if(err)
    //                 res.send(err);
                
    //             bear.name = req.body.name;

    //             bear.save(function(err){

    //                 if(err)
    //                     res.send(err);
                    
    //                 res.json({message: 'Bear updated!'});
    //             });
    //         });
    //     })
    //     //delete bears
    //     .delete(function(req, res){

    //         Bear.remove({
    //             _id: req.params.bear_id
    //         }, function(err, bear){

    //             if(err)
    //                 res.send(err);
                
    //             res.json({message: 'Successfully deleted!'});
    //         });
    //     });