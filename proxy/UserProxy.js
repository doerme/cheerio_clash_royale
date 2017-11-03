var UserModel = require('../models/User.js');

exports.addUser = function(data, callback){
    
    console.log(data);
    var newUser = UserModel({
        account: data.account,
        password: data.password,
        userName: data.userName,
        registeredTime: data.registeredTime,
        lastLogin: data.lastLogin,
        pidList: data.pidList,
        isApproval: data.isApproval
    });
    newUser.save(callback);
}

exports.editNickname = function(data, callback){
    
    console.log(data);
    UserModel
            .update({
                account: data.account
            }, {
                userName: data.userName
            }, function(err, msg){
                
                callback(err, msg);
            });
}

exports.findUser = function(account, callback){
    console.log(account);
    UserModel.find({
        account: account
    }, function(err, msg){
        callback(err, msg);
    });
}

exports.deleteUser = function(account, callback){
    console.log(account);
    UserModel.remove({
        account: account
    }, function(err, msg){
        callback(err, msg);
    });
}