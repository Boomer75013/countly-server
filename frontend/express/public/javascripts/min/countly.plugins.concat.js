(function (countlyPlugins, $, undefined) {

    //Private Properties
    var _pluginsData = {};
    var _configsData = {};

    //Public Methods
    countlyPlugins.initialize = function (id) {
		return $.ajax({
			type:"GET",
			url:countlyCommon.API_URL + "/o/plugins",
			data:{
                api_key:countlyGlobal['member'].api_key
            },
			success:function (json) {
				_pluginsData = json;
			}
		});
    };
    
    //Public Methods
    countlyPlugins.initializeConfigs = function (id) {
		return $.ajax({
			type:"GET",
			url:countlyCommon.API_URL + "/o/configs",
			data:{
                api_key:countlyGlobal['member'].api_key
            },
			success:function (json) {
				_configsData = json;
			}
		});
    };
    
    countlyPlugins.updateConfigs = function (configs, callback) {
		$.ajax({
			type:"GET",
			url:countlyCommon.API_URL + "/i/configs",
			data:{
                configs:JSON.stringify(configs),
                api_key:countlyGlobal['member'].api_key
            },
			success:function (json) {
				_configsData = json;
                if(callback)
                    callback(null, json);
			},
			error:function (json) {
                if(callback)
                    callback(true, json);
			}
		});
    };
	
	countlyPlugins.toggle = function (plugins, callback) {
		$.ajax({
			type:"GET",
			url:countlyCommon.API_URL + "/i/plugins",
			data:{
				plugin:JSON.stringify(plugins),
				api_key:countlyGlobal['member'].api_key
			},
			success:function (json) {
				if(callback)
					callback(json);
			},
			error: function(xhr, textStatus, errorThrown){
				var ret = textStatus+" ";
				ret += xhr.status+": "+$(xhr.responseText).text();
				if(errorThrown)
					ret += errorThrown+"\n";
				if(callback)
					callback(ret);
			}
		});
    };
	
	countlyPlugins.getData = function () {
		return _pluginsData;
    };
    
    countlyPlugins.getConfigsData = function () {
		return _configsData;
    };
	
}(window.countlyPlugins = window.countlyPlugins || {}, jQuery));;window.PluginsView = countlyView.extend({
	initialize:function () {
		this.filter = (store.get("countly_pluginsfilter")) ? store.get("countly_pluginsfilter") : "plugins-all";
    },
    beforeRender: function() {
		if(this.template)
			return $.when(countlyPlugins.initialize()).then(function () {});
		else{
			var self = this;
			return $.when($.get(countlyGlobal["path"]+'/plugins/templates/plugins.html', function(src){
				self.template = Handlebars.compile(src);
			}), countlyPlugins.initialize()).then(function () {});
		}
    },
    renderCommon:function (isRefresh) {
		
        var pluginsData = countlyPlugins.getData();
        this.templateData = {
            "page-title":jQuery.i18n.map["plugins.title"]
        };
		var self = this;
        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
			$("#"+this.filter).addClass("selected").addClass("active");
			$.fn.dataTableExt.afnFiltering.push(function( oSettings, aData, iDataIndex ) {
				if(!$(oSettings.nTable).hasClass("plugins-filter"))
					return true;
				if((self.filter == "plugins-enabled" && !aData[3]) || (self.filter == "plugins-disabled" && aData[3])){
					return false
				}
				return true;
			});

			this.dtable = $('#plugins-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": pluginsData,
                "aoColumns": [
                    { "mData": function(row, type){return row.title;}, "sType":"string", "sTitle": jQuery.i18n.map["plugins.name"]},
                    { "mData": function(row, type){return row.description;}, "sType":"string", "sTitle": jQuery.i18n.map["plugins.description"] },
                    { "mData": function(row, type){return row.version;}, "sType":"string", "sTitle": jQuery.i18n.map["plugins.version"], "sClass":"center" },
                    { "mData": function(row, type){if(type == "display"){ if(!row.enabled) return '<a class="icon-button green btn-header btn-plugins" id="plugin-'+row.code+'">'+jQuery.i18n.map["plugins.enable"]+'</a>'; else return '<a class="icon-button red btn-header btn-plugins" id="plugin-'+row.code+'">'+jQuery.i18n.map["plugins.disable"]+'</a>';}else return row.enabled;}, "sType":"string", "sTitle": jQuery.i18n.map["plugins.state"], "sClass":"shrink center"},
					{ "mData": function(row, type){if(row.homepage != "") return '<a class="icon-button btn-header light" href="'+ row.homepage + '" target="_blank">'+jQuery.i18n.map["plugins.homepage"]+'</a>'; else return "";}, "sType":"string", "sTitle": jQuery.i18n.map["plugins.homepage"], "sClass":"shrink center"}
                ]
            }));
			this.dtable.stickyTableHeaders();
			this.dtable.fnSort( [ [0,'asc'] ] );
        }
    },
    refresh:function (){
    },
	togglePlugin: function(plugins){
		var self = this;
		var overlay = $("#overlay").clone();
		$("body").append(overlay);
		overlay.show();
		var loader = $(this.el).find("#content-loader");
		loader.show();
		countlyPlugins.toggle(plugins, function(res){
			var msg = {clearAll:true};
			if(res == "Success" || res == "Errors"){
				var seconds = 10;
				if(res == "Success"){
					msg.title = jQuery.i18n.map["plugins.success"];
					msg.message = jQuery.i18n.map["plugins.restart"]+" "+seconds+" "+jQuery.i18n.map["plugins.seconds"];
					msg.info = jQuery.i18n.map["plugins.finish"];
					msg.delay = seconds*1000;
				}
				else if(res == "Errors"){
					msg.title = jQuery.i18n.map["plugins.errors"];
					msg.message = jQuery.i18n.map["plugins.errors-msg"];
					msg.info = jQuery.i18n.map["plugins.restart"]+" "+seconds+" "+jQuery.i18n.map["plugins.seconds"];
					msg.sticky = true;
					msg.type = "error";
				}
				setTimeout(function(){
					window.location.reload(true);
				}, seconds*1000);
			}
			else{
				overlay.hide();
				loader.hide();
				msg.title = jQuery.i18n.map["plugins.error"];
				msg.message = res;
				msg.info = jQuery.i18n.map["plugins.retry"];
				msg.sticky = true;
				msg.type = "error";
			}
			CountlyHelpers.notify(msg);
		});
	},
	filterPlugins: function(filter){
		this.filter = filter;
		store.set("countly_pluginsfilter", filter);
		$("#"+this.filter).addClass("selected").addClass("active");
		this.dtable.fnDraw();
	}
});

window.ConfigurationsView = countlyView.extend({
	initialize:function () {
		this.predefinedInputs = {};
		this.predefinedLabels = {
            "frontend":"Frontend",
            "api":"API",
            "apps":"Apps",
            "frontend-production":"Production mode",
            "frontend-session_timeout":"Session timeout in ms",
            "api-domain":"Domain in emails",
            "api-safe":"Safer API responses",
            "api-session_duration_limit":"Maximal Session Duration",
            "api-city_data":"Track city data",
            "api-event_limit":"Max unique event keys",
            "api-event_segmentation_limit":"Max segmentation in each event",
            "api-event_segmentation_value_limit":"Max unique values in each segmentation",
            "apps-country":"Default Country",
            "apps-category":"Default Category"
        };
        this.configsData = {};
        this.cache = {};
        this.changes = {};
        
        //register some common system config inputs
        this.registerInput("apps-category", function(value){
            var categories = app.manageAppsView.getAppCategories();
            var select = '<div class="cly-select" id="apps-category">'+
				'<div class="select-inner">'+
					'<div class="text-container">';
            if(!categories[value])
                select += '<div class="text"></div>';
            else
                select += '<div class="text">'+categories[value]+'</div>';
			select += '</div>'+
					'<div class="right combo"></div>'+
				'</div>'+
				'<div class="select-items square">'+
					'<div>';
                    
                for(var i in categories){
                    select += '<div data-value="'+i+'" class="segmentation-option item">'+categories[i]+'</div>';
                }

			select += '</div>'+
				'</div>'+
			'</div>';
            return select;
        });
        
        this.registerInput("apps-country", function(value){
            var zones = app.manageAppsView.getTimeZones();
            var select = '<div class="cly-select" id="apps-country">'+
				'<div class="select-inner">'+
					'<div class="text-container">';
            if(!zones[value])
				select += '<div class="text"></div>';
            else
                select += '<div class="text"><div class="flag" style="background-image:url(images/flags/'+value.toLowerCase()+'.png)"></div>'+zones[value].n+'</div>';
            
			select += '</div>'+
					'<div class="right combo"></div>'+
				'</div>'+
				'<div class="select-items square">'+
					'<div>';
                    
                for(var i in zones){
                    select += '<div data-value="'+i+'" class="segmentation-option item"><div class="flag" style="background-image:url(images/flags/'+i.toLowerCase()+'.png)"></div>'+zones[i].n+'</div>';
                }

			select += '</div>'+
				'</div>'+
			'</div>';
            return select;
        });
        
        this.registerInput("apps-timezone", function(value){
            return null;
        });
    },
    beforeRender: function() {
		if(this.template)
			return $.when(countlyPlugins.initializeConfigs()).then(function () {});
		else{
			var self = this;
			return $.when($.get(countlyGlobal["path"]+'/plugins/templates/configurations.html', function(src){
				self.template = Handlebars.compile(src);
			}), countlyPlugins.initializeConfigs()).then(function () {});
		}
    },
    renderCommon:function (isRefresh) {
        this.configsData = countlyPlugins.getConfigsData();
        var configsHTML;
        var title = jQuery.i18n.map["plugins.configs"];
        if(this.namespace && this.configsData[this.namespace]){
            configsHTML = this.generateConfigsTable(this.configsData[this.namespace], "-"+this.namespace);
            title = this.getInputLabel(this.namespace, this.namespace) + " " + title;
        }
        else
            configsHTML = this.generateConfigsTable(this.configsData);
        
        
        this.templateData = {
            "page-title":title,
            "configs":configsHTML,
            "namespace":this.namespace
        };
		var self = this;
        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            this.changes = {};
            this.cache = JSON.parse(JSON.stringify(this.configsData));
            
            $("#configs-back").click(function(){
                window.history.back();
            });

			$(".boolean-selector>.button").click(function () {
                var dictionary = {"plugins.enable":true, "plugins.disable":false};
                var cur = $(this);
                if (cur.hasClass("selected")) {
                    return true;
                }
                var prev = cur.parent(".button-selector").find(">.button.selected");
                prev.removeClass("selected").removeClass("active");
                cur.addClass("selected").addClass("active");
                var id = $(this).parent(".button-selector").attr("id");
                var value = dictionary[$(this).data("localize")];
                self.updateConfig(id, value);
            });
            
            $(".configs input").keyup(function () {
                var id = $(this).attr("id");
                var value = $(this).val();
                if($(this).attr("type") == "number")
                    value = parseFloat(value);
                self.updateConfig(id, value);
            });
            
            $(".configs .segmentation-option").on("click", function () {
                var id = $(this).closest(".cly-select").attr("id");
				var value = $(this).data("value");
                self.updateConfig(id, value);
			});
            
            $("#configs-apply-changes").click(function () {
                countlyPlugins.updateConfigs(self.changes, function(err, services){
                    if(err){
                        CountlyHelpers.notify({
                            title: "Configs not changed",
                            message: "Could not save changes",
                            type: "error"
                        });
                    }
                    else{
                        CountlyHelpers.notify({
                            title: "Configs changed",
                            message: "Changes were successfully saved"
                        });
                        self.configsData = JSON.parse(JSON.stringify(self.cache));
                        $("#configs-apply-changes").hide();
                        self.changes = {};
                    }
                });
            });
        }
    },
    updateConfig: function(id, value){
        var configs = id.split("-");
                
        //update cache
        var data = this.cache;
        for(var i = 0; i < configs.length; i++){
            if(typeof data[configs[i]] == "undefined"){
                break;
            }
            else if(i == configs.length-1){
                data[configs[i]] = value;
            }
            else{
                data = data[configs[i]];
            }
        }
        
        //add to changes
        var data = this.changes;
        for(var i = 0; i < configs.length; i++){
            if(i == configs.length-1){
                data[configs[i]] = value;
            }
            else if(typeof data[configs[i]] == "undefined"){
                data[configs[i]] = {};
            }
            data = data[configs[i]];
        }

        if(JSON.stringify(this.configsData) != JSON.stringify(this.cache)){
            $("#configs-apply-changes").show();
        }
        else{
            $("#configs-apply-changes").hide();
            this.changes = {};
        }  
    },
    generateConfigsTable: function(configsData, id){
        id = id || "";
        var first = true;
        if(id != ""){
            first = false;
        }
        var configsHTML = "<table class='d-table help-zone-vb ";
        if(first)
            configsHTML +=  "no-fix";
        configsHTML += "' cellpadding='0' cellspacing='0'>";
        for(var i in configsData){
            if(typeof configsData[i] == "object"){
                if(configsData[i] != null){
                    var label = this.getInputLabel((id+"-"+i).substring(1), i);
                    if(label)
                        configsHTML += "<tr><td>"+label+"</td><td>"+this.generateConfigsTable(configsData[i], id+"-"+i)+"</td></tr>";
                }
            }
            else{
                var input = this.getInputByType((id+"-"+i).substring(1), configsData[i]);
                var label = this.getInputLabel((id+"-"+i).substring(1), i);
                if(input && label)
                    configsHTML += "<tr><td>"+label+"</td><td>"+input+"</td></tr>";
            }
        }
        configsHTML += "</table>";
        return configsHTML;
    },
    getInputLabel: function(id, value){
        if(typeof this.predefinedLabels[id] != "undefined")
            return this.predefinedLabels[id];
        else
            return value;
    },
    getInputByType: function(id, value){
        if(this.predefinedInputs[id]){
            return this.predefinedInputs[id](value);
        }
        else if(typeof value == "boolean"){
            var input = '<div id="'+id+'" class="button-selector boolean-selector">';
            if(value){
                input += '<div class="button active selected" data-localize="plugins.enable"></div>';
                input += '<div class="button" data-localize="plugins.disable"></div>';
            }
            else{
                input += '<div class="button" data-localize="plugins.enable"></div>';
                input += '<div class="button active selected" data-localize="plugins.disable"></div>';
            }
            input += '</div>';
            return input;
        }
        else if(typeof value == "number"){
            return "<input type='number' id='"+id+"' value='"+value+"'/>";
        }
        else
            return "<input type='text' id='"+id+"' value='"+value+"'/>";
    },
    registerInput: function(id, callback){
        this.predefinedInputs[id] = callback;
    },
    registerLabel: function(id, html){
        this.predefinedLabels[id] = html;
    },
    refresh:function (){
    }
});

//register views
app.pluginsView = new PluginsView();
app.configurationsView = new ConfigurationsView();
if(countlyGlobal["member"].global_admin){
    app.route('/manage/plugins', 'plugins', function () {
        this.renderWhenReady(this.pluginsView);
    });
    
    app.route('/manage/configurations', 'configurations', function () {
        this.configurationsView.namespace = null;
        this.renderWhenReady(this.configurationsView);
    });
    
    app.route('/manage/configurations/:namespace', 'configurations_namespace', function (namespace) {
        this.configurationsView.namespace = namespace;
        this.renderWhenReady(this.configurationsView);
    });
}

app.addPageScript("/manage/plugins", function(){
   $("#plugins-selector").find(">.button").click(function () {
        if ($(this).hasClass("selected")) {
            return true;
        }

        $(".plugins-selector").removeClass("selected").removeClass("active");
		var filter = $(this).attr("id");
		app.activeView.filterPlugins(filter);
    });
	var plugins = countlyGlobal["plugins"].slice();
	$("#plugins-table").on("click", ".btn-plugins", function () {
		var show = false;
		var plugin = this.id.toString().replace(/^plugin-/, '');
		if($(this).hasClass("green")){
			$(this).removeClass("green").addClass("red");
			$(this).text(jQuery.i18n.map["plugins.disable"]);
			plugins.push(plugin);
		}
		else if($(this).hasClass("red")){
			$(this).removeClass("red").addClass("green");
			$(this).text(jQuery.i18n.map["plugins.enable"]);
			var index = $.inArray(plugin, plugins);
			plugins.splice(index, 1);
		}
		if(plugins.length != countlyGlobal["plugins"].length)
			show = true;
		else{
			for(var i = 0; i < plugins.length; i++){
				if($.inArray(plugins[i], countlyGlobal["plugins"]) == -1){
					show = true;
					break;
				}
			}
		}
		if(show)
			$(".btn-plugin-enabler").show();
		else
			$(".btn-plugin-enabler").hide();
	});
	$("#plugins-selector").on("click", ".btn-plugin-enabler", function () {
		var plugins = {};
		$(".btn-plugins").each(function(){
			var plugin = this.id.toString().replace(/^plugin-/, '');
			var state = ($(this).hasClass("green")) ? false : true;
			plugins[plugin] = state;
		})
		var text = jQuery.i18n.map["plugins.confirm"];
		var msg = {title:jQuery.i18n.map["plugins.processing"], message: jQuery.i18n.map["plugins.wait"], info:jQuery.i18n.map["plugins.hold-on"], sticky:true};
		CountlyHelpers.confirm(text, "red", function (result) {
			if (!result) {
				return true;
			}
			CountlyHelpers.notify(msg);
			app.activeView.togglePlugin(plugins);
		});
	});
});

app.addPageScript("#", function(){
	if (Backbone.history.fragment == '/manage/plugins') {
        $("#sidebar-app-select").addClass("disabled");
        $("#sidebar-app-select").removeClass("active");
    }
    if (Backbone.history.fragment == '/manage/configurations') {
        $("#sidebar-app-select").addClass("disabled");
        $("#sidebar-app-select").removeClass("active");
    }
});

$( document ).ready(function() {
	if(countlyGlobal["member"] && countlyGlobal["member"]["global_admin"]){
		var menu = '<a href="#/manage/plugins" class="item">'+
			'<div class="logo-icon fa fa-puzzle-piece"></div>'+
			'<div class="text" data-localize="plugins.title"></div>'+
		'</a>';
		if($('#management-submenu .help-toggle').length)
			$('#management-submenu .help-toggle').before(menu);
        
        var menu = '<a href="#/manage/configurations" class="item">'+
			'<div class="logo-icon fa fa-wrench"></div>'+
			'<div class="text" data-localize="plugins.configs"></div>'+
		'</a>';
		if($('#management-submenu .help-toggle').length)
			$('#management-submenu .help-toggle').before(menu);
	}
});;CountlyHelpers.createMetricModel(window.countlyDensity = window.countlyDensity || {}, "density", jQuery);;window.DensityView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyDensity.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var densityData = countlyDensity.getData();

        this.templateData = {
            "page-title":jQuery.i18n.map["density.title"],
            "logo-class":"densities",
            "graph-type-double-pie":true,
            "pie-titles":{
                "left":jQuery.i18n.map["common.total-users"],
                "right":jQuery.i18n.map["common.new-users"]
            }
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            if(typeof addDrill != "undefined"){
                addDrill("up.dnst");
            }

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": densityData.chartData,
                "aoColumns": [
                    { "mData": "density", sType:"session-duration", "sTitle": jQuery.i18n.map["density.table.density"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
            countlyCommon.drawGraph(densityData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(densityData.chartDPNew, "#dashboard-graph2", "pie");
        }
    },
    refresh:function () {
        var self = this;
        $.when(countlyDensity.refresh()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);

            newPage = $("<div>" + self.template(self.templateData) + "</div>");
        
            $(self.el).find(".dashboard-summary").replaceWith(newPage.find(".dashboard-summary"));

            var densityData = countlyDensity.getData();

            countlyCommon.drawGraph(densityData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(densityData.chartDPNew, "#dashboard-graph2", "pie");
			CountlyHelpers.refreshTable(self.dtable, densityData.chartData);
        });
    }
});

//register views
app.densityView = new DensityView();

app.route("/analytics/density", 'desity', function () {
	this.renderWhenReady(this.densityView);
});

$( document ).ready(function() {
	var menu = '<a href="#/analytics/density" class="item">'+
		'<div class="logo densities"></div>'+
		'<div class="text" data-localize="sidebar.analytics.densities"></div>'+
	'</a>';
	$('#analytics-submenu').append(menu);
});;(function () {
    var langmap;
    $.ajax({
        type:"GET",
        url:countlyCommon.API_PARTS.data.r+"/langmap",
        dataType:"json",
        success:function (json) {
            langmap = json;
        }
    });
    function getLanguageName(code){
        if(langmap && langmap[code]){
            return langmap[code].englishName
        }
        else
            return code;
    }
    CountlyHelpers.createMetricModel(window.countlyLanguage = window.countlyLanguage || {getLanguageName:getLanguageName}, "langs", jQuery, getLanguageName);
}());;window.LanguageView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyLanguage.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var languageData = countlyLanguage.getData();

        this.templateData = {
            "page-title":jQuery.i18n.map["languages.title"],
            "logo-class":"languages",
            "graph-type-double-pie":true,
            "pie-titles":{
                "left":jQuery.i18n.map["common.total-users"],
                "right":jQuery.i18n.map["common.new-users"]
            },
            "chart-helper":"languages.chart",
            "table-helper":""
        };

        languageData.chartData.forEach(function(row){
            if (row.language in countlyGlobalLang.languages) row.language = countlyGlobalLang.languages[row.language].englishName;
        });

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            if(typeof addDrill != "undefined"){
                addDrill("up.la");
            }
            countlyCommon.drawGraph(languageData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(languageData.chartDPNew, "#dashboard-graph2", "pie");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": languageData.chartData,
                "aoColumns": [
                    { "mData": "langs", "sTitle": jQuery.i18n.map["languages.table.language"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);
            newPage = $("<div>" + self.template(self.templateData) + "</div>");

            var languageData = countlyLanguage.getData();
            countlyCommon.drawGraph(languageData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(languageData.chartDPNew, "#dashboard-graph2", "pie");

            CountlyHelpers.refreshTable(self.dtable, languageData.chartData);
            app.localize();
        });
    }
});

//register views
app.languageView = new LanguageView();

app.route("/analytics/languages", "languages", function () {
    this.renderWhenReady(this.languageView);
});

$( document ).ready(function() {
	Handlebars.registerHelper('languageTitle', function (context, options) {
        return countlyGlobalLang.languages[context];
    });

	var menu = '<a href="#/analytics/languages" class="item">'+
		'<div class="logo languages"></div>'+
		'<div class="text" data-localize="sidebar.analytics.languages"></div>'+
	'</a>';
	$('#analytics-submenu').append(menu);
});;;(function(g,f,b,e,c,d,o){/*! Jssor */
$Jssor$=g.$Jssor$=g.$Jssor$||{};new(function(){this.$DebugMode=c;this.$Log=function(c,d){var a=g.console||{},b=this.$DebugMode;if(b&&a.log)a.log(c);else b&&d&&alert(c)};this.$Error=function(b,d){var c=g.console||{},a=this.$DebugMode;if(a&&c.error)c.error(b);else a&&alert(b);if(a)throw d||new Error(b);};this.$Fail=function(a){throw new Error(a);};this.$Assert=function(b,c){var a=this.$DebugMode;if(a)if(!b)throw new Error("Assert failed "+c||"");};this.$Trace=function(c){var a=g.console||{},b=this.$DebugMode;b&&a.log&&a.log(c)};this.$Execute=function(b){var a=this.$DebugMode;a&&b()};this.$LiveStamp=function(b,c){var a=f.createElement("DIV");a.setAttribute("id",c);b.$Live=a}});var m=function(){var b=this,a={};b.$On=b.addEventListener=function(b,c){if(typeof c!="function")return;if(!a[b])a[b]=[];a[b].push(c)};b.$Off=b.removeEventListener=function(e,d){var b=a[e];if(typeof d!="function")return;else if(!b)return;for(var c=0;c<b.length;c++)if(d==b[c]){b.splice(c,1);return}};b.$ClearEventListeners=function(b){if(a[b])delete a[b]};b.$TriggerEvent=function(e){var c=a[e],d=[];if(!c)return;for(var b=1;b<arguments.length;b++)d.push(arguments[b]);for(var b=0;b<c.length;b++)try{c[b].apply(g,d)}catch(f){}}},h;(function(){h=function(a,b){this.x=typeof a=="number"?a:0;this.y=typeof b=="number"?b:0};var a=h.prototype;a.$Plus=function(a){return new h(this.x+a.x,this.y+a.y)};a.$Minus=function(a){return new h(this.x-a.x,this.y-a.y)};a.$Times=function(a){return new h(this.x*a,this.y*a)};a.$Divide=function(a){return new h(this.x/a,this.y/a)};a.$Negate=function(){return new h(-this.x,-this.y)};a.$DistanceTo=function(a){return b.sqrt(b.pow(this.x-a.x,2)+b.pow(this.y-a.y,2))};a.$Apply=function(a){return new h(a(this.x),a(this.y))};a.$Equals=function(a){return a instanceof h&&this.x===a.x&&this.y===a.y};a.$ToString=function(){return"("+this.x+","+this.y+")"}})();var l=g.$JssorEasing$={$EaseLinear:function(a){return a},$EaseGoBack:function(a){return 1-b.abs(2-1)},$EaseSwing:function(a){return-b.cos(a*b.PI)/2+.5},$EaseInQuad:function(a){return a*a},$EaseOutQuad:function(a){return-a*(a-2)},$EaseInOutQuad:function(a){return(a*=2)<1?1/2*a*a:-1/2*(--a*(a-2)-1)},$EaseInCubic:function(a){return a*a*a},$EaseOutCubic:function(a){return(a-=1)*a*a+1},$EaseInOutCubic:function(a){return(a*=2)<1?1/2*a*a*a:1/2*((a-=2)*a*a+2)},$EaseInQuart:function(a){return a*a*a*a},$EaseOutQuart:function(a){return-((a-=1)*a*a*a-1)},$EaseInOutQuart:function(a){return(a*=2)<1?1/2*a*a*a*a:-1/2*((a-=2)*a*a*a-2)},$EaseInQuint:function(a){return a*a*a*a*a},$EaseOutQuint:function(a){return(a-=1)*a*a*a*a+1},$EaseInOutQuint:function(a){return(a*=2)<1?1/2*a*a*a*a*a:1/2*((a-=2)*a*a*a*a+2)},$EaseInSine:function(a){return 1-b.cos(a*b.PI/2)},$EaseOutSine:function(a){return b.sin(a*b.PI/2)},$EaseInOutSine:function(a){return-1/2*(b.cos(b.PI*a)-1)},$EaseInExpo:function(a){return a==0?0:b.pow(2,10*(a-1))},$EaseOutExpo:function(a){return a==1?1:-b.pow(2,-10*a)+1},$EaseInOutExpo:function(a){return a==0||a==1?a:(a*=2)<1?1/2*b.pow(2,10*(a-1)):1/2*(-b.pow(2,-10*--a)+2)},$EaseInCirc:function(a){return-(b.sqrt(1-a*a)-1)},$EaseOutCirc:function(a){return b.sqrt(1-(a-=1)*a)},$EaseInOutCirc:function(a){return(a*=2)<1?-1/2*(b.sqrt(1-a*a)-1):1/2*(b.sqrt(1-(a-=2)*a)+1)},$EaseInElastic:function(a){if(!a||a==1)return a;var c=.3,d=.075;return-(b.pow(2,10*(a-=1))*b.sin((a-d)*2*b.PI/c))},$EaseOutElastic:function(a){if(!a||a==1)return a;var c=.3,d=.075;return b.pow(2,-10*a)*b.sin((a-d)*2*b.PI/c)+1},$EaseInOutElastic:function(a){if(!a||a==1)return a;var c=.45,d=.1125;return(a*=2)<1?-.5*b.pow(2,10*(a-=1))*b.sin((a-d)*2*b.PI/c):b.pow(2,-10*(a-=1))*b.sin((a-d)*2*b.PI/c)*.5+1},$EaseInBack:function(a){var b=1.70158;return a*a*((b+1)*a-b)},$EaseOutBack:function(a){var b=1.70158;return(a-=1)*a*((b+1)*a+b)+1},$EaseInOutBack:function(a){var b=1.70158;return(a*=2)<1?1/2*a*a*(((b*=1.525)+1)*a-b):1/2*((a-=2)*a*(((b*=1.525)+1)*a+b)+2)},$EaseInBounce:function(a){return 1-l.$EaseOutBounce(1-a)},$EaseOutBounce:function(a){return a<1/2.75?7.5625*a*a:a<2/2.75?7.5625*(a-=1.5/2.75)*a+.75:a<2.5/2.75?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375},$EaseInOutBounce:function(a){return a<1/2?l.$EaseInBounce(a*2)*.5:l.$EaseOutBounce(a*2-1)*.5+.5},$EaseInWave:function(a){return 1-b.cos(a*b.PI*2)},$EaseOutWave:function(a){return b.sin(a*b.PI*2)},$EaseOutJump:function(a){return 1-((a*=2)<1?(a=1-a)*a*a:(a-=1)*a*a)},$EaseInJump:function(a){return(a*=2)<1?a*a*a:(a=2-a)*a*a}},i=g.$JssorDirection$={$TO_LEFT:1,$TO_RIGHT:2,$TO_TOP:4,$TO_BOTTOM:8,$HORIZONTAL:3,$VERTICAL:12,$LEFTRIGHT:3,$TOPBOTOM:12,$TOPLEFT:5,$TOPRIGHT:6,$BOTTOMLEFT:9,$BOTTOMRIGHT:10,$AROUND:15,$GetDirectionHorizontal:function(a){return a&3},$GetDirectionVertical:function(a){return a&12},$ChessHorizontal:function(a){return(~a&3)+(a&12)},$ChessVertical:function(a){return(~a&12)+(a&3)},$IsToLeft:function(a){return(a&3)==1},$IsToRight:function(a){return(a&3)==2},$IsToTop:function(a){return(a&12)==4},$IsToBottom:function(a){return(a&12)==8},$IsHorizontal:function(a){return(a&3)>0},$IsVertical:function(a){return(a&12)>0}},r={$BACKSPACE:8,$COMMA:188,$DELETE:46,$DOWN:40,$END:35,$ENTER:13,$ESCAPE:27,$HOME:36,$LEFT:37,$NUMPAD_ADD:107,$NUMPAD_DECIMAL:110,$NUMPAD_DIVIDE:111,$NUMPAD_ENTER:108,$NUMPAD_MULTIPLY:106,$NUMPAD_SUBTRACT:109,$PAGE_DOWN:34,$PAGE_UP:33,$PERIOD:190,$RIGHT:39,$SPACE:32,$TAB:9,$UP:38},p,n={$UNKNOWN:0,$IE:1,$FIREFOX:2,$SAFARI:3,$CHROME:4,$OPERA:5},z=1,v=2,x=3,w=4,y=5,j,a=g.$JssorUtils$=new function(){var i=this,m=n.$UNKNOWN,j=0,s=0,T=0,B=0,fb=navigator.appName,k=navigator.userAgent;function F(){if(!m)if(fb=="Microsoft Internet Explorer"&&!!g.attachEvent&&!!g.ActiveXObject){var d=k.indexOf("MSIE");m=n.$IE;s=parseFloat(k.substring(d+5,k.indexOf(";",d)));/*@cc_on T=@_jscript_version@*/;j=f.documentMode||s}else if(fb=="Netscape"&&!!g.addEventListener){var c=k.indexOf("Firefox"),a=k.indexOf("Safari"),h=k.indexOf("Chrome"),b=k.indexOf("AppleWebKit");if(c>=0){m=n.$FIREFOX;j=parseFloat(k.substring(c+8))}else if(a>=0){var i=k.substring(0,a).lastIndexOf("/");m=h>=0?n.$CHROME:n.$SAFARI;j=parseFloat(k.substring(i+1,a))}if(b>=0)B=parseFloat(k.substring(b+12))}else{var e=/(opera)(?:.*version|)[ \/]([\w.]+)/i.exec(k);if(e){m=n.$OPERA;j=parseFloat(e[2])}}}function r(){F();return m==z}function I(){return r()&&(j<6||f.compatMode=="BackCompat")}function Z(){F();return m==v}function O(){F();return m==x}function lb(){F();return m==w}function nb(){F();return m==y}function V(){return O()&&B>534&&B<535}function hb(){return O()&&B<535}function A(){return r()&&j<9}var D;function t(a){if(!D){q(["transform","WebkitTransform","msTransform","MozTransform","OTransform"],function(b){if(!i.$IsUndefined(a.style[b])){D=b;return c}});D=D||"transform"}return D}function jb(a,b){return b&&a!=f.body?f.body:a.offsetParent}function db(a){return Object.prototype.toString.call(a)}var L;function q(a,c){if(db(a)=="[object Array]"){for(var b=0;b<a.length;b++)if(c(a[b],b,a))break}else for(var d in a)if(c(a[d],d,a))break}function ob(){if(!L){L={};q(["Boolean","Number","String","Function","Array","Date","RegExp","Object"],function(a){L["[object "+a+"]"]=a.toLowerCase()})}return L}function C(a){return a==e?String(a):ob()[db(a)]||"object"}function pb(a){if(!a||C(a)!=="object"||a.nodeType||i.$IsWindow(a))return d;var b=Object.prototype.hasOwnProperty;try{if(a.constructor&&!b.call(a,"constructor")&&!b.call(a.constructor.prototype,"isPrototypeOf"))return d}catch(e){return d}var c;for(c in a);return c===o||b.call(a,c)}function eb(b,a){setTimeout(b,a||0)}function K(b,d,c){var a=!b||b=="inherit"?"":b;q(d,function(c){var b=c.exec(a);if(b){var d=a.substr(0,b.index),e=a.substr(b.lastIndex+1,a.length-(b.lastIndex+1));a=d+e}});a=c+(a.indexOf(" ")!=0?" ":"")+a;return a}function ab(b,a){if(j<9)b.style.filter=a}function ib(b,a,c){if(T<9){var e=b.style.filter,g=new RegExp(/[\s]*progid:DXImageTransform\.Microsoft\.Matrix\([^\)]*\)/g),f=a?"progid:DXImageTransform.Microsoft.Matrix(M11="+a[0][0]+", M12="+a[0][1]+", M21="+a[1][0]+", M22="+a[1][1]+", SizingMethod='auto expand')":"",d=K(e,[g],f);ab(b,d);i.$CssMarginTop(b,c.y);i.$CssMarginLeft(b,c.x)}}i.$IsBrowserIE=r;i.$IsBrowserIeQuirks=I;i.$IsBrowserFireFox=Z;i.$IsBrowserSafari=O;i.$IsBrowserChrome=lb;i.$IsBrowserOpera=nb;i.$IsBrowserBadTransform=V;i.$IsBrowserSafeHWA=hb;i.$IsBrowserIe9Earlier=A;i.$GetBrowserVersion=function(){return j};i.$GetBrowserEngineVersion=function(){return s||j};i.$GetWebKitVersion=function(){return B};i.$Delay=eb;i.$GetElement=function(a){if(i.$IsString(a))a=f.getElementById(a);return a};i.$GetElementPosition=function(a){a=i.$GetElement(a);var b=new h;while(a){b.x+=a.offsetLeft;b.y+=a.offsetTop;var c=i.$GetElementStyle(a).position=="fixed";if(c)b=b.$Plus(i.$GetPageScroll(g));a=jb(a,c)}return b};i.$GetElementSize=function(a){a=i.$GetElement(a);return new h(a.clientWidth,a.clientHeight)};i.$GetEvent=function(a){return a?a:g.event};i.$GetEventSrcElement=function(a){a=i.$GetEvent(a);return a.target||a.srcElement||f};i.$GetEventDstElement=function(a){a=i.$GetEvent(a);return a.relatedTarget||a.toElement};i.$GetMousePosition=function(a){a=i.$GetEvent(a);var b=new h;if(a.type=="DOMMouseScroll"&&Z()&&j<3){b.x=a.screenX;b.y=a.screenY}else if(typeof a.pageX=="number"){b.x=a.pageX;b.y=a.pageY}else if(typeof a.clientX=="number"){b.x=a.clientX+f.body.scrollLeft+f.documentElement.scrollLeft;b.y=a.clientY+f.body.scrollTop+f.documentElement.scrollTop}return b};i.$GetMouseScroll=function(a){a=i.$GetEvent(a);var c=0;if(typeof a.wheelDelta=="number")c=a.wheelDelta;else if(typeof a.detail=="number")c=a.detail*-1;return c?c/b.abs(c):0};i.$GetPageScroll=function(b){var a=new h,c=b.document.documentElement||{},d=b.document.body||{};if(typeof b.pageXOffset=="number"){a.x=b.pageXOffset;a.y=b.pageYOffset}else if(d.scrollLeft||d.scrollTop){a.x=d.scrollLeft;a.y=d.scrollTop}else if(c.scrollLeft||c.scrollTop){a.x=c.scrollLeft;a.y=c.scrollTop}return a};i.$GetWindowSize=function(c){var a=new h,b=I()?c.document.body:c.document.documentElement;a.x=b.clientWidth;a.y=b.clientHeight;return a};function G(c,d,a){if(a!=o)c.style[d]=a;else{var b=c.currentStyle||c.style;a=b[d];if(a==""&&g.getComputedStyle){b=c.ownerDocument.defaultView.getComputedStyle(c,e);b&&(a=b.getPropertyValue(d)||b[d])}return a}}function Q(b,c,a,d){if(a!=o){d&&(a+="px");G(b,c,a)}else return parseFloat(G(b,c))}function rb(b,d,a){return Q(b,d,a,c)}function l(d,a){var b=a&2,c=a?Q:G;return function(e,a){return c(e,d,a,b)}}function kb(b){if(r()&&s<9){var a=/opacity=([^)]*)/.exec(b.style.filter||"");return a?parseFloat(a[1])/100:1}else return parseFloat(b.style.opacity||"1")}function mb(c,a,f){if(r()&&s<9){var h=c.style.filter||"",i=new RegExp(/[\s]*alpha\([^\)]*\)/g),e=b.round(100*a),d="";if(e<100||f)d="alpha(opacity="+e+") ";var g=K(h,[i],d);ab(c,g)}else c.style.opacity=a==1?"":b.round(a*100)/100}function S(g,c){var f=c.$Rotate||0,d=c.$Scale==o?1:c.$Scale;if(A()){var k=i.$CreateMatrix(f/180*b.PI,d,d);ib(g,!f&&d==1?e:k,i.$GetMatrixOffset(k,c.$OriginalWidth,c.$OriginalHeight))}else{var h=t(g);if(h){var j="rotate("+f%360+"deg) scale("+d+")";if(a.$IsBrowserChrome()&&B>535)j+=" perspective(2000px)";g.style[h]=j}}}i.$SetStyleTransform=function(b,a){if(V())eb(i.$CreateCallback(e,S,b,a));else S(b,a)};i.$SetStyleTransformOrigin=function(b,c){var a=t(b);if(a)b.style[a+"Origin"]=c};i.$SetStyleScale=function(a,c){if(r()&&s<9||s<10&&I())a.style.zoom=c==1?"":c;else{var b=t(a);if(b){var f="scale("+c+")",e=a.style[b],g=new RegExp(/[\s]*scale\(.*?\)/g),d=K(e,[g],f);a.style[b]=d}}};i.$EnableHWA=function(a){if(!a.style[t(a)]||a.style[t(a)]=="none")a.style[t(a)]="perspective(2000px)"};i.$DisableHWA=function(a){a.style[t(a)]="none"};var cb=0,bb=0,H;function gb(g){var f=c,a=I()?g.document.body:g.document.documentElement;if(a){var e=a.offsetWidth-cb,b=a.offsetHeight-bb;if(e||b){cb+=e;bb+=b}else f=d}f&&q(H,function(a){a()})}i.$OnWindowResize=function(b,a){if(r()&&s<9)if(!H){H=[a];a=i.$CreateCallback(e,gb,b)}else{H.push(a);return}i.$AddEvent(b,"resize",a)};i.$AddEvent=function(a,c,d,b){a=i.$GetElement(a);if(a.addEventListener){c=="mousewheel"&&a.addEventListener("DOMMouseScroll",d,b);a.addEventListener(c,d,b)}else if(a.attachEvent){a.attachEvent("on"+c,d);b&&a.setCapture&&a.setCapture()}};i.$RemoveEvent=function(a,c,d,b){a=i.$GetElement(a);if(a.removeEventListener){c=="mousewheel"&&a.removeEventListener("DOMMouseScroll",d,b);a.removeEventListener(c,d,b)}else if(a.detachEvent){a.detachEvent("on"+c,d);b&&a.releaseCapture&&a.releaseCapture()}};i.$FireEvent=function(c,b){var a;if(f.createEvent){a=f.createEvent("HTMLEvents");a.initEvent(b,d,d);c.dispatchEvent(a)}else{var e="on"+b;a=f.createEventObject();c.fireEvent(e,a)}};i.$AddEventBrowserMouseUp=function(b,a){i.$AddEvent(A()?f:g,"mouseup",b,a)};i.$RemoveEventBrowserMouseUp=function(b,a){i.$RemoveEvent(A()?f:g,"mouseup",b,a)};i.$AddEventBrowserMouseDown=function(b,a){i.$AddEvent(A()?f:g,"mousedown",b,a)};i.$RemoveEventBrowserMouseDown=function(b,a){i.$RemoveEvent(A()?f:g,"mousedown",b,a)};i.$CancelEvent=function(a){a=i.$GetEvent(a);a.preventDefault&&a.preventDefault();a.cancel=c;a.returnValue=d};i.$StopEvent=function(a){a=i.$GetEvent(a);a.stopPropagation&&a.stopPropagation();a.cancelBubble=c};i.$CreateCallback=function(e,d){for(var b=[],a=2;a<arguments.length;a++)b.push(arguments[a]);var c=function(){for(var c=b.concat([]),a=0;a<arguments.length;a++)c.push(arguments[a]);return d.apply(e,c)};return c};var M;i.$FreeElement=function(b){if(!M)M=i.$CreateDivElement();if(b){a.$AppendChild(M,b);a.$ClearInnerHtml(M)}};i.$SetInnerText=function(a,c){var b=f.createTextNode(c);i.$ClearInnerHtml(a);a.appendChild(b)};i.$GetInnerText=function(a){return a.textContent||a.innerText};i.$GetInnerHtml=function(a){return a.innerHTML};i.$SetInnerHtml=function(a,b){a.innerHTML=b};i.$ClearInnerHtml=function(a){a.innerHTML=""};i.$EncodeHtml=function(b){var a=i.$CreateDivElement();i.$SetInnerText(a,b);return i.$GetInnerHtml(a)};i.$DecodeHtml=function(b){var a=i.$CreateDivElement();i.$SetInnerHtml(a,b);return i.$GetInnerText(a)};i.$SelectElement=function(c){var b;if(g.getSelection)b=g.getSelection();var a=e;if(f.createRange){a=f.createRange();a.selectNode(c)}else{a=f.body.createTextRange();a.moveToElementText(c);a.select()}b&&b.addRange(a)};i.$DeselectElements=function(){if(f.selection)f.selection.empty();else g.getSelection&&g.getSelection().removeAllRanges()};i.$GetChildren=function(c){for(var b=[],a=c.firstChild;a;a=a.nextSibling)a.nodeType==1&&b.push(a);return b};function R(a,c,b,f){if(!b)b="u";for(a=a?a.firstChild:e;a;a=a.nextSibling)if(a.nodeType==1){if(i.$GetAttributeEx(a,b)==c)return a;if(f){var d=R(a,c,b,f);if(d)return d}}}i.$FindFirstChildByAttribute=R;function W(a,c,d){for(a=a?a.firstChild:e;a;a=a.nextSibling)if(a.nodeType==1){if(a.tagName==c)return a;if(d){var b=W(a,c,d);if(b)return b}}}i.$FindFirstChildByTag=W;function X(a,d,g){var b=[];for(a=a?a.firstChild:e;a;a=a.nextSibling)if(a.nodeType==1){(!d||a.tagName==d)&&b.push(a);if(g){var f=X(a,d,c);if(f.length)b=b.concat(f)}}return b}i.$FindChildrenByTag=X;i.$GetElementsByTagName=function(b,a){return b.getElementsByTagName(a)};i.$Extend=function(c){for(var b=1;b<arguments.length;b++){var a=arguments[b];if(a)for(var d in a)c[d]=a[d]}return c};i.$Unextend=function(b,d){var c={};for(var a in b)if(b[a]!=d[a])c[a]=b[a];return c};i.$IsUndefined=function(a){return C(a)=="undefined"};i.$IsFunction=function(a){return C(a)=="function"};i.$IsArray=Array.isArray||function(a){return C(a)=="array"};i.$IsString=function(a){return C(a)=="string"};i.$IsNumeric=function(a){return!isNaN(parseFloat(a))&&isFinite(a)};i.$IsWindow=function(a){return a!=e&&a==a.window};i.$Type=C;i.$Each=q;i.$IsPlainObject=pb;i.$CreateDivElement=function(a){return i.$CreateElement("DIV",a)};i.$CreateSpanElement=function(a){return i.$CreateElement("SPAN",a)};i.$CreateElement=function(b,a){a=a||f;return a.createElement(b)};i.$EmptyFunction=function(){};i.$GetAttribute=function(a,b){return a.getAttribute(b)};i.$GetAttributeEx=function(a,b){return i.$GetAttribute(a,b)||i.$GetAttribute(a,"data-"+b)};i.$SetAttribute=function(b,c,a){b.setAttribute(c,a)};i.$GetClassName=function(a){return a.className};i.$SetClassName=function(b,a){b.className=a||""};i.$GetParentNode=function(a){return a.parentNode};i.$HideElement=function(a){i.$CssDisplay(a,"none")};i.$HideElements=function(b){for(var a=0;a<b.length;a++)i.$HideElement(b[a])};i.$ShowElement=function(a,b){i.$CssDisplay(a,b==d?"none":"")};i.$ShowElements=function(b){for(var a=0;a<b.length;a++)i.$ShowElement(b[a])};i.$RemoveAttribute=function(b,a){b.removeAttribute(a)};i.$CanClearClip=function(){return r()&&j<10};i.$SetStyleClip=function(d,c){if(c)d.style.clip="rect("+b.round(c.$Top)+"px "+b.round(c.$Right)+"px "+b.round(c.$Bottom)+"px "+b.round(c.$Left)+"px)";else{var g=d.style.cssText,f=[new RegExp(/[\s]*clip: rect\(.*?\)[;]?/i),new RegExp(/[\s]*cliptop: .*?[;]?/i),new RegExp(/[\s]*clipright: .*?[;]?/i),new RegExp(/[\s]*clipbottom: .*?[;]?/i),new RegExp(/[\s]*clipleft: .*?[;]?/i)],e=K(g,f,"");a.$CssCssText(d,e)}};i.$GetNow=function(){return+new Date};i.$AppendChild=function(b,a){b.appendChild(a)};i.$AppendChildren=function(b,a){q(a,function(a){i.$AppendChild(b,a)})};i.$InsertBefore=function(c,b,a){c.insertBefore(b,a)};i.$InsertAdjacentHtml=function(b,a,c){b.insertAdjacentHTML(a,c)};i.$RemoveChild=function(b,a){b.removeChild(a)};i.$RemoveChildren=function(b,a){q(a,function(a){i.$RemoveChild(b,a)})};i.$ClearChildren=function(a){i.$RemoveChildren(a,i.$GetChildren(a))};i.$ParseInt=function(b,a){return parseInt(b,a||10)};i.$ParseFloat=function(a){return parseFloat(a)};i.$IsChild=function(b,a){var c=f.body;while(a&&b!=a&&c!=a)try{a=a.parentNode}catch(e){return d}return b==a};i.$ToLowerCase=function(a){if(a)a=a.toLowerCase();return a};i.$CloneNode=function(b,a){return b.cloneNode(a)};function N(b,a,c){a.onload=e;a.abort=e;b&&b(a,c)}i.$LoadImage=function(d,b){if(i.$IsBrowserOpera()&&j<11.6||!d)N(b,e);else{var a=new Image;a.onload=i.$CreateCallback(e,N,b,a);a.onabort=i.$CreateCallback(e,N,b,a,c);a.src=d}};i.$LoadImages=function(e,b,f){var d=e.length+1;function c(a){d--;if(b&&a&&a.src==b.src)b=a;!d&&f&&f(b)}a.$Each(e,function(b){a.$LoadImage(b.src,c)});c()};i.$BuildElement=function(d,k,j,i){if(i)d=a.$CloneNode(d,c);for(var h=a.$GetElementsByTagName(d,k),f=h.length-1;f>-1;f--){var b=h[f],e=a.$CloneNode(j,c);a.$SetClassName(e,a.$GetClassName(b));a.$CssCssText(e,b.style.cssText);var g=a.$GetParentNode(b);a.$InsertBefore(g,e,b);a.$RemoveChild(g,b)}return d};var E;function qb(b){var g=this,h,e,j;function f(){var c=h;if(e)c+="dn";else if(j)c+="av";a.$SetClassName(b,c)}function k(){E.push(g);e=c;f()}g.$MouseUp=function(){e=d;f()};g.$Activate=function(a){j=a;f()};b=i.$GetElement(b);if(!E){i.$AddEventBrowserMouseUp(function(){var a=E;E=[];q(a,function(a){a.$MouseUp()})});E=[]}h=i.$GetClassName(b);a.$AddEvent(b,"mousedown",k)}i.$Buttonize=function(a){return new qb(a)};i.$Css=G;i.$CssN=Q;i.$CssP=rb;i.$CssOverflow=l("overflow");i.$CssTop=l("top",2);i.$CssLeft=l("left",2);i.$CssWidth=l("width",2);i.$CssHeight=l("height",2);i.$CssMarginLeft=l("marginLeft",2);i.$CssMarginTop=l("marginTop",2);i.$CssPosition=l("position");i.$CssDisplay=l("display");i.$CssZIndex=l("zIndex",1);i.$CssFloat=function(b,a){return G(b,r()?"styleFloat":"cssFloat",a)};i.$CssOpacity=function(b,a,c){if(a!=o)mb(b,a,c);else return kb(b)};i.$CssCssText=function(a,b){if(b!=o)a.style.cssText=b;else return a.style.cssText};var P={$Opacity:i.$CssOpacity,$Top:i.$CssTop,$Left:i.$CssLeft,$Width:i.$CssWidth,$Height:i.$CssHeight,$Position:i.$CssPosition,$Display:i.$CssDisplay,$ZIndex:i.$CssZIndex},u;function J(){if(!u)u=i.$Extend({$MarginTop:i.$CssMarginTop,$MarginLeft:i.$CssMarginLeft,$Clip:i.$SetStyleClip,$Transform:i.$SetStyleTransform},P);return u}function Y(){J();u.$Transform=u.$Transform;return u}i.$GetStyleSetter=J;i.$GetStyleSetterEx=Y;i.$GetStyles=function(c,b){J();var a={};q(b,function(d,b){if(P[b])a[b]=P[b](c)});return a};i.$SetStyles=function(c,b){var a=J();q(b,function(d,b){a[b]&&a[b](c,d)})};i.$SetStylesEx=function(b,a){Y();i.$SetStyles(b,a)};p=new function(){var a=this;function b(d,g){for(var j=d[0].length,i=d.length,h=g[0].length,f=[],c=0;c<i;c++)for(var k=f[c]=[],b=0;b<h;b++){for(var e=0,a=0;a<j;a++)e+=d[c][a]*g[a][b];k[b]=e}return f}a.$ScaleX=function(b,c){return a.$ScaleXY(b,c,0)};a.$ScaleY=function(b,c){return a.$ScaleXY(b,0,c)};a.$ScaleXY=function(a,c,d){return b(a,[[c,0],[0,d]])};a.$TransformPoint=function(d,c){var a=b(d,[[c.x],[c.y]]);return new h(a[0][0],a[1][0])}};i.$CreateMatrix=function(d,a,c){var e=b.cos(d),f=b.sin(d);return[[e*a,-f*c],[f*a,e*c]]};i.$GetMatrixOffset=function(d,c,a){var e=p.$TransformPoint(d,new h(-c/2,-a/2)),f=p.$TransformPoint(d,new h(c/2,-a/2)),g=p.$TransformPoint(d,new h(c/2,a/2)),i=p.$TransformPoint(d,new h(-c/2,a/2));return new h(b.min(e.x,f.x,g.x,i.x)+c/2,b.min(e.y,f.y,g.y,i.y)+a/2)}};j=function(n,m,g,O,z,x){n=n||0;var f=this,r,K,o,p,y,A=0,C,M,L,D,j=0,t=0,E,k=n,s=n+m,i,h,q,u=[],B;function I(b){i+=b;h+=b;k+=b;s+=b;j+=b;t+=b;a.$Each(u,function(a){a,a.$Shift(b)})}function N(a,b){var c=a-i+n*b;I(c);return h}function w(w,G){var n=w;if(q&&(n>=h||n<=i))n=((n-i)%q+q)%q+i;if(!E||y||G||j!=n){var p=b.min(n,h);p=b.max(p,i);if(!E||y||G||p!=t){if(x){var d=x;if(z){var s=(p-k)/(m||1);if(g.$Optimize&&a.$IsBrowserChrome()&&m)s=b.round(s*m/16)/m*16;if(g.$Reverse)s=1-s;d={};for(var o in x){var R=M[o]||1,J=L[o]||[0,1],l=(s-J[0])/J[1];l=b.min(b.max(l,0),1);l=l*R;var H=b.floor(l);if(l!=H)l-=H;var Q=C[o]||C.$Default,I=Q(l),r,K=z[o],F=x[o];if(a.$IsNumeric(F))r=K+(F-K)*I;else{r=a.$Extend({$Offset:{}},z[o]);a.$Each(F.$Offset,function(c,b){var a=c*I;r.$Offset[b]=a;r[b]+=a})}d[o]=r}}if(z.$Zoom)d.$Transform={$Rotate:d.$Rotate||0,$Scale:d.$Zoom,$OriginalWidth:g.$OriginalWidth,$OriginalHeight:g.$OriginalHeight};if(x.$Clip&&g.$Move){var v=d.$Clip.$Offset,D=(v.$Top||0)+(v.$Bottom||0),A=(v.$Left||0)+(v.$Right||0);d.$Left=(d.$Left||0)+A;d.$Top=(d.$Top||0)+D;d.$Clip.$Left-=A;d.$Clip.$Right-=A;d.$Clip.$Top-=D;d.$Clip.$Bottom-=D}if(d.$Clip&&a.$CanClearClip()&&!d.$Clip.$Top&&!d.$Clip.$Left&&d.$Clip.$Right==g.$OriginalWidth&&d.$Clip.$Bottom==g.$OriginalHeight)d.$Clip=e;a.$Each(d,function(b,a){B[a]&&B[a](O,b)})}f.$OnInnerOffsetChange(t-k,p-k)}t=p;a.$Each(u,function(b,c){var a=w<j?u[u.length-c-1]:b;a.$GoToPosition(w,G)});var P=j,N=w;j=n;E=c;f.$OnPositionChange(P,N)}}function F(a,c){c&&a.$Locate(h,1);h=b.max(h,a.$GetPosition_OuterEnd());u.push(a)}function H(){if(r){var d=a.$GetNow(),e=b.min(d-A,a.$IsBrowserOpera()?80:20),c=j+e*p;A=d;if(c*p>=o*p)c=o;w(c);if(!y&&c*p>=o*p)J(D);else a.$Delay(H,g.$Interval)}}function v(d,e,g){if(!r){r=c;y=g;D=e;d=b.max(d,i);d=b.min(d,h);o=d;p=o<j?-1:1;f.$OnStart();A=a.$GetNow();H()}}function J(a){if(r){y=r=D=d;f.$OnStop();a&&a()}}f.$Play=function(a,b,c){v(a?j+a:h,b,c)};f.$PlayToPosition=function(b,a,c){v(b,a,c)};f.$PlayToBegin=function(a,b){v(i,a,b)};f.$PlayToEnd=function(a,b){v(h,a,b)};f.$Stop=function(){J()};f.$Continue=function(a){v(a)};f.$GetPosition=function(){return j};f.$GetPlayToPosition=function(){return o};f.$GetPosition_Display=function(){return t};f.$GoToPosition=w;f.$GoToBegin=function(){w(i,c)};f.$GoToEnd=function(){w(h,c)};f.$Move=function(a){w(j+a)};f.$CombineMode=function(){return K};f.$GetDuration=function(){return m};f.$IsPlaying=function(){return r};f.$IsOnTheWay=function(){return j>k&&j<=s};f.$SetLoopLength=function(a){q=a};f.$Locate=N;f.$Shift=I;f.$Join=F;f.$Combine=function(a){F(a,0)};f.$Chain=function(a){F(a,1)};f.$GetPosition_InnerBegin=function(){return k};f.$GetPosition_InnerEnd=function(){return s};f.$GetPosition_OuterBegin=function(){return i};f.$GetPosition_OuterEnd=function(){return h};f.$OnPositionChange=a.$EmptyFunction;f.$OnStart=a.$EmptyFunction;f.$OnStop=a.$EmptyFunction;f.$OnInnerOffsetChange=a.$EmptyFunction;f.$Version=a.$GetNow();g=a.$Extend({$Interval:16},g);q=g.$LoopLength;B=a.$Extend({},a.$GetStyleSetter(),g.$Setter);i=k=n;h=s=n+m;var M=g.$Round||{},L=g.$During||{};C=a.$Extend({$Default:a.$IsFunction(g.$Easing)&&g.$Easing||l.$EaseSwing},g.$Easing)};var s,k=g.$JssorSlideshowFormations$={};new function(){var p=0,o=1,w=2,v=3,I=1,H=2,J=4,G=8,O=256,P=512,N=1024,M=2048,z=M+I,y=M+H,E=P+I,C=P+H,D=O+J,A=O+G,B=N+J,F=N+G;function S(a){return(a&H)==H}function T(a){return(a&J)==J}function x(b,a,c){c.push(a);b[a]=b[a]||[];b[a].push(c)}k.$FormationStraight=function(f){for(var d=f.$Cols,e=f.$Rows,k=f.$Assembly,l=f.$Count,j=[],a=0,b=0,h=d-1,i=e-1,g=l-1,c,b=0;b<e;b++)for(a=0;a<d;a++){switch(k){case z:c=g-(a*e+(i-b));break;case B:c=g-(b*d+(h-a));break;case E:c=g-(a*e+b);case D:c=g-(b*d+a);break;case y:c=a*e+b;break;case A:c=b*d+(h-a);break;case C:c=a*e+(i-b);break;default:c=b*d+a}x(j,c,[b,a])}return j};k.$FormationSwirl=function(e){var l=e.$Cols,m=e.$Rows,r=e.$Assembly,k=e.$Count,q=[],n=[],i=0,a=0,b=0,f=l-1,g=m-1,h,d,j=0;switch(r){case z:a=f;b=0;d=[w,o,v,p];break;case B:a=0;b=g;d=[p,v,o,w];break;case E:a=f;b=g;d=[v,o,w,p];break;case D:a=f;b=g;d=[o,v,p,w];break;case y:a=0;b=0;d=[w,p,v,o];break;case A:a=f;b=0;d=[o,w,p,v];break;case C:a=0;b=g;d=[v,p,w,o];break;default:a=0;b=0;d=[p,w,o,v]}i=0;while(i<k){h=b+","+a;if(a>=0&&a<l&&b>=0&&b<m&&!n[h]){n[h]=c;x(q,i++,[b,a])}else switch(d[j++%d.length]){case p:a--;break;case w:b--;break;case o:a++;break;case v:b++}switch(d[j%d.length]){case p:a++;break;case w:b++;break;case o:a--;break;case v:b--}}return q};k.$FormationZigZag=function(d){var k=d.$Cols,l=d.$Rows,n=d.$Assembly,j=d.$Count,h=[],i=0,a=0,b=0,e=k-1,f=l-1,m,c,g=0;switch(n){case z:a=e;b=0;c=[w,o,v,o];break;case B:a=0;b=f;c=[p,v,o,v];break;case E:a=e;b=f;c=[v,o,w,o];break;case D:a=e;b=f;c=[o,v,p,v];break;case y:a=0;b=0;c=[w,p,v,p];break;case A:a=e;b=0;c=[o,w,p,w];break;case C:a=0;b=f;c=[v,p,w,p];break;default:a=0;b=0;c=[p,w,o,w]}i=0;while(i<j){m=b+","+a;if(a>=0&&a<k&&b>=0&&b<l&&typeof h[m]=="undefined"){x(h,i++,[b,a]);switch(c[g%c.length]){case p:a++;break;case w:b++;break;case o:a--;break;case v:b--}}else{switch(c[g++%c.length]){case p:a--;break;case w:b--;break;case o:a++;break;case v:b++}switch(c[g++%c.length]){case p:a++;break;case w:b++;break;case o:a--;break;case v:b--}}}return h};k.$FormationStraightStairs=function(h){var l=h.$Cols,m=h.$Rows,e=h.$Assembly,k=h.$Count,i=[],j=0,c=0,d=0,f=l-1,g=m-1,o=k-1;switch(e){case z:case C:case E:case y:var a=0,b=0;break;case A:case B:case D:case F:var a=f,b=0;break;default:e=F;var a=f,b=0}c=a;d=b;while(j<k){if(T(e)||S(e))x(i,o-j++,[d,c]);else x(i,j++,[d,c]);switch(e){case z:case C:c--;d++;break;case E:case y:c++;d--;break;case A:case B:c--;d--;break;case F:case D:default:c++;d++}if(c<0||d<0||c>f||d>g){switch(e){case z:case C:a++;break;case A:case B:case E:case y:b++;break;case F:case D:default:a--}if(a<0||b<0||a>f||b>g){switch(e){case z:case C:a=f;b++;break;case E:case y:b=g;a++;break;case A:case B:b=g;a--;break;case F:case D:default:a=0;b++}if(b>g)b=g;else if(b<0)b=0;else if(a>f)a=f;else if(a<0)a=0}d=b;c=a}}return i};k.$FormationSquare=function(h){var a=h.$Cols||1,c=h.$Rows||1,i=[],d,e,f,g,j;f=a<c?(c-a)/2:0;g=a>c?(a-c)/2:0;j=b.round(b.max(a/2,c/2))+1;for(d=0;d<a;d++)for(e=0;e<c;e++)x(i,j-b.min(d+1+f,e+1+g,a-d+f,c-e+g),[e,d]);return i};k.$FormationRectangle=function(f){var d=f.$Cols||1,e=f.$Rows||1,g=[],a,c,h;h=b.round(b.min(d/2,e/2))+1;for(a=0;a<d;a++)for(c=0;c<e;c++)x(g,h-b.min(a+1,c+1,d-a,e-c),[c,a]);return g};k.$FormationRandom=function(d){for(var e=[],a,c=0;c<d.$Rows;c++)for(a=0;a<d.$Cols;a++)x(e,b.ceil(1e5*b.random())%13,[c,a]);return e};k.$FormationCircle=function(d){for(var e=d.$Cols||1,f=d.$Rows||1,g=[],a,h=e/2-.5,i=f/2-.5,c=0;c<e;c++)for(a=0;a<f;a++)x(g,b.round(b.sqrt(b.pow(c-h,2)+b.pow(a-i,2))),[a,c]);return g};k.$FormationCross=function(d){for(var e=d.$Cols||1,f=d.$Rows||1,g=[],a,h=e/2-.5,i=f/2-.5,c=0;c<e;c++)for(a=0;a<f;a++)x(g,b.round(b.min(b.abs(c-h),b.abs(a-i))),[a,c]);return g};k.$FormationRectangleCross=function(f){for(var g=f.$Cols||1,h=f.$Rows||1,i=[],a,d=g/2-.5,e=h/2-.5,j=b.max(d,e)+1,c=0;c<g;c++)for(a=0;a<h;a++)x(i,b.round(j-b.max(d-b.abs(c-d),e-b.abs(a-e)))-1,[a,c]);return i};function Q(a){var b=a.$Formation(a);return a.$Reverse?b.reverse():b}function K(g,f){var e={$Interval:f,$Duration:1,$Delay:0,$Cols:1,$Rows:1,$Opacity:0,$Zoom:0,$Clip:0,$Move:d,$SlideOut:d,$FlyDirection:0,$Reverse:d,$Formation:k.$FormationRandom,$Assembly:F,$ChessMode:{$Column:0,$Row:0},$Easing:l.$EaseSwing,$Round:{},$Blocks:[],$During:{}};a.$Extend(e,g);e.$Count=e.$Cols*e.$Rows;if(a.$IsFunction(e.$Easing))e.$Easing={$Default:e.$Easing};e.$FramesCount=b.ceil(e.$Duration/e.$Interval);e.$EasingInstance=R(e);e.$GetBlocks=function(b,a){b/=e.$Cols;a/=e.$Rows;var f=b+"x"+a;if(!e.$Blocks[f]){e.$Blocks[f]={$Width:b,$Height:a};for(var c=0;c<e.$Cols;c++)for(var d=0;d<e.$Rows;d++)e.$Blocks[f][d+","+c]={$Top:d*a,$Right:c*b+b,$Bottom:d*a+a,$Left:c*b}}return e.$Blocks[f]};if(e.$Brother){e.$Brother=K(e.$Brother,f);e.$SlideOut=c}return e}function R(d){var c=d.$Easing;if(!c.$Default)c.$Default=l.$EaseSwing;var e=d.$FramesCount,f=c.$Cache;if(!f){var g=a.$Extend({},d.$Easing,d.$Round);f=c.$Cache={};a.$Each(g,function(n,l){var g=c[l]||c.$Default,j=d.$Round[l]||1;if(!a.$IsArray(g.$Cache))g.$Cache=[];var h=g.$Cache[e]=g.$Cache[e]||[];if(!h[j]){h[j]=[0];for(var k=1;k<=e;k++){var i=k/e*j,m=b.floor(i);if(i!=m)i-=m;h[j][k]=g(i)}}f[l]=h})}return f}function L(D,k,f,y,m,l){var B=this,v,w={},p={},o=[],h,g,t,r=f.$ChessMode.$Column||0,s=f.$ChessMode.$Row||0,j=f.$GetBlocks(m,l),q=Q(f),E=q.length-1,u=f.$Duration+f.$Delay*E,z=y+u,n=f.$SlideOut,A;z+=a.$IsBrowserChrome()?260:50;B.$EndTime=z;B.$ShowFrame=function(c){c-=y;var d=c<u;if(d||A){A=d;if(!n)c=u-c;var e=b.ceil(c/f.$Interval);a.$Each(p,function(c,f){var d=b.max(e,c.$Min);d=b.min(d,c.length-1);if(c.$LastFrameIndex!=d){if(!c.$LastFrameIndex&&!n)a.$ShowElement(o[f]);else d==c.$Max&&n&&a.$HideElement(o[f]);c.$LastFrameIndex=d;a.$SetStylesEx(o[f],c[d])}})}};function x(b){a.$DisableHWA(b);var c=a.$GetChildren(b);a.$Each(c,function(a){x(a)})}k=a.$CloneNode(k,c);x(k);if(a.$IsBrowserIe9Earlier()){var F=!k["no-image"],C=a.$FindChildrenByTag(k,e,c);a.$Each(C,function(b){(F||b["jssor-slider"])&&a.$CssOpacity(b,a.$CssOpacity(b),c)})}a.$Each(q,function(e,k){a.$Each(e,function(N){var S=N[0],R=N[1],z=S+","+R,u=d,x=d,A=d;if(r&&R%2){if(i.$IsHorizontal(r))u=!u;if(i.$IsVertical(r))x=!x;if(r&16)A=!A}if(s&&S%2){if(i.$IsHorizontal(s))u=!u;if(i.$IsVertical(s))x=!x;if(s&16)A=!A}f.$Top=f.$Top||f.$Clip&4;f.$Bottom=f.$Bottom||f.$Clip&8;f.$Left=f.$Left||f.$Clip&1;f.$Right=f.$Right||f.$Clip&2;var G=x?f.$Bottom:f.$Top,D=x?f.$Top:f.$Bottom,F=u?f.$Right:f.$Left,E=u?f.$Left:f.$Right;f.$Clip=G||D||F||E;t={};g={$Top:0,$Left:0,$Opacity:1,$Width:m,$Height:l};h=a.$Extend({},g);v=a.$Extend({},j[z]);if(f.$Opacity)g.$Opacity=2-f.$Opacity;if(f.$ZIndex){g.$ZIndex=f.$ZIndex;h.$ZIndex=0}var Q=f.$Cols*f.$Rows>1||f.$Clip;if(f.$Zoom||f.$Rotate){var P=c;if(a.$IsBrowserIE()&&a.$GetBrowserEngineVersion()<9)if(f.$Cols*f.$Rows>1)P=d;else Q=d;if(P){g.$Zoom=f.$Zoom?f.$Zoom-1:1;h.$Zoom=1;if(a.$IsBrowserIe9Earlier()||a.$IsBrowserOpera())g.$Zoom=b.min(g.$Zoom,2);var K=f.$Rotate;if(K==c)K=1;g.$Rotate=K*360*(A?-1:1);h.$Rotate=0}}if(Q){if(f.$Clip){var y=f.$ScaleClip||1,o=v.$Offset={};if(G&&D){o.$Top=j.$Height/2*y;o.$Bottom=-o.$Top}else if(G)o.$Bottom=-j.$Height*y;else if(D)o.$Top=j.$Height*y;if(F&&E){o.$Left=j.$Width/2*y;o.$Right=-o.$Left}else if(F)o.$Right=-j.$Width*y;else if(E)o.$Left=j.$Width*y}t.$Clip=v;h.$Clip=j[z]}if(f.$FlyDirection){var q=f.$FlyDirection;if(!u)q=i.$ChessHorizontal(q);if(!x)q=i.$ChessVertical(q);var M=f.$ScaleHorizontal||1,O=f.$ScaleVertical||1;if(i.$IsToLeft(q))g.$Left+=m*M;else if(i.$IsToRight(q))g.$Left-=m*M;if(i.$IsToTop(q))g.$Top+=l*O;else if(i.$IsToBottom(q))g.$Top-=l*O}a.$Each(g,function(b,c){if(a.$IsNumeric(b))if(b!=h[c])t[c]=b-h[c]});w[z]=n?h:g;var L=b.round(k*f.$Delay/f.$Interval);p[z]=new Array(L);p[z].$Min=L;for(var C=f.$FramesCount,J=0;J<=C;J++){var e={};a.$Each(t,function(g,c){var m=f.$EasingInstance[c]||f.$EasingInstance.$Default,l=m[f.$Round[c]||1],k=f.$During[c]||[0,1],d=(J/C-k[0])/k[1]*C;d=b.round(b.min(C,b.max(d,0)));var j=l[d];if(a.$IsNumeric(g))e[c]=h[c]+g*j;else{var i=e[c]=a.$Extend({},h[c]);i.$Offset=[];a.$Each(g.$Offset,function(c,b){var a=c*j;i.$Offset[b]=a;i[b]+=a})}});if(h.$Zoom)e.$Transform={$Rotate:e.$Rotate||0,$Scale:e.$Zoom,$OriginalWidth:m,$OriginalHeight:l};if(e.$Clip&&f.$Move){var B=e.$Clip.$Offset,I=(B.$Top||0)+(B.$Bottom||0),H=(B.$Left||0)+(B.$Right||0);e.$Left=(e.$Left||0)+H;e.$Top=(e.$Top||0)+I;e.$Clip.$Left-=H;e.$Clip.$Right-=H;e.$Clip.$Top-=I;e.$Clip.$Bottom-=I}e.$ZIndex=e.$ZIndex||1;p[z].push(e)}})});q.reverse();a.$Each(q,function(b){a.$Each(b,function(d){var g=d[0],f=d[1],e=g+","+f,b=k;if(f||g)b=a.$CloneNode(k,c);a.$SetStyles(b,w[e]);a.$CssOverflow(b,"hidden");a.$CssPosition(b,"absolute");D.$AddClipElement(b);o[e]=b;a.$ShowElement(b,n)})})}g.$JssorSlideshowRunner$=function(h,l,i,n,p){var d=this,o,f,c,s=0,r=n.$TransitionsOrder,k,g=16;function q(){var a=this,b=0;j.call(a,0,o);a.$OnPositionChange=function(d,a){if(a-b>g){b=a;c&&c.$ShowFrame(a);f&&f.$ShowFrame(a)}};a.$Transition=k}d.$GetTransition=function(f){var c=0,e=n.$Transitions,d=e.length;if(r){if(d>f&&(a.$IsBrowserChrome()||a.$IsBrowserSafari()||a.$IsBrowserFireFox()))d-=d%f;c=s++%d}else c=b.floor(b.random()*d);e[c]&&(e[c].$Index=c);return e[c]};d.$Initialize=function(w,x,n,p,a){k=a;a=K(a,g);var m=p.$Item,j=n.$Item;m["no-image"]=!p.$Image;j["no-image"]=!n.$Image;var q=m,r=j,v=a,e=a.$Brother||K({},g);if(!a.$SlideOut){q=j;r=m}var s=e.$Shift||0;f=new L(h,r,e,b.max(s-e.$Interval,0),l,i);c=new L(h,q,v,b.max(e.$Interval-s,0),l,i);f.$ShowFrame(0);c.$ShowFrame(0);o=b.max(f.$EndTime,c.$EndTime);d.$Index=w};d.$Clear=function(){h.$Clear();f=e;c=e};d.$GetProcessor=function(){var a=e;if(c)a=new q;return a};if(a.$IsBrowserIe9Earlier()||a.$IsBrowserOpera()||p&&a.$GetWebKitVersion<537)g=32;m.call(d);j.call(d,-1e7,1e7)};function n(o,ec){var i=this;function zc(){var a=this;j.call(a,-1e8,2e8);a.$GetCurrentSlideInfo=function(){var c=a.$GetPosition_Display(),d=b.floor(c),f=u(d),e=c-b.floor(c);return{$Index:f,$VirtualIndex:d,$Position:e}};a.$OnPositionChange=function(d,a){var e=b.floor(a);if(e!=a&&a>d)e++;Rb(e,c);i.$TriggerEvent(n.$EVT_POSITION_CHANGE,u(a),u(d),a,d)}}function yc(){var b=this;j.call(b,0,0,{$LoopLength:s});a.$Each(C,function(a){K&1&&a.$SetLoopLength(s);b.$Chain(a);a.$Shift(hb/Zb)})}function xc(){var a=this,b=Qb.$Elmt;j.call(a,-1,2,{$Easing:l.$EaseLinear,$Setter:{$Position:Xb},$LoopLength:s},b,{$Position:1},{$Position:-1});a.$Wrapper=b}function mc(o,m){var a=this,f,g,h,l,b;j.call(a,-1e8,2e8);a.$OnStart=function(){R=c;V=e;i.$TriggerEvent(n.$EVT_SWIPE_START,u(y.$GetPosition()),y.$GetPosition())};a.$OnStop=function(){R=d;l=d;var a=y.$GetCurrentSlideInfo();i.$TriggerEvent(n.$EVT_SWIPE_END,u(y.$GetPosition()),y.$GetPosition());!a.$Position&&Bc(a.$VirtualIndex,p)};a.$OnPositionChange=function(d,c){var a;if(l)a=b;else{a=g;if(h)a=k.$SlideEasing(c/h)*(g-f)+f}y.$GoToPosition(a)};a.$PlayCarousel=function(b,d,c,e){f=b;g=d;h=c;y.$GoToPosition(b);a.$GoToPosition(0);a.$PlayToPosition(c,e)};a.$StandBy=function(d){l=c;b=d;a.$Play(d,e,c)};a.$SetStandByPosition=function(a){b=a};a.$MoveCarouselTo=function(a){y.$GoToPosition(a)};y=new zc;y.$Combine(o);y.$Combine(m)}function nc(){var c=this,b=Wb();a.$CssZIndex(b,0);c.$Elmt=b;c.$AddClipElement=function(c){a.$AppendChild(b,c);a.$ShowElement(b)};c.$Clear=function(){a.$HideElement(b);a.$ClearInnerHtml(b)}}function wc(q,o){var f=this,t,x,K,y,g,z=[],R,r,X,I,P,F,l,v,h,hb;j.call(f,-w,w+1,{$SlideItemAnimator:c});function E(a){x&&x.$Revert();t&&t.$Revert();W(q,a);F=c;t=new N.$Class(q,N,1);x=new N.$Class(q,N);x.$GoToBegin();t.$GoToBegin()}function Z(){t.$Version<N.$Version&&E()}function L(o,q,m){if(!I){I=c;if(g&&m){var e=m.width,b=m.height,l=e,j=b;if(e&&b&&k.$FillMode){if(k.$FillMode&3&&(!(k.$FillMode&4)||e>J||b>H)){var h=d,p=J/H*b/e;if(k.$FillMode&1)h=p>1;else if(k.$FillMode&2)h=p<1;l=h?e*H/b:J;j=h?H:b*J/e}a.$CssWidth(g,l);a.$CssHeight(g,j);a.$CssTop(g,(H-j)/2);a.$CssLeft(g,(J-l)/2)}a.$CssPosition(g,"absolute");i.$TriggerEvent(n.$EVT_LOAD_END,cc)}}a.$HideElement(q);o&&o(f)}function Y(b,c,d,e){if(e==V&&p==o&&S)if(!Ac){var a=u(b);A.$Initialize(a,o,c,f,d);c.$HideContentForSlideshow();ab.$Locate(a,1);ab.$GoToPosition(a);B.$PlayCarousel(b,b,0)}}function cb(b){if(b==V&&p==o){if(!l){var a=e;if(A)if(A.$Index==o)a=A.$GetProcessor();else A.$Clear();Z();l=new uc(o,a,f.$GetCaptionSliderIn(),f.$GetCaptionSliderOut());l.$SetPlayer(h)}!l.$IsPlaying()&&l.$Replay()}}function Q(d,c){if(d==o){if(d!=c)C[c]&&C[c].$ParkOut();h&&h.$Enable();var j=V=a.$GetNow();f.$LoadImage(a.$CreateCallback(e,cb,j))}else{var i=b.abs(o-d),g=w+k.$LazyLoading;(!P||i<=g||s-i<=g)&&f.$LoadImage()}}function fb(){if(p==o&&l){l.$Stop();h&&h.$Quit();h&&h.$Disable();l.$OpenSlideshowPanel()}}function gb(){p==o&&l&&l.$Stop()}function O(b){if(U)a.$CancelEvent(b);else i.$TriggerEvent(n.$EVT_CLICK,o,b)}function M(){h=v.pInstance;l&&l.$SetPlayer(h)}f.$LoadImage=function(d,b){b=b||y;if(z.length&&!I){a.$ShowElement(b);if(!X){X=c;i.$TriggerEvent(n.$EVT_LOAD_START);a.$Each(z,function(b){if(!b.src){b.src=a.$GetAttributeEx(b,"src2");a.$CssDisplay(b,b["display-origin"])}})}a.$LoadImages(z,g,a.$CreateCallback(e,L,d,b))}else L(d,b)};f.$GoForNextSlide=function(){if(A){var b=A.$GetTransition(s);if(b){var f=V=a.$GetNow(),c=o+1*Vb,d=C[u(c)];return d.$LoadImage(a.$CreateCallback(e,Y,c,d,b,f),y)}}bb(p+k.$AutoPlaySteps*Vb)};f.$TryActivate=function(){Q(o,o)};f.$ParkOut=function(){h&&h.$Quit();h&&h.$Disable();f.$UnhideContentForSlideshow();l&&l.$Abort();l=e;E()};f.$StampSlideItemElements=function(a){a=hb+"_"+a};f.$HideContentForSlideshow=function(){a.$HideElement(q)};f.$UnhideContentForSlideshow=function(){a.$ShowElement(q)};f.$EnablePlayer=function(){h&&h.$Enable()};function W(b,f,e){if(b["jssor-slider"]||a.$GetAttribute(b,"u")=="thumb")return;e=e||0;if(!F){if(b.tagName=="IMG"){z.push(b);if(!b.src){P=c;b["display-origin"]=a.$CssDisplay(b);a.$HideElement(b)}}a.$IsBrowserIe9Earlier()&&a.$CssZIndex(b,(a.$CssZIndex(b)||0)+1);if(k.$HWA&&a.$GetWebKitVersion()>0)(!G||a.$GetWebKitVersion()<534||!eb)&&a.$EnableHWA(b)}var h=a.$GetChildren(b);a.$Each(h,function(h){var j=a.$GetAttributeEx(h,"u");if(j=="player"&&!v){v=h;if(v.pInstance)M();else a.$AddEvent(v,"dataavailable",M)}if(j=="caption"){if(!a.$IsBrowserIE()&&!f){var i=a.$CloneNode(h,c);a.$InsertBefore(b,i,h);a.$RemoveChild(b,h);h=i;f=c}}else if(!F&&!e&&!g&&a.$GetAttributeEx(h,"u")=="image"){g=h;if(g){if(g.tagName=="A"){R=g;a.$SetStyles(R,T);r=a.$CloneNode(g,d);a.$AddEvent(r,"click",O);a.$SetStyles(r,T);a.$CssDisplay(r,"block");a.$CssOpacity(r,0);a.$Css(r,"backgroundColor","#000");g=a.$FindFirstChildByTag(g,"IMG")}g.border=0;a.$SetStyles(g,T)}}W(h,f,e+1)})}f.$OnInnerOffsetChange=function(c,b){var a=w-b;Xb(K,a)};f.$GetCaptionSliderIn=function(){return t};f.$GetCaptionSliderOut=function(){return x};f.$Index=o;m.call(f);var D=a.$FindFirstChildByAttribute(q,"thumb");if(D){f.$Thumb=a.$CloneNode(D,c);a.$RemoveAttribute(D,"id");a.$HideElement(D)}a.$ShowElement(q);y=a.$CloneNode(db,c);a.$CssZIndex(y,1e3);a.$AddEvent(q,"click",O);E(c);f.$Image=g;f.$Link=r;f.$Item=q;f.$Wrapper=K=q;a.$AppendChild(K,y);i.$On(203,Q);i.$On(22,gb);i.$On(24,fb)}function uc(g,r,v,u){var b=this,m=0,x=0,o,h,e,f,l,s,w,t,q=C[g];j.call(b,0,0);function y(){a.$ClearChildren(O);dc&&l&&q.$Link&&a.$AppendChild(O,q.$Link);a.$ShowElement(O,l||!q.$Image)}function z(){if(s){s=d;i.$TriggerEvent(n.$EVT_ROLLBACK_END,g,e,m,h,e,f);b.$GoToPosition(h)}b.$Replay()}function B(a){t=a;b.$Stop();b.$Replay()}b.$Replay=function(){var a=b.$GetPosition_Display();if(!I&&!R&&!t&&p==g){if(!a){if(o&&!l){l=c;b.$OpenSlideshowPanel(c);i.$TriggerEvent(n.$EVT_SLIDESHOW_START,g,m,x,o,f)}y()}var d,k=n.$EVT_STATE_CHANGE;if(a!=f)if(a==e)d=f;else if(a==h)d=e;else if(!a)d=h;else if(a>e){s=c;d=e;k=n.$EVT_ROLLBACK_START}else d=b.$GetPlayToPosition();i.$TriggerEvent(k,g,a,m,h,e,f);var j=S&&(!Tb||Z);if(a==f)j&&q.$GoForNextSlide();else(j||a!=e)&&b.$PlayToPosition(d,z)}};b.$Abort=function(){A&&A.$Index==g&&A.$Clear();var a=b.$GetPosition_Display();a<f&&i.$TriggerEvent(n.$EVT_STATE_CHANGE,g,-a-1,m,h,e,f)};b.$OpenSlideshowPanel=function(b){r&&a.$CssOverflow(jb,b&&r.$Transition.$Outside?"":"hidden")};b.$OnInnerOffsetChange=function(b,a){if(l&&a>=o){l=d;y();q.$UnhideContentForSlideshow();A.$Clear();i.$TriggerEvent(n.$EVT_SLIDESHOW_END,g,m,x,o,f)}i.$TriggerEvent(n.$EVT_PROGRESS_CHANGE,g,a,m,h,e,f)};b.$SetPlayer=function(a){if(a&&!w){w=a;a.$On($JssorPlayer$.$EVT_SWITCH,B)}};r&&b.$Chain(r);o=b.$GetPosition_OuterEnd();b.$GetPosition_OuterEnd();b.$Chain(v);h=v.$GetPosition_OuterEnd();e=h+k.$AutoPlayInterval;u.$Shift(e);b.$Combine(u);f=b.$GetPosition_OuterEnd()}function Xb(c,g){var f=x>0?x:ib,d=Ab*g*(f&1),e=Bb*g*(f>>1&1);if(!a.$IsBrowserChrome()){d=b.round(d);e=b.round(e)}if(a.$IsBrowserIE()&&a.$GetBrowserVersion()>=10&&a.$GetBrowserVersion()<11)c.style.msTransform="translate("+d+"px, "+e+"px)";else if(a.$IsBrowserChrome()&&a.$GetBrowserVersion()>=30&&a.$GetBrowserVersion()<34){c.style.WebkitTransition="transform 0s";c.style.WebkitTransform="translate3d("+d+"px, "+e+"px, 0px) perspective(2000px)"}else{a.$CssLeft(c,d);a.$CssTop(c,e)}}function sc(c){U=0;var b=a.$GetEventSrcElement(c).tagName;!L&&b!="INPUT"&&b!="TEXTAREA"&&qc()&&rc(c)}function rc(b){qb=R;I=c;zb=d;V=e;a.$AddEvent(f,ob,ac);a.$GetNow();Ib=B.$GetPlayToPosition();B.$Stop();if(!qb)x=0;if(G){var h=b.touches[0];ub=h.clientX;vb=h.clientY}else{var g=a.$GetMousePosition(b);ub=g.x;vb=g.y;a.$CancelEvent(b)}E=0;cb=0;gb=0;D=y.$GetPosition();i.$TriggerEvent(n.$EVT_DRAG_START,u(D),D,b)}function ac(e){if(I&&(!a.$IsBrowserIe9Earlier()||e.button)){var f;if(G){var m=e.touches;if(m&&m.length>0)f=new h(m[0].clientX,m[0].clientY)}else f=a.$GetMousePosition(e);if(f){var k=f.x-ub,l=f.y-vb;if(b.floor(D)!=D)x=x||ib&L;if((k||l)&&!x){if(L==3)if(b.abs(l)>b.abs(k))x=2;else x=1;else x=L;if(G&&x==1&&b.abs(l)-b.abs(k)>3)zb=c}if(x){var d=l,j=Bb;if(x==1){d=k;j=Ab}if(!(K&1)){if(d>0){var g=j*p,i=d-g;if(i>0)d=g+b.sqrt(i)*5}if(d<0){var g=j*(s-w-p),i=-d-g;if(i>0)d=-g-b.sqrt(i)*5}}if(E-cb<-2)gb=1;else if(E-cb>2)gb=0;cb=E;E=d;sb=D-E/j/(nb||1);if(E&&x&&!zb){a.$CancelEvent(e);if(!R)B.$StandBy(sb);else B.$SetStandByPosition(sb)}else a.$IsBrowserIe9Earlier()&&a.$CancelEvent(e)}}}else Eb(e)}function Eb(h){oc();if(I){I=d;a.$GetNow();a.$RemoveEvent(f,ob,ac);U=E;U&&a.$CancelEvent(h);B.$Stop();var e=y.$GetPosition();i.$TriggerEvent(n.$EVT_DRAG_END,u(e),e,u(D),D,h);var c=b.floor(D);if(b.abs(E)>=k.$MinDragOffsetToSlide){c=b.floor(e);c+=gb}if(!(K&1))c=b.min(s-w,b.max(c,0));var g=b.abs(c-e);g=1-b.pow(1-g,5);if(!U&&qb)B.$Continue(Ib);else if(e==c){tb.$EnablePlayer();tb.$TryActivate()}else B.$PlayCarousel(e,c,g*Sb)}}function lc(a){C[p];p=u(a);tb=C[p];Rb(a);return p}function Bc(a,b){x=0;lc(a);i.$TriggerEvent(n.$EVT_PARK,u(a),b)}function Rb(b,c){xb=b;a.$Each(Q,function(a){a.$SetCurrentIndex(u(b),b,c)})}function qc(){var b=n.$DragRegistry||0,a=P;if(G)a&1&&(a&=1);n.$DragRegistry|=a;return L=a&~b}function oc(){if(L){n.$DragRegistry&=~P;L=0}}function Wb(){var b=a.$CreateDivElement();a.$SetStyles(b,T);a.$CssPosition(b,"absolute");return b}function u(a){return(a%s+s)%s}function ic(a,c){if(c)if(!K){a=b.min(b.max(a+xb,0),s-w);c=d}else if(K&2){a=u(a+xb);c=d}bb(a,k.$SlideDuration,c)}function yb(){a.$Each(Q,function(a){a.$Show(a.$Options.$ChanceToShow>Z)})}function gc(b){b=a.$GetEvent(b);var c=b.target?b.target:b.srcElement,d=b.relatedTarget?b.relatedTarget:b.toElement;if(!a.$IsChild(o,c)||a.$IsChild(o,d))return;Z=1;yb();C[p].$TryActivate()}function fc(){Z=0;yb()}function hc(){T={$Width:J,$Height:H,$Top:0,$Left:0};a.$Each(X,function(b){a.$SetStyles(b,T);a.$CssPosition(b,"absolute");a.$CssOverflow(b,"hidden");a.$HideElement(b)});a.$SetStyles(db,T)}function lb(b,a){bb(b,a,c)}function bb(h,g,l){if(Ob&&(!I||k.$NaviQuitDrag)){R=c;I=d;B.$Stop();if(a.$IsUndefined(g))g=Sb;var f=Fb.$GetPosition_Display(),e=h;if(l){e=f+h;if(h>0)e=b.ceil(e);else e=b.floor(e)}if(!(K&1)){e=u(e);e=b.max(0,b.min(e,s-w))}var j=(e-f)%s;e=f+j;var i=f==e?0:g*b.abs(j);i=b.min(i,g*w*1.5);B.$PlayCarousel(f,e,i||1)}}i.$PlayTo=bb;i.$GoTo=function(a){bb(a,1)};i.$Next=function(){lb(1)};i.$Prev=function(){lb(-1)};i.$Pause=function(){S=d};i.$Play=function(){if(!S){S=c;C[p]&&C[p].$TryActivate()}};i.$SetSlideshowTransitions=function(a){k.$SlideshowOptions.$Transitions=a};i.$SetCaptionTransitions=function(b){N.$CaptionTransitions=b;N.$Version=a.$GetNow()};i.$SlidesCount=function(){return X.length};i.$CurrentIndex=function(){return p};i.$IsAutoPlaying=function(){return S};i.$IsDragging=function(){return I};i.$IsSliding=function(){return R};i.$IsMouseOver=function(){return!Z};i.$LastDragSucceded=function(){return U};i.$GetOriginalWidth=function(){return a.$CssWidth(v||o)};i.$GetOriginalHeight=function(){return a.$CssHeight(v||o)};i.$GetScaleWidth=function(){return a.$CssWidth(o)};i.$GetScaleHeight=function(){return a.$CssHeight(o)};i.$SetScaleWidth=function(c){if(!v){var b=a.$CreateDivElement(f);a.$CssCssText(b,a.$CssCssText(o));a.$SetClassName(b,a.$GetClassName(o));a.$CssPosition(b,"relative");a.$CssTop(b,0);a.$CssLeft(b,0);a.$CssOverflow(b,"visible");v=a.$CreateDivElement(f);a.$CssPosition(v,"absolute");a.$CssTop(v,0);a.$CssLeft(v,0);a.$CssWidth(v,a.$CssWidth(o));a.$CssHeight(v,a.$CssHeight(o));a.$SetStyleTransformOrigin(v,"0 0");a.$AppendChild(v,b);var g=a.$GetChildren(o);a.$AppendChild(o,v);a.$Css(o,"backgroundImage","");var e={navigator:Y&&Y.$Scale==d,arrowleft:M&&M.$Scale==d,arrowright:M&&M.$Scale==d,thumbnavigator:F&&F.$Scale==d,thumbwrapper:F&&F.$Scale==d};a.$Each(g,function(c){a.$AppendChild(e[a.$GetAttributeEx(c,"u")]?o:b,c)});a.$ShowElement(b);a.$ShowElement(v)}nb=c/a.$CssWidth(v);a.$SetStyleScale(v,nb);a.$CssWidth(o,c);a.$CssHeight(o,nb*a.$CssHeight(v));a.$Each(Q,function(a){a.$Relocate()})};i.$GetVirtualIndex=function(a){var d=b.ceil(u(hb/Zb)),c=u(a-p+d);if(c>w){if(a-p>s/2)a-=s;else if(a-p<=-s/2)a+=s}else a=p+c-d;return a};m.call(this);i.$Elmt=o=a.$GetElement(o);var k=a.$Extend({$FillMode:0,$LazyLoading:1,$StartIndex:0,$AutoPlay:d,$Loop:1,$HWA:c,$NaviQuitDrag:c,$AutoPlaySteps:1,$AutoPlayInterval:3e3,$PauseOnHover:1,$SlideDuration:500,$SlideEasing:l.$EaseOutQuad,$MinDragOffsetToSlide:20,$SlideSpacing:0,$DisplayPieces:1,$ParkingPosition:0,$UISearchMode:1,$PlayOrientation:1,$DragOrientation:1},ec),ib=k.$PlayOrientation&3,Vb=(k.$PlayOrientation&4)/-4||1,fb=k.$SlideshowOptions,N=a.$Extend({$Class:t,$PlayInMode:1,$PlayOutMode:1},k.$CaptionSliderOptions),Y=k.$BulletNavigatorOptions,M=k.$ArrowNavigatorOptions,F=k.$ThumbnailNavigatorOptions,W=k.$UISearchMode,v,z=a.$FindFirstChildByAttribute(o,"slides",e,W),db=a.$FindFirstChildByAttribute(o,"loading",e,W)||a.$CreateDivElement(f),Kb=a.$FindFirstChildByAttribute(o,"navigator",e,W),bc=a.$FindFirstChildByAttribute(o,"arrowleft",e,W),Yb=a.$FindFirstChildByAttribute(o,"arrowright",e,W),Hb=a.$FindFirstChildByAttribute(o,"thumbnavigator",e,W),kc=a.$CssWidth(z),jc=a.$CssHeight(z),T,X=[],tc=a.$GetChildren(z);a.$Each(tc,function(b){b.tagName=="DIV"&&!a.$GetAttributeEx(b,"u")&&X.push(b)});var p=-1,xb,tb,s=X.length,J=k.$SlideWidth||kc,H=k.$SlideHeight||jc,Ub=k.$SlideSpacing,Ab=J+Ub,Bb=H+Ub,Zb=ib&1?Ab:Bb,w=b.min(k.$DisplayPieces,s),jb,x,L,zb,G,Q=[],Nb,Pb,Mb,dc,Ac,S,Tb=k.$PauseOnHover,Sb=k.$SlideDuration,rb,eb,hb,Ob=w<s,K=Ob?k.$Loop:0,P,U,Z=1,R,I,V,ub=0,vb=0,E,cb,gb,Fb,y,ab,B,Qb=new nc,nb;S=k.$AutoPlay;i.$Options=ec;hc();o["jssor-slider"]=c;a.$CssZIndex(z,a.$CssZIndex(z)||0);a.$CssPosition(z,"absolute");jb=a.$CloneNode(z);a.$InsertBefore(a.$GetParentNode(z),jb,z);if(fb){dc=fb.$ShowLink;rb=fb.$Class;eb=w==1&&s>1&&rb&&(!a.$IsBrowserIE()||a.$GetBrowserVersion()>=8)}hb=eb||w>=s||!(K&1)?0:k.$ParkingPosition;P=(w>1||hb?ib:-1)&k.$DragOrientation;var wb=z,C=[],A,O,Db="mousedown",ob="mousemove",Gb="mouseup",mb,D,qb,Ib,sb;if(g.navigator.msPointerEnabled){Db="MSPointerDown";ob="MSPointerMove";Gb="MSPointerUp";mb="MSPointerCancel";if(P){var Cb="none";if(P==1)Cb="pan-y";else if(P==2)Cb="pan-x";a.$SetAttribute(wb.style,"-ms-touch-action",Cb)}}else if("ontouchstart"in g||"createTouch"in f){G=c;Db="touchstart";ob="touchmove";Gb="touchend";mb="touchcancel"}ab=new xc;if(eb)A=new rb(Qb,J,H,fb,G);a.$AppendChild(jb,ab.$Wrapper);a.$CssOverflow(z,"hidden");O=Wb();a.$Css(O,"backgroundColor","#000");a.$CssOpacity(O,0);a.$InsertBefore(wb,O,wb.firstChild);for(var pb=0;pb<X.length;pb++){var vc=X[pb],cc=new wc(vc,pb);C.push(cc)}a.$HideElement(db);Fb=new yc;B=new mc(Fb,ab);if(P){a.$AddEvent(z,Db,sc);a.$AddEvent(f,Gb,Eb);mb&&a.$AddEvent(f,mb,Eb)}Tb&=G?2:1;if(Kb&&Y){Nb=new Y.$Class(Kb,Y);Q.push(Nb)}if(M&&bc&&Yb){Pb=new M.$Class(bc,Yb,M);Q.push(Pb)}if(Hb&&F){F.$StartIndex=k.$StartIndex;Mb=new F.$Class(Hb,F);Q.push(Mb)}a.$Each(Q,function(a){a.$Reset(s,C,db);a.$On(q.$NAVIGATIONREQUEST,ic)});i.$SetScaleWidth(i.$GetOriginalWidth());a.$AddEvent(o,"mouseout",gc);a.$AddEvent(o,"mouseover",fc);yb();k.$ArrowKeyNavigation&&a.$AddEvent(f,"keydown",function(a){if(a.keyCode==r.$LEFT)lb(-1);else a.keyCode==r.$RIGHT&&lb(1)});var kb=k.$StartIndex;if(!(K&1))kb=b.max(0,b.min(kb,s-w));B.$PlayCarousel(kb,kb,0)}n.$EVT_CLICK=21;n.$EVT_DRAG_START=22;n.$EVT_DRAG_END=23;n.$EVT_SWIPE_START=24;n.$EVT_SWIPE_END=25;n.$EVT_LOAD_START=26;n.$EVT_LOAD_END=27;n.$EVT_POSITION_CHANGE=202;n.$EVT_PARK=203;n.$EVT_SLIDESHOW_START=206;n.$EVT_SLIDESHOW_END=207;n.$EVT_PROGRESS_CHANGE=208;n.$EVT_STATE_CHANGE=209;n.$EVT_ROLLBACK_START=210;n.$EVT_ROLLBACK_END=211;g.$JssorSlider$=s=n};var q={$NAVIGATIONREQUEST:1,$INDEXCHANGE:2,$RESET:3};g.$JssorBulletNavigator$=function(f,D){var h=this;m.call(h);f=a.$GetElement(f);var t,u,s,r,l=0,g,n,k,y,z,j,i,p,o,C=[],A=[];function x(a){a!=-1&&A[a].$Activate(a==l)}function v(a){h.$TriggerEvent(q.$NAVIGATIONREQUEST,a*n)}h.$Elmt=f;h.$GetCurrentIndex=function(){return r};h.$SetCurrentIndex=function(a){if(a!=r){var d=l,c=b.floor(a/n);l=c;r=a;x(d);x(c)}};h.$Show=function(b){a.$ShowElement(f,b)};var B;h.$Relocate=function(){if(!B||g.$Scale==d){g.$AutoCenter&1&&a.$CssLeft(f,(a.$CssWidth(a.$GetParentNode(f))-u)/2);g.$AutoCenter&2&&a.$CssTop(f,(a.$CssHeight(a.$GetParentNode(f))-s)/2);B=c}};var w;h.$Reset=function(D){if(!w){t=b.ceil(D/n);l=0;var q=p+y,r=o+z,m=b.ceil(t/k)-1;u=p+q*(!j?m:k-1);s=o+r*(j?m:k-1);a.$CssWidth(f,u);a.$CssHeight(f,s);for(var d=0;d<t;d++){var B=a.$CreateSpanElement();a.$SetInnerText(B,d+1);var h=a.$BuildElement(i,"NumberTemplate",B,c);a.$CssPosition(h,"absolute");var x=d%(m+1);a.$CssLeft(h,!j?q*x:d%k*q);a.$CssTop(h,j?r*x:b.floor(d/(m+1))*r);a.$AppendChild(f,h);C[d]=h;g.$ActionMode&1&&a.$AddEvent(h,"click",a.$CreateCallback(e,v,d));g.$ActionMode&2&&a.$AddEvent(h,"mouseover",a.$CreateCallback(e,v,d));A[d]=a.$Buttonize(h)}w=c}};h.$Options=g=a.$Extend({$SpacingX:0,$SpacingY:0,$Orientation:1,$ActionMode:1},D);i=a.$FindFirstChildByAttribute(f,"prototype");p=a.$CssWidth(i);o=a.$CssHeight(i);a.$RemoveChild(f,i);n=g.$Steps||1;k=g.$Lanes||1;y=g.$SpacingX;z=g.$SpacingY;j=g.$Orientation-1};g.$JssorArrowNavigator$=function(b,g,s){var f=this;m.call(f);var i,h,j,p=a.$GetParentNode(b),o=a.$CssWidth(b),l=a.$CssHeight(b);function k(a){f.$TriggerEvent(q.$NAVIGATIONREQUEST,a,c)}f.$GetCurrentIndex=function(){return i};f.$SetCurrentIndex=function(b,a,c){if(c)i=a;else i=b};f.$Show=function(c){a.$ShowElement(b,c);a.$ShowElement(g,c)};var r;f.$Relocate=function(){if(!r||h.$Scale==d){var f=a.$CssWidth(p),e=a.$CssHeight(p);if(h.$AutoCenter&1){a.$CssLeft(b,(f-o)/2);a.$CssLeft(g,(f-o)/2)}if(h.$AutoCenter&2){a.$CssTop(b,(e-l)/2);a.$CssTop(g,(e-l)/2)}r=c}};var n;f.$Reset=function(d){i=0;if(!n){a.$AddEvent(b,"click",a.$CreateCallback(e,k,-j));a.$AddEvent(g,"click",a.$CreateCallback(e,k,j));a.$Buttonize(b);a.$Buttonize(g);n=c}};f.$Options=h=a.$Extend({$Steps:1},s);j=h.$Steps};g.$JssorThumbnailNavigator$=function(i,A){var h=this,x,l,e,u=[],y,w,f,n,o,t,r,k,p,g,j;m.call(h);i=a.$GetElement(i);function z(n,d){var g=this,b,m,k;function o(){m.$Activate(l==d)}function i(){if(!p.$LastDragSucceded()){var a=f-d%f,b=p.$GetVirtualIndex((d+a)/f-1),c=b*f+f-a;h.$TriggerEvent(q.$NAVIGATIONREQUEST,c)}}g.$Index=d;g.$Highlight=o;k=n.$Thumb||n.$Image||a.$CreateDivElement();g.$Wrapper=b=a.$BuildElement(j,"ThumbnailTemplate",k,c);m=a.$Buttonize(b);e.$ActionMode&1&&a.$AddEvent(b,"click",i);e.$ActionMode&2&&a.$AddEvent(b,"mouseover",i)}h.$GetCurrentIndex=function(){return l};h.$SetCurrentIndex=function(c,d,e){var a=l;l=c;a!=-1&&u[a].$Highlight();u[c].$Highlight();!e&&p.$PlayTo(p.$GetVirtualIndex(b.floor(d/f)))};h.$Show=function(b){a.$ShowElement(i,b)};h.$Relocate=a.$EmptyFunction;var v;h.$Reset=function(F,D){if(!v){x=F;b.ceil(x/f);l=-1;k=b.min(k,D.length);var h=e.$Orientation&1,q=t+(t+n)*(f-1)*(1-h),m=r+(r+o)*(f-1)*h,C=q+(q+n)*(k-1)*h,A=m+(m+o)*(k-1)*(1-h);a.$CssPosition(g,"absolute");a.$CssOverflow(g,"hidden");e.$AutoCenter&1&&a.$CssLeft(g,(y-C)/2);e.$AutoCenter&2&&a.$CssTop(g,(w-A)/2);a.$CssWidth(g,C);a.$CssHeight(g,A);var j=[];a.$Each(D,function(l,e){var i=new z(l,e),d=i.$Wrapper,c=b.floor(e/f),k=e%f;a.$CssLeft(d,(t+n)*k*(1-h));a.$CssTop(d,(r+o)*k*h);if(!j[c]){j[c]=a.$CreateDivElement();a.$AppendChild(g,j[c])}a.$AppendChild(j[c],d);u.push(i)});var E=a.$Extend({$AutoPlay:d,$NaviQuitDrag:d,$SlideWidth:q,$SlideHeight:m,$SlideSpacing:n*h+o*(1-h),$MinDragOffsetToSlide:12,$SlideDuration:200,$PauseOnHover:1,$PlayOrientation:e.$Orientation,$DragOrientation:e.$DisableDrag?0:e.$Orientation},e);p=new s(i,E);v=c}};h.$Options=e=a.$Extend({$SpacingX:3,$SpacingY:3,$DisplayPieces:1,$Orientation:1,$AutoCenter:3,$ActionMode:1},A);y=a.$CssWidth(i);w=a.$CssHeight(i);g=a.$FindFirstChildByAttribute(i,"slides");j=a.$FindFirstChildByAttribute(g,"prototype");t=a.$CssWidth(j);r=a.$CssHeight(j);a.$RemoveChild(g,j);f=e.$Lanes||1;n=e.$SpacingX;o=e.$SpacingY;k=e.$DisplayPieces};function t(){j.call(this,0,0);this.$Revert=a.$EmptyFunction}g.$JssorCaptionSlider$=function(q,k,g){var d=this,h,o=g?k.$PlayInMode:k.$PlayOutMode,f=k.$CaptionTransitions,p={$Transition:"t",$Delay:"d",$Duration:"du",$ScaleHorizontal:"x",$ScaleVertical:"y",$Rotate:"r",$Zoom:"z",$Opacity:"f",$BeginTime:"b"},e={$Default:function(b,a){if(!isNaN(a.$Value))b=a.$Value;else b*=a.$Percent;return b},$Opacity:function(b,a){return this.$Default(b-1,a)}};e.$Zoom=e.$Opacity;j.call(d,0,0);function m(r,l){var k=[],i,j=[],c=[];function h(c,d){var b={};a.$Each(p,function(g,h){var e=a.$GetAttributeEx(c,g+(d||""));if(e){var f={};if(g=="t")f.$Value=e;else if(e.indexOf("%")+1)f.$Percent=a.$ParseFloat(e)/100;else f.$Value=a.$ParseFloat(e);b[h]=f}});return b}function n(){return f[b.floor(b.random()*f.length)]}function d(g){var h;if(g=="*")h=n();else if(g){var e=f[a.$ParseInt(g)]||f[g];if(a.$IsArray(e)){if(g!=i){i=g;c[g]=0;j[g]=e[b.floor(b.random()*e.length)]}else c[g]++;e=j[g];if(a.$IsArray(e)){e=e.length&&e[c[g]%e.length];if(a.$IsArray(e))e=e[b.floor(b.random()*e.length)]}}h=e;if(a.$IsString(h))h=d(h)}return h}var q=a.$GetChildren(r);a.$Each(q,function(b){var c=[];c.$Elmt=b;var f=a.$GetAttributeEx(b,"u")=="caption";a.$Each(g?[0,3]:[2],function(k,n){if(f){var j,g;if(k!=2||!a.$GetAttributeEx(b,"t3")){g=h(b,k);if(k==2&&!g.$Transition){g.$Delay=g.$Delay||{$Value:0};g=a.$Extend(h(b,0),g)}}if(g&&g.$Transition){j=d(g.$Transition.$Value);if(j){var i=a.$Extend({$Delay:0,$ScaleHorizontal:1,$ScaleVertical:1},j);a.$Each(g,function(c,a){var b=(e[a]||e.$Default).apply(e,[i[a],g[a]]);if(!isNaN(b))i[a]=b});if(!n)if(g.$BeginTime)i.$BeginTime=g.$BeginTime.$Value||0;else if(o&2)i.$BeginTime=0}}c.push(i)}if(l%2&&!n)c.$Children=m(b,l+1)});k.push(c)});return k}function n(E,d,F){var h={$Easing:d.$Easing,$Round:d.$Round,$During:d.$During,$Reverse:g&&!F,$Optimize:c},k=E,y=a.$GetParentNode(E),o=a.$CssWidth(k),n=a.$CssHeight(k),u=a.$CssWidth(y),t=a.$CssHeight(y),f={},l={},m=d.$ScaleClip||1;if(d.$Opacity)f.$Opacity=2-d.$Opacity;h.$OriginalWidth=o;h.$OriginalHeight=n;if(d.$Zoom||d.$Rotate){f.$Zoom=d.$Zoom?d.$Zoom-1:1;if(a.$IsBrowserIe9Earlier()||a.$IsBrowserOpera())f.$Zoom=b.min(f.$Zoom,2);l.$Zoom=1;var s=d.$Rotate||0;if(s==c)s=1;f.$Rotate=s*360;l.$Rotate=0}else if(d.$Clip){var z={$Top:0,$Right:o,$Bottom:n,$Left:0},D=a.$Extend({},z),e=D.$Offset={},C=d.$Clip&4,v=d.$Clip&8,A=d.$Clip&1,x=d.$Clip&2;if(C&&v){e.$Top=n/2*m;e.$Bottom=-e.$Top}else if(C)e.$Bottom=-n*m;else if(v)e.$Top=n*m;if(A&&x){e.$Left=o/2*m;e.$Right=-e.$Left}else if(A)e.$Right=-o*m;else if(x)e.$Left=o*m;h.$Move=d.$Move;f.$Clip=D;l.$Clip=z}var p=d.$FlyDirection,q=0,r=0,w=d.$ScaleHorizontal,B=d.$ScaleVertical;if(i.$IsToLeft(p))q-=u*w;else if(i.$IsToRight(p))q+=u*w;if(i.$IsToTop(p))r-=t*B;else if(i.$IsToBottom(p))r+=t*B;if(q||r||h.$Move){f.$Left=q+a.$CssLeft(k);f.$Top=r+a.$CssTop(k)}var G=d.$Duration;l=a.$Extend(l,a.$GetStyles(k,f));h.$Setter=a.$GetStyleSetterEx();return new j(d.$Delay,G,h,k,l,f)}function l(b,c){a.$Each(c,function(c){var f,i=c.$Elmt,e=c[0],j=c[1];if(e){f=n(i,e);b=f.$Locate(a.$IsUndefined(e.$BeginTime)?b:e.$BeginTime,1)}b=l(b,c.$Children);if(j){var g=n(i,j,1);g.$Locate(b,1);d.$Combine(g);h.$Combine(g)}f&&d.$Combine(f)});return b}d.$Revert=function(){d.$GoToPosition(d.$GetPosition_OuterEnd()*(g||0));h.$GoToBegin()};h=new j(0,0);l(0,o?m(q,1):[])}})(window,document,Math,null,true,false);window.EnterpriseView = countlyView.extend({
    initialize:function () {},
	beforeRender: function() {
		if(!this.template){
			var self = this;
			return $.when($.get(countlyGlobal["path"]+'/enterpriseinfo/templates/info.html', function(src){
				self.template = Handlebars.compile(src);
			})).then(function () {});
		}
    },
    pageScript:function () {
        var titles = {
            "drill":"Game changer for data analytics",
            "funnels":"Track completion rates step by step",
            "retention":"See how engaging your application is",
            "revenue":"Calculate your customer's lifetime value",
            "user-profiles":"Understand what users have been doing in your application",
            "scalability": "Tens of millions of users? No problem",
            "support":"Enterprise support and SLA",
            "raw-data": "Your data, your rules"
        }

        $("#enterprise-sections").find(".app-container").on("click", function() {
            var section = $(this).data("section");

            $(".enterprise-content").hide();
            $(".enterprise-content." + section).show();

            $("#enterprise-sections").find(".app-container").removeClass("active");
            $(this).addClass("active");

            $(".widget-header .title").text(titles[section] || "");
        });
    },
    renderCommon:function () {
        $(this.el).html(this.template(this.templateData));
        this.pageScript();
    }
});

//register views
app.enterpriseView = new EnterpriseView();

app.route( "/enterprise", "enterprise", function () {
	this.renderWhenReady(this.enterpriseView);
});

$( document ).ready(function() {
	var menu = '<a class="item" id="enterprise-menu" href="#/enterprise">'+
		'<div class="logo logo-icon fa fa-rocket"></div>'+
        '<div class="text" data-localize="">Enterprise</div>'+
    '</a>';
	$('#sidebar-menu').append(menu);
	
	if(typeof countlyGlobalEE != "undefined" && countlyGlobalEE["discount"]){
		var msg = {title:"5000+ users reached", message: "<a href='https://count.ly/enterprise-edition/' target='_blank'>To get 20% off Enterprise edition contact us with code:<br/><strong>"+countlyGlobalEE["discount"]+"</strong></a>", info:"Thank you for being with us", sticky:true, closeOnClick:false};
		CountlyHelpers.notify(msg);
    }
});