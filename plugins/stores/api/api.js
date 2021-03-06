var plugin = {},
	common = require('../../../api/utils/common.js'),
    plugins = require('../../pluginManager.js'),
    stores = require("../stores.json"),
	fetch = require('../../../api/parts/data/fetch.js');

(function (plugin) {
	plugins.register("/worker", function(ob){
		common.dbUserMap['store'] = 'str';
	});
	plugins.register("/session/metrics", function(ob){
		var predefinedMetrics = ob.predefinedMetrics;
        var params = ob.params;
        var user = ob.user;
        if (params.qstring.metrics && (!user || typeof user[common.dbUserMap['store']] == "undefined")) {
            if(typeof params.qstring.metrics._store == "undefined" && params.qstring.metrics._os){
                params.qstring.metrics._store = params.qstring.metrics._os;
            }
        }
		predefinedMetrics.push({
            db: "stores",
            metrics: [
                { name: "_store", set: "stores", short_code: common.dbUserMap['store'] }
            ]
        });
	});
	plugins.register("/o", function(ob){
		var params = ob.params;
		var validateUserForDataReadAPI = ob.validateUserForDataReadAPI;
		if (params.qstring.method == "stores") {
			validateUserForDataReadAPI(params, fetch.fetchTimeObj, 'stores');
			return true;
		}
		return false;
	});
    
    plugins.register("/o/stores", function(ob){
		common.returnOutput(ob.params, stores);
		return true;
	});
	
	plugins.register("/i/apps/delete", function(ob){
		var appId = ob.appId;
		common.db.collection('stores').remove({'_id': {$regex: appId + ".*"}},function(){});
	});
	
	plugins.register("/i/apps/reset", function(ob){
		var appId = ob.appId;
		common.db.collection('stores').remove({'_id': {$regex: appId + ".*"}},function(){});
	});
    
    plugins.register("/i/apps/clear", function(ob){
		var appId = ob.appId;
        var ids = ob.ids;
		common.db.collection('stores').remove({$and:[{'_id': {$regex: appId + ".*"}}, {'_id': {$nin:ids}}]},function(){});
	});
}(plugin));

module.exports = plugin;