var Proxy = require('../proxy');

module.exports = function(router){
    router.use((req, res, next) => {
        console.log("???? no router match");
        next();
    });

    router.get('/', (req, res) => {
        res.send('user router');
    });
    
}