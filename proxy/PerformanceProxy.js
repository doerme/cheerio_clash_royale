var PerformanceModel = require('../models/Performance.js');

exports.addPerformanceReport = function(data, callback){

    console.log(data);
    var newPerformance = PerformanceModel({
        pid: data.pid,
        userAgent: data.userAgent,
        currentURL: data.currentURL,
        reportTime: data.timestamp,
        sourceInfo: data.sourceInfo,
        loadInfo: data.loadInfo
    });
    newPerformance.save(callback);
}

exports.obtainPerformanceReport = function(pid, callback){

    console.log(pid);
    PerformanceModel
            .findOne({
                pid: pid
            }, function(err, repo){
                
                callback(err, repo);
            });
}