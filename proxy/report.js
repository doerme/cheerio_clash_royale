// var testModel = require('../models/test');
var testModel;

exports.getAllTest = function(name, callback){
    testModel.find()
             .sort({
                 _id: -1
             })
             .exec(callback);
}

exports.addTest = function(name, callback){
    var newObj = new testModel({
        name: name
    });
    newObj.save(callback);
}