(function (countlyMapHelper, $, undefined) {

    // Private Properties
    var _chart,
        _dataTable,
        _chartElementId = "geo-chart",
        _chartOptions = {
            displayMode:'region',
            colorAxis:{minValue:0, colors:['#D7F1D8', '#6BB96E']},
            resolution:'countries',
            toolTip:{textStyle:{color:'#FF0000'}, showColorCode:false},
            legend:"none",
            backgroundColor:"transparent",
            datalessRegionColor:"#FFF"
        },
        _mapData = [],
        _countryMap = {};

    $.get('localization/countries/en/country.json', function (data) {
        _countryMap = data;
    });

    countlyMapHelper.drawGeoChart = function (options, locationData) {
        if (options) {
            if (options.chartElementId) {
                _chartElementId = options.chartElementId;
            }

            if (options.height) {
                _chartOptions.height = options.height;

                //preserve the aspect ratio of the chart if height is given
                _chartOptions.width = (options.height * 556 / 347);
            }
        }

        _mapData = locationData;

        if (google.visualization) {
            draw();
        } else {
            google.load('visualization', '1', {'packages':['geochart'], callback:draw});
        }
    };

    //Private Methods
    function draw() {
        var chartData = {cols:[], rows:[]};

        _chart = new google.visualization.GeoChart(document.getElementById(_chartElementId));

        chartData.cols = [
            {id:'country', label:jQuery.i18n.map["countries.table.country"], type:'string'},
            {id:'total', label:jQuery.i18n.map["common.total"], type:'number'}
        ];

        chartData.rows = _.map(_mapData, function (value, key, list) {
            value.country = _countryMap[value.country] || "Unknown";

            if (value.country == "European Union" || value.country == "Unknown") {
                return {c:[
                    {v:""},
                    {v:value.value}
                ]};
            }
            return {c:[
                {v:value.country},
                {v:value.value}
            ]};
        });

        _dataTable = new google.visualization.DataTable(chartData);

        _chartOptions['region'] = "world";
        _chartOptions['resolution'] = 'countries';
        _chartOptions["displayMode"] = "region";

        _chart.draw(_dataTable, _chartOptions);
    }

}(window.countlyMapHelper = window.countlyMapHelper || {}, jQuery));;(function(countlyEvent, $, undefined) {

    //Private Properties
    var _activeEventDb = {},
        _activeEvents = {},
        _activeEvent = "",
        _activeSegmentation = "",
        _activeSegmentations = [],
        _activeSegmentationValues = [],
        _activeSegmentationObj = {},
        _activeAppKey = 0,
        _initialized = false,
        _period = null;

    //Public Methods
    countlyEvent.initialize = function(forceReload) {
        if (!forceReload && _initialized && _period == countlyCommon.getPeriodForAjax() && _activeAppKey == countlyCommon.ACTIVE_APP_KEY) {
            return countlyEvent.refresh();
        }

        _period = countlyCommon.getPeriodForAjax();

        if (!countlyCommon.DEBUG) {
            _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
            _initialized = true;

            return $.when(
                $.ajax({
                    type: "GET",
                    url: countlyCommon.API_PARTS.data.r,
                    data: {
                        "api_key": countlyGlobal.member.api_key,
                        "app_id" : countlyCommon.ACTIVE_APP_ID,
                        "method" : "get_events",
                        "period":_period
                    },
                    dataType: "jsonp",
                    success: function(json) {
                        _activeEvents = json;
                        if (!_activeEvent && countlyEvent.getEvents()[0]) {
                            _activeEvent = countlyEvent.getEvents()[0].key;
                        }
                    }
                }),
                $.ajax({
                    type: "GET",
                    url: countlyCommon.API_PARTS.data.r,
                    data: {
                        "api_key": countlyGlobal.member.api_key,
                        "app_id" : countlyCommon.ACTIVE_APP_ID,
                        "method" : "events",
                        "event": _activeEvent,
                        "segmentation": _activeSegmentation,
                        "period":_period
                    },
                    dataType: "jsonp",
                    success: function(json) {
                        _activeEventDb = json;
                        setMeta();
                    }
                })
            ).then(function(){
                return true;
            });
        } else {
            _activeEventDb = {"2012":{}};
            return true;
        }
    };

    countlyEvent.refresh = function() {
        if (!countlyCommon.DEBUG) {
            return $.when(
                $.ajax({
                    type: "GET",
                    url: countlyCommon.API_PARTS.data.r,
                    data: {
                        "api_key": countlyGlobal.member.api_key,
                        "app_id" : countlyCommon.ACTIVE_APP_ID,
                        "method" : "get_events"
                    },
                    dataType: "jsonp",
                    success: function(json) {
                        _activeEvents = json;
                        if (!_activeEvent && countlyEvent.getEvents()[0]) {
                            _activeEvent = countlyEvent.getEvents()[0].key;
                        }
                    }
                }),
                $.ajax({
                    type: "GET",
                    url: countlyCommon.API_PARTS.data.r,
                    data: {
                        "api_key": countlyGlobal.member.api_key,
                        "app_id" : countlyCommon.ACTIVE_APP_ID,
                        "method" : "events",
                        "action" : "refresh",
                        "event": _activeEvent,
                        "segmentation": _activeSegmentation
                    },
                    dataType: "jsonp",
                    success: function(json) {
                        countlyCommon.extendDbObj(_activeEventDb, json);
                        extendMeta();
                    }
                })
            ).then(function(){
                return true;
            });
        } else {
            _activeEventDb = {"2012":{}};
            return true;
        }
    };

    countlyEvent.reset = function () {
        _activeEventDb = {};
        _activeEvents = {};
        _activeEvent = "";
        _activeSegmentation = "";
        _activeSegmentations = [];
        _activeSegmentationValues = [];
        _activeSegmentationObj = {};
        _activeAppKey = 0;
        _initialized = false;
    };

    countlyEvent.refreshEvents = function () {
        if (!countlyCommon.DEBUG) {
            $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.r,
                data:{
                    "api_key": countlyGlobal.member.api_key,
                    "app_id": countlyCommon.ACTIVE_APP_ID,
                    "method":"get_events"
                },
                dataType:"jsonp",
                success:function (json) {
                    _activeEvents = json;
                    if (!_activeEvent && countlyEvent.getEvents()[0]) {
                        _activeEvent = countlyEvent.getEvents()[0].key;
                    }
                }
            });
        } else {
            _activeEvents = {};
            return true;
        }
    };

    countlyEvent.setActiveEvent = function (activeEvent, callback) {
        _activeEventDb = {};
        _activeSegmentation = "";
        _activeSegmentations = [];
        _activeSegmentationValues = [];
        _activeSegmentationObj = {};
        _activeEvent = activeEvent;

        $.when(countlyEvent.initialize(true)).then(callback);
    };

    countlyEvent.setActiveSegmentation = function (activeSegmentation, callback) {
        _activeEventDb = {};
        _activeSegmentation = activeSegmentation;

        $.when(countlyEvent.initialize(true)).then(callback);
    };

    countlyEvent.getActiveSegmentation = function () {
        return (_activeSegmentation) ? _activeSegmentation : jQuery.i18n.map["events.no-segmentation"];
    };

    countlyEvent.isSegmentedView = function() {
        return (_activeSegmentation) ? true : false;
    };

    countlyEvent.getEventData = function () {

        var eventData = {},
            eventMap = (_activeEvents) ? ((_activeEvents.map) ? _activeEvents.map : {}) : {},
            countString = (eventMap[_activeEvent] && eventMap[_activeEvent].count) ? eventMap[_activeEvent].count : jQuery.i18n.map["events.table.count"],
            sumString = (eventMap[_activeEvent] && eventMap[_activeEvent].sum) ? eventMap[_activeEvent].sum : jQuery.i18n.map["events.table.sum"];

        if (_activeSegmentation) {
            eventData = {chartData:{}, chartDP:{dp:[], ticks:[]}};

            var tmpEventData = countlyCommon.extractTwoLevelData(_activeEventDb, _activeSegmentationValues, countlyEvent.clearEventsObject, [
                {
                    name:"curr_segment",
                    func:function (rangeArr, dataObj) {
                        return rangeArr.replace(/:/g, ".").replace(/\[CLY\]/g,"");
                    }
                },
                { "name":"c" },
                { "name":"s" }
            ]);

            eventData.chartData = tmpEventData.chartData;

            var segments = _.pluck(eventData.chartData, "curr_segment").slice(0,15),
                segmentsCount = _.pluck(eventData.chartData, 'c'),
                segmentsSum = _.without(_.pluck(eventData.chartData, 's'), false, null, "", undefined, NaN),
                chartDP = [
                    {data:[], color: countlyCommon.GRAPH_COLORS[0]}
                ];

            if (_.reduce(segmentsSum, function(memo, num) { return memo + num;  }, 0) == 0) {
                segmentsSum = [];
            }

            if (segmentsSum.length) {
                chartDP[chartDP.length] = {data:[], color: countlyCommon.GRAPH_COLORS[1]};
                chartDP[1]["data"][0] = [-1, null];
                chartDP[1]["data"][segments.length + 1] = [segments.length, null];
            }

            chartDP[0]["data"][0] = [-1, null];
            chartDP[0]["data"][segments.length + 1] = [segments.length, null];

            eventData.chartDP.ticks.push([-1, ""]);
            eventData.chartDP.ticks.push([segments.length, ""]);

            for (var i = 0; i < segments.length; i++) {
                chartDP[0]["data"][i + 1] = [i, segmentsCount[i]];
                if (segmentsSum.length) {
                    chartDP[1]["data"][i + 1] = [i, segmentsSum[i]];
                }
                eventData.chartDP.ticks.push([i, segments[i]]);
            }

            eventData.chartDP.dp = chartDP;

            eventData["eventName"] = countlyEvent.getEventLongName(_activeEvent);
            eventData["dataLevel"] = 2;
            eventData["tableColumns"] = [jQuery.i18n.map["events.table.segmentation"], countString];
            if (segmentsSum.length) {
                eventData["tableColumns"][eventData["tableColumns"].length] = sumString;
            } else {
                _.each(eventData.chartData, function (element, index, list) {
                    list[index] = _.pick(element, "curr_segment", "c");
                });
            }
        } else {
            var chartData = [
                    { data:[], label:countString, color: countlyCommon.GRAPH_COLORS[0] },
                    { data:[], label:sumString, color: countlyCommon.GRAPH_COLORS[1] }
                ],
                dataProps = [
                    { name:"c" },
                    { name:"s" }
                ];

            eventData = countlyCommon.extractChartData(_activeEventDb, countlyEvent.clearEventsObject, chartData, dataProps);

            eventData["eventName"] = countlyEvent.getEventLongName(_activeEvent);
            eventData["dataLevel"] = 1;
            eventData["tableColumns"] = [jQuery.i18n.map["common.date"], countString];

            var cleanSumCol = _.without(_.pluck(eventData.chartData, 's'), false, null, "", undefined, NaN);

            if (_.reduce(cleanSumCol, function(memo, num) { return memo + num;  }, 0) != 0) {
                eventData["tableColumns"][eventData["tableColumns"].length] = sumString;
            } else {
                eventData.chartDP[1] = false;
                eventData.chartDP = _.compact(eventData.chartDP);
                _.each(eventData.chartData, function (element, index, list) {
                    list[index] = _.pick(element, "date", "c");
                });
            }
        }

        var countArr = _.pluck(eventData.chartData, "c");

        if (countArr.length) {
            eventData.totalCount = _.reduce(countArr, function(memo, num){ return memo + num; }, 0);
        }

        var sumArr = _.pluck(eventData.chartData, "s");

        if (sumArr.length) {
            eventData.totalSum = _.reduce(sumArr, function(memo, num){ return memo + num; }, 0);
        }

        return eventData;
    };

    countlyEvent.getEvents = function() {
        var events = (_activeEvents)? ((_activeEvents.list)? _activeEvents.list : []) : [],
            eventMap = (_activeEvents)? ((_activeEvents.map)? _activeEvents.map : {}) : {},
            eventOrder = (_activeEvents)? ((_activeEvents.order)? _activeEvents.order : []) : [],
            eventsWithOrder = [],
            eventsWithoutOrder = [];

        for (var i = 0; i < events.length; i++) {
            var arrayToUse = eventsWithoutOrder;

            if (eventOrder.indexOf(events[i]) !== -1) {
                arrayToUse = eventsWithOrder;
            }

            if (eventMap[events[i]] && eventMap[events[i]]["name"]) {
                arrayToUse.push({
                    "key": events[i],
                    "name": eventMap[events[i]]["name"],
                    "count": eventMap[events[i]]["count"],
                    "sum": eventMap[events[i]]["sum"],
                    "is_active": (_activeEvent == events[i])
                });
            } else {
                arrayToUse.push({
                    "key": events[i],
                    "name": events[i],
                    "count": "",
                    "sum": "",
                    "is_active": (_activeEvent == events[i])
                });
            }
        }

        eventsWithOrder = _.sortBy(eventsWithOrder, function(event){ return eventOrder.indexOf(event.key); });
        eventsWithoutOrder = _.sortBy(eventsWithoutOrder, function(event){ return event.key; });

        return eventsWithOrder.concat(eventsWithoutOrder);
    };

    countlyEvent.getEventsWithSegmentations = function() {
        var eventSegmentations = (_activeEvents)? ((_activeEvents.segments)? _activeEvents.segments : []) : [],
            eventMap = (_activeEvents)? ((_activeEvents.map)? _activeEvents.map : {}) : {},
            eventNames = [];

        for (var event in eventSegmentations) {

            if (eventMap[event] && eventMap[event]["name"]) {
                eventNames.push({
                    "key": event,
                    "name": eventMap[event]["name"]
                });
            } else {
                eventNames.push({
                    "key": event,
                    "name": event
                });
            }

            for (var i = 0; i < eventSegmentations[event].length; i++) {
                if (eventMap[event] && eventMap[event]["name"]) {
                    eventNames.push({
                        "key": event,
                        "name": eventMap[event]["name"] + " / " + eventSegmentations[event][i]
                    });
                } else {
                    eventNames.push({
                        "key": event,
                        "name": event + " / " + eventSegmentations[event][i]
                    });
                }
            }
        }

        return eventNames;
    };

    countlyEvent.getEventMap = function() {
        var events = countlyEvent.getEvents(),
            eventMap = {};

        for (var i = 0; i < events.length; i++) {
            eventMap[events[i].key] = events[i];
        }

        return eventMap;
    };

    countlyEvent.getEventLongName = function (eventKey) {
        var eventMap = (_activeEvents) ? ((_activeEvents.map) ? _activeEvents.map : {}) : {};

        if (eventMap[eventKey] && eventMap[eventKey]["name"]) {
            return eventMap[eventKey]["name"];
        } else {
            return eventKey;
        }
    };

    countlyEvent.getEventSegmentations = function() {
        return _activeSegmentations;
    };

    countlyEvent.clearEventsObject = function (obj) {
        if (obj) {
            if (!obj["c"]) obj["c"] = 0;
            if (!obj["s"]) obj["s"] = 0;
        }
        else {
            obj = {"c":0, "s":0};
        }

        return obj;
    };

    countlyEvent.getEventSummary = function() {
        //Update the current period object in case selected date is changed
        _periodObj = countlyCommon.periodObj;

        var dataArr = {},
            tmp_x,
            tmp_y,
            currentTotal = 0,
            previousTotal = 0,
            currentSum = 0,
            previousSum = 0;

        if (_periodObj.isSpecialPeriod) {
            for (var i = 0; i < (_periodObj.currentPeriodArr.length); i++) {
                tmp_x = countlyCommon.getDescendantProp(_activeEventDb, _periodObj.currentPeriodArr[i]);
                tmp_y = countlyCommon.getDescendantProp(_activeEventDb, _periodObj.previousPeriodArr[i]);
                tmp_x = countlyEvent.clearEventsObject(tmp_x);
                tmp_y = countlyEvent.clearEventsObject(tmp_y);

                if (_activeSegmentation) {
                    var tmpCurrCount = _.reduce(_.map(_.filter(tmp_x, function(num, key){ return _activeSegmentationValues.indexOf(key) != -1; }), function(num, key){ return num.c || 0; }), function(memo, num){ return memo + num; }, 0),
                        tmpCurrSum = _.reduce(_.map(_.filter(tmp_x, function(num, key){ return _activeSegmentationValues.indexOf(key) != -1; }), function(num, key){ return num.s || 0; }), function(memo, num){ return memo + num; }, 0),
                        tmpPrevCount = _.reduce(_.map(_.filter(tmp_y, function(num, key){ return _activeSegmentationValues.indexOf(key) != -1; }), function(num, key){ return num.c || 0; }), function(memo, num){ return memo + num; }, 0),
                        tmpPrevSum = _.reduce(_.map(_.filter(tmp_y, function(num, key){ return _activeSegmentationValues.indexOf(key) != -1; }), function(num, key){ return num.s || 0; }), function(memo, num){ return memo + num; }, 0);

                    tmp_x = {
                        "c": tmpCurrCount,
                        "s": tmpCurrSum
                    };

                    tmp_y = {
                        "c": tmpPrevCount,
                        "s": tmpPrevSum
                    };
                }

                currentTotal += tmp_x["c"];
                previousTotal += tmp_y["c"];
                currentSum += tmp_x["s"];
                previousSum += tmp_y["s"];
            }
        } else {
            tmp_x = countlyCommon.getDescendantProp(_activeEventDb, _periodObj.activePeriod);
            tmp_y = countlyCommon.getDescendantProp(_activeEventDb, _periodObj.previousPeriod);
            tmp_x = countlyEvent.clearEventsObject(tmp_x);
            tmp_y = countlyEvent.clearEventsObject(tmp_y);

            if (_activeSegmentation) {
                var tmpCurrCount = _.reduce(_.map(_.filter(tmp_x, function(num, key){ return _activeSegmentationValues.indexOf(key) != -1; }), function(num, key){ return num.c || 0; }), function(memo, num){ return memo + num; }, 0),
                    tmpCurrSum = _.reduce(_.map(_.filter(tmp_x, function(num, key){ return _activeSegmentationValues.indexOf(key) != -1; }), function(num, key){ return num.s || 0; }), function(memo, num){ return memo + num; }, 0),
                    tmpPrevCount = _.reduce(_.map(_.filter(tmp_y, function(num, key){ return _activeSegmentationValues.indexOf(key) != -1; }), function(num, key){ return num.c || 0; }), function(memo, num){ return memo + num; }, 0),
                    tmpPrevSum = _.reduce(_.map(_.filter(tmp_y, function(num, key){ return _activeSegmentationValues.indexOf(key) != -1; }), function(num, key){ return num.s || 0; }), function(memo, num){ return memo + num; }, 0);

                tmp_x = {
                    "c": tmpCurrCount,
                    "s": tmpCurrSum
                };

                tmp_y = {
                    "c": tmpPrevCount,
                    "s": tmpPrevSum
                };
            }

            currentTotal = tmp_x["c"];
            previousTotal = tmp_y["c"];
            currentSum = tmp_x["s"];
            previousSum = tmp_y["s"];
        }

        var	changeTotal = countlyCommon.getPercentChange(previousTotal, currentTotal),
            changeSum = countlyCommon.getPercentChange(previousSum, currentSum);

        dataArr =
        {
            usage:{
                "event-total":{
                    "total":currentTotal,
                    "change":changeTotal.percent,
                    "trend":changeTotal.trend
                },
                "event-sum":{
                    "total":currentSum,
                    "change":changeSum.percent,
                    "trend":changeSum.trend
                }
            }
        };

        var eventMap = (_activeEvents)? ((_activeEvents.map)? _activeEvents.map : {}) : {},
            countString = (eventMap[_activeEvent] && eventMap[_activeEvent].count)? eventMap[_activeEvent].count.toUpperCase() : jQuery.i18n.map["events.count"],
            sumString = (eventMap[_activeEvent] && eventMap[_activeEvent].sum)? eventMap[_activeEvent].sum.toUpperCase() : jQuery.i18n.map["events.sum"];

        var bigNumbers = {
            "class": "one-column",
            "items": [
                {
                    "title": countString,
                    "total": dataArr.usage["event-total"].total,
                    "trend": dataArr.usage["event-total"].trend
                }
            ]
        };

        if (currentSum != 0) {
            bigNumbers["class"] = "two-column";
            bigNumbers.items[bigNumbers.items.length] = {
                "title": sumString,
                "total": dataArr.usage["event-sum"].total,
                "trend": dataArr.usage["event-sum"].trend
            }
        }

        return bigNumbers;
    };

    countlyEvent.getMultiEventData = function(eventKeysArr, callback) {
        $.ajax({
            type: "GET",
            url: countlyCommon.API_PARTS.data.r,
            data: {
                "api_key": countlyGlobal.member.api_key,
                "app_id" : countlyCommon.ACTIVE_APP_ID,
                "method" : "events",
                "events": JSON.stringify(eventKeysArr)
            },
            dataType: "jsonp",
            success: function(json) {
                callback(extractDataForGraphAndChart(json));
            }
        });


        function extractDataForGraphAndChart(dataFromDb) {
            var eventData = {},
                eventMap = (_activeEvents) ? ((_activeEvents.map) ? _activeEvents.map : {}) : {},
                countString = (eventMap[_activeEvent] && eventMap[_activeEvent].count) ? eventMap[_activeEvent].count : jQuery.i18n.map["events.table.count"],
                sumString = (eventMap[_activeEvent] && eventMap[_activeEvent].sum) ? eventMap[_activeEvent].sum : jQuery.i18n.map["events.table.sum"];

            var chartData = [
                    { data:[], label:countString, color: countlyCommon.GRAPH_COLORS[0] },
                    { data:[], label:sumString, color: countlyCommon.GRAPH_COLORS[1] }
                ],
                dataProps = [
                    { name:"c" },
                    { name:"s" }
                ];

            eventData = countlyCommon.extractChartData(dataFromDb, countlyEvent.clearEventsObject, chartData, dataProps);

            eventData["eventName"] = countlyEvent.getEventLongName(_activeEvent);
            eventData["dataLevel"] = 1;
            eventData["tableColumns"] = [jQuery.i18n.map["common.date"], countString];

            var cleanSumCol = _.without(_.pluck(eventData.chartData, 's'), false, null, "", undefined, NaN);

            if (_.reduce(cleanSumCol, function(memo, num) { return memo + num;  }, 0) != 0) {
                eventData["tableColumns"][eventData["tableColumns"].length] = sumString;
            } else {
                eventData.chartDP[1] = false;
                eventData.chartDP = _.compact(eventData.chartDP);
                _.each(eventData.chartData, function (element, index, list) {
                    list[index] = _.pick(element, "date", "c");
                });
            }

            var countArr = _.pluck(eventData.chartData, "c");

            if (countArr.length) {
                eventData.totalCount = _.reduce(countArr, function(memo, num){ return memo + num; }, 0);
            }

            var sumArr = _.pluck(eventData.chartData, "s");

            if (sumArr.length) {
                eventData.totalSum = _.reduce(sumArr, function(memo, num){ return memo + num; }, 0);
            }

            return eventData;
        }
    };

    function setMeta() {
        _activeSegmentationObj = _activeEventDb["meta"] || {};
        _activeSegmentations = _activeSegmentationObj["segments"] || [];
        if (_activeSegmentations) {
            _activeSegmentations.sort();
        }
        _activeSegmentationValues = (_activeSegmentationObj[_activeSegmentation])? _activeSegmentationObj[_activeSegmentation]: [];
    }

    function extendMeta() {
        for (var metaObj in _activeEventDb["meta"]) {
            _activeSegmentationObj[metaObj] = countlyCommon.union(_activeSegmentationObj[metaObj], _activeEventDb["meta"][metaObj]);
        }

        _activeSegmentations = _activeSegmentationObj["segments"];
        if (_activeSegmentations) {
            _activeSegmentations.sort();
        }
        _activeSegmentationValues = (_activeSegmentationObj[_activeSegmentation])? _activeSegmentationObj[_activeSegmentation]: [];
    }

}(window.countlyEvent = window.countlyEvent || {}, jQuery));;(function (countlySession, $, undefined) {

    //Private Properties
    var _periodObj = {},
        _sessionDb = {},
        _durations = [];

    //Public Methods
    countlySession.initialize = function () {
        _sessionDb = countlyUser.getDbObj();
        setMeta();
    };

    countlySession.refresh = function (newJSON) {
        countlyCommon.extendDbObj(_sessionDb, newJSON);
        extendMeta();
    };

    countlySession.reset = function () {
        _sessionDb = {};
        setMeta();
    };

    countlySession.getSessionData = function () {

        //Update the current period object in case selected date is changed
        _periodObj = countlyCommon.periodObj;

        var dataArr = {},
            tmp_x,
            tmp_y,
            currentTotal = 0,
            previousTotal = 0,
            currentPayingTotal = 0,
            previousPayingTotal = 0,
            currentMsgEnabledTotal = 0,
            previousMsgEnabledTotal = 0,
            currentNew = 0,
            previousNew = 0,
            currentUnique = 0,
            previousUnique = 0,
            currentDuration = 0,
            previousDuration = 0,
            currentEvents = 0,
            previousEvents = 0,
            isEstimate = false;

        if (_periodObj.isSpecialPeriod) {

            isEstimate = true;

            for (var i = 0; i < (_periodObj.uniquePeriodArr.length); i++) {
                tmp_x = countlyCommon.getDescendantProp(_sessionDb, _periodObj.uniquePeriodArr[i]);
                tmp_x = countlySession.clearSessionObject(tmp_x);
                currentUnique += tmp_x["u"];
                currentPayingTotal += tmp_x["p"];
                currentMsgEnabledTotal += tmp_x["m"];
            }

            var tmpUniqObj,
                tmpCurrentUniq = 0,
                tmpCurrentPaying = 0,
                tmpCurrentMsgEnabled = 0;

            for (var i = 0; i < (_periodObj.uniquePeriodCheckArr.length); i++) {
                tmpUniqObj = countlyCommon.getDescendantProp(_sessionDb, _periodObj.uniquePeriodCheckArr[i]);
                tmpUniqObj = countlySession.clearSessionObject(tmpUniqObj);
                tmpCurrentUniq += tmpUniqObj["u"];
                tmpCurrentPaying += tmpUniqObj["p"];
                tmpCurrentMsgEnabled += tmpUniqObj["m"];
            }

            //console.log(currentPayingTotal + " " + tmpCurrentPaying)

            if (currentUnique > tmpCurrentUniq) {
                currentUnique = tmpCurrentUniq;
            }

            if (currentPayingTotal > tmpCurrentPaying) {
                currentPayingTotal = tmpCurrentPaying;
            }

            if (currentMsgEnabledTotal > tmpCurrentMsgEnabled) {
                currentMsgEnabledTotal = tmpCurrentMsgEnabled;
            }

            for (var i = 0; i < (_periodObj.previousUniquePeriodArr.length); i++) {
                tmp_y = countlyCommon.getDescendantProp(_sessionDb, _periodObj.previousUniquePeriodArr[i]);
                tmp_y = countlySession.clearSessionObject(tmp_y);
                previousUnique += tmp_y["u"];
                previousPayingTotal += tmp_y["p"];
                previousMsgEnabledTotal += tmp_y["m"];
            }

            var tmpUniqObj2,
                tmpPreviousUniq = 0,
                tmpPreviousPaying = 0,
                tmpPreviousMsgEnabled = 0;

            for (var i = 0; i < (_periodObj.previousUniquePeriodCheckArr.length); i++) {
                tmpUniqObj2 = countlyCommon.getDescendantProp(_sessionDb, _periodObj.previousUniquePeriodCheckArr[i]);
                tmpUniqObj2 = countlySession.clearSessionObject(tmpUniqObj2);
                tmpPreviousUniq += tmpUniqObj2["u"];
                tmpPreviousPaying += tmpUniqObj2["p"];
                tmpPreviousMsgEnabled += tmpUniqObj2["m"];
            }

            if (previousUnique > tmpPreviousUniq) {
                previousUnique = tmpPreviousUniq;
            }

            if (previousPayingTotal > tmpPreviousPaying) {
                previousPayingTotal = tmpPreviousPaying;
            }

            if (currentMsgEnabledTotal > tmpCurrentMsgEnabled) {
                currentMsgEnabledTotal = tmpCurrentMsgEnabled;
            }

            for (var i = 0; i < (_periodObj.currentPeriodArr.length); i++) {
                tmp_x = countlyCommon.getDescendantProp(_sessionDb, _periodObj.currentPeriodArr[i]);
                tmp_y = countlyCommon.getDescendantProp(_sessionDb, _periodObj.previousPeriodArr[i]);
                tmp_x = countlySession.clearSessionObject(tmp_x);
                tmp_y = countlySession.clearSessionObject(tmp_y);

                currentTotal += tmp_x["t"];
                previousTotal += tmp_y["t"];
                currentNew += tmp_x["n"];
                previousNew += tmp_y["n"];
                currentDuration += tmp_x["d"];
                previousDuration += tmp_y["d"];
                currentEvents += tmp_x["e"];
                previousEvents += tmp_y["e"];
            }
        } else {
            tmp_x = countlyCommon.getDescendantProp(_sessionDb, _periodObj.activePeriod);
            tmp_y = countlyCommon.getDescendantProp(_sessionDb, _periodObj.previousPeriod);
            tmp_x = countlySession.clearSessionObject(tmp_x);
            tmp_y = countlySession.clearSessionObject(tmp_y);

            currentTotal = tmp_x["t"];
            previousTotal = tmp_y["t"];
            currentNew = tmp_x["n"];
            previousNew = tmp_y["n"];
            currentUnique = tmp_x["u"];
            previousUnique = tmp_y["u"];
            currentDuration = tmp_x["d"];
            previousDuration = tmp_y["d"];
            currentEvents = tmp_x["e"];
            previousEvents = tmp_y["e"];
            currentPayingTotal = tmp_x["p"];
            previousPayingTotal = tmp_y["p"];
            currentMsgEnabledTotal = tmp_x["m"];
            previousMsgEnabledTotal = tmp_y["m"];
        }

        var sessionDuration = (currentDuration / 60),
            previousSessionDuration = (previousDuration / 60),
            previousDurationPerUser = (previousTotal == 0) ? 0 : previousSessionDuration / previousTotal,
            durationPerUser = (currentTotal == 0) ? 0 : (sessionDuration / currentTotal),
            previousEventsPerUser = (previousUnique == 0) ? 0 : previousEvents / previousUnique,
            eventsPerUser = (currentUnique == 0) ? 0 : (currentEvents / currentUnique),
            changeTotal = countlyCommon.getPercentChange(previousTotal, currentTotal),
            changeDuration = countlyCommon.getPercentChange(previousDuration, currentDuration),
            changeDurationPerUser = countlyCommon.getPercentChange(previousDurationPerUser, durationPerUser),
            changeNew = countlyCommon.getPercentChange(previousNew, currentNew),
            changeUnique = countlyCommon.getPercentChange(previousUnique, currentUnique),
            changeReturning = countlyCommon.getPercentChange((previousUnique - previousNew), (currentNew - currentNew)),
            changeEvents = countlyCommon.getPercentChange(previousEvents, currentEvents),
            changeEventsPerUser = countlyCommon.getPercentChange(previousEventsPerUser, eventsPerUser),
            changePaying = countlyCommon.getPercentChange(previousPayingTotal, currentPayingTotal),
            changeMsgEnabled = countlyCommon.getPercentChange(previousMsgEnabledTotal, currentMsgEnabledTotal),
            sparkLines = calcSparklineData();

        /*var timeSpentString = (sessionDuration.toFixed(1)) + " " + jQuery.i18n.map["common.minute.abrv"];

        if (sessionDuration >= 142560) {
            timeSpentString = (sessionDuration / 525600).toFixed(1) + " " + jQuery.i18n.map["common.year.abrv"];
        } else if (sessionDuration >= 1440) {
            timeSpentString = (sessionDuration / 1440).toFixed(1) + " " + jQuery.i18n.map["common.day.abrv"];
        } else if (sessionDuration >= 60) {
            timeSpentString = (sessionDuration / 60).toFixed(1) + " " + jQuery.i18n.map["common.hour.abrv"];
        }*/
        
        var timeSpentString = countlyCommon.timeString(sessionDuration);

        dataArr =
        {
            usage:{
                "total-sessions":{
                    "total":currentTotal,
                    "change":changeTotal.percent,
                    "trend":changeTotal.trend,
                    "sparkline":sparkLines.total
                },
                "paying-users":{
                    "total":currentPayingTotal,
                    "prev-total":previousPayingTotal,
                    "change":changePaying.percent,
                    "trend":changePaying.trend,
                    "isEstimate":isEstimate
                },
                "total-users":{
                    "total":currentUnique,
                    "prev-total":previousUnique,
                    "change":changeUnique.percent,
                    "trend":changeUnique.trend,
                    "sparkline":sparkLines.unique,
                    "isEstimate":isEstimate
                },
                "messaging-users":{
                    "total":currentMsgEnabledTotal,
                    "prev-total":previousMsgEnabledTotal,
                    "change":changeMsgEnabled.percent,
                    "trend":changeMsgEnabled.trend,
                    "sparkline":sparkLines.msg,
                    "isEstimate":isEstimate
                },
                "new-users":{
                    "total":currentNew,
                    "change":changeNew.percent,
                    "trend":changeNew.trend,
                    "sparkline":sparkLines.nev
                },
                "returning-users":{
                    "total":(currentUnique - currentNew),
                    "change":changeReturning.percent,
                    "trend":changeReturning.trend,
                    "sparkline":sparkLines.returning
                },
                "total-duration":{
                    "total":timeSpentString,
                    "change":changeDuration.percent,
                    "trend":changeDuration.trend,
                    "sparkline":sparkLines["total-time"]
                },
                "avg-duration-per-session":{
                    "total":countlyCommon.timeString(durationPerUser),
                    "change":changeDurationPerUser.percent,
                    "trend":changeDurationPerUser.trend,
                    "sparkline":sparkLines["avg-time"]
                },
                "events":{
                    "total":currentEvents,
                    "change":changeEvents.percent,
                    "trend":changeEvents.trend,
                    "sparkline":sparkLines["events"]
                },
                "avg-events":{
                    "total":eventsPerUser.toFixed(1),
                    "change":changeEventsPerUser.percent,
                    "trend":changeEventsPerUser.trend,
                    "sparkline":sparkLines["avg-events"]
                }
            }
        };

        return dataArr;
    };

    countlySession.getDurationData = function () {
        var chartData = {chartData:{}, chartDP:{dp:[], ticks:[]}};

        chartData.chartData = countlyCommon.extractRangeData(_sessionDb, "ds", _durations, countlySession.explainDurationRange);

        var durations = _.pluck(chartData.chartData, "ds"),
            durationTotals = _.pluck(chartData.chartData, "t"),
            chartDP = [
                {data:[]}
            ];

        chartDP[0]["data"][0] = [-1, null];
        chartDP[0]["data"][durations.length + 1] = [durations.length, null];

        chartData.chartDP.ticks.push([-1, ""]);
        chartData.chartDP.ticks.push([durations.length, ""]);

        for (var i = 0; i < durations.length; i++) {
            chartDP[0]["data"][i + 1] = [i, durationTotals[i]];
            chartData.chartDP.ticks.push([i, durations[i]]);
        }

        chartData.chartDP.dp = chartDP;

        for (var i = 0; i < chartData.chartData.length; i++) {
            chartData.chartData[i]["percent"] = "<div class='percent-bar' style='width:" + (2 * chartData.chartData[i]["percent"]) + "px;'></div>" + chartData.chartData[i]["percent"] + "%";
        }

        return chartData;
    };

    countlySession.getSessionDP = function () {

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.table.total-sessions"] },
                { data:[], label:jQuery.i18n.map["common.table.new-sessions"] },
                { data:[], label:jQuery.i18n.map["common.table.unique-sessions"] }
            ],
            dataProps = [
                { name:"t" },
                { name:"n" },
                { name:"u" }
            ];

        return countlyCommon.extractChartData(_sessionDb, countlySession.clearSessionObject, chartData, dataProps);
    };

    countlySession.getSessionDPTotal = function () {

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.table.total-sessions"], color:'#DDDDDD', mode:"ghost" },
                { data:[], label:jQuery.i18n.map["common.table.total-sessions"], color:'#333933' }
            ],
            dataProps = [
                {
                    name:"pt",
                    func:function (dataObj) {
                        return dataObj["t"]
                    },
                    period:"previous"
                },
                { name:"t" }
            ];

        return countlyCommon.extractChartData(_sessionDb, countlySession.clearSessionObject, chartData, dataProps);
    };

    countlySession.getUserDP = function () {

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.table.total-users"] },
                { data:[], label:jQuery.i18n.map["common.table.new-users"] },
                { data:[], label:jQuery.i18n.map["common.table.returning-users"] }
            ],
            dataProps = [
                { name:"u" },
                { name:"n" },
                {
                    name:"returning",
                    func:function (dataObj) {
                        return dataObj["u"] - dataObj["n"];
                    }
                }
            ];

        return countlyCommon.extractChartData(_sessionDb, countlySession.clearSessionObject, chartData, dataProps);
    };

    countlySession.getUserDPActive = function () {

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.table.total-users"], color:'#DDDDDD', mode:"ghost" },
                { data:[], label:jQuery.i18n.map["common.table.total-users"], color:'#333933' }
            ],
            dataProps = [
                {
                    name:"pt",
                    func:function (dataObj) {
                        return dataObj["u"]
                    },
                    period:"previous"
                },
                {
                    name:"t",
                    func:function (dataObj) {
                        return dataObj["u"]
                    }
                }
            ];

        return countlyCommon.extractChartData(_sessionDb, countlySession.clearSessionObject, chartData, dataProps);
    };

    countlySession.getUserDPNew = function () {

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.table.new-users"], color:'#DDDDDD', mode:"ghost"},
                { data:[], label:jQuery.i18n.map["common.table.new-users"], color:'#333933' }
            ],
            dataProps = [
                {
                    name:"pn",
                    func:function (dataObj) {
                        return dataObj["n"]
                    },
                    period:"previous"
                },
                { name:"n" }
            ];

        return countlyCommon.extractChartData(_sessionDb, countlySession.clearSessionObject, chartData, dataProps);
    };

    countlySession.getMsgUserDPActive = function () {

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.table.total-users"], color: countlyCommon.GRAPH_COLORS[0]},
                { data:[], label:jQuery.i18n.map["common.table.messaging-users"], color:countlyCommon.GRAPH_COLORS[1] }
            ],
            dataProps = [
                {
                    name:"u"
                },
                {
                    name:"m"
                }
            ];

        return countlyCommon.extractChartData(_sessionDb, countlySession.clearSessionObject, chartData, dataProps);
    };

    countlySession.getDurationDP = function () {

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.graph.time-spent"], color:'#DDDDDD', mode:"ghost"},
                { data:[], label:jQuery.i18n.map["common.graph.time-spent"], color:'#333933' }
            ],
            dataProps = [
                {
                    name:"previous_t",
                    func:function (dataObj) {
                        return ((dataObj["d"] / 60).toFixed(1));
                    },
                    period:"previous"
                },
                {
                    name:"t",
                    func:function (dataObj) {
                        return ((dataObj["d"] / 60).toFixed(1));
                    }
                }
            ];

        return countlyCommon.extractChartData(_sessionDb, countlySession.clearSessionObject, chartData, dataProps);
    };

    countlySession.getDurationDPAvg = function () {

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.graph.average-time"], color:'#DDDDDD', mode:"ghost"},
                { data:[], label:jQuery.i18n.map["common.graph.average-time"], color:'#333933' }
            ],
            dataProps = [
                {
                    name:"previous_average",
                    func:function (dataObj) {
                        return ((dataObj["t"] == 0) ? 0 : ((dataObj["d"] / dataObj["t"]) / 60).toFixed(1));
                    },
                    period:"previous"
                },
                {
                    name:"average",
                    func:function (dataObj) {
                        return ((dataObj["t"] == 0) ? 0 : ((dataObj["d"] / dataObj["t"]) / 60).toFixed(1));
                    }
                }
            ];

        return countlyCommon.extractChartData(_sessionDb, countlySession.clearSessionObject, chartData, dataProps);
    };

    countlySession.getEventsDP = function () {

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.graph.reqs-received"], color:'#DDDDDD', mode:"ghost"},
                { data:[], label:jQuery.i18n.map["common.graph.reqs-received"], color:'#333933' }
            ],
            dataProps = [
                {
                    name:"pe",
                    func:function (dataObj) {
                        return dataObj["e"]
                    },
                    period:"previous"
                },
                {
                    name:"e"
                }
            ];

        return countlyCommon.extractChartData(_sessionDb, countlySession.clearSessionObject, chartData, dataProps);
    };

    countlySession.getEventsDPAvg = function () {

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.graph.avg-reqs-received"], color:'#DDDDDD', mode:"ghost"},
                { data:[], label:jQuery.i18n.map["common.graph.avg-reqs-received"], color:'#333933' }
            ],
            dataProps = [
                {
                    name:"previous_average",
                    func:function (dataObj) {
                        return ((dataObj["u"] == 0) ? 0 : ((dataObj["e"] / dataObj["u"]).toFixed(1)));
                    },
                    period:"previous"
                },
                {
                    name:"average",
                    func:function (dataObj) {
                        return ((dataObj["u"] == 0) ? 0 : ((dataObj["e"] / dataObj["u"]).toFixed(1)));
                    }
                }
            ];

        return countlyCommon.extractChartData(_sessionDb, countlySession.clearSessionObject, chartData, dataProps);
    };

    countlySession.clearSessionObject = function (obj) {
        if (obj) {
            if (!obj["t"]) obj["t"] = 0;
            if (!obj["n"]) obj["n"] = 0;
            if (!obj["u"]) obj["u"] = 0;
            if (!obj["d"]) obj["d"] = 0;
            if (!obj["e"]) obj["e"] = 0;
            if (!obj["p"]) obj["p"] = 0;
            if (!obj["m"]) obj["m"] = 0;
        }
        else {
            obj = {"t":0, "n":0, "u":0, "d":0, "e":0, "p":0, "m":0};
        }

        return obj;
    };

    countlySession.explainDurationRange = function (index) {
        var sec = jQuery.i18n.map["common.seconds"],
            min = jQuery.i18n.map["common.minutes"],
            hr = jQuery.i18n.map["common.hour"];

        var durationRange = [
            "0-10 " + sec,
            "11-30 " + sec,
            "31-60 " + sec,
            "1-3 " + min,
            "3-10 " + min,
            "10-30 " + min,
            "30-60 " + min,
            "> 1 " + hr
        ];

        return durationRange[index];
    };

    countlySession.getDurationIndex = function (duration) {
        var sec = jQuery.i18n.map["common.seconds"],
            min = jQuery.i18n.map["common.minutes"],
            hr = jQuery.i18n.map["common.hour"];

        var durationRange = [
            "0-10 " + sec,
            "11-30 " + sec,
            "31-60 " + sec,
            "1-3 " + min,
            "3-10 " + min,
            "10-30 " + min,
            "30-60 " + min,
            "> 1 " + hr
        ];

        return durationRange.indexOf(duration);
    };

    countlySession.getTopUserBars = function () {

        var barData = [],
            sum = 0,
            maxItems = 3,
            totalPercent = 0;

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.table.total-users"] }
            ],
            dataProps = [
                {
                    name:"t",
                    func:function (dataObj) {
                        return dataObj["u"]
                    }
                }
            ];

        var totalUserData = countlyCommon.extractChartData(_sessionDb, countlySession.clearSessionObject, chartData, dataProps),
            topUsers = _.sortBy(_.reject(totalUserData.chartData, function (obj) {
                return obj["t"] == 0;
            }), function (obj) {
                return -obj["t"];
            });

        if (topUsers.length < 3) {
            maxItems = topUsers.length;
        }

        for (var i = 0; i < maxItems; i++) {
            sum += topUsers[i]["t"];
        }

        for (var i = 0; i < maxItems; i++) {
            var percent = Math.floor((topUsers[i]["t"] / sum) * 100);
            totalPercent += percent;

            if (i == (maxItems - 1)) {
                percent += 100 - totalPercent;
            }

            barData[i] = { "name":topUsers[i]["date"], "percent":percent };
        }

        return barData;
    };

    countlySession.getSessionDb = function () {
        return _sessionDb;
    };

    //Private Methods
    function calcSparklineData() {

        var sparkLines = {"total":[], "nev":[], "unique":[], "returning":[], "total-time":[], "avg-time":[], "events":[], "avg-events":[], "msg":[]};

        if (!_periodObj.isSpecialPeriod) {
            for (var i = _periodObj.periodMin; i < (_periodObj.periodMax + 1); i++) {
                var tmp_x = countlyCommon.getDescendantProp(_sessionDb, _periodObj.activePeriod + "." + i);
                tmp_x = countlySession.clearSessionObject(tmp_x);

                sparkLines["total"][sparkLines["total"].length] = tmp_x["t"];
                sparkLines["nev"][sparkLines["nev"].length] = tmp_x["n"];
                sparkLines["unique"][sparkLines["unique"].length] = tmp_x["u"];
                sparkLines["returning"][sparkLines["returning"].length] = (tmp_x["t"] - tmp_x["n"]);
                sparkLines["total-time"][sparkLines["total-time"].length] = tmp_x["d"];
                sparkLines["avg-time"][sparkLines["avg-time"].length] = (tmp_x["t"] == 0) ? 0 : (tmp_x["d"] / tmp_x["t"]);
                sparkLines["events"][sparkLines["events"].length] = tmp_x["e"];
                sparkLines["avg-events"][sparkLines["avg-events"].length] = (tmp_x["u"] == 0) ? 0 : (tmp_x["e"] / tmp_x["u"]);
                sparkLines["msg"][sparkLines["msg"].length] = tmp_x["m"];
            }
        } else {
            for (var i = 0; i < (_periodObj.currentPeriodArr.length); i++) {
                var tmp_x = countlyCommon.getDescendantProp(_sessionDb, _periodObj.currentPeriodArr[i]);
                tmp_x = countlySession.clearSessionObject(tmp_x);

                sparkLines["total"][sparkLines["total"].length] = tmp_x["t"];
                sparkLines["nev"][sparkLines["nev"].length] = tmp_x["n"];
                sparkLines["unique"][sparkLines["unique"].length] = tmp_x["u"];
                sparkLines["returning"][sparkLines["returning"].length] = (tmp_x["t"] - tmp_x["n"]);
                sparkLines["total-time"][sparkLines["total-time"].length] = tmp_x["d"];
                sparkLines["avg-time"][sparkLines["avg-time"].length] = (tmp_x["t"] == 0) ? 0 : (tmp_x["d"] / tmp_x["t"]);
                sparkLines["events"][sparkLines["events"].length] = tmp_x["e"];
                sparkLines["avg-events"][sparkLines["avg-events"].length] = (tmp_x["u"] == 0) ? 0 : (tmp_x["e"] / tmp_x["u"]);
                sparkLines["msg"][sparkLines["msg"].length] = tmp_x["m"];
            }
        }

        for (var key in sparkLines) {
            sparkLines[key] = sparkLines[key].join(",");
        }

        return sparkLines;
    }

    function setMeta() {
        if (_sessionDb['meta']) {
            _durations = (_sessionDb['meta']['d-ranges']) ? _sessionDb['meta']['d-ranges'] : [];
        } else {
            _durations = [];
        }
    }

    function extendMeta() {
        if (_sessionDb['meta']) {
            _durations = countlyCommon.union(_durations, _sessionDb['meta']['d-ranges']);
        }
    }

}(window.countlySession = window.countlySession || {}, jQuery));
;(function (countlyCity, $, undefined) {

    // Private Properties
    var _periodObj = {},
        _locationsDb = {},
        _activeAppKey = 0,
        _cities = [],
        _chart,
        _dataTable,
        _chartElementId = "geo-chart",
        _chartOptions = {
            displayMode:'markers',
            colorAxis:{minValue:0, colors:['#D7F1D8', '#6BB96E']},
            resolution:'countries',
            toolTip:{textStyle:{color:'#FF0000'}, showColorCode:false},
            legend:"none",
            backgroundColor:"transparent",
            datalessRegionColor:"#FFF",
            region:"TR"
        },
        _initialized = false,
        _period = null;

    if (countlyCommon.CITY_DATA === false) {
        countlyCity.initialize = function() { return true; };
        countlyCity.refresh = function() { return true; };
        countlyCity.drawGeoChart = function() { return true; };
        countlyCity.refreshGeoChart = function() { return true; };
        countlyCity.getLocationData = function() { return []; };
    } else {
        // Public Methods
        countlyCity.initialize = function () {

            if (_initialized && _period == countlyCommon.getPeriodForAjax() && _activeAppKey == countlyCommon.ACTIVE_APP_KEY) {
                return countlyCity.refresh();
            }

            _period = countlyCommon.getPeriodForAjax();

            if (!countlyCommon.DEBUG) {
                _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
                _initialized = true;

                return $.ajax({
                    type:"GET",
                    url:countlyCommon.API_PARTS.data.r,
                    data:{
                        "api_key":countlyGlobal.member.api_key,
                        "app_id":countlyCommon.ACTIVE_APP_ID,
                        "method":"cities",
                        "period":_period
                    },
                    dataType:"jsonp",
                    success:function (json) {
                        _locationsDb = json;
                        setMeta();
                    }
                });
            } else {
                _locationsDb = {"2012":{}};
                return true;
            }
        };

        countlyCity.refresh = function () {

            _periodObj = countlyCommon.periodObj;

            if (!countlyCommon.DEBUG) {

                if (_activeAppKey != countlyCommon.ACTIVE_APP_KEY) {
                    _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
                    return countlyCity.initialize();
                }

                return $.ajax({
                    type:"GET",
                    url:countlyCommon.API_PARTS.data.r,
                    data:{
                        "api_key":countlyGlobal.member.api_key,
                        "app_id":countlyCommon.ACTIVE_APP_ID,
                        "method":"cities",
                        "action":"refresh"
                    },
                    dataType:"jsonp",
                    success:function (json) {
                        countlyCommon.extendDbObj(_locationsDb, json);
                        setMeta();
                    }
                });
            } else {
                _locationsDb = {"2012":{}};
                return true;
            }
        };

        countlyCity.reset = function () {
            _locationsDb = {};
            setMeta();
        };

        countlyCity.drawGeoChart = function (options) {

            _periodObj = countlyCommon.periodObj;

            if (options) {
                if (options.chartElementId) {
                    _chartElementId = options.chartElementId;
                }

                if (options.height) {
                    _chartOptions.height = options.height;

                    //preserve the aspect ratio of the chart if height is given
                    _chartOptions.width = (options.height * 556 / 347);
                }
            }

            if (google.visualization) {
                draw(options.metric);
            } else {
                google.load('visualization', '1', {'packages':['geochart'], callback:draw});
            }
        };

        countlyCity.refreshGeoChart = function (metric) {
            if (google.visualization) {
                reDraw(metric);
            } else {
                google.load('visualization', '1', {'packages':['geochart'], callback:draw});
            }
        };

        countlyCity.getLocationData = function (options) {

            var locationData = countlyCommon.extractTwoLevelData(_locationsDb, _cities, countlyCity.clearLocationObject, [
                {
                    "name":"city",
                    "func":function (rangeArr, dataObj) {
                        return rangeArr;
                    }
                },
                { "name":"t" },
                { "name":"u" },
                { "name":"n" }
            ]);

            if (options && options.maxCountries && locationData.chartData) {
                if (locationData.chartData.length > options.maxCountries) {
                    locationData.chartData = locationData.chartData.splice(0, options.maxCountries);
                }
            }

            return locationData.chartData;
        };
    }

    countlyCity.clearLocationObject = function (obj) {
        if (obj) {
            if (!obj["t"]) obj["t"] = 0;
            if (!obj["n"]) obj["n"] = 0;
            if (!obj["u"]) obj["u"] = 0;
        }
        else {
            obj = {"t":0, "n":0, "u":0};
        }

        return obj;
    };

    //Private Methods
    function draw(ob) {
        ob = ob || {id:'total', label:jQuery.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"};
        var chartData = {cols:[], rows:[]};

        _chart = new google.visualization.GeoChart(document.getElementById(_chartElementId));

        var tt = countlyCommon.extractTwoLevelData(_locationsDb, _cities, countlyCity.clearLocationObject, [
            {
                "name":"city",
                "func":function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        chartData.cols = [
            {id:'city', label:"City", type:'string'}
        ];
        chartData.cols.push(ob);
        chartData.rows = _.map(tt.chartData, function (value, key, list) {
            if (value.city == "Unknown") {
                return {c:[
                    {v:""},
                    {v:value[ob.metric]}
                ]};
            }
            return {c:[
                {v:value.city},
                {v:value[ob.metric]}
            ]};
        });

        _dataTable = new google.visualization.DataTable(chartData);

        if (countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID].country) {
            _chartOptions['region'] = countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID].country;
        }

        _chartOptions['resolution'] = 'countries';
        _chartOptions["displayMode"] = "markers";

        _chart.draw(_dataTable, _chartOptions);
    }

    function reDraw(ob) {
        ob = ob || {id:'total', label:jQuery.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"};
        var chartData = {cols:[], rows:[]};

        var tt = countlyCommon.extractTwoLevelData(_locationsDb, _cities, countlyCity.clearLocationObject, [
            {
                "name":"city",
                "func":function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        chartData.cols = [
            {id:'city', label:"City", type:'string'}
        ];
        chartData.cols.push(ob);
        chartData.rows = _.map(tt.chartData, function (value, key, list) {
            if (value.city == "Unknown") {
                return {c:[
                    {v:""},
                    {v:value[ob.metric]}
                ]};
            }
            return {c:[
                {v:value.city},
                {v:value[ob.metric]}
            ]};
        });

        _dataTable = new google.visualization.DataTable(chartData);
        _chart.draw(_dataTable, _chartOptions);
    }

    function setMeta() {
        if (_locationsDb['meta']) {
            _cities = (_locationsDb['meta']['cities']) ? _locationsDb['meta']['cities'] : [];
        } else {
            _cities = [];
        }
    }

}(window.countlyCity = window.countlyCity || {}, jQuery));;(function (countlyLocation, $, undefined) {

    // Private Properties
    var _periodObj = {},
        _locationsDb = {},
        _countries = [],
        _chart,
        _dataTable,
        _chartElementId = "geo-chart",
        _chartOptions = {
            displayMode:'region',
            colorAxis:{minValue:0, colors:['#D7F1D8', '#6BB96E']},
            resolution:'countries',
            toolTip:{textStyle:{color:'#FF0000'}, showColorCode:false},
            legend:"none",
            backgroundColor:"transparent",
            datalessRegionColor:"#FFF"
        },
        _countryMap = {};

    // Load local country names
    $.get('localization/countries/' + countlyCommon.BROWSER_LANG_SHORT + '/country.json', function (data) {
        _countryMap = data;
    });

    // Public Methods
    countlyLocation.initialize = function () {
        _locationsDb = countlyUser.getDbObj();
        setMeta();
    };

    countlyLocation.refresh = function (newJSON) {
        countlyCommon.extendDbObj(_locationsDb, newJSON);
        extendMeta();
    };

    countlyLocation.reset = function () {
        _locationsDb = {};
        setMeta();
    };

    countlyLocation.drawGeoChart = function (options) {

        _periodObj = countlyCommon.periodObj;

        if (options) {
            if (options.chartElementId) {
                _chartElementId = options.chartElementId;
            }

            if (options.height) {
                _chartOptions.height = options.height;

                //preserve the aspect ratio of the chart if height is given
                _chartOptions.width = (options.height * 556 / 347);
            }
        }

        if (google.visualization) {
            draw(options.metric);
        } else {
            google.load('visualization', '1', {'packages':['geochart'], callback:draw});
        }
    };

    countlyLocation.refreshGeoChart = function (metric) {
        if (google.visualization) {
            reDraw(metric);
        } else {
            google.load('visualization', '1', {'packages':['geochart'], callback:draw});
        }
    };

    countlyLocation.getLocationData = function (options) {

        var locationData = countlyCommon.extractTwoLevelData(_locationsDb, _countries, countlyLocation.clearLocationObject, [
            {
                "name":"country",
                "func":function (rangeArr, dataObj) {
                    return countlyLocation.getCountryName(rangeArr);
                }
            },
            {
                "name":"code",
                "func":function (rangeArr, dataObj) {
                    return rangeArr.toLowerCase();
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);
        locationData.chartData = countlyCommon.mergeMetricsByName(locationData.chartData, "country");
        locationData.chartData = _.sortBy(locationData.chartData, function(obj) { return -obj.t; });

        if (options && options.maxCountries && locationData.chartData) {
            if (locationData.chartData.length > options.maxCountries) {
                locationData.chartData = locationData.chartData.splice(0, options.maxCountries);
            }
        }

        for (var i = 0; i < locationData.chartData.length; i++) {
            locationData.chartData[i]['country_flag'] =
                "<div class='flag' style='background-image:url("+countlyGlobal["path"]+"/images/flags/" + locationData.chartData[i]['code'] + ".png);'></div>" +
                locationData.chartData[i]['country'];
        }

        return locationData.chartData;
    };

    countlyLocation.clearLocationObject = function (obj) {
        if (obj) {
            if (!obj["t"]) obj["t"] = 0;
            if (!obj["n"]) obj["n"] = 0;
            if (!obj["u"]) obj["u"] = 0;
        }
        else {
            obj = {"t":0, "n":0, "u":0};
        }

        return obj;
    };

    countlyLocation.getCountryName = function (cc) {
        var countryName = _countryMap[cc.toUpperCase()];

        if (countryName) {
            return countryName;
        } else {
            return "Unknown";
        }
    };

    countlyLocation.changeLanguage = function () {
        // Load local country names
        return $.get('localization/countries/' + countlyCommon.BROWSER_LANG_SHORT + '/country.json', function (data) {
            _countryMap = data;
        });
    };

    //Private Methods
    function draw(ob) {
        ob = ob || {id:'total', label:jQuery.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"};
        var chartData = {cols:[], rows:[]};

        _chart = new google.visualization.GeoChart(document.getElementById(_chartElementId));

        var tt = countlyCommon.extractTwoLevelData(_locationsDb, _countries, countlyLocation.clearLocationObject, [
            {
                "name":"country",
                "func":function (rangeArr, dataObj) {
                    return countlyLocation.getCountryName(rangeArr);
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        chartData.cols = [
            {id:'country', label:jQuery.i18n.map["countries.table.country"], type:'string'}
        ];
        chartData.cols.push(ob);
        chartData.rows = _.map(tt.chartData, function (value, key, list) {
            if (value.country == "European Union" || value.country == "Unknown") {
                return {c:[
                    {v:""},
                    {v:value[ob.metric]}
                ]};
            }
            return {c:[
                {v:value.country},
                {v:value[ob.metric]}
            ]};
        });

        _dataTable = new google.visualization.DataTable(chartData);

        _chartOptions['region'] = "world";
        _chartOptions['resolution'] = 'countries';
        _chartOptions["displayMode"] = "region";

        // This is how you handle regionClick and change zoom for only a specific country

        if (countlyCommon.CITY_DATA !== false && _chartOptions.height > 300) {
            google.visualization.events.addListener(_chart, 'regionClick', function (eventData) {
                var activeAppCountry = countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID].country;
                if (activeAppCountry && eventData.region == activeAppCountry) {
                    _chartOptions['region'] = eventData.region;
                    _chartOptions['resolution'] = 'countries';
                    _chart.draw(_dataTable, _chartOptions);

                    $(document).trigger('selectMapCountry');
                }
            });
        }

        _chart.draw(_dataTable, _chartOptions);
    }

    function reDraw(ob) {
        ob = ob || {id:'total', label:jQuery.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"};
        var chartData = {cols:[], rows:[]};

        var tt = countlyCommon.extractTwoLevelData(_locationsDb, _countries, countlyLocation.clearLocationObject, [
            {
                "name":"country",
                "func":function (rangeArr, dataObj) {
                    return countlyLocation.getCountryName(rangeArr);
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        chartData.cols = [
            {id:'country', label:jQuery.i18n.map["countries.table.country"], type:'string'}
        ];
        chartData.cols.push(ob);
        chartData.rows = _.map(tt.chartData, function (value, key, list) {
            if (value.country == "European Union" || value.country == "Unknown") {
                return {c:[
                    {v:""},
                    {v:value[ob.metric]}
                ]};
            }
            return {c:[
                {v:value.country},
                {v:value[ob.metric]}
            ]};
        });

        _dataTable = new google.visualization.DataTable(chartData);
        _chart.draw(_dataTable, _chartOptions);
    }

    function setMeta() {
        if (_locationsDb['meta']) {
            _countries = (_locationsDb['meta']['countries']) ? _locationsDb['meta']['countries'] : [];
        } else {
            _countries = [];
        }
    }

    function extendMeta() {
        if (_locationsDb['meta']) {
            _countries = countlyCommon.union(_countries, _locationsDb['meta']['countries']);
        }
    }

}(window.countlyLocation = window.countlyLocation || {}, jQuery));;(function (countlyUser, $, undefined) {

    //Private Properties
    var _periodObj = {},
        _userDb = {},
        _loyalties = [],
        _frequencies = [],
        _activeAppKey = 0,
        _initialized = false,
        _period = null;

    //Public Methods
    countlyUser.initialize = function () {
        if (_initialized && _period == countlyCommon.getPeriodForAjax() && _activeAppKey == countlyCommon.ACTIVE_APP_KEY) {
            return countlyUser.refresh();
        }

        _period = countlyCommon.getPeriodForAjax();

        if (!countlyCommon.DEBUG) {
            _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
            _initialized = true;

            return $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.r,
                data:{
                    "api_key":countlyGlobal.member.api_key,
                    "app_id":countlyCommon.ACTIVE_APP_ID,
                    "method":"users",
                    "period":_period
                },
                dataType:"jsonp",
                success:function (json) {
                    _userDb = json;
                    setMeta();

                    countlySession.initialize();
                    countlyLocation.initialize();
                }
            });
        } else {
            return true;
        }
    };

    countlyUser.refresh = function () {
        if (!countlyCommon.DEBUG) {

            if (_activeAppKey != countlyCommon.ACTIVE_APP_KEY) {
                _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
                return countlyUser.initialize();
            }

            return $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.r,
                data:{
                    "api_key":countlyGlobal.member.api_key,
                    "app_id":countlyCommon.ACTIVE_APP_ID,
                    "method":"users",
                    "action":"refresh"
                },
                dataType:"jsonp",
                success:function (json) {
                    countlyCommon.extendDbObj(_userDb, json);
                    extendMeta();

                    countlySession.refresh(json);
                    countlyLocation.refresh(json);
                }
            });
        } else {
            return true;
        }
    };

    countlyUser.reset = function () {
        _userDb = {};
        setMeta();
    };

    countlyUser.getFrequencyData = function () {

        var chartData = {chartData:{}, chartDP:{dp:[], ticks:[]}};

        chartData.chartData = countlyCommon.extractRangeData(_userDb, "f", _frequencies, countlyUser.explainFrequencyRange);

        var frequencies = _.pluck(chartData.chartData, "f"),
            frequencyTotals = _.pluck(chartData.chartData, "t"),
            chartDP = [
                {data:[]}
            ];

        chartDP[0]["data"][0] = [-1, null];
        chartDP[0]["data"][frequencies.length + 1] = [frequencies.length, null];

        chartData.chartDP.ticks.push([-1, ""]);
        chartData.chartDP.ticks.push([frequencies.length, ""]);

        for (var i = 0; i < frequencies.length; i++) {
            chartDP[0]["data"][i + 1] = [i, frequencyTotals[i]];
            chartData.chartDP.ticks.push([i, frequencies[i]]);
        }

        chartData.chartDP.dp = chartDP;

        for (var i = 0; i < chartData.chartData.length; i++) {
            chartData.chartData[i]["percent"] = "<div class='percent-bar' style='width:" + (2 * chartData.chartData[i]["percent"]) + "px;'></div>" + chartData.chartData[i]["percent"] + "%";
        }

        return chartData;
    };

    countlyUser.getLoyaltyData = function () {

        var chartData = {chartData:{}, chartDP:{dp:[], ticks:[]}};

        chartData.chartData = countlyCommon.extractRangeData(_userDb, "l", _loyalties, countlyUser.explainLoyaltyRange);

        var loyalties = _.pluck(chartData.chartData, "l"),
            loyaltyTotals = _.pluck(chartData.chartData, 't'),
            chartDP = [
                {data:[]}
            ];

        chartDP[0]["data"][0] = [-1, null];
        chartDP[0]["data"][loyalties.length + 1] = [loyalties.length, null];

        chartData.chartDP.ticks.push([-1, ""]);
        chartData.chartDP.ticks.push([loyalties.length, ""]);

        for (var i = 0; i < loyalties.length; i++) {
            chartDP[0]["data"][i + 1] = [i, loyaltyTotals[i]];
            chartData.chartDP.ticks.push([i, loyalties[i]]);
        }

        chartData.chartDP.dp = chartDP;

        for (var i = 0; i < chartData.chartData.length; i++) {
            chartData.chartData[i]["percent"] = "<div class='percent-bar' style='width:" + (2 * chartData.chartData[i]["percent"]) + "px;'></div>" + chartData.chartData[i]["percent"] + "%";
        }

        return chartData;
    };

    countlyUser.getLoyaltyDP = function () {

        //Update the current period object in case selected date is changed
        _periodObj = countlyCommon.periodObj;

        var dataArr = [
                { data:[], label:jQuery.i18n.map["user-loyalty.loyalty"] }
            ],
            ticks = [],
            rangeUsers;

        for (var j = 0; j < _loyalties.length; j++) {

            rangeUsers = 0;

            if (!_periodObj.isSpecialPeriod) {
                for (var i = _periodObj.periodMin; i < (_periodObj.periodMax + 1); i++) {

                    var tmp_x = countlyCommon.getDescendantProp(_userDb, _periodObj.activePeriod + "." + i + "." + "l");
                    tmp_x = clearLoyaltyObject(tmp_x);

                    rangeUsers += tmp_x[_loyalties[j]];
                }

                if (rangeUsers != 0) {
                    dataArr[0]["data"][dataArr[0]["data"].length] = [j, rangeUsers];
                    ticks[j] = [j, _loyalties[j]];
                }
            } else {
                for (var i = 0; i < (_periodObj.currentPeriodArr.length); i++) {

                    var tmp_x = countlyCommon.getDescendantProp(_userDb, _periodObj.currentPeriodArr[i] + "." + "l");
                    tmp_x = clearLoyaltyObject(tmp_x);

                    rangeUsers += tmp_x[_loyalties[j]];
                }

                if (rangeUsers != 0) {
                    dataArr[0]["data"][dataArr[0]["data"].length] = [j, rangeUsers];
                    ticks[j] = [j, _loyalties[j]];
                }
            }
        }

        return {
            dp:dataArr,
            ticks:ticks
        };
    };

    countlyUser.explainFrequencyRange = function (index) {
        var localHours = jQuery.i18n.map["user-loyalty.range.hours"],
            localDay = jQuery.i18n.map["user-loyalty.range.day"],
            localDays = jQuery.i18n.map["user-loyalty.range.days"];

        var frequencyRange = [
            jQuery.i18n.map["user-loyalty.range.first-session"],
            "1-24 " + localHours,
            "1 " + localDay,
            "2 " + localDays,
            "3 " + localDays,
            "4 " + localDays,
            "5 " + localDays,
            "6 " + localDays,
            "7 " + localDays,
            "8-14 " + localDays,
            "15-30 " + localDays,
            "30+ " + localDays
        ];

        return frequencyRange[index];
    };

    countlyUser.getFrequencyIndex = function (frequency) {
        var localHours = jQuery.i18n.map["user-loyalty.range.hours"],
            localDay = jQuery.i18n.map["user-loyalty.range.day"],
            localDays = jQuery.i18n.map["user-loyalty.range.days"];

        var frequencyRange = [
            jQuery.i18n.map["user-loyalty.range.first-session"],
            "1-24 " + localHours,
            "1 " + localDay,
            "2 " + localDays,
            "3 " + localDays,
            "4 " + localDays,
            "5 " + localDays,
            "6 " + localDays,
            "7 " + localDays,
            "8-14 " + localDays,
            "15-30 " + localDays,
            "30+ " + localDays
        ];

        return frequencyRange.indexOf(frequency);
    };

    countlyUser.explainLoyaltyRange = function (index) {
        var loyaltyRange = [
            "1",
            "2",
            "3-5",
            "6-9",
            "10-19",
            "20-49",
            "50-99",
            "100-499",
            "> 500"
        ];

        return loyaltyRange[index];
    };

    countlyUser.getLoyaltyIndex = function (loyalty) {
        var loyaltyRange = [
            "1",
            "2",
            "3-5",
            "6-9",
            "10-19",
            "20-49",
            "50-99",
            "100-499",
            "> 500"
        ];

        return loyaltyRange.indexOf(loyalty);
    };

    countlyUser.isInitialized = function() {
        return _initialized;
    };

    countlyUser.getDbObj = function() {
        return _userDb;
    };

    function setMeta() {
        if (_userDb['meta']) {
            _loyalties = (_userDb['meta']['l-ranges']) ? _userDb['meta']['l-ranges'] : [];
            _frequencies = (_userDb['meta']['f-ranges']) ? _userDb['meta']['f-ranges'] : [];
        } else {
            _loyalties = [];
            _frequencies = [];
        }
    }

    function extendMeta() {
        if (_userDb['meta']) {
            _loyalties = countlyCommon.union(_loyalties, _userDb['meta']['l-ranges']);
            _frequencies = countlyCommon.union(_frequencies, _userDb['meta']['f-ranges']);
        }
    }

}(window.countlyUser = window.countlyUser || {}, jQuery));;countlyDeviceList = {
	"iPhone1,1":"iPhone 1G",
	"iPhone1,2":"iPhone 3G",
	"iPhone2,1":"iPhone 3GS",
	"iPhone3,1":"iPhone 4 (GSM)",
	"iPhone3,2":"iPhone 4 (GSM Rev A)",
	"iPhone3,3":"iPhone 4 (CDMA)",
	"iPhone4,1":"iPhone 4S",
	"iPhone5,1":"iPhone 5 (GSM)",
	"iPhone5,2":"iPhone 5 (Global)",
	"iPhone5,3":"iPhone 5C (GSM)",
	"iPhone5,4":"iPhone 5C (Global)",
	"iPhone6,1":"iPhone 5S (GSM)",
	"iPhone6,2":"iPhone 5S (Global)",
	"iPhone7,1":"iPhone 6 Plus",
	"iPhone7,2":"iPhone 6",
	"iPod1,1":"iPod Touch 1G",
	"iPod2,1":"iPod Touch 2G",
	"iPod3,1":"iPod Touch 3G",
	"iPod4,1":"iPod Touch 4G",
	"iPod5,1":"iPod Touch 5G",
	"iPad1,1":"iPad",
	"iPad2,1":"iPad 2 (WiFi)",
	"iPad2,2":"iPad 2 (GSM)",
	"iPad2,3":"iPad 2 (CDMA)",
	"iPad2,4":"iPad 2 (WiFi Rev A)",
	"iPad3,1":"iPad 3 (WiFi)",
	"iPad3,2":"iPad 3 (CDMA)",
	"iPad3,3":"iPad 3 (Global)",
	"iPad3,4":"iPad 4 (WiFi)",
	"iPad3,5":"iPad 4 (GSM)",
	"iPad3,6":"iPad 4 (Global)",
	"iPad4,1":"iPad Air (WiFi)",
	"iPad4,2":"iPad Air (Global)",
	"iPad4,3":"iPad Air (Global)",
	"iPad5,3":"iPad Air 2G (WiFi)",
	"iPad5,4":"iPad Air 2G (Global)",
	"iPad2,5":"iPad Mini (WiFi)",
	"iPad2,6":"iPad Mini (GSM)",
	"iPad2,7":"iPad Mini (Global)",
	"iPad4,4":"iPad Mini 2G (WiFi)",
	"iPad4,5":"iPad Mini 2G (Global)",
	"iPad4,6":"iPad Mini 2G (Global)",
	"iPad4,7":"iPad Mini 3G (WiFi)",
	"iPad4,8":"iPad Mini 3G (Global)",
	"iPad4,9":"iPad Mini 3G (Global)",
	"i386":"Simulator",
	"x86_64":"Simulator"
};(function (countlyDevice, $, undefined) {

    //Private Properties
    var _periodObj = {},
        _deviceDb = {},
        _devices = [],
        _activeAppKey = 0,
        _initialized = false,
        _period = null;

    //Public Methods
    countlyDevice.initialize = function () {
        if (_initialized && _period == countlyCommon.getPeriodForAjax() && _activeAppKey == countlyCommon.ACTIVE_APP_KEY) {
            return countlyDevice.refresh();
        }

        _period = countlyCommon.getPeriodForAjax();

        if (!countlyCommon.DEBUG) {
            _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
            _initialized = true;

            return $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.r,
                data:{
                    "api_key":countlyGlobal.member.api_key,
                    "app_id":countlyCommon.ACTIVE_APP_ID,
                    "method":"devices",
                    "period":_period
                },
                dataType:"jsonp",
                success:function (json) {
                    _deviceDb = json;
                    setMeta();
                }
            });
        } else {
            _deviceDb = {"2012":{}};
            return true;
        }
    };

    countlyDevice.refresh = function () {
        _periodObj = countlyCommon.periodObj;

        if (!countlyCommon.DEBUG) {

            if (_activeAppKey != countlyCommon.ACTIVE_APP_KEY) {
                _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
                return countlyDevice.initialize();
            }

            return $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.r,
                data:{
                    "api_key":countlyGlobal.member.api_key,
                    "app_id":countlyCommon.ACTIVE_APP_ID,
                    "method":"devices",
                    "action":"refresh"
                },
                dataType:"jsonp",
                success:function (json) {
                    countlyCommon.extendDbObj(_deviceDb, json);
                    extendMeta();
                }
            });
        } else {
            _deviceDb = {"2012":{}};
            return true;
        }
    };

    countlyDevice.reset = function () {
        _deviceDb = {};
        setMeta();
    };

    countlyDevice.getDeviceData = function () {

        var chartData = countlyCommon.extractTwoLevelData(_deviceDb, _devices, countlyDevice.clearDeviceObject, [
            {
                name:"device",
                func:function (rangeArr, dataObj) {
                    return countlyDevice.getDeviceFullName(rangeArr);
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        var deviceNames = _.pluck(chartData.chartData, 'device'),
            deviceTotal = _.pluck(chartData.chartData, 'u'),
            deviceNew = _.pluck(chartData.chartData, 'n'),
            chartData2 = [],
            chartData3 = [];

        var sum = _.reduce(deviceTotal, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < deviceNames.length; i++) {
            var percent = (deviceTotal[i] / sum) * 100;
            chartData2[i] = {data:[
                [0, deviceTotal[i]]
            ], label:deviceNames[i]};
        }

        var sum2 = _.reduce(deviceNew, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < deviceNames.length; i++) {
            var percent = (deviceNew[i] / sum2) * 100;
            chartData3[i] = {data:[
                [0, deviceNew[i]]
            ], label:deviceNames[i]};
        }

        chartData.chartDPTotal = {};
        chartData.chartDPTotal.dp = chartData2;

        chartData.chartDPNew = {};
        chartData.chartDPNew.dp = chartData3;

        return chartData;
    };

    countlyDevice.getDeviceDP = function () {

        //Update the current period object in case selected date is changed
        _periodObj = countlyCommon.periodObj;

        var dataArr = [
                { data:[], label:"Devices" }
            ],
            ticks = [],
            rangeUsers;

        for (var j = 0; j < _devices.length; j++) {

            rangeUsers = 0;

            if (!_periodObj.isSpecialPeriod) {
                for (var i = _periodObj.periodMin; i < (_periodObj.periodMax + 1); i++) {

                    var tmp_x = countlyCommon.getDescendantProp(_deviceDb, _periodObj.activePeriod + "." + i + ".device");
                    tmp_x = clearLoyaltyObject(tmp_x);

                    rangeUsers += tmp_x[_deviceDb["devices"][j]];
                }

                if (rangeUsers != 0) {
                    dataArr[0]["data"][dataArr[0]["data"].length] = [j, rangeUsers];
                    ticks[j] = [j, countlyDevice.getDeviceFullName(_deviceDb["devices"][j])];
                }
            } else {
                for (var i = 0; i < (_periodObj.currentPeriodArr.length); i++) {

                    var tmp_x = countlyCommon.getDescendantProp(_deviceDb, _periodObj.currentPeriodArr[i] + ".device");
                    tmp_x = clearLoyaltyObject(tmp_x);

                    rangeUsers += tmp_x[_deviceDb["devices"][j]];
                }

                if (rangeUsers != 0) {
                    dataArr[0]["data"][dataArr[0]["data"].length] = [j, rangeUsers];
                    ticks[j] = [j, countlyDevice.getDeviceFullName(_deviceDb["devices"][j])];
                }
            }
        }

        return {
            dp:dataArr,
            ticks:ticks
        };
    };

    countlyDevice.clearDeviceObject = function (obj) {
        if (obj) {
            if (!obj["t"]) obj["t"] = 0;
            if (!obj["n"]) obj["n"] = 0;
            if (!obj["u"]) obj["u"] = 0;
        }
        else {
            obj = {"t":0, "n":0, "u":0};
        }

        return obj;
    };

    countlyDevice.getDeviceFullName = function(shortName) {
		if(countlyDeviceList && countlyDeviceList[shortName])
			return countlyDeviceList[shortName];
        return shortName;
    };

    function setMeta() {
        if (_deviceDb['meta']) {
            _devices = (_deviceDb['meta']['devices']) ? _deviceDb['meta']['devices'] : [];
        } else {
            _devices = [];
        }
    }

    function extendMeta() {
        if (_deviceDb['meta']) {
            _devices = countlyCommon.union(_devices, _deviceDb['meta']['devices']);
        }
    }

}(window.countlyDevice = window.countlyDevice || {}, jQuery));;(function (countlyDeviceDetails, $, undefined) {

    //Private Properties
    var _periodObj = {},
        _deviceDetailsDb = {},
        _os = [],
        _resolutions = [],
        _os_versions = [],
        _activeAppKey = 0,
        _initialized = false,
        _period = null;

    //Public Methods
    countlyDeviceDetails.initialize = function () {
        if (_initialized && _period == countlyCommon.getPeriodForAjax() && _activeAppKey == countlyCommon.ACTIVE_APP_KEY) {
            return countlyDeviceDetails.refresh();
        }

        _period = countlyCommon.getPeriodForAjax();

        if (!countlyCommon.DEBUG) {
            _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
            _initialized = true;

            return $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.r,
                data:{
                    "api_key":countlyGlobal.member.api_key,
                    "app_id":countlyCommon.ACTIVE_APP_ID,
                    "method":"device_details",
                    "period":_period
                },
                dataType:"jsonp",
                success:function (json) {
                    _deviceDetailsDb = json;
                    setMeta();

                    countlyAppVersion.initialize();
                }
            });
        } else {
            _deviceDetailsDb = {"2012":{}};
            return true;
        }
    };

    countlyDeviceDetails.refresh = function () {
        _periodObj = countlyCommon.periodObj;

        if (!countlyCommon.DEBUG) {

            if (_activeAppKey != countlyCommon.ACTIVE_APP_KEY) {
                _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
                return countlyDeviceDetails.initialize();
            }

            return $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.r,
                data:{
                    "api_key":countlyGlobal.member.api_key,
                    "app_id":countlyCommon.ACTIVE_APP_ID,
                    "method":"device_details",
                    "action":"refresh"
                },
                dataType:"jsonp",
                success:function (json) {
                    countlyCommon.extendDbObj(_deviceDetailsDb, json);
                    extendMeta();

                    countlyAppVersion.refresh(json);
                }
            });
        } else {
            _deviceDetailsDb = {"2012":{}};
            return true;
        }
    };

    countlyDeviceDetails.reset = function () {
        _deviceDetailsDb = {};
        setMeta();
    };

    countlyDeviceDetails.clearDeviceDetailsObject = function (obj) {
        if (obj) {
            if (!obj["t"]) obj["t"] = 0;
            if (!obj["n"]) obj["n"] = 0;
            if (!obj["u"]) obj["u"] = 0;
        }
        else {
            obj = {"t":0, "n":0, "u":0};
        }

        return obj;
    };

    countlyDeviceDetails.getPlatforms = function () {
        return _os;
    };

    countlyDeviceDetails.getPlatformBars = function () {
        return countlyCommon.extractBarData(_deviceDetailsDb, _os, countlyDeviceDetails.clearDeviceDetailsObject);
    };

    countlyDeviceDetails.getPlatformData = function () {

        var chartData = countlyCommon.extractTwoLevelData(_deviceDetailsDb, _os, countlyDeviceDetails.clearDeviceDetailsObject, [
            {
                name:"os_",
                func:function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        var platformNames = _.pluck(chartData.chartData, 'os_'),
            platformTotal = _.pluck(chartData.chartData, 'u'),
            chartData2 = [];

        var sum = _.reduce(platformTotal, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < platformNames.length; i++) {
            var percent = (platformTotal[i] / sum) * 100;
            chartData2[i] = {data:[
                [0, platformTotal[i]]
            ], label:platformNames[i]};
        }

        chartData.chartDP = {};
        chartData.chartDP.dp = chartData2;

        return chartData;
    };

    countlyDeviceDetails.getResolutionBars = function () {
        return countlyCommon.extractBarData(_deviceDetailsDb, _resolutions, countlyDeviceDetails.clearDeviceDetailsObject);
    };

    countlyDeviceDetails.getResolutionData = function () {
        var chartData = countlyCommon.extractTwoLevelData(_deviceDetailsDb, _resolutions, countlyDeviceDetails.clearDeviceDetailsObject, [
            {
                name:"resolution",
                func:function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            {
                name:"width",
                func:function (rangeArr, dataObj) {
                    return "<a>" + rangeArr.split("x")[0] + "</a>";
                }
            },
            {
                name:"height",
                func:function (rangeArr, dataObj) {
                    return "<a>" + rangeArr.split("x")[1] + "</a>";
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        var resolutions = _.pluck(chartData.chartData, 'resolution'),
            resolutionTotal = _.pluck(chartData.chartData, 'u'),
            resolutionNew = _.pluck(chartData.chartData, 'n'),
            chartData2 = [],
            chartData3 = [];

        var sum = _.reduce(resolutionTotal, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < resolutions.length; i++) {
            var percent = (resolutionTotal[i] / sum) * 100;
            chartData2[i] = {data:[
                [0, resolutionTotal[i]]
            ], label:resolutions[i]};
        }

        var sum2 = _.reduce(resolutionNew, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < resolutions.length; i++) {
            var percent = (resolutionNew[i] / sum) * 100;
            chartData3[i] = {data:[
                [0, resolutionNew[i]]
            ], label:resolutions[i]};
        }

        chartData.chartDPTotal = {};
        chartData.chartDPTotal.dp = chartData2;

        chartData.chartDPNew = {};
        chartData.chartDPNew.dp = chartData3;

        return chartData;
    };

    countlyDeviceDetails.getOSVersionBars = function () {
        var osVersions = countlyCommon.extractBarData(_deviceDetailsDb, _os_versions, countlyDeviceDetails.clearDeviceDetailsObject);

        for (var i = 0; i < osVersions.length; i++) {
            osVersions[i].name = countlyDeviceDetails.fixOSVersion(osVersions[i].name);
        }

        return osVersions;
    };

    countlyDeviceDetails.getOSVersionData = function (os) {

        var oSVersionData = countlyCommon.extractTwoLevelData(_deviceDetailsDb, _os_versions, countlyDeviceDetails.clearDeviceDetailsObject, [
            {
                name:"os_version",
                func:function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        var osSegmentation = ((os) ? os : ((_os) ? _os[0] : null)),
            platformVersionTotal = _.pluck(oSVersionData.chartData, 'u'),
            chartData2 = [];

        if (oSVersionData.chartData) {
            for (var i = 0; i < oSVersionData.chartData.length; i++) {
                oSVersionData.chartData[i].os_version = countlyDeviceDetails.fixOSVersion(oSVersionData.chartData[i].os_version);

                if (oSVersionData.chartData[i].os_version.indexOf(osSegmentation) == -1) {
                    delete oSVersionData.chartData[i];
                }
            }
        }

        oSVersionData.chartData = _.compact(oSVersionData.chartData);

        var platformVersionNames = _.pluck(oSVersionData.chartData, 'os_version'),
            platformNames = [];

        var sum = _.reduce(platformVersionTotal, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < platformVersionNames.length; i++) {
            var percent = (platformVersionTotal[i] / sum) * 100;

            chartData2[chartData2.length] = {data:[
                [0, platformVersionTotal[i]]
            ], label:platformVersionNames[i].replace(osSegmentation + " ", "")};
        }

        oSVersionData.chartDP = {};
        oSVersionData.chartDP.dp = chartData2;
        oSVersionData.os = [];

        if (_os && _os.length > 1) {
            for (var i = 0; i < _os.length; i++) {
                //if (_os[i] != osSegmentation) {
                //    continue;
                //}

                oSVersionData.os.push({
                    "name":_os[i],
                    "class":_os[i].toLowerCase()
                });
            }
        }

        return oSVersionData;
    };

    countlyDeviceDetails.fixOSVersion = function(osName) {
        return osName
            .replace(/:/g, ".")
            .replace(/^unk/g, "Unknown ")
            .replace(/^qnx/g, "QNX ")
            .replace(/^os2/g, "OS/2 ")
            .replace(/^mw/g, "Windows ")
            .replace(/^ob/g, "Open BSD ")
            .replace(/^sb/g, "SearchBot ")
            .replace(/^so/g, "Sun OS ")
            .replace(/^bo/g, "BeOS ")
            .replace(/^l/g, "Linux ")
            .replace(/^u/g, "UNIX ")
            .replace(/^i/g, "iOS ")
            .replace(/^a/g, "Android ")
            .replace(/^b/g, "BlackBerry ")
            .replace(/^w/g, "Windows Phone ")
            .replace(/^o/g, "OS X ")
            .replace(/^m/g, "Mac ")
            .replace(/^t/g, "Tizen ");
    };

    countlyDeviceDetails.getDbObj = function() {
        return _deviceDetailsDb;
    };

    function setMeta() {
        if (_deviceDetailsDb['meta']) {
            _os = (_deviceDetailsDb['meta']['os']) ? _deviceDetailsDb['meta']['os'] : [];
            _resolutions = (_deviceDetailsDb['meta']['resolutions']) ? _deviceDetailsDb['meta']['resolutions'] : [];
            _os_versions = (_deviceDetailsDb['meta']['os_versions']) ? _deviceDetailsDb['meta']['os_versions'] : [];
        } else {
            _os = [];
            _resolutions = [];
            _os_versions = [];
        }

        if (_os_versions.length) {
            _os_versions = _os_versions.join(",").replace(/\./g, ":").split(",");
        }
    }

    function extendMeta() {
        if (_deviceDetailsDb['meta']) {
            _os = countlyCommon.union(_os, _deviceDetailsDb['meta']['os']);
            _resolutions = countlyCommon.union(_resolutions, _deviceDetailsDb['meta']['resolutions']);
            _os_versions = countlyCommon.union(_os_versions, _deviceDetailsDb['meta']['os_versions']);
        }

        if (_os_versions.length) {
            _os_versions = _os_versions.join(",").replace(/\./g, ":").split(",");
        }
    }

}(window.countlyDeviceDetails = window.countlyDeviceDetails || {}, jQuery));
;(function (countlyAppVersion, $, undefined) {

    //Private Properties
    var _appVersionsDb = {},
        _app_versions = [];

    //Public Methods
    countlyAppVersion.initialize = function () {
        _appVersionsDb = countlyDeviceDetails.getDbObj();
        setMeta();
    };

    countlyAppVersion.refresh = function (newJSON) {
        countlyCommon.extendDbObj(_appVersionsDb, newJSON);
        extendMeta();
    };

    countlyAppVersion.reset = function () {
        _appVersionsDb = {};
        setMeta();
    };

    countlyAppVersion.clearAppVersionsObject = function (obj) {
        if (obj) {
            if (!obj["t"]) obj["t"] = 0;
            if (!obj["n"]) obj["n"] = 0;
            if (!obj["u"]) obj["u"] = 0;
        }
        else {
            obj = {"t":0, "n":0, "u":0};
        }

        return obj;
    };

    countlyAppVersion.getAppVersionBars = function () {
        return countlyCommon.extractBarData(_appVersionsDb, _app_versions, countlyAppVersion.clearAppVersionsObject);
    };

    countlyAppVersion.getAppVersionData = function (os) {

        var appVersionData = {chartData:{}, chartDP:{dp:[], ticks:[]}};

        var tmpAppVersionData = countlyCommon.extractTwoLevelData(_appVersionsDb, _app_versions, countlyAppVersion.clearAppVersionsObject, [
            {
                name:"app_version",
                func:function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        appVersionData.chartData = tmpAppVersionData.chartData;

        if (appVersionData.chartData) {
            for (var i = 0; i < appVersionData.chartData.length; i++) {
                appVersionData.chartData[i].app_version = appVersionData.chartData[i].app_version.replace(/:/g, ".");
            }
        }

        var appVersions = _.pluck(appVersionData.chartData, "app_version"),
            appVersionTotal = _.pluck(appVersionData.chartData, 't'),
            appVersionNew = _.pluck(appVersionData.chartData, 'n'),
            chartDP = [
                {data:[], label:jQuery.i18n.map["common.table.total-sessions"]},
                {data:[], label:jQuery.i18n.map["common.table.new-users"]}
            ];

        chartDP[0]["data"][0] = [-1, null];
        chartDP[0]["data"][appVersions.length + 1] = [appVersions.length, null];

        appVersionData.chartDP.ticks.push([-1, ""]);
        appVersionData.chartDP.ticks.push([appVersions.length, ""]);

        for (var i = 0; i < appVersions.length; i++) {
            chartDP[0]["data"][i + 1] = [i, appVersionTotal[i]];
            chartDP[1]["data"][i + 1] = [i, appVersionNew[i]];
            appVersionData.chartDP.ticks.push([i, appVersions[i]]);
        }

        appVersionData.chartDP.dp = chartDP;

        return appVersionData;
    };

    function setMeta() {
        if (_appVersionsDb['meta']) {
            _app_versions = (_appVersionsDb['meta']['app_versions']) ? _appVersionsDb['meta']['app_versions'] : [];
        } else {
            _app_versions = [];
        }
    }

    function extendMeta() {
        if (_appVersionsDb['meta']) {
            _app_versions = countlyCommon.union(_app_versions, _appVersionsDb['meta']['app_versions']);
        }
    }

}(window.countlyAppVersion = window.countlyAppVersion || {}, jQuery));
;(function (countlyCarrier, $, undefined) {

    //Private Properties
    var _periodObj = {},
        _carrierDb = {},
        _carriers = [],
        _activeAppKey = 0,
        _initialized = false,
        _period = null;

    //Public Methods
    countlyCarrier.initialize = function () {
        if (_initialized && _period == countlyCommon.getPeriodForAjax() && _activeAppKey == countlyCommon.ACTIVE_APP_KEY) {
            return countlyCarrier.refresh();
        }

        _period = countlyCommon.getPeriodForAjax();

        if (!countlyCommon.DEBUG) {
            _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
            _initialized = true;

            return $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.r,
                data:{
                    "api_key":countlyGlobal.member.api_key,
                    "app_id":countlyCommon.ACTIVE_APP_ID,
                    "method":"carriers",
                    "period":_period
                },
                dataType:"jsonp",
                success:function (json) {
                    _carrierDb = json;
                    setMeta();
                }
            });
        } else {
            _carrierDb = {"2012":{}};
            return true;
        }
    };

    countlyCarrier.refresh = function () {
        _periodObj = countlyCommon.periodObj;

        if (!countlyCommon.DEBUG) {

            if (_activeAppKey != countlyCommon.ACTIVE_APP_KEY) {
                _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
                return countlyCarrier.initialize();
            }

            return $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.data.r,
                data:{
                    "api_key":countlyGlobal.member.api_key,
                    "app_id":countlyCommon.ACTIVE_APP_ID,
                    "method":"carriers",
                    "action":"refresh"
                },
                dataType:"jsonp",
                success:function (json) {
                    countlyCommon.extendDbObj(_carrierDb, json);
                    extendMeta();
                }
            });
        } else {
            _carrierDb = {"2012":{}};

            return true;
        }
    };

    countlyCarrier.reset = function () {
        _carrierDb = {};
        setMeta();
    };

    countlyCarrier.getCarrierData = function () {

        var chartData = countlyCommon.extractTwoLevelData(_carrierDb, _carriers, countlyCarrier.clearCarrierObject, [
            {
                name:"carrier",
                func:function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        var carrierNames = _.pluck(chartData.chartData, 'carrier'),
            carrierTotal = _.pluck(chartData.chartData, 't'),
            carrierNew = _.pluck(chartData.chartData, 'n'),
            chartData2 = [],
            chartData3 = [];

        var sum = _.reduce(carrierTotal, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < carrierNames.length; i++) {
            var percent = (carrierTotal[i] / sum) * 100;
            chartData2[i] = {data:[
                [0, carrierTotal[i]]
            ], label:carrierNames[i]};
        }

        var sum2 = _.reduce(carrierNew, function (memo, num) {
            return memo + num;
        }, 0);

        for (var i = 0; i < carrierNames.length; i++) {
            var percent = (carrierNew[i] / sum) * 100;
            chartData3[i] = {data:[
                [0, carrierNew[i]]
            ], label:carrierNames[i]};
        }

        chartData.chartDPTotal = {};
        chartData.chartDPTotal.dp = chartData2;

        chartData.chartDPNew = {};
        chartData.chartDPNew.dp = chartData3;

        return chartData;
    };

    countlyCarrier.clearCarrierObject = function (obj) {
        if (obj) {
            if (!obj["t"]) obj["t"] = 0;
            if (!obj["n"]) obj["n"] = 0;
            if (!obj["u"]) obj["u"] = 0;
        }
        else {
            obj = {"t":0, "n":0, "u":0};
        }

        return obj;
    };

    countlyCarrier.getCarrierBars = function () {
        return countlyCommon.extractBarData(_carrierDb, _carriers, countlyCarrier.clearCarrierObject);
    };

    function setMeta() {
        if (_carrierDb['meta']) {
            _carriers = (_carrierDb['meta']['carriers']) ? _carrierDb['meta']['carriers'] : [];
        } else {
            _carriers = [];
        }
    }

    function extendMeta() {
        if (_carrierDb['meta']) {
            _carriers = countlyCommon.union(_carriers, _carrierDb['meta']['carriers']);
        }
    }

}(window.countlyCarrier = window.countlyCarrier || {}, jQuery));;(function (countlyAllApps, $, undefined) {

    //Private Properties
    var _appData = {"all":{_id:"all", name:"All apps"}},
		_appIds = {},
		_sessions = {},
		_sessionData = {};
	var _tempApp;

    //Public Methods
    countlyAllApps.initialize = function () {
        return countlyAllApps.refresh();
    };

    countlyAllApps.refresh = function () {
        if (!countlyCommon.DEBUG) {
			this.reset();
			var deffereds = [];
			_tempApp = countlyCommon.ACTIVE_APP_ID;
			for(var i in countlyGlobal["apps"]){
				deffereds.push(loadApp(i));
			}
			return $.when.apply($, deffereds).then(function(){
				countlyCommon.setActiveApp(_tempApp);
				_appData["all"].sessions = {total:0, trend:0};
				_appData["all"].users = {total:0, trend:0};
				_appData["all"].newusers = {total:0, trend:0};
				_appData["all"].duration = {total:0, trend:0};
				_appData["all"].avgduration = {total:0, trend:0};
				_sessions["all"] = {};
				for(var appID in countlyGlobal["apps"]){
                    _appData[appID].duration.total = 0;
                    _appData[appID].avgduration.total = 0;
					var sessionData = _sessionData[appID];
					for(var i in _sessions[appID]){
						for(var j = 0, l = _sessions[appID][i].data.length; j < l; j++){
							if(!_sessions["all"][i]){
								_sessions["all"][i] = {};
								_sessions["all"][i].label = _sessions[appID][i].label;
								_sessions["all"][i].data = [];
							}
							if(!_sessions["all"][i].data[j]){
								_sessions["all"][i].data[j] = [0,0];
							}
							_sessions["all"][i].data[j][0] = _sessions[appID][i].data[j][0];
							_sessions["all"][i].data[j][1] += parseFloat(_sessions[appID][i].data[j][1]);
							if(i == "#draw-total-time-spent"){
								_appData["all"].duration.total += parseFloat(_sessions[appID][i].data[j][1]);
								_appData[appID].duration.total += parseFloat(_sessions[appID][i].data[j][1]);
                            }
						}
					}
					_appData["all"].sessions.total += sessionData.usage['total-sessions'].total;
					_appData["all"].users.total += sessionData.usage['total-users'].total;
					_appData["all"].newusers.total += sessionData.usage['new-users'].total;
					_appData["all"].sessions.trend += fromShortNumber(sessionData.usage['total-sessions'].change);
					_appData["all"].users.trend += fromShortNumber(sessionData.usage['total-users'].change);
					_appData["all"].newusers.trend += fromShortNumber(sessionData.usage['new-users'].change);
					_appData["all"].duration.trend += fromShortNumber(sessionData.usage['total-duration'].change);
					_appData["all"].avgduration.trend += fromShortNumber(sessionData.usage['avg-duration-per-session'].change);
                    _appData[appID].avgduration.total = (_appData[appID].sessions.total == 0 ) ? 0 : _appData[appID].duration.total/_appData[appID].sessions.total;
				}
				for(var i in _appData["all"]){
					if(_appData["all"][i].trend < 0)
						_appData["all"][i].trend = "d";
					else
						_appData["all"][i].trend = "u";
				}
				_appData["all"].avgduration.total = (_appData["all"].sessions.total == 0 ) ? 0 : _appData["all"].duration.total/_appData["all"].sessions.total;
			});
        } else {
            return true;
        }
    };

    countlyAllApps.reset = function () {
		_appIds = {};
    };
	
	countlyAllApps.getData = function () {
		var data = [];
		for(var i in _appData){
			data.push(_appData[i]);
		}
        return data;
    };
	
	countlyAllApps.getSessionData = function () {
        return _sessions;
    };
	
	countlyAllApps.setApp = function (app) {
        _tempApp = app;
		countlyCommon.setActiveApp(_tempApp);
    };
	
	var loadApp = function(appID){
		countlyCommon.setActiveApp(appID);
		return $.when(countlyUser.initialize()).done(function () {
			var sessionData = countlySession.getSessionData();
			if(!_appIds[appID]){
				_sessionData[appID] = sessionData;
				_sessions[appID] = {
					"#draw-total-users": countlySession.getUserDPActive().chartDP[1],
					"#draw-new-users": countlySession.getUserDPNew().chartDP[1],
					"#draw-total-sessions": countlySession.getSessionDPTotal().chartDP[1],
					"#draw-time-spent": countlySession.getDurationDPAvg().chartDP[1],
					"#draw-total-time-spent": countlySession.getDurationDP().chartDP[1],
					"#draw-avg-events-served": countlySession.getEventsDPAvg().chartDP[1]
				};
				_appData[appID] = {_id:appID, name:countlyGlobal["apps"][appID].name, sessions:sessionData.usage['total-sessions'], users:sessionData.usage['total-users'], newusers:sessionData.usage['new-users'], duration:sessionData.usage['total-duration'], avgduration:sessionData.usage['avg-duration-per-session']};
				_appIds[appID] = true;
			}
		});
	};
	
	var fromShortNumber = function(str){
		if(str == "NA" || str == "∞"){
			return 0;
		}
		else{
			str = str.slice(0, -1);
			var rate = 1;
			if(str.slice(-1) == "K"){
				str = str.slice(0, -1);
				rate = 1000;
			}
			else if(str.slice(-1) == "M"){
				str = str.slice(0, -1);
				rate = 1000000;
			}
			return parseFloat(str)*rate;
		}
	};
}(window.countlyAllApps = window.countlyAllApps || {}, jQuery));;/*
 A countly view is defined as a page corresponding to a url fragment such 
 as #/manage/apps. This interface defines common functions or properties 
 the view object has. A view may override any function or property.
 */
var countlyView = Backbone.View.extend({
    template:null, //handlebars template of the view
    templateData:{}, //data to be used while rendering the template
    el:$('#content'), //jquery element to render view into
    initialize:function () {    //compile view template
        this.template = Handlebars.compile($("#template-analytics-common").html());
    },
    dateChanged:function () {    //called when user changes the date selected
        if (Backbone.history.fragment == "/") {
			this.refresh(true);
		} else {
			this.refresh();
		}
    },
    appChanged:function () {    //called when user changes selected app from the sidebar
        countlyEvent.reset();

        var self = this;
        $.when(countlyEvent.initialize()).then(function() {
            self.render();
        });
    },
    beforeRender: function () {
        return true;
    },
    afterRender: function() {},
    render:function () {    //backbone.js view render function
        $("#content-top").html("");
        this.el.html('<div id="content-loader"></div>');

        if (countlyCommon.ACTIVE_APP_ID) {
            var self = this;
            $.when(this.beforeRender(), initializeOnce()).then(function() {
                self.renderCommon();
                self.afterRender();
                app.pageScript();
            });
        } else {
            this.renderCommon();
            this.afterRender();
            app.pageScript();
        }

        return this;
    },
    renderCommon:function (isRefresh) {}, // common render function of the view
    refresh:function () {    // resfresh function for the view called every 10 seconds by default
        return true;
    },
    restart:function () { // triggered when user is active after idle period
        this.refresh();
    },
    destroy:function () {}
});

var initializeOnce = _.once(function() {
    return $.when(countlyEvent.initialize()).then(function() {});
});

var Template = function () {
    this.cached = {};
};
var T = new Template();

$.extend(Template.prototype, {
    render:function (name, callback) {
        if (T.isCached(name)) {
            callback(T.cached[name]);
        } else {
            $.get(T.urlFor(name), function (raw) {
                T.store(name, raw);
                T.render(name, callback);
            });
        }
    },
    renderSync:function (name, callback) {
        if (!T.isCached(name)) {
            T.fetch(name);
        }
        T.render(name, callback);
    },
    prefetch:function (name) {
        $.get(T.urlFor(name), function (raw) {
            T.store(name, raw);
        });
    },
    fetch:function (name) {
        // synchronous, for those times when you need it.
        if (!T.isCached(name)) {
            var raw = $.ajax({'url':T.urlFor(name), 'async':false}).responseText;
            T.store(name, raw);
        }
    },
    isCached:function (name) {
        return !!T.cached[name];
    },
    store:function (name, raw) {
        T.cached[name] = Handlebars.compile(raw);
    },
    urlFor:function (name) {
        //return "/resources/templates/"+ name + ".handlebars";
        return name + ".html";
    }
});

/*
 Some helper functions to be used throughout all views. Includes custom 
 popup, alert and confirm dialogs for the time being.
 */
(function (CountlyHelpers, $, undefined) {

    CountlyHelpers.parseAndShowMsg = function (msg) {
        if (!msg || !msg.length) {
            return true;
        }

        if (_.isArray(msg)) {
            msg = msg[0];
        }

        var type = "info",
            message = "",
            msgArr = msg.split("|");

        if (msgArr.length > 1) {
            type = msgArr[0];
            message = msgArr[1];
        } else {
            message = msg;
        }
        
        CountlyHelpers.notify({type:type, message:message});

        delete countlyGlobal["message"];
    };
	
	CountlyHelpers.notify = function (msg) {
		$.titleAlert((msg.title || msg.message || msg.info || "Notification"), {
			requireBlur:true,
			stopOnFocus:true,
			duration:(msg.delay || 10000),
			interval:1000
		});
		$.amaran({
			content:{
				title: msg.title || "Notification",
				message:msg.message || "",
				info:msg.info || "",
				icon:msg.icon || 'fa fa-info'
			},
			theme:'awesome '+ (msg.type || "ok"),
			position: msg.position || 'top right',
			delay: msg.delay || 10000,
			sticky: msg.sticky || false,
			clearAll: msg.clearAll || false,
			closeButton:true,
			closeOnClick:(msg.closeOnClick === false) ? false : true,
			onClick: msg.onClick || null
		});
	};

    CountlyHelpers.popup = function (element, custClass, isHTML) {
        var dialog = $("#cly-popup").clone();
        dialog.removeAttr("id");
        if (custClass) {
            dialog.addClass(custClass);
        }

        if (isHTML) {
            dialog.find(".content").html(element);
        } else {
            dialog.find(".content").html($(element).html());
        }

        revealDialog(dialog);
    };

    CountlyHelpers.openResource = function(url) {
        var dialog = $("#cly-resource").clone();
        dialog.removeAttr("id");
        dialog.find(".content").html("<iframe style='border-radius:5px; border:none; width:800px; height:600px;' src='" + url + "'></iframe>");

        revealDialog(dialog);
    };

    CountlyHelpers.alert = function (msg, type) {
        var dialog = $("#cly-alert").clone();
        dialog.removeAttr("id");
        dialog.find(".message").html(msg);

        dialog.addClass(type);
        revealDialog(dialog);
    };

    CountlyHelpers.confirm = function (msg, type, callback, buttonText) {
        var dialog = $("#cly-confirm").clone();
        dialog.removeAttr("id");
        dialog.find(".message").html(msg);

        if (buttonText && buttonText.length == 2) {
            dialog.find("#dialog-cancel").text(buttonText[0]);
            dialog.find("#dialog-continue").text(buttonText[1]);
        }

        dialog.addClass(type);
        revealDialog(dialog);

        dialog.find("#dialog-cancel").on('click', function () {
            callback(false);
        });

        dialog.find("#dialog-continue").on('click', function () {
            callback(true);
        });
    };
	
	CountlyHelpers.loading = function (msg) {
        var dialog = $("#cly-loading").clone();
        dialog.removeAttr("id");
        dialog.find(".message").html(msg);
        dialog.addClass('cly-loading');
        revealDialog(dialog);
        return dialog;
    };

    CountlyHelpers.setUpDateSelectors = function(self) {
        $("#month").text(moment().year());
        $("#day").text(moment().format("MMM"));
        $("#yesterday").text(moment().subtract("days",1).format("Do"));

        $("#date-selector").find(">.button").click(function () {
            if ($(this).hasClass("selected")) {
                return true;
            }

            self.dateFromSelected = null;
            self.dateToSelected = null;

            $(".date-selector").removeClass("selected").removeClass("active");
            $(this).addClass("selected");
            var selectedPeriod = $(this).attr("id");

            if (countlyCommon.getPeriod() == selectedPeriod) {
                return true;
            }

            countlyCommon.setPeriod(selectedPeriod);

            self.dateChanged(selectedPeriod);

            $("#" + selectedPeriod).addClass("active");
        });

        $("#date-selector").find(">.button").each(function(){
            if (countlyCommon.getPeriod() == $(this).attr("id")) {
                $(this).addClass("active").addClass("selected");
            }
        });
    };

    CountlyHelpers.initializeSelect = function (element) {
        element = element || $("#content-container");
        element.off("click", ".cly-select").on("click", ".cly-select", function (e) {
            if ($(this).hasClass("disabled")) {
                return true;
            }

            $(this).removeClass("req");

            var selectItems = $(this).find(".select-items"),
                itemCount = selectItems.find(".item").length;

            if (!selectItems.length) {
                return false;
            }

            $(".cly-select").find(".search").remove();

            if (selectItems.is(":visible")) {
                $(this).removeClass("active");
            } else {
                $(".cly-select").removeClass("active");
                $(".select-items").hide();
                $(this).addClass("active");

                if (itemCount > 10 && !$(this).hasClass("centered")) {
                    $("<div class='search'><div class='inner'><input type='text' /><i class= fa fa-search'></i></div></div>").insertBefore($(this).find(".select-items"));
                }
            }

            if ($(this).hasClass("centered")) {
                var height = $(this).find(".select-items").height();
                $(this).find(".select-items").css("margin-top", (-(height/2).toFixed(0) - ($(this).height()/2).toFixed(0)) + "px");
            }

            if ($(this).find(".select-items").is(":visible")) {
                $(this).find(".select-items").hide();
            } else {
                $(this).find(".select-items").show();
                $(this).find(".select-items>div").addClass("scroll-list");
                $(this).find(".scroll-list").slimScroll({
                    height:'100%',
                    start:'top',
                    wheelStep:10,
                    position:'right',
                    disableFadeOut:true
                });
            }

            $(this).find(".search input").focus();

            $("#date-picker").hide();
            e.stopPropagation();
        });

        element.off("click", ".select-items .item").on("click", ".select-items .item", function () {
            var selectedItem = $(this).parents(".cly-select").find(".text");
            selectedItem.text($(this).text());
            selectedItem.data("value", $(this).data("value"));
        });

        element.off("click", ".cly-select .search").on("click", ".cly-select .search", function (e) {
            e.stopPropagation();
        });

        element.off("keyup", ".cly-select .search input").on("keyup", ".cly-select .search input", function(event) {
            if (!$(this).val()) {
                $(this).parents(".cly-select").find(".item").removeClass("hidden");
            } else {
                $(this).parents(".cly-select").find(".item:not(:contains('" + $(this).val() + "'))").addClass("hidden");
                $(this).parents(".cly-select").find(".item:contains('" + $(this).val() + "')").removeClass("hidden");
            }
        });

        element.off('mouseenter').on('mouseenter', ".cly-select .item", function () {
            var item = $(this);

            if (this.offsetWidth < this.scrollWidth && !item.attr('title')) {
                item.attr('title', item.text());
            }
        });

        $(window).click(function () {
            $(".select-items").hide();
            $(".cly-select").find(".search").remove();
        });
    };

    CountlyHelpers.refreshTable = function(dTable, newDataArr) {
        var oSettings = dTable.fnSettings();
        dTable.fnClearTable(false);

		if(newDataArr && newDataArr.length)
			for (var i=0; i < newDataArr.length; i++) {
				dTable.oApi._fnAddData(oSettings, newDataArr[i]);
			}

        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
        dTable.fnStandingRedraw();
    };
	
	CountlyHelpers.expandRows = function(dTable, getData){
		dTable.aOpen = [];
		dTable.on("click", "tr", function (e){
			var nTr = this;
			var id = $(nTr).attr("id");
			if(!id){
				e.stopPropagation();
			}
			else{
				var i = $.inArray( id, dTable.aOpen );
			
				if ( i === -1 ) {
					$(nTr).addClass("selected");
					var nDetailsRow = dTable.fnOpen( nTr, getData(dTable.fnGetData( nTr )), 'details' );
					$('div.datatablesubrow', nDetailsRow).slideDown();
					dTable.aOpen.push( id );
				}
				else {
					$(nTr).removeClass("selected");
					$('div.datatablesubrow', $(nTr).next()[0]).slideUp( function () {
						dTable.fnClose( nTr );
						dTable.aOpen.splice( i, 1 );
					} );
				}
			}
		});
	};
	
	CountlyHelpers.reopenRows = function(dTable, getData){
		var nTr;
		var oSettings = dTable.fnSettings();
		if(dTable.aOpen){
			$.each( dTable.aOpen, function ( i, id ) {
				var nTr = $("#"+id)[0];
				$(nTr).addClass("selected");
				var nDetailsRow = dTable.fnOpen( nTr, getData(dTable.fnGetData( nTr )), 'details' );
				$('div.datatablesubrow', nDetailsRow).show();
			});
		}
	};
	
	CountlyHelpers.appIdsToNames = function(context){
        var ret = "";

        for (var i = 0; i < context.length; i++) {
            if (!context[i]) {
                continue;
            } else if (!countlyGlobal['apps'][context[i]]) {
                ret += 'deleted app';
            } else {
                ret += countlyGlobal['apps'][context[i]]["name"];
            }

            if (context.length > 1 && i != context.length - 1) {
                ret += ", ";
            }
        }

        return ret;
    };
    
    CountlyHelpers.loadJS = function(js, callback){
		var fileref=document.createElement('script'),
        loaded;
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", js);
        if (callback) {
            fileref.onreadystatechange = fileref.onload = function() {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName("head")[0].appendChild(fileref);
	};
    
    CountlyHelpers.loadCSS = function(css, callback){
		var fileref=document.createElement("link"),
        loaded;
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", css);
        if (callback) {
            fileref.onreadystatechange = fileref.onload = function() {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName("head")[0].appendChild(fileref)
	};

    CountlyHelpers.messageText = function(messagePerLocale) {
        if (!messagePerLocale) {
            return '';
        } else if (messagePerLocale['default']) {
            return messagePerLocale['default'];
        } else if (messagePerLocale.en) {
            return messagePerLocale.en;
        } else {
            for (var locale in messagePerLocale) return messagePerLocale[locale];
        }
        return '';
    };

    CountlyHelpers.clip = function(f) {
        return function(opt) {
            var res = f(opt);
            return '<div class="clip' + (res ? '' : ' nothing') + '">' + (res || jQuery.i18n.map['push.no-message']) + '</div>';
        }
    };
	
	CountlyHelpers.createMetricModel = function (countlyMetric, _name, $, fetchValue) {
		//Private Properties
		var _periodObj = {},
			_Db = {},
			_metrics = [],
			_activeAppKey = 0,
			_initialized = false,
			_period = null;
	
		//Public Methods
		countlyMetric.initialize = function () {
			if (_initialized &&  _period == countlyCommon.getPeriodForAjax() && _activeAppKey == countlyCommon.ACTIVE_APP_KEY) {
				return this.refresh();
			}
	
			_period = countlyCommon.getPeriodForAjax();
	
			if (!countlyCommon.DEBUG) {
				_activeAppKey = countlyCommon.ACTIVE_APP_KEY;
				_initialized = true;
	
				return $.ajax({
					type:"GET",
					url:countlyCommon.API_PARTS.data.r,
					data:{
						"api_key":countlyGlobal.member.api_key,
						"app_id":countlyCommon.ACTIVE_APP_ID,
						"method":_name,
						"period":_period
					},
					dataType:"jsonp",
					success:function (json) {
						_Db = json;
						setMeta();
					}
				});
			} else {
				_Db = {"2012":{}};
				return true;
			}
		};
	
		countlyMetric.refresh = function () {
			_periodObj = countlyCommon.periodObj;
	
			if (!countlyCommon.DEBUG) {
	
				if (_activeAppKey != countlyCommon.ACTIVE_APP_KEY) {
					_activeAppKey = countlyCommon.ACTIVE_APP_KEY;
					return this.initialize();
				}
	
				return $.ajax({
					type:"GET",
					url:countlyCommon.API_PARTS.data.r,
					data:{
						"api_key":countlyGlobal.member.api_key,
						"app_id":countlyCommon.ACTIVE_APP_ID,
						"method":_name,
						"action":"refresh"
					},
					dataType:"jsonp",
					success:function (json) {
						countlyCommon.extendDbObj(_Db, json);
						extendMeta();
					}
				});
			} else {
				_Db = {"2012":{}};
	
				return true;
			}
		};
	
		countlyMetric.reset = function () {
			_Db = {};
			setMeta();
		};
	
		countlyMetric.getData = function () {
	
			var chartData = countlyCommon.extractTwoLevelData(_Db, _metrics, this.clearObject, [
				{
					name:_name,
					func:function (rangeArr, dataObj) {
                        if(fetchValue)
                            return fetchValue(rangeArr);
                        else
                            return rangeArr;
					}
				},
				{ "name":"t" },
				{ "name":"u" },
				{ "name":"n" }
			]);
            chartData.chartData = countlyCommon.mergeMetricsByName(chartData.chartData, _name);
			var namesData = _.pluck(chartData.chartData, _name),
				totalData = _.pluck(chartData.chartData, 't'),
				newData = _.pluck(chartData.chartData, 'n'),
				chartData2 = [],
				chartData3 = [];
	
			var sum = _.reduce(totalData, function (memo, num) {
				return memo + num;
			}, 0);
	
			for (var i = 0; i < namesData.length; i++) {
				var percent = (totalData[i] / sum) * 100;
				chartData2[i] = {data:[
					[0, totalData[i]]
				], label:namesData[i]};
			}
	
			var sum2 = _.reduce(newData, function (memo, num) {
				return memo + num;
			}, 0);
	
			for (var i = 0; i < namesData.length; i++) {
				var percent = (newData[i] / sum) * 100;
				chartData3[i] = {data:[
					[0, newData[i]]
				], label:namesData[i]};
			}
	
			chartData.chartDPTotal = {};
			chartData.chartDPTotal.dp = chartData2;
	
			chartData.chartDPNew = {};
			chartData.chartDPNew.dp = chartData3;
	
			return chartData;
		};
	
		countlyMetric.clearObject = function (obj) {
			if (obj) {
				if (!obj["t"]) obj["t"] = 0;
				if (!obj["n"]) obj["n"] = 0;
				if (!obj["u"]) obj["u"] = 0;
			}
			else {
				obj = {"t":0, "n":0, "u":0};
			}
	
			return obj;
		};
	
		countlyMetric.getBars = function () {
			return countlyCommon.extractBarData(_Db, _metrics, this.clearObject);
		};
	
		function setMeta() {
			if (_Db['meta']) {
				_metrics = (_Db['meta'][_name]) ? _Db['meta'][_name] : [];
			} else {
				_metrics = [];
			}
		}
	
		function extendMeta() {
			if (_Db['meta']) {
				_metrics = countlyCommon.union(_metrics, _Db['meta'][_name]);
			}
		}
	
	};

    CountlyHelpers.initializeTextSelect = function () {
        $("#content-container").on("click", ".cly-text-select", function (e) {
            if ($(this).hasClass("disabled")) {
                return true;
            }

            initItems($(this));

            $("#date-picker").hide();
            e.stopPropagation();
        });

        $("#content-container").on("click", ".select-items .item", function () {
            var selectedItem = $(this).parents(".cly-text-select").find(".text");
            selectedItem.text($(this).text());
            selectedItem.data("value", $(this).data("value"));
            selectedItem.val($(this).text());
        });

        $("#content-container").on("keyup", ".cly-text-select input", function(event) {
            initItems($(this).parents(".cly-text-select"), true);

            $(this).data("value", $(this).val());

            if (!$(this).val()) {
                $(this).parents(".cly-text-select").find(".item").removeClass("hidden");
            } else {
                $(this).parents(".cly-text-select").find(".item:not(:contains('" + $(this).val() + "'))").addClass("hidden");
                $(this).parents(".cly-text-select").find(".item:contains('" + $(this).val() + "')").removeClass("hidden");
            }
        });

        function initItems(select, forceShow) {
            select.removeClass("req");

            var selectItems = select.find(".select-items");

            if (!selectItems.length) {
                return false;
            }

            if (select.find(".select-items").is(":visible") && !forceShow) {
                select.find(".select-items").hide();
            } else {
                select.find(".select-items").show();
                select.find(".select-items>div").addClass("scroll-list");
                select.find(".scroll-list").slimScroll({
                    height:'100%',
                    start:'top',
                    wheelStep:10,
                    position:'right',
                    disableFadeOut:true
                });
            }
        }

        $(window).click(function () {
            $(".select-items").hide();
        });
    };

    CountlyHelpers.initializeHugeDropdown = function () {
        var dropdownHideFunc;

        $("#content-container").on("mouseenter", ".cly-huge-dropdown-activator", function (e) {
            clearInterval(dropdownHideFunc);

            var target = $(this).next(".cly-huge-dropdown");

            target.trigger("huge-dropdown-init");
            target.find(".scroll").slimScroll({
                height:'100%',
                start:'top',
                wheelStep:10,
                position:'right',
                disableFadeOut:true
            });

            target.find(".button-container .title").text($(this).text());
            target.fadeIn("slow");
        });

        $("#content-container").on("mouseleave", ".cly-huge-dropdown", function (e) {
            var target = $(this);
            dropdownHideFunc = setTimeout(function() { target.fadeOut("fast") }, 500);
        });

        $("#content-container").on("mouseenter", ".cly-huge-dropdown", function (e) {
            clearInterval(dropdownHideFunc);
        });

        $("#content-container").on("close", ".cly-huge-dropdown", function (e) {
            $(this).fadeOut("fast");
        });
    };

    function revealDialog(dialog) {
        $("body").append(dialog);

        var dialogHeight = dialog.outerHeight()+5,
            dialogWidth = dialog.outerWidth()+5;

        dialog.css({
            "height":dialogHeight,
            "margin-top":Math.floor(-dialogHeight / 2),
            "width":dialogWidth,
            "margin-left":Math.floor(-dialogWidth / 2)
        });

        $("#overlay").fadeIn();
        dialog.fadeIn(app.tipsify.bind(app, $("#help-toggle").hasClass("active"), dialog));
    }
	
	function changeDialogHeight(dialog, height, animate) {
        var dialogHeight = height || dialog.attr('data-height') || dialog.height() + 15,
            dialogWidth = dialog.width(),
            maxHeight = $("#sidebar").height() - 40;

        dialog.attr('data-height', height);

        if (dialogHeight > maxHeight) {
            dialog[animate ? 'animate' : 'css']({
                "height":maxHeight,
                "margin-top":Math.floor(-maxHeight / 2),
                "width":dialogWidth,
                "margin-left":Math.floor(-dialogWidth / 2),
                "overflow-y": "auto"
            });
        } else {
            dialog[animate ? 'animate' : 'css']({
                "height":dialogHeight,
                "margin-top":Math.floor(-dialogHeight / 2),
                "width":dialogWidth,
                "margin-left":Math.floor(-dialogWidth / 2)
            });
        }
    }
	
	CountlyHelpers.revealDialog = revealDialog;
    CountlyHelpers.changeDialogHeight = changeDialogHeight;

    CountlyHelpers.removeDialog = function(dialog){
        dialog.remove();
        $("#overlay").fadeOut();
    };

    $(document).ready(function () {
        $("#overlay").click(function () {
            var dialog = $(".dialog:visible:not(.cly-loading)");
            if (dialog.length) {
                dialog.fadeOut().remove();
                $(this).hide();
            }
        });

        $("#dialog-ok, #dialog-cancel, #dialog-continue").live('click', function () {
            $(this).parents(".dialog:visible").fadeOut().remove();
            if (!$('.dialog:visible').length) $("#overlay").hide();
        });

        $(document).keyup(function (e) {
            // ESC
            if (e.keyCode == 27) {
                $(".dialog:visible").animate({
                    top:0,
                    opacity:0
                }, {
                    duration:1000,
                    easing:'easeOutQuart',
                    complete:function () {
                        $(this).remove();
                    }
                });

                $("#overlay").hide();
            }
        });
    });

}(window.CountlyHelpers = window.CountlyHelpers || {}, jQuery));

$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

window.DashboardView = countlyView.extend({
    selectedView:"#draw-total-sessions",
    initialize:function () {
        this.curMap = "map-list-sessions";
        this.template = Handlebars.compile($("#dashboard-template").html());
    },
    beforeRender: function() {
        this.maps = {
            "map-list-sessions": {id:'total', label:jQuery.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"},
            "map-list-users": {id:'total', label:jQuery.i18n.map["sidebar.analytics.users"], type:'number', metric:"u"},
            "map-list-new": {id:'total', label:jQuery.i18n.map["common.table.new-users"], type:'number', metric:"n"}
        };
        return $.when(countlyUser.initialize(), countlyCarrier.initialize(), countlyDeviceDetails.initialize()).then(function () {});
    },
    afterRender: function() {
        var self = this;
        countlyLocation.drawGeoChart({height:290, metric:self.maps[self.curMap]});
    },
    pageScript:function () {
        $("#total-user-estimate-ind").on("click", function() {
            CountlyHelpers.alert($("#total-user-estimate-exp").html(), "black");
        });

        $(".widget-content .inner").click(function () {
            $(".big-numbers").removeClass("active");
            $(".big-numbers .select").removeClass("selected");
            $(this).parent(".big-numbers").addClass("active");
            $(this).find('.select').addClass("selected");
        });

        $(".bar-inner").on({
            mouseenter:function () {
                var number = $(this).parent().next();

                number.text($(this).data("item"));
                number.css({"color":$(this).css("background-color")});
            },
            mouseleave:function () {
                var number = $(this).parent().next();

                number.text(number.data("item"));
                number.css({"color":$(this).parent().find(".bar-inner:first-child").css("background-color")});
            }
        });

        var self = this;
        $(".big-numbers .inner").click(function () {
            var elID = $(this).find('.select').attr("id");

            if (self.selectedView == "#" + elID) {
                return true;
            }

            self.selectedView = "#" + elID;
            self.drawGraph();
        });
        
        this.countryList();
        $(".map-list .cly-button-group .icon-button").click(function(){
            $(".map-list .cly-button-group .icon-button").removeClass("active");
            $(this).addClass("active");
            self.curMap = $(this).attr("id");
            countlyLocation.refreshGeoChart(self.maps[self.curMap]);
            self.countryList();
        });

        app.localize();
    },
    drawGraph:function() {
        var sessionDP = {};

        switch (this.selectedView) {
            case "#draw-total-users":
                sessionDP = countlySession.getUserDPActive();
                break;
            case "#draw-new-users":
                sessionDP = countlySession.getUserDPNew();
                break;
            case "#draw-total-sessions":
                sessionDP = countlySession.getSessionDPTotal();
                break;
            case "#draw-time-spent":
                sessionDP = countlySession.getDurationDPAvg();
                break;
            case "#draw-total-time-spent":
                sessionDP = countlySession.getDurationDP();
                break;
            case "#draw-avg-events-served":
                sessionDP = countlySession.getEventsDPAvg();
                break;
        }

        _.defer(function () {
            countlyCommon.drawTimeGraph(sessionDP.chartDP, "#dashboard-graph");
        });
    },
    renderCommon:function (isRefresh, isDateChange) {
        var sessionData = countlySession.getSessionData(),
            locationData = countlyLocation.getLocationData({maxCountries:7}),
            sessionDP = countlySession.getSessionDPTotal();

        this.locationData = locationData;
        sessionData["page-title"] = countlyCommon.getDateRange();
        sessionData["usage"] = [
            {
                "title":jQuery.i18n.map["common.total-sessions"],
                "data":sessionData.usage['total-sessions'],
                "id":"draw-total-sessions",
                "help":"dashboard.total-sessions"
            },
            {
                "title":jQuery.i18n.map["common.total-users"],
                "data":sessionData.usage['total-users'],
                "id":"draw-total-users",
                "help":"dashboard.total-users"
            },
            {
                "title":jQuery.i18n.map["common.new-users"],
                "data":sessionData.usage['new-users'],
                "id":"draw-new-users",
                "help":"dashboard.new-users"
            },
            {
                "title":jQuery.i18n.map["dashboard.time-spent"],
                "data":sessionData.usage['total-duration'],
                "id":"draw-total-time-spent",
                "help":"dashboard.total-time-spent"
            },
            {
                "title":jQuery.i18n.map["dashboard.avg-time-spent"],
                "data":sessionData.usage['avg-duration-per-session'],
                "id":"draw-time-spent",
                "help":"dashboard.avg-time-spent2"
            },
            {
                "title":jQuery.i18n.map["dashboard.avg-reqs-received"],
                "data":sessionData.usage['avg-events'],
                "id":"draw-avg-events-served",
                "help":"dashboard.avg-reqs-received"
            }
        ];
        sessionData["bars"] = [
            {
                "title":jQuery.i18n.map["common.bar.top-platform"],
                "data":countlyDeviceDetails.getPlatformBars(),
                "help":"dashboard.top-platforms"
            },
            {
                "title":jQuery.i18n.map["common.bar.top-resolution"],
                "data":countlyDeviceDetails.getResolutionBars(),
                "help":"dashboard.top-resolutions"
            },
            {
                "title":jQuery.i18n.map["common.bar.top-carrier"],
                "data":countlyCarrier.getCarrierBars(),
                "help":"dashboard.top-carriers"
            },
            {
                "title":jQuery.i18n.map["common.bar.top-users"],
                "data":countlySession.getTopUserBars(),
                "help":"dashboard.top-users"
            }
        ];

        this.templateData = sessionData;

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            $(this.selectedView).parents(".big-numbers").addClass("active");
            this.pageScript();

            if (!isDateChange) {
                this.drawGraph();
            }
        }
    },
    restart:function () {
        this.refresh(true);
    },
    refresh:function (isFromIdle) {

        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);

            var newPage = $("<div>" + self.template(self.templateData) + "</div>");
            $(".dashboard-summary").replaceWith(newPage.find(".dashboard-summary"));
            $(".widget-header .title").replaceWith(newPage.find(".widget-header .title"));

            $("#big-numbers-container").find(".big-numbers").each(function(i, el) {
                var newEl = $(newPage.find("#big-numbers-container .big-numbers")[i]);

                if (isFromIdle) {
                    $(el).find(".number").replaceWith(newEl.find(".number"));
                } else {
                    var currNumberEl = $(el).find(".number .value"),
                        currNumberVal = parseFloat(currNumberEl.text()) || 0,
                        currNumPost = currNumberEl.text().replace(currNumberVal, ''),
                        targetValue = parseFloat(newEl.find(".number .value").text()),
                        targetPost = newEl.find(".number .value").text().replace(targetValue, '');

                    if (targetValue != currNumberVal) {
                        if (targetValue < currNumberVal || (targetPost.length && targetPost != currNumPost)) {
                            $(el).find(".number").replaceWith(newEl.find(".number"));
                        } else {
                            jQuery({someValue: currNumberVal, currEl: currNumberEl}).animate({someValue: targetValue}, {
                                duration: 2000,
                                easing:'easeInOutQuint',
                                step: function() {
                                    if ((targetValue + "").indexOf(".") == -1) {
                                        this.currEl.text(Math.round(this.someValue) + targetPost);
                                    } else {
                                        this.currEl.text(parseFloat((this.someValue).toFixed(1)) + targetPost);
                                    }
                                }
                            });
                        }
                    }
                }

                $(el).find(".trend").replaceWith(newEl.find(".trend"));
                $(el).find(".spark").replaceWith(newEl.find(".spark"));
            });

            self.drawGraph();

            $(".usparkline").peity("bar", { width:"100%", height:"30", colour:"#6BB96E", strokeColour:"#6BB96E", strokeWidth:2 });
            $(".dsparkline").peity("bar", { width:"100%", height:"30", colour:"#C94C4C", strokeColour:"#C94C4C", strokeWidth:2 });

            if (newPage.find("#map-list-right").length == 0) {
                $("#map-list-right").remove();
            }

            if ($("#map-list-right").length) {
                $("#map-list-right").replaceWith(newPage.find("#map-list-right"));
            } else {
                $(".widget.map-list").prepend(newPage.find("#map-list-right"));
            }

            self.pageScript();
        });
    },
    countryList:function(){
        var self = this;
        $("#map-list-right").empty();
        var country;
        for(var i = 0; i < self.locationData.length; i++){
            country = self.locationData[i];
            $("#map-list-right").append('<div class="map-list-item">'+
                '<div class="flag" style="background-image:url(\''+countlyGlobal["cdn"]+'images/flags/'+country.code+'.png\');"></div>'+
                '<div class="country-name">'+country.country+'</div>'+
                '<div class="total">'+country[self.maps[self.curMap].metric]+'</div>'+
            '</div>');
        }
    },
    destroy:function () {
        $("#content-top").html("");
    }
});

window.SessionView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyUser.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {

        var sessionData = countlySession.getSessionData(),
            sessionDP = countlySession.getSessionDP();

        this.templateData = {
            "page-title":jQuery.i18n.map["sessions.title"],
            "logo-class":"sessions",
            "big-numbers":{
                "count":3,
                "items":[
                    {
                        "title":jQuery.i18n.map["common.total-sessions"],
                        "total":sessionData.usage["total-sessions"].total,
                        "trend":sessionData.usage["total-sessions"].trend,
                        "help":"sessions.total-sessions"
                    },
                    {
                        "title":jQuery.i18n.map["common.new-sessions"],
                        "total":sessionData.usage["new-users"].total,
                        "trend":sessionData.usage["new-users"].trend,
                        "help":"sessions.new-sessions"
                    },
                    {
                        "title":jQuery.i18n.map["common.unique-sessions"],
                        "total":sessionData.usage["total-users"].total,
                        "trend":sessionData.usage["total-users"].trend,
                        "help":"sessions.unique-sessions"
                    }
                ]
            }
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            countlyCommon.drawTimeGraph(sessionDP.chartDP, "#dashboard-graph");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": sessionDP.chartData,
                "aoColumns": [
                    { "mData": "date", "sType":"customDate", "sTitle": jQuery.i18n.map["common.date"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.unique-sessions"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(countlyUser.initialize()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);
            newPage = $("<div>" + self.template(self.templateData) + "</div>");
            $(self.el).find("#big-numbers-container").html(newPage.find("#big-numbers-container").html());

            var sessionDP = countlySession.getSessionDP();
            countlyCommon.drawTimeGraph(sessionDP.chartDP, "#dashboard-graph");
            CountlyHelpers.refreshTable(self.dtable, sessionDP.chartData);

            app.localize();
        });
    }
});

window.UserView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyUser.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var sessionData = countlySession.getSessionData(),
            userDP = countlySession.getUserDP();

        this.templateData = {
            "page-title":jQuery.i18n.map["users.title"],
            "logo-class":"users",
            "big-numbers":{
                "count":3,
                "items":[
                    {
                        "title":jQuery.i18n.map["common.total-users"],
                        "total":sessionData.usage["total-users"].total,
                        "trend":sessionData.usage["total-users"].trend,
                        "help":"users.total-users"
                    },
                    {
                        "title":jQuery.i18n.map["common.new-users"],
                        "total":sessionData.usage["new-users"].total,
                        "trend":sessionData.usage["new-users"].trend,
                        "help":"users.new-users"
                    },
                    {
                        "title":jQuery.i18n.map["common.returning-users"],
                        "total":sessionData.usage["returning-users"].total,
                        "trend":sessionData.usage["returning-users"].trend,
                        "help":"users.returning-users"
                    }
                ]
            }
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            countlyCommon.drawTimeGraph(userDP.chartDP, "#dashboard-graph");
            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": userDP.chartData,
                "aoColumns": [
                    { "mData": "date", "sType":"customDate", "sTitle": jQuery.i18n.map["common.date"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] },
                    { "mData": "returning", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.returning-users"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(countlyUser.initialize()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);
            newPage = $("<div>" + self.template(self.templateData) + "</div>");

            $(self.el).find("#big-numbers-container").replaceWith(newPage.find("#big-numbers-container"));

            var userDP = countlySession.getUserDP();
            countlyCommon.drawTimeGraph(userDP.chartDP, "#dashboard-graph");
            CountlyHelpers.refreshTable(self.dtable, userDP.chartData);

            app.localize();
        });
    }
});

window.AllAppsView = countlyView.extend({
	selectedView:"#draw-total-sessions",
	selectedApps: {"all":true},
	selectedCount: 0,
	initialize:function () {
        this.template = Handlebars.compile($("#template-allapps").html());
    },
    beforeRender: function() {
        return $.when(countlyAllApps.initialize()).then(function () {});
    },
	pageScript:function () {
        $(".widget-content .inner").click(function () {
            $(".big-numbers").removeClass("active");
            $(".big-numbers .select").removeClass("selected");
            $(this).parent(".big-numbers").addClass("active");
            $(this).find('.select').addClass("selected");
        });

        var self = this;
        $(".big-numbers .inner").click(function () {
            var elID = $(this).find('.select').attr("id");

            if (self.selectedView == "#" + elID) {
                return true;
            }

            self.selectedView = "#" + elID;
            self.drawGraph();
        });

        app.localize();
    },
    drawGraph:function() {
        var sessionDP = [];
        var sessions = countlyAllApps.getSessionData();
        var data, color;
        var cnt = 0;
        for(var i in this.selectedApps){
            try{
                data = sessions[i][this.selectedView];
                color = countlyCommon.GRAPH_COLORS[cnt];
                if(i == "all")
                    sessionDP.push({data:data.data, label:data.label + " for All Apps", color:color});
                else
                    sessionDP.push({data:data.data, label:data.label + " for "+countlyGlobal["apps"][i].name, color:color});
                $("#"+i+" .color").css("background-color", color);
                cnt++;
            }
            catch(err){

            }
        }
        _.defer(function () {
            countlyCommon.drawTimeGraph(sessionDP, "#dashboard-graph");

        });
    },
    renderCommon:function (isRefresh) {
        $("#sidebar-app-select").find(".text").text(jQuery.i18n.map["allapps.title"]);
        $("#sidebar-app-select").find(".logo").css("background-image", "url('"+countlyGlobal["cdn"]+"images/favicon.png')");
        $("#sidebar-menu > .item").addClass("hide");
        $("#management-menu").removeClass("hide");
        $("#allapps-menu").removeClass("hide").css("display", "block");
        var appData = countlyAllApps.getData();

        this.templateData = {
            "page-title":jQuery.i18n.map["allapps.title"],
            "logo-class":"platforms",
            "usage":[
                {
                    "title":jQuery.i18n.map["common.total-sessions"],
                    "data":0,
                    "id":"draw-total-sessions",
                    "help":"dashboard.total-sessions"
                },
                {
                    "title":jQuery.i18n.map["common.total-users"],
                    "data":0,
                    "id":"draw-total-users",
                    "help":"dashboard.total-users"
                },
                {
                    "title":jQuery.i18n.map["common.new-users"],
                    "data":0,
                    "id":"draw-new-users",
                    "help":"dashboard.new-users"
                },
                {
                    "title":jQuery.i18n.map["dashboard.time-spent"],
                    "data":0,
                    "id":"draw-total-time-spent",
                    "help":"dashboard.total-time-spent"
                },
                {
                    "title":jQuery.i18n.map["dashboard.avg-time-spent"],
                    "data":0,
                    "id":"draw-time-spent",
                    "help":"dashboard.avg-time-spent2"
                },
                {
                    "title":jQuery.i18n.map["dashboard.avg-reqs-received"],
                    "data":0,
                    "id":"draw-avg-events-served",
                    "help":"dashboard.avg-reqs-received"
                }
            ]
        };
        var self = this;
        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            $(this.selectedView).parents(".big-numbers").addClass("active");
            this.pageScript();
            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": appData,
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                    $(nRow).attr("id", aData._id);
                },
                "aoColumns": [
                    { "mData": function(row, type){if(self.selectedApps[row._id]) return "<i class='check fa fa-check'></i>"; else return "<i class='check fa fa-unchecked'></i>";}, "sWidth":"10px", "bSortable":false},
                    { "mData": function(row, type){if(type == "display"){ var ret; if(row["_id"] == "all") ret = "<div class='logo' style='background-image: url("+countlyGlobal["path"]+"/images/favicon.png);'></div> "; else ret = "<div class='logo' style='background-image: url("+countlyGlobal["cdn"]+"appimages/" + row["_id"] + ".png);'></div> "; return ret+row.name+"<div class='color'></div>";} else return row.name;}, "sType":"string", "sTitle": jQuery.i18n.map["allapps.app-name"], "sClass": "break" },
                    { "mData": function(row, type){if(type == "display") return "<div class='trend' style='background-image:url("+countlyGlobal["cdn"]+"images/dashboard/"+row.sessions.trend+"trend.png);'></div> "+row.sessions.total; else return row.sessions.total;}, "sType":"numeric", "sTitle": jQuery.i18n.map["allapps.total-sessions"] },
                    { "mData": function(row, type){if(type == "display") return "<div class='trend' style='background-image:url("+countlyGlobal["cdn"]+"images/dashboard/"+row.users.trend+"trend.png);'></div> "+row.users.total; else return row.users.total;}, "sType":"numeric", "sTitle": jQuery.i18n.map["allapps.total-users"] },
                    { "mData": function(row, type){if(type == "display") return "<div class='trend' style='background-image:url("+countlyGlobal["cdn"]+"images/dashboard/"+row.newusers.trend+"trend.png);'></div> "+row.newusers.total; else return row.newusers.total;}, "sType":"numeric", "sTitle": jQuery.i18n.map["allapps.new-users"] },
                    { "mData": function(row, type){if(type == "display") return "<div class='trend' style='background-image:url("+countlyGlobal["cdn"]+"images/dashboard/"+row.duration.trend+"trend.png);'></div> "+countlyCommon.timeString(row.duration.total); else return row.duration.total;}, "sType":"numeric", "sTitle": jQuery.i18n.map["allapps.total-duration"] },
                    { "mData": function(row, type){if(type == "display") return "<div class='trend' style='background-image:url("+countlyGlobal["cdn"]+"images/dashboard/"+row.avgduration.trend+"trend.png);'></div> "+countlyCommon.timeString(row.avgduration.total); else return row.avgduration.total;}, "sType":"numeric", "sTitle": jQuery.i18n.map["allapps.average-duration"] }
                ]
            }));
            this.drawGraph();
            $(".dataTable-bottom").append("<div clas='dataTables_info' style='float: right; margin-top:2px; margin-right: 10px;'>Maximum number of applications to be compared (10)</div>")

            $(".d-table").stickyTableHeaders();

            $('.allapps tbody').on("click", "tr", function (event){
                var td = $(event.target).closest("td");
                var row = $(this);
                if(row.children().first().is(td))
                {
                    if(self.selectedApps[row.attr("id")]){
                        row.find(".check").removeClass("fa fa-check").addClass("fa fa-unchecked");
                        row.find(".color").css("background-color", "transparent");
                        delete self.selectedApps[row.attr("id")];
                        if(row.attr("id") != "all")
                            self.selectedCount--;
                        if(self.selectedCount==0){
                            $("#empty-graph").show();
                            $(".big-numbers").removeClass("active");
                            $(".big-numbers .select").removeClass("selected");
                        }

                    }
                    else if(self.selectedCount < 10 || row.attr("id") == "all"){
                        if(self.selectedCount==0){
                            $("#empty-graph").hide();
                            $(self.selectedView).parents(".big-numbers").addClass("active");
                        }
                        if(row.attr("id") == "all"){
                            $(".check.icon-check").removeClass("fa fa-check").addClass("fa fa-unchecked");
                            $('.d-table').find(".color").css("background-color", "transparent");
                            self.selectedApps = {};
                            self.selectedCount = 0;
                        }
                        else{
                            if(self.selectedApps["all"]){
                                $(".d-table #all .check.icon-check").removeClass("fa fa-check").addClass("fa fa-unchecked");
                                $('.d-table #all').find(".color").css("background-color", "transparent");
                                delete self.selectedApps["all"];
                            }
                            self.selectedCount++;
                        }
                        row.find(".check").removeClass("fa fa-unchecked").addClass("fa fa-check");
                        self.selectedApps[row.attr("id")] = true;
                    }
                    self.drawGraph();
                }
                else
                {
                    if(row.attr("id") != "all"){
                        var aData = self.dtable.fnGetData( this );
                        countlyAllApps.setApp(row.attr("id"));
                        $("#sidebar-app-select").find(".logo").css("background-image", "url('"+countlyGlobal["cdn"]+"appimages/" + row.attr("id") + ".png')");
                        $("#sidebar-app-select").find(".text").text(aData["name"]);
                        $("#sidebar-menu > .item").removeClass("hide");
                        $("#allapps-menu").css("display", "none");
                        window.location.hash = "#/";
                    }
                }
            });
        }
    },
    refresh:function () {
        var self = this;
        $.when(countlyAllApps.initialize()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);
            newPage = $("<div>" + self.template(self.templateData) + "</div>");

            var appData = countlyAllApps.getData();
            CountlyHelpers.refreshTable(self.dtable, appData);
            self.drawGraph();
            app.localize();
        });
    }
});

window.LoyaltyView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyUser.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var loyaltyData = countlyUser.getLoyaltyData();

        this.templateData = {
            "page-title":jQuery.i18n.map["user-loyalty.title"],
            "logo-class":"loyalty",
            "chart-helper":"loyalty.chart",
            "table-helper":"loyalty.table"
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            countlyCommon.drawGraph(loyaltyData.chartDP, "#dashboard-graph", "bar");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": loyaltyData.chartData,
                "aoColumns": [
                    { "mData": "l", sType:"loyalty", "sTitle": jQuery.i18n.map["user-loyalty.table.session-count"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.number-of-users"] },
                    { "mData": "percent", "sType":"percent", "sTitle": jQuery.i18n.map["common.percent"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(countlyUser.initialize()).then(function () {
            if (app.activeView != self) {
                return false;
            }

            var loyaltyData = countlyUser.getLoyaltyData();
            countlyCommon.drawGraph(loyaltyData.chartDP, "#dashboard-graph", "bar");
            CountlyHelpers.refreshTable(self.dtable, loyaltyData.chartData);
        });
    }
});

window.CountriesView = countlyView.extend({
    cityView: (store.get("countly_location_city")) ? store.get("countly_active_app") : false,
    initialize:function () {
        this.curMap = "map-list-sessions";
        this.template = Handlebars.compile($("#template-analytics-countries").html());
    },
    beforeRender: function() {
        this.maps = {
            "map-list-sessions": {id:'total', label:jQuery.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"},
            "map-list-users": {id:'total', label:jQuery.i18n.map["sidebar.analytics.users"], type:'number', metric:"u"},
            "map-list-new": {id:'total', label:jQuery.i18n.map["common.table.new-users"], type:'number', metric:"n"}
        };
        return $.when(countlyUser.initialize(), countlyCity.initialize()).then(function () {});
    },
    drawTable: function() {
        var tableFirstColTitle = (this.cityView) ? jQuery.i18n.map["countries.table.city"] : jQuery.i18n.map["countries.table.country"],
            locationData,
            firstCollData = "country_flag"

        if (this.cityView) {
            locationData = countlyCity.getLocationData();
            firstCollData = "city";
        } else {
            locationData = countlyLocation.getLocationData();
        }

        var activeApp = countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID];
        if (activeApp && activeApp.country) {
            $("#toggle-map").text(countlyLocation.getCountryName(activeApp.country));
        }

        this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
            "aaData": locationData,
            "aoColumns": [
                { "mData": firstCollData, "sTitle": tableFirstColTitle },
                { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
            ]
        }));

        $(".d-table").stickyTableHeaders();
    },
    renderCommon:function (isRefresh) {
        var sessionData = countlySession.getSessionData();

        this.templateData = {
            "page-title":jQuery.i18n.map["countries.title"],
            "logo-class":"countries",
            "big-numbers":{
                "count":3,
                "items":[
                    {
                        "title":jQuery.i18n.map["common.total-sessions"],
                        "total":sessionData.usage["total-sessions"].total,
                        "trend":sessionData.usage["total-sessions"].trend,
                        "help":"countries.total-sessions"
                    },
                    {
                        "title":jQuery.i18n.map["common.total-users"],
                        "total":sessionData.usage["total-users"].total,
                        "trend":sessionData.usage["total-users"].trend,
                        "help":"countries.total-users"
                    },
                    {
                        "title":jQuery.i18n.map["common.new-users"],
                        "total":sessionData.usage["new-users"].total,
                        "trend":sessionData.usage["new-users"].trend,
                        "help":"countries.new-users"
                    }
                ]
            },
            "chart-helper":"countries.chart",
            "table-helper":"countries.table"
        };

        var self = this;
        $(document).bind('selectMapCountry', function () {
            self.cityView = true;
            store.set("countly_location_city", true);
            $("#toggle-map").addClass("active");

            countlyCity.drawGeoChart({height:450, metric:self.maps[self.curMap]});
            self.refresh(true);
        });

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            if (this.cityView) {
                countlyCity.drawGeoChart({height:450, metric:self.maps[self.curMap]});
                $("#toggle-map").addClass("active");
            } else {
                countlyLocation.drawGeoChart({height:450, metric:self.maps[self.curMap]});
            }

            this.drawTable();

            if (countlyCommon.CITY_DATA === false) {
                $("#toggle-map").hide();
                store.set("countly_location_city", false);
            }

            $("#toggle-map").on('click', function () {
                if ($(this).hasClass("active")) {
                    self.cityView = false;
                    countlyLocation.drawGeoChart({height:450, metric:self.maps[self.curMap]});
                    $(this).removeClass("active");
                    self.refresh(true);
                    store.set("countly_location_city", false);
                } else {
                    self.cityView = true;
                    countlyCity.drawGeoChart({height:450, metric:self.maps[self.curMap]});
                    $(this).addClass("active");
                    self.refresh(true);
                    store.set("countly_location_city", true);
                }
            });
            
            $(".geo-switch .cly-button-group .icon-button").click(function(){
                $(".geo-switch .cly-button-group .icon-button").removeClass("active");
                $(this).addClass("active");
                self.curMap = $(this).attr("id");
                if (self.cityView)
                    countlyCity.refreshGeoChart(self.maps[self.curMap]);
                else
                    countlyLocation.refreshGeoChart(self.maps[self.curMap]);
            });
        }
    },
    refresh:function (isToggle) {
        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);
            newPage = $("<div>" + self.template(self.templateData) + "</div>");

            $(self.el).find("#big-numbers-container").replaceWith(newPage.find("#big-numbers-container"));

            if (isToggle) {
                self.drawTable();
            } else {
                var locationData;
                if (self.cityView) {
                    locationData = countlyCity.getLocationData();
                    countlyCity.refreshGeoChart(self.maps[self.curMap]);
                } else {
                    locationData = countlyLocation.getLocationData();
                    countlyLocation.refreshGeoChart(self.maps[self.curMap]);
                }

                CountlyHelpers.refreshTable(self.dtable, locationData);
            }

            app.localize();
        });
    }
});

window.FrequencyView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyUser.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var frequencyData = countlyUser.getFrequencyData();

        this.templateData = {
            "page-title":jQuery.i18n.map["session-frequency.title"],
            "logo-class":"frequency",
            "chart-helper":"frequency.chart",
            "table-helper":"frequency.table"
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            countlyCommon.drawGraph(frequencyData.chartDP, "#dashboard-graph", "bar");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": frequencyData.chartData,
                "aoColumns": [
                    { "mData": "f", sType:"frequency", "sTitle": jQuery.i18n.map["session-frequency.table.time-after"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.number-of-users"] },
                    { "mData": "percent", "sType":"percent", "sTitle": jQuery.i18n.map["common.percent"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(countlyUser.initialize()).then(function () {
            if (app.activeView != self) {
                return false;
            }

            var frequencyData = countlyUser.getFrequencyData();
            countlyCommon.drawGraph(frequencyData.chartDP, "#dashboard-graph", "bar");
            CountlyHelpers.refreshTable(self.dtable, frequencyData.chartData);
        });
    }
});

window.DeviceView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyDevice.initialize(), countlyDeviceDetails.initialize()).then(function () {});
    },
    pageScript:function () {
        $(".bar-inner").on({
            mouseenter:function () {
                var number = $(this).parent().next();

                number.text($(this).data("item"));
                number.css({"color":$(this).css("background-color")});
            },
            mouseleave:function () {
                var number = $(this).parent().next();

                number.text(number.data("item"));
                number.css({"color":$(this).parent().find(".bar-inner:first-child").css("background-color")});
            }
        });

        app.localize();
    },
    renderCommon:function (isRefresh) {
        var deviceData = countlyDevice.getDeviceData();

        this.templateData = {
            "page-title":jQuery.i18n.map["devices.title"],
            "logo-class":"devices",
            "graph-type-double-pie":true,
            "pie-titles":{
                "left":jQuery.i18n.map["common.total-users"],
                "right":jQuery.i18n.map["common.new-users"]
            },
            "bars":[
                {
                    "title":jQuery.i18n.map["common.bar.top-platform"],
                    "data":countlyDeviceDetails.getPlatformBars(),
                    "help":"dashboard.top-platforms"
                },
                {
                    "title":jQuery.i18n.map["common.bar.top-platform-version"],
                    "data":countlyDeviceDetails.getOSVersionBars(),
                    "help":"devices.platform-versions2"
                },
                {
                    "title":jQuery.i18n.map["common.bar.top-resolution"],
                    "data":countlyDeviceDetails.getResolutionBars(),
                    "help":"dashboard.top-resolutions"
                }
            ],
            "chart-helper":"devices.chart",
            "table-helper":""
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            this.pageScript();

            countlyCommon.drawGraph(deviceData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(deviceData.chartDPNew, "#dashboard-graph2", "pie");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": deviceData.chartData,
                "aoColumns": [
                    { "mData": "device", "sTitle": jQuery.i18n.map["devices.table.device"] },
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
            $(self.el).find(".dashboard-summary").replaceWith(newPage.find(".dashboard-summary"));

            var deviceData = countlyDevice.getDeviceData();

            countlyCommon.drawGraph(deviceData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(deviceData.chartDPNew, "#dashboard-graph2", "pie");
            CountlyHelpers.refreshTable(self.dtable, deviceData.chartData);

            self.pageScript();
        });
    }
});

window.PlatformView = countlyView.extend({
    activePlatform:null,
    beforeRender: function() {
        return $.when(countlyDeviceDetails.initialize()).then(function () {});
    },
    pageScript:function () {
        var self = this;

        if (self.activePlatform) {
            $(".graph-segment[data-name='" + self.activePlatform + "']").addClass("active");
        } else {
            $(".graph-segment:first-child").addClass("active");
        }

        $(".graph-segment").on("click", function () {
            self.activePlatform = $(this).data("name");
            $(".graph-segment").removeClass("active");
            $(this).addClass("active");

            self.refresh();
        });

        app.localize();
    },
    renderCommon:function (isRefresh) {
        var oSVersionData = countlyDeviceDetails.getOSVersionData(this.activePlatform),
            platformData = countlyDeviceDetails.getPlatformData();

        this.templateData = {
            "page-title":jQuery.i18n.map["platforms.title"],
            "logo-class":"platforms",
            "graph-type-double-pie":true,
            "pie-titles":{
                "left":jQuery.i18n.map["platforms.pie-left"],
                "right":jQuery.i18n.map["platforms.pie-right"]
            },
            "graph-segmentation":oSVersionData.os,
            "chart-helper":"platform-versions.chart",
            "table-helper":"",
            "two-tables": true
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            this.pageScript();

            countlyCommon.drawGraph(platformData.chartDP, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(oSVersionData.chartDP, "#dashboard-graph2", "pie");

            this.dtable = $('#dataTableOne').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": platformData.chartData,
                "aoColumns": [
                    { "mData": "os_", "sTitle": jQuery.i18n.map["platforms.table.platform"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
                ]
            }));

            this.dtableTwo = $('#dataTableTwo').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": oSVersionData.chartData,
                "aoColumns": [
                    { "mData": "os_version", "sTitle": jQuery.i18n.map["platforms.table.platform-version"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] },
                    { "mData": "u", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-users"] },
                    { "mData": "n", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.new-users"] }
                ]
            }));

            $("#dataTableTwo").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(this.beforeRender()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);

            var oSVersionData = countlyDeviceDetails.getOSVersionData(self.activePlatform),
                platformData = countlyDeviceDetails.getPlatformData(),
                newPage = $("<div>" + self.template(self.templateData) + "</div>");

            $(self.el).find(".dashboard-summary").replaceWith(newPage.find(".dashboard-summary"));
            $(self.el).find(".graph-segment-container").replaceWith(newPage.find(".graph-segment-container"));

            countlyCommon.drawGraph(platformData.chartDP, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(oSVersionData.chartDP, "#dashboard-graph2", "pie");

            CountlyHelpers.refreshTable(self.dtable, platformData.chartData);
            CountlyHelpers.refreshTable(self.dtableTwo, oSVersionData.chartData);

            self.pageScript();
        });
    }
});

window.AppVersionView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyDeviceDetails.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var appVersionData = countlyAppVersion.getAppVersionData();

        this.templateData = {
            "page-title":jQuery.i18n.map["app-versions.title"],
            "logo-class":"app-versions",
            "chart-helper":"app-versions.chart",
            "table-helper":""
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));
            countlyCommon.drawGraph(appVersionData.chartDP, "#dashboard-graph", "bar");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": appVersionData.chartData,
                "aoColumns": [
                    { "mData": "app_version", "sTitle": jQuery.i18n.map["app-versions.table.app-version"] },
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

            var appVersionData = countlyAppVersion.getAppVersionData();
            countlyCommon.drawGraph(appVersionData.chartDP, "#dashboard-graph", "bar");
            CountlyHelpers.refreshTable(self.dtable, appVersionData.chartData);
        });
    }
});

window.CarrierView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyCarrier.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var carrierData = countlyCarrier.getCarrierData();

        this.templateData = {
            "page-title":jQuery.i18n.map["carriers.title"],
            "logo-class":"carriers",
            "graph-type-double-pie":true,
            "pie-titles":{
                "left":jQuery.i18n.map["common.total-users"],
                "right":jQuery.i18n.map["common.new-users"]
            },
            "chart-helper":"carriers.chart",
            "table-helper":""
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            countlyCommon.drawGraph(carrierData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(carrierData.chartDPNew, "#dashboard-graph2", "pie");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": carrierData.chartData,
                "aoColumns": [
                    { "mData": "carrier", "sTitle": jQuery.i18n.map["carriers.table.carrier"] },
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

            var carrierData = countlyCarrier.getCarrierData();
            countlyCommon.drawGraph(carrierData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(carrierData.chartDPNew, "#dashboard-graph2", "pie");
            CountlyHelpers.refreshTable(self.dtable, carrierData.chartData);
        });
    }
});

window.ResolutionView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyDeviceDetails.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var resolutionData = countlyDeviceDetails.getResolutionData();

        this.templateData = {
            "page-title":jQuery.i18n.map["resolutions.title"],
            "logo-class":"resolutions",
            "graph-type-double-pie":true,
            "pie-titles":{
                "left":jQuery.i18n.map["common.total-users"],
                "right":jQuery.i18n.map["common.new-users"]
            },
            "chart-helper":"resolutions.chart"
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            countlyCommon.drawGraph(resolutionData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(resolutionData.chartDPNew, "#dashboard-graph2", "pie");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": resolutionData.chartData,
                "aoColumns": [
                    { "mData": "resolution", "sTitle": jQuery.i18n.map["resolutions.table.resolution"] },
                    { "mData": function(row){return parseInt(row.width.replace(/<(?:.|\n)*?>/gm, ''))}, sType:"numeric","sTitle": jQuery.i18n.map["resolutions.table.width"] },
                    { "mData": function(row){return parseInt(row.height.replace(/<(?:.|\n)*?>/gm, ''))}, sType:"numeric","sTitle": jQuery.i18n.map["resolutions.table.height"] },
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
        $.when(countlyDeviceDetails.initialize()).then(function () {
            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);

            newPage = $("<div>" + self.template(self.templateData) + "</div>");
            $(self.el).find(".dashboard-summary").replaceWith(newPage.find(".dashboard-summary"));

            var resolutionData = countlyDeviceDetails.getResolutionData();

            countlyCommon.drawGraph(resolutionData.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(resolutionData.chartDPNew, "#dashboard-graph2", "pie");
            CountlyHelpers.refreshTable(self.dtable, resolutionData.chartData);
        });
    }
});

window.DurationView = countlyView.extend({
    beforeRender: function() {
        return $.when(countlyUser.initialize()).then(function () {});
    },
    renderCommon:function (isRefresh) {
        var durationData = countlySession.getDurationData();

        this.templateData = {
            "page-title":jQuery.i18n.map["session-duration.title"],
            "logo-class":"durations",
            "chart-helper":"durations.chart",
            "table-helper":"durations.table"
        };

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            countlyCommon.drawGraph(durationData.chartDP, "#dashboard-graph", "bar");

            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": durationData.chartData,
                "aoColumns": [
                    { "mData": "ds", sType:"session-duration", "sTitle": jQuery.i18n.map["session-duration.table.duration"] },
                    { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.number-of-users"] },
                    { "mData": "percent", "sType":"percent", "sTitle": jQuery.i18n.map["common.percent"] }
                ]
            }));

            $(".d-table").stickyTableHeaders();
        }
    },
    refresh:function () {
        var self = this;
        $.when(countlyUser.initialize()).then(function () {
            if (app.activeView != self) {
                return false;
            }

            var durationData = countlySession.getDurationData();
            countlyCommon.drawGraph(durationData.chartDP, "#dashboard-graph", "bar");
            CountlyHelpers.refreshTable(self.dtable, durationData.chartData);
        });
    }
});

window.ManageAppsView = countlyView.extend({
    initialize:function () {
        this.template = Handlebars.compile($("#template-management-applications").html());
    },
    destroy:function () {
        app.closeAppTooltip();
        app.disableAppTooltip();
    },
    getAppCategories: function(){
        return { 1:jQuery.i18n.map["application-category.books"], 2:jQuery.i18n.map["application-category.business"], 3:jQuery.i18n.map["application-category.education"], 4:jQuery.i18n.map["application-category.entertainment"], 5:jQuery.i18n.map["application-category.finance"], 6:jQuery.i18n.map["application-category.games"], 7:jQuery.i18n.map["application-category.health-fitness"], 8:jQuery.i18n.map["application-category.lifestyle"], 9:jQuery.i18n.map["application-category.medical"], 10:jQuery.i18n.map["application-category.music"], 11:jQuery.i18n.map["application-category.navigation"], 12:jQuery.i18n.map["application-category.news"], 13:jQuery.i18n.map["application-category.photography"], 14:jQuery.i18n.map["application-category.productivity"], 15:jQuery.i18n.map["application-category.reference"], 16:jQuery.i18n.map["application-category.social-networking"], 17:jQuery.i18n.map["application-category.sports"], 18:jQuery.i18n.map["application-category.travel"], 19:jQuery.i18n.map["application-category.utilities"], 20:jQuery.i18n.map["application-category.weather"]};
    },
    getTimeZones: function(){
        return { "AF":{"n":"Afghanistan","z":[{"(GMT+04:30) Kabul":"Asia/Kabul"}]}, "AL":{"n":"Albania","z":[{"(GMT+01:00) Tirane":"Europe/Tirane"}]}, "DZ":{"n":"Algeria","z":[{"(GMT+01:00) Algiers":"Africa/Algiers"}]}, "AS":{"n":"American Samoa","z":[{"(GMT-11:00) Pago Pago":"Pacific/Pago_Pago"}]}, "AD":{"n":"Andorra","z":[{"(GMT+01:00) Andorra":"Europe/Andorra"}]}, "AO":{"n":"Angola","z":[{"(GMT+01:00) Luanda":"Africa/Luanda"}]}, "AI":{"n":"Anguilla","z":[{"(GMT-04:00) Anguilla":"America/Anguilla"}]}, "AQ":{"n":"Antarctica","z":[{"(GMT-04:00) Palmer":"Antarctica/Palmer"},{"(GMT-03:00) Rothera":"Antarctica/Rothera"},{"(GMT+03:00) Syowa":"Antarctica/Syowa"},{"(GMT+05:00) Mawson":"Antarctica/Mawson"},{"(GMT+06:00) Vostok":"Antarctica/Vostok"},{"(GMT+07:00) Davis":"Antarctica/Davis"},{"(GMT+08:00) Casey":"Antarctica/Casey"},{"(GMT+10:00) Dumont D'Urville":"Antarctica/DumontDUrville"}]}, "AG":{"n":"Antigua and Barbuda","z":[{"(GMT-04:00) Antigua":"America/Antigua"}]}, "AR":{"n":"Argentina","z":[{"(GMT-03:00) Buenos Aires":"America/Buenos_Aires"}]}, "AM":{"n":"Armenia","z":[{"(GMT+04:00) Yerevan":"Asia/Yerevan"}]}, "AW":{"n":"Aruba","z":[{"(GMT-04:00) Aruba":"America/Aruba"}]}, "AU":{"n":"Australia","z":[{"(GMT+08:00) Western Time - Perth":"Australia/Perth"},{"(GMT+09:30) Central Time - Adelaide":"Australia/Adelaide"},{"(GMT+09:30) Central Time - Darwin":"Australia/Darwin"},{"(GMT+10:00) Eastern Time - Brisbane":"Australia/Brisbane"},{"(GMT+10:00) Eastern Time - Hobart":"Australia/Hobart"},{"(GMT+10:00) Eastern Time - Melbourne, Sydney":"Australia/Sydney"}]}, "AT":{"n":"Austria","z":[{"(GMT+01:00) Vienna":"Europe/Vienna"}]}, "AZ":{"n":"Azerbaijan","z":[{"(GMT+04:00) Baku":"Asia/Baku"}]}, "BS":{"n":"Bahamas","z":[{"(GMT-05:00) Nassau":"America/Nassau"}]}, "BH":{"n":"Bahrain","z":[{"(GMT+03:00) Bahrain":"Asia/Bahrain"}]}, "BD":{"n":"Bangladesh","z":[{"(GMT+06:00) Dhaka":"Asia/Dhaka"}]}, "BB":{"n":"Barbados","z":[{"(GMT-04:00) Barbados":"America/Barbados"}]}, "BY":{"n":"Belarus","z":[{"(GMT+03:00) Minsk":"Europe/Minsk"}]}, "BE":{"n":"Belgium","z":[{"(GMT+01:00) Brussels":"Europe/Brussels"}]}, "BZ":{"n":"Belize","z":[{"(GMT-06:00) Belize":"America/Belize"}]}, "BJ":{"n":"Benin","z":[{"(GMT+01:00) Porto-Novo":"Africa/Porto-Novo"}]}, "BM":{"n":"Bermuda","z":[{"(GMT-04:00) Bermuda":"Atlantic/Bermuda"}]}, "BT":{"n":"Bhutan","z":[{"(GMT+06:00) Thimphu":"Asia/Thimphu"}]}, "BO":{"n":"Bolivia","z":[{"(GMT-04:00) La Paz":"America/La_Paz"}]}, "BA":{"n":"Bosnia and Herzegovina","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Sarajevo"}]}, "BW":{"n":"Botswana","z":[{"(GMT+02:00) Gaborone":"Africa/Gaborone"}]}, "BR":{"n":"Brazil","z":[{"(GMT-04:00) Boa Vista":"America/Boa_Vista"},{"(GMT-04:00) Campo Grande":"America/Campo_Grande"},{"(GMT-04:00) Cuiaba":"America/Cuiaba"},{"(GMT-04:00) Manaus":"America/Manaus"},{"(GMT-04:00) Porto Velho":"America/Porto_Velho"},{"(GMT-04:00) Rio Branco":"America/Rio_Branco"},{"(GMT-03:00) Araguaina":"America/Araguaina"},{"(GMT-03:00) Belem":"America/Belem"},{"(GMT-03:00) Fortaleza":"America/Fortaleza"},{"(GMT-03:00) Maceio":"America/Maceio"},{"(GMT-03:00) Recife":"America/Recife"},{"(GMT-03:00) Salvador":"America/Bahia"},{"(GMT-03:00) Sao Paulo":"America/Sao_Paulo"},{"(GMT-02:00) Noronha":"America/Noronha"}]}, "IO":{"n":"British Indian Ocean Territory","z":[{"(GMT+06:00) Chagos":"Indian/Chagos"}]}, "VG":{"n":"British Virgin Islands","z":[{"(GMT-04:00) Tortola":"America/Tortola"}]}, "BN":{"n":"Brunei","z":[{"(GMT+08:00) Brunei":"Asia/Brunei"}]}, "BG":{"n":"Bulgaria","z":[{"(GMT+02:00) Sofia":"Europe/Sofia"}]}, "BF":{"n":"Burkina Faso","z":[{"(GMT+00:00) Ouagadougou":"Africa/Ouagadougou"}]}, "BI":{"n":"Burundi","z":[{"(GMT+02:00) Bujumbura":"Africa/Bujumbura"}]}, "KH":{"n":"Cambodia","z":[{"(GMT+07:00) Phnom Penh":"Asia/Phnom_Penh"}]}, "CM":{"n":"Cameroon","z":[{"(GMT+01:00) Douala":"Africa/Douala"}]}, "CA":{"n":"Canada","z":[{"(GMT-07:00) Mountain Time - Dawson Creek":"America/Dawson_Creek"},{"(GMT-08:00) Pacific Time - Vancouver":"America/Vancouver"},{"(GMT-08:00) Pacific Time - Whitehorse":"America/Whitehorse"},{"(GMT-06:00) Central Time - Regina":"America/Regina"},{"(GMT-07:00) Mountain Time - Edmonton":"America/Edmonton"},{"(GMT-07:00) Mountain Time - Yellowknife":"America/Yellowknife"},{"(GMT-06:00) Central Time - Winnipeg":"America/Winnipeg"},{"(GMT-05:00) Eastern Time - Iqaluit":"America/Iqaluit"},{"(GMT-05:00) Eastern Time - Montreal":"America/Montreal"},{"(GMT-05:00) Eastern Time - Toronto":"America/Toronto"},{"(GMT-04:00) Atlantic Time - Halifax":"America/Halifax"},{"(GMT-03:30) Newfoundland Time - St. Johns":"America/St_Johns"}]}, "CV":{"n":"Cape Verde","z":[{"(GMT-01:00) Cape Verde":"Atlantic/Cape_Verde"}]}, "KY":{"n":"Cayman Islands","z":[{"(GMT-05:00) Cayman":"America/Cayman"}]}, "CF":{"n":"Central African Republic","z":[{"(GMT+01:00) Bangui":"Africa/Bangui"}]}, "TD":{"n":"Chad","z":[{"(GMT+01:00) Ndjamena":"Africa/Ndjamena"}]}, "CL":{"n":"Chile","z":[{"(GMT-06:00) Easter Island":"Pacific/Easter"},{"(GMT-04:00) Santiago":"America/Santiago"}]}, "CN":{"n":"China","z":[{"(GMT+08:00) China Time - Beijing":"Asia/Shanghai"}]}, "CX":{"n":"Christmas Island","z":[{"(GMT+07:00) Christmas":"Indian/Christmas"}]}, "CC":{"n":"Cocos [Keeling] Islands","z":[{"(GMT+06:30) Cocos":"Indian/Cocos"}]}, "CO":{"n":"Colombia","z":[{"(GMT-05:00) Bogota":"America/Bogota"}]}, "KM":{"n":"Comoros","z":[{"(GMT+03:00) Comoro":"Indian/Comoro"}]}, "CD":{"n":"Congo [DRC]","z":[{"(GMT+01:00) Kinshasa":"Africa/Kinshasa"},{"(GMT+02:00) Lubumbashi":"Africa/Lubumbashi"}]}, "CG":{"n":"Congo [Republic]","z":[{"(GMT+01:00) Brazzaville":"Africa/Brazzaville"}]}, "CK":{"n":"Cook Islands","z":[{"(GMT-10:00) Rarotonga":"Pacific/Rarotonga"}]}, "CR":{"n":"Costa Rica","z":[{"(GMT-06:00) Costa Rica":"America/Costa_Rica"}]}, "CI":{"n":"Côte d’Ivoire","z":[{"(GMT+00:00) Abidjan":"Africa/Abidjan"}]}, "HR":{"n":"Croatia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Zagreb"}]}, "CU":{"n":"Cuba","z":[{"(GMT-05:00) Havana":"America/Havana"}]}, "CW":{"n":"Curaçao","z":[{"(GMT-04:00) Curacao":"America/Curacao"}]}, "CY":{"n":"Cyprus","z":[{"(GMT+02:00) Nicosia":"Asia/Nicosia"}]}, "CZ":{"n":"Czech Republic","z":[{"(GMT+01:00) Central European Time - Prague":"Europe/Prague"}]}, "DK":{"n":"Denmark","z":[{"(GMT+01:00) Copenhagen":"Europe/Copenhagen"}]}, "DJ":{"n":"Djibouti","z":[{"(GMT+03:00) Djibouti":"Africa/Djibouti"}]}, "DM":{"n":"Dominica","z":[{"(GMT-04:00) Dominica":"America/Dominica"}]}, "DO":{"n":"Dominican Republic","z":[{"(GMT-04:00) Santo Domingo":"America/Santo_Domingo"}]}, "EC":{"n":"Ecuador","z":[{"(GMT-06:00) Galapagos":"Pacific/Galapagos"},{"(GMT-05:00) Guayaquil":"America/Guayaquil"}]}, "EG":{"n":"Egypt","z":[{"(GMT+02:00) Cairo":"Africa/Cairo"}]}, "SV":{"n":"El Salvador","z":[{"(GMT-06:00) El Salvador":"America/El_Salvador"}]}, "GQ":{"n":"Equatorial Guinea","z":[{"(GMT+01:00) Malabo":"Africa/Malabo"}]}, "ER":{"n":"Eritrea","z":[{"(GMT+03:00) Asmera":"Africa/Asmera"}]}, "EE":{"n":"Estonia","z":[{"(GMT+02:00) Tallinn":"Europe/Tallinn"}]}, "ET":{"n":"Ethiopia","z":[{"(GMT+03:00) Addis Ababa":"Africa/Addis_Ababa"}]}, "FK":{"n":"Falkland Islands [Islas Malvinas]","z":[{"(GMT-03:00) Stanley":"Atlantic/Stanley"}]}, "FO":{"n":"Faroe Islands","z":[{"(GMT+00:00) Faeroe":"Atlantic/Faeroe"}]}, "FJ":{"n":"Fiji","z":[{"(GMT+12:00) Fiji":"Pacific/Fiji"}]}, "FI":{"n":"Finland","z":[{"(GMT+02:00) Helsinki":"Europe/Helsinki"}]}, "FR":{"n":"France","z":[{"(GMT+01:00) Paris":"Europe/Paris"}]}, "GF":{"n":"French Guiana","z":[{"(GMT-03:00) Cayenne":"America/Cayenne"}]}, "PF":{"n":"French Polynesia","z":[{"(GMT-10:00) Tahiti":"Pacific/Tahiti"},{"(GMT-09:30) Marquesas":"Pacific/Marquesas"},{"(GMT-09:00) Gambier":"Pacific/Gambier"}]}, "TF":{"n":"French Southern Territories","z":[{"(GMT+05:00) Kerguelen":"Indian/Kerguelen"}]}, "GA":{"n":"Gabon","z":[{"(GMT+01:00) Libreville":"Africa/Libreville"}]}, "GM":{"n":"Gambia","z":[{"(GMT+00:00) Banjul":"Africa/Banjul"}]}, "GE":{"n":"Georgia","z":[{"(GMT+04:00) Tbilisi":"Asia/Tbilisi"}]}, "DE":{"n":"Germany","z":[{"(GMT+01:00) Berlin":"Europe/Berlin"}]}, "GH":{"n":"Ghana","z":[{"(GMT+00:00) Accra":"Africa/Accra"}]}, "GI":{"n":"Gibraltar","z":[{"(GMT+01:00) Gibraltar":"Europe/Gibraltar"}]}, "GR":{"n":"Greece","z":[{"(GMT+02:00) Athens":"Europe/Athens"}]}, "GL":{"n":"Greenland","z":[{"(GMT-04:00) Thule":"America/Thule"},{"(GMT-03:00) Godthab":"America/Godthab"},{"(GMT-01:00) Scoresbysund":"America/Scoresbysund"},{"(GMT+00:00) Danmarkshavn":"America/Danmarkshavn"}]}, "GD":{"n":"Grenada","z":[{"(GMT-04:00) Grenada":"America/Grenada"}]}, "GP":{"n":"Guadeloupe","z":[{"(GMT-04:00) Guadeloupe":"America/Guadeloupe"}]}, "GU":{"n":"Guam","z":[{"(GMT+10:00) Guam":"Pacific/Guam"}]}, "GT":{"n":"Guatemala","z":[{"(GMT-06:00) Guatemala":"America/Guatemala"}]}, "GN":{"n":"Guinea","z":[{"(GMT+00:00) Conakry":"Africa/Conakry"}]}, "GW":{"n":"Guinea-Bissau","z":[{"(GMT+00:00) Bissau":"Africa/Bissau"}]}, "GY":{"n":"Guyana","z":[{"(GMT-04:00) Guyana":"America/Guyana"}]}, "HT":{"n":"Haiti","z":[{"(GMT-05:00) Port-au-Prince":"America/Port-au-Prince"}]}, "HN":{"n":"Honduras","z":[{"(GMT-06:00) Central Time - Tegucigalpa":"America/Tegucigalpa"}]}, "HK":{"n":"Hong Kong","z":[{"(GMT+08:00) Hong Kong":"Asia/Hong_Kong"}]}, "HU":{"n":"Hungary","z":[{"(GMT+01:00) Budapest":"Europe/Budapest"}]}, "IS":{"n":"Iceland","z":[{"(GMT+00:00) Reykjavik":"Atlantic/Reykjavik"}]}, "IN":{"n":"India","z":[{"(GMT+05:30) India Standard Time":"Asia/Calcutta"}]}, "ID":{"n":"Indonesia","z":[{"(GMT+07:00) Jakarta":"Asia/Jakarta"},{"(GMT+08:00) Makassar":"Asia/Makassar"},{"(GMT+09:00) Jayapura":"Asia/Jayapura"}]}, "IR":{"n":"Iran","z":[{"(GMT+03:30) Tehran":"Asia/Tehran"}]}, "IQ":{"n":"Iraq","z":[{"(GMT+03:00) Baghdad":"Asia/Baghdad"}]}, "IE":{"n":"Ireland","z":[{"(GMT+00:00) Dublin":"Europe/Dublin"}]}, "IL":{"n":"Israel","z":[{"(GMT+02:00) Jerusalem":"Asia/Jerusalem"}]}, "IT":{"n":"Italy","z":[{"(GMT+01:00) Rome":"Europe/Rome"}]}, "JM":{"n":"Jamaica","z":[{"(GMT-05:00) Jamaica":"America/Jamaica"}]}, "JP":{"n":"Japan","z":[{"(GMT+09:00) Tokyo":"Asia/Tokyo"}]}, "JO":{"n":"Jordan","z":[{"(GMT+02:00) Amman":"Asia/Amman"}]}, "KZ":{"n":"Kazakhstan","z":[{"(GMT+05:00) Aqtau":"Asia/Aqtau"},{"(GMT+05:00) Aqtobe":"Asia/Aqtobe"},{"(GMT+06:00) Almaty":"Asia/Almaty"}]}, "KE":{"n":"Kenya","z":[{"(GMT+03:00) Nairobi":"Africa/Nairobi"}]}, "KI":{"n":"Kiribati","z":[{"(GMT+12:00) Tarawa":"Pacific/Tarawa"},{"(GMT+13:00) Enderbury":"Pacific/Enderbury"},{"(GMT+14:00) Kiritimati":"Pacific/Kiritimati"}]}, "KW":{"n":"Kuwait","z":[{"(GMT+03:00) Kuwait":"Asia/Kuwait"}]}, "KG":{"n":"Kyrgyzstan","z":[{"(GMT+06:00) Bishkek":"Asia/Bishkek"}]}, "LA":{"n":"Laos","z":[{"(GMT+07:00) Vientiane":"Asia/Vientiane"}]}, "LV":{"n":"Latvia","z":[{"(GMT+02:00) Riga":"Europe/Riga"}]}, "LB":{"n":"Lebanon","z":[{"(GMT+02:00) Beirut":"Asia/Beirut"}]}, "LS":{"n":"Lesotho","z":[{"(GMT+02:00) Maseru":"Africa/Maseru"}]}, "LR":{"n":"Liberia","z":[{"(GMT+00:00) Monrovia":"Africa/Monrovia"}]}, "LY":{"n":"Libya","z":[{"(GMT+02:00) Tripoli":"Africa/Tripoli"}]}, "LI":{"n":"Liechtenstein","z":[{"(GMT+01:00) Vaduz":"Europe/Vaduz"}]}, "LT":{"n":"Lithuania","z":[{"(GMT+02:00) Vilnius":"Europe/Vilnius"}]}, "LU":{"n":"Luxembourg","z":[{"(GMT+01:00) Luxembourg":"Europe/Luxembourg"}]}, "MO":{"n":"Macau","z":[{"(GMT+08:00) Macau":"Asia/Macau"}]}, "MK":{"n":"Macedonia [FYROM]","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Skopje"}]}, "MG":{"n":"Madagascar","z":[{"(GMT+03:00) Antananarivo":"Indian/Antananarivo"}]}, "MW":{"n":"Malawi","z":[{"(GMT+02:00) Blantyre":"Africa/Blantyre"}]}, "MY":{"n":"Malaysia","z":[{"(GMT+08:00) Kuala Lumpur":"Asia/Kuala_Lumpur"}]}, "MV":{"n":"Maldives","z":[{"(GMT+05:00) Maldives":"Indian/Maldives"}]}, "ML":{"n":"Mali","z":[{"(GMT+00:00) Bamako":"Africa/Bamako"}]}, "MT":{"n":"Malta","z":[{"(GMT+01:00) Malta":"Europe/Malta"}]}, "MH":{"n":"Marshall Islands","z":[{"(GMT+12:00) Kwajalein":"Pacific/Kwajalein"},{"(GMT+12:00) Majuro":"Pacific/Majuro"}]}, "MQ":{"n":"Martinique","z":[{"(GMT-04:00) Martinique":"America/Martinique"}]}, "MR":{"n":"Mauritania","z":[{"(GMT+00:00) Nouakchott":"Africa/Nouakchott"}]}, "MU":{"n":"Mauritius","z":[{"(GMT+04:00) Mauritius":"Indian/Mauritius"}]}, "YT":{"n":"Mayotte","z":[{"(GMT+03:00) Mayotte":"Indian/Mayotte"}]}, "MX":{"n":"Mexico","z":[{"(GMT-07:00) Mountain Time - Hermosillo":"America/Hermosillo"},{"(GMT-08:00) Pacific Time - Tijuana":"America/Tijuana"},{"(GMT-07:00) Mountain Time - Chihuahua, Mazatlan":"America/Mazatlan"},{"(GMT-06:00) Central Time - Mexico City":"America/Mexico_City"}]}, "FM":{"n":"Micronesia","z":[{"(GMT+10:00) Truk":"Pacific/Truk"},{"(GMT+11:00) Kosrae":"Pacific/Kosrae"},{"(GMT+11:00) Ponape":"Pacific/Ponape"}]}, "MD":{"n":"Moldova","z":[{"(GMT+02:00) Chisinau":"Europe/Chisinau"}]}, "MC":{"n":"Monaco","z":[{"(GMT+01:00) Monaco":"Europe/Monaco"}]}, "MN":{"n":"Mongolia","z":[{"(GMT+07:00) Hovd":"Asia/Hovd"},{"(GMT+08:00) Choibalsan":"Asia/Choibalsan"},{"(GMT+08:00) Ulaanbaatar":"Asia/Ulaanbaatar"}]}, "MS":{"n":"Montserrat","z":[{"(GMT-04:00) Montserrat":"America/Montserrat"}]}, "MA":{"n":"Morocco","z":[{"(GMT+00:00) Casablanca":"Africa/Casablanca"}]}, "MZ":{"n":"Mozambique","z":[{"(GMT+02:00) Maputo":"Africa/Maputo"}]}, "MM":{"n":"Myanmar [Burma]","z":[{"(GMT+06:30) Rangoon":"Asia/Rangoon"}]}, "NA":{"n":"Namibia","z":[{"(GMT+01:00) Windhoek":"Africa/Windhoek"}]}, "NR":{"n":"Nauru","z":[{"(GMT+12:00) Nauru":"Pacific/Nauru"}]}, "NP":{"n":"Nepal","z":[{"(GMT+05:45) Katmandu":"Asia/Katmandu"}]}, "NL":{"n":"Netherlands","z":[{"(GMT+01:00) Amsterdam":"Europe/Amsterdam"}]}, "NC":{"n":"New Caledonia","z":[{"(GMT+11:00) Noumea":"Pacific/Noumea"}]}, "NZ":{"n":"New Zealand","z":[{"(GMT+12:00) Auckland":"Pacific/Auckland"}]}, "NI":{"n":"Nicaragua","z":[{"(GMT-06:00) Managua":"America/Managua"}]}, "NE":{"n":"Niger","z":[{"(GMT+01:00) Niamey":"Africa/Niamey"}]}, "NG":{"n":"Nigeria","z":[{"(GMT+01:00) Lagos":"Africa/Lagos"}]}, "NU":{"n":"Niue","z":[{"(GMT-11:00) Niue":"Pacific/Niue"}]}, "NF":{"n":"Norfolk Island","z":[{"(GMT+11:30) Norfolk":"Pacific/Norfolk"}]}, "KP":{"n":"North Korea","z":[{"(GMT+09:00) Pyongyang":"Asia/Pyongyang"}]}, "MP":{"n":"Northern Mariana Islands","z":[{"(GMT+10:00) Saipan":"Pacific/Saipan"}]}, "NO":{"n":"Norway","z":[{"(GMT+01:00) Oslo":"Europe/Oslo"}]}, "OM":{"n":"Oman","z":[{"(GMT+04:00) Muscat":"Asia/Muscat"}]}, "PK":{"n":"Pakistan","z":[{"(GMT+05:00) Karachi":"Asia/Karachi"}]}, "PW":{"n":"Palau","z":[{"(GMT+09:00) Palau":"Pacific/Palau"}]}, "PS":{"n":"Palestinian Territories","z":[{"(GMT+02:00) Gaza":"Asia/Gaza"}]}, "PA":{"n":"Panama","z":[{"(GMT-05:00) Panama":"America/Panama"}]}, "PG":{"n":"Papua New Guinea","z":[{"(GMT+10:00) Port Moresby":"Pacific/Port_Moresby"}]}, "PY":{"n":"Paraguay","z":[{"(GMT-04:00) Asuncion":"America/Asuncion"}]}, "PE":{"n":"Peru","z":[{"(GMT-05:00) Lima":"America/Lima"}]}, "PH":{"n":"Philippines","z":[{"(GMT+08:00) Manila":"Asia/Manila"}]}, "PN":{"n":"Pitcairn Islands","z":[{"(GMT-08:00) Pitcairn":"Pacific/Pitcairn"}]}, "PL":{"n":"Poland","z":[{"(GMT+01:00) Warsaw":"Europe/Warsaw"}]}, "PT":{"n":"Portugal","z":[{"(GMT-01:00) Azores":"Atlantic/Azores"},{"(GMT+00:00) Lisbon":"Europe/Lisbon"}]}, "PR":{"n":"Puerto Rico","z":[{"(GMT-04:00) Puerto Rico":"America/Puerto_Rico"}]}, "QA":{"n":"Qatar","z":[{"(GMT+03:00) Qatar":"Asia/Qatar"}]}, "RE":{"n":"Réunion","z":[{"(GMT+04:00) Reunion":"Indian/Reunion"}]}, "RO":{"n":"Romania","z":[{"(GMT+02:00) Bucharest":"Europe/Bucharest"}]}, "RU":{"n":"Russia","z":[{"(GMT+03:00) Moscow-01 - Kaliningrad":"Europe/Kaliningrad"},{"(GMT+04:00) Moscow+00":"Europe/Moscow"},{"(GMT+04:00) Moscow+00 - Samara":"Europe/Samara"},{"(GMT+06:00) Moscow+02 - Yekaterinburg":"Asia/Yekaterinburg"},{"(GMT+07:00) Moscow+03 - Omsk, Novosibirsk":"Asia/Omsk"},{"(GMT+08:00) Moscow+04 - Krasnoyarsk":"Asia/Krasnoyarsk"},{"(GMT+09:00) Moscow+05 - Irkutsk":"Asia/Irkutsk"},{"(GMT+10:00) Moscow+06 - Yakutsk":"Asia/Yakutsk"},{"(GMT+11:00) Moscow+07 - Yuzhno-Sakhalinsk":"Asia/Vladivostok"},{"(GMT+12:00) Moscow+08 - Magadan":"Asia/Magadan"},{"(GMT+12:00) Moscow+08 - Petropavlovsk-Kamchatskiy":"Asia/Kamchatka"}]}, "RW":{"n":"Rwanda","z":[{"(GMT+02:00) Kigali":"Africa/Kigali"}]}, "SH":{"n":"Saint Helena","z":[{"(GMT+00:00) St Helena":"Atlantic/St_Helena"}]}, "KN":{"n":"Saint Kitts and Nevis","z":[{"(GMT-04:00) St. Kitts":"America/St_Kitts"}]}, "LC":{"n":"Saint Lucia","z":[{"(GMT-04:00) St. Lucia":"America/St_Lucia"}]}, "PM":{"n":"Saint Pierre and Miquelon","z":[{"(GMT-03:00) Miquelon":"America/Miquelon"}]}, "VC":{"n":"Saint Vincent and the Grenadines","z":[{"(GMT-04:00) St. Vincent":"America/St_Vincent"}]}, "WS":{"n":"Samoa","z":[{"(GMT+13:00) Apia":"Pacific/Apia"}]}, "SM":{"n":"San Marino","z":[{"(GMT+01:00) Rome":"Europe/San_Marino"}]}, "ST":{"n":"São Tomé and Príncipe","z":[{"(GMT+00:00) Sao Tome":"Africa/Sao_Tome"}]}, "SA":{"n":"Saudi Arabia","z":[{"(GMT+03:00) Riyadh":"Asia/Riyadh"}]}, "SN":{"n":"Senegal","z":[{"(GMT+00:00) Dakar":"Africa/Dakar"}]}, "RS":{"n":"Serbia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Belgrade"}]}, "SC":{"n":"Seychelles","z":[{"(GMT+04:00) Mahe":"Indian/Mahe"}]}, "SL":{"n":"Sierra Leone","z":[{"(GMT+00:00) Freetown":"Africa/Freetown"}]}, "SG":{"n":"Singapore","z":[{"(GMT+08:00) Singapore":"Asia/Singapore"}]}, "SK":{"n":"Slovakia","z":[{"(GMT+01:00) Central European Time - Prague":"Europe/Bratislava"}]}, "SI":{"n":"Slovenia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Ljubljana"}]}, "SB":{"n":"Solomon Islands","z":[{"(GMT+11:00) Guadalcanal":"Pacific/Guadalcanal"}]}, "SO":{"n":"Somalia","z":[{"(GMT+03:00) Mogadishu":"Africa/Mogadishu"}]}, "ZA":{"n":"South Africa","z":[{"(GMT+02:00) Johannesburg":"Africa/Johannesburg"}]}, "GS":{"n":"South Georgia and the South Sandwich Islands","z":[{"(GMT-02:00) South Georgia":"Atlantic/South_Georgia"}]}, "KR":{"n":"South Korea","z":[{"(GMT+09:00) Seoul":"Asia/Seoul"}]}, "ES":{"n":"Spain","z":[{"(GMT+00:00) Canary Islands":"Atlantic/Canary"},{"(GMT+01:00) Ceuta":"Africa/Ceuta"},{"(GMT+01:00) Madrid":"Europe/Madrid"}]}, "LK":{"n":"Sri Lanka","z":[{"(GMT+05:30) Colombo":"Asia/Colombo"}]}, "SD":{"n":"Sudan","z":[{"(GMT+03:00) Khartoum":"Africa/Khartoum"}]}, "SR":{"n":"Suriname","z":[{"(GMT-03:00) Paramaribo":"America/Paramaribo"}]}, "SJ":{"n":"Svalbard and Jan Mayen","z":[{"(GMT+01:00) Oslo":"Arctic/Longyearbyen"}]}, "SZ":{"n":"Swaziland","z":[{"(GMT+02:00) Mbabane":"Africa/Mbabane"}]}, "SE":{"n":"Sweden","z":[{"(GMT+01:00) Stockholm":"Europe/Stockholm"}]}, "CH":{"n":"Switzerland","z":[{"(GMT+01:00) Zurich":"Europe/Zurich"}]}, "SY":{"n":"Syria","z":[{"(GMT+02:00) Damascus":"Asia/Damascus"}]}, "TW":{"n":"Taiwan","z":[{"(GMT+08:00) Taipei":"Asia/Taipei"}]}, "TJ":{"n":"Tajikistan","z":[{"(GMT+05:00) Dushanbe":"Asia/Dushanbe"}]}, "TZ":{"n":"Tanzania","z":[{"(GMT+03:00) Dar es Salaam":"Africa/Dar_es_Salaam"}]}, "TH":{"n":"Thailand","z":[{"(GMT+07:00) Bangkok":"Asia/Bangkok"}]}, "TL":{"n":"Timor-Leste","z":[{"(GMT+09:00) Dili":"Asia/Dili"}]}, "TG":{"n":"Togo","z":[{"(GMT+00:00) Lome":"Africa/Lome"}]}, "TK":{"n":"Tokelau","z":[{"(GMT+14:00) Fakaofo":"Pacific/Fakaofo"}]}, "TO":{"n":"Tonga","z":[{"(GMT+13:00) Tongatapu":"Pacific/Tongatapu"}]}, "TT":{"n":"Trinidad and Tobago","z":[{"(GMT-04:00) Port of Spain":"America/Port_of_Spain"}]}, "TN":{"n":"Tunisia","z":[{"(GMT+01:00) Tunis":"Africa/Tunis"}]}, "TR":{"n":"Turkey","z":[{"(GMT+02:00) Istanbul":"Europe/Istanbul"}]}, "TM":{"n":"Turkmenistan","z":[{"(GMT+05:00) Ashgabat":"Asia/Ashgabat"}]}, "TC":{"n":"Turks and Caicos Islands","z":[{"(GMT-05:00) Grand Turk":"America/Grand_Turk"}]}, "TV":{"n":"Tuvalu","z":[{"(GMT+12:00) Funafuti":"Pacific/Funafuti"}]}, "UM":{"n":"U.S. Minor Outlying Islands","z":[{"(GMT-11:00) Midway":"Pacific/Midway"},{"(GMT-10:00) Johnston":"Pacific/Johnston"},{"(GMT+12:00) Wake":"Pacific/Wake"}]}, "VI":{"n":"U.S. Virgin Islands","z":[{"(GMT-04:00) St. Thomas":"America/St_Thomas"}]}, "UG":{"n":"Uganda","z":[{"(GMT+03:00) Kampala":"Africa/Kampala"}]}, "UA":{"n":"Ukraine","z":[{"(GMT+02:00) Kiev":"Europe/Kiev"}]}, "AE":{"n":"United Arab Emirates","z":[{"(GMT+04:00) Dubai":"Asia/Dubai"}]}, "GB":{"n":"United Kingdom","z":[{"(GMT+00:00) GMT (no daylight saving)":"Etc/GMT"},{"(GMT+00:00) London":"Europe/London"}]}, "US":{"n":"United States","z":[{"(GMT-10:00) Hawaii Time":"Pacific/Honolulu"},{"(GMT-09:00) Alaska Time":"America/Anchorage"},{"(GMT-07:00) Mountain Time - Arizona":"America/Phoenix"},{"(GMT-08:00) Pacific Time":"America/Los_Angeles"},{"(GMT-07:00) Mountain Time":"America/Denver"},{"(GMT-06:00) Central Time":"America/Chicago"},{"(GMT-05:00) Eastern Time":"America/New_York"}]}, "UY":{"n":"Uruguay","z":[{"(GMT-03:00) Montevideo":"America/Montevideo"}]}, "UZ":{"n":"Uzbekistan","z":[{"(GMT+05:00) Tashkent":"Asia/Tashkent"}]}, "VU":{"n":"Vanuatu","z":[{"(GMT+11:00) Efate":"Pacific/Efate"}]}, "VA":{"n":"Vatican City","z":[{"(GMT+01:00) Rome":"Europe/Vatican"}]}, "VE":{"n":"Venezuela","z":[{"(GMT-04:30) Caracas":"America/Caracas"}]}, "VN":{"n":"Vietnam","z":[{"(GMT+07:00) Hanoi":"Asia/Saigon"}]}, "WF":{"n":"Wallis and Futuna","z":[{"(GMT+12:00) Wallis":"Pacific/Wallis"}]}, "EH":{"n":"Western Sahara","z":[{"(GMT+00:00) El Aaiun":"Africa/El_Aaiun"}]}, "YE":{"n":"Yemen","z":[{"(GMT+03:00) Aden":"Asia/Aden"}]}, "ZM":{"n":"Zambia","z":[{"(GMT+02:00) Lusaka":"Africa/Lusaka"}]}, "ZW":{"n":"Zimbabwe","z":[{"(GMT+02:00) Harare":"Africa/Harare"}]} };
    },
    renderCommon:function () {
        app.enableAppTooltip();
        $(this.el).html(this.template({
            admin_apps:countlyGlobal['admin_apps']
        }));
        var appCategories = this.getAppCategories();
        var timezones = this.getTimeZones();

        var appId = countlyCommon.ACTIVE_APP_ID;
        $("#app-management-bar .app-container").removeClass("active");
        $("#app-management-bar .app-container[data-id='" + appId + "']").addClass("active");

        function initAppManagement(appId) {
            if (jQuery.isEmptyObject(countlyGlobal['apps'])) {
                showAdd();
                $("#no-app-warning").show();
                return false;
            } else if (jQuery.isEmptyObject(countlyGlobal['admin_apps'])) {
                showAdd();
                return false;
            } else {
                hideAdd();

                if (countlyGlobal['admin_apps'][appId]) {
                    $("#delete-app").show();
                } else {
                    $("#delete-app").hide();
                }
            }

            if ($("#new-install-overlay").is(":visible")) {
                $("#no-app-warning").hide();
                $("#first-app-success").show();
                $("#new-install-overlay").fadeOut();
                countlyCommon.setActiveApp(appId);
                $("#sidebar-app-select").find(".logo").css("background-image", "url('"+countlyGlobal["cdn"]+"appimages/" + appId + ".png')");
                $("#sidebar-app-select").find(".text").text(countlyGlobal['apps'][appId].name);
            }

            $("#app-edit-id").val(appId);
            $("#view-app").find(".widget-header .title").text(countlyGlobal['apps'][appId].name);
            $("#app-edit-name").find(".read").text(countlyGlobal['apps'][appId].name);
            $("#app-edit-name").find(".edit input").val(countlyGlobal['apps'][appId].name);
            $("#view-app-key").text(countlyGlobal['apps'][appId].key);
            $("#view-app-id").text(appId);
            $("#app-edit-category").find(".cly-select .text").text(appCategories[countlyGlobal['apps'][appId].category]);
            $("#app-edit-category").find(".cly-select .text").data("value", countlyGlobal['apps'][appId].category);
            $("#app-edit-timezone").find(".cly-select .text").data("value", countlyGlobal['apps'][appId].timezone);
            $("#app-edit-category").find(".read").text(appCategories[countlyGlobal['apps'][appId].category]);
            $("#app-edit-image").find(".read .logo").css({"background-image":'url("'+countlyGlobal["cdn"]+'appimages/' + appId + '.png")'});
            var appTimezone = timezones[countlyGlobal['apps'][appId].country];

            for (var i = 0; i < appTimezone.z.length; i++) {
                for (var tzone in appTimezone.z[i]) {
                    if (appTimezone.z[i][tzone] == countlyGlobal['apps'][appId].timezone) {
                        var appEditTimezone = $("#app-edit-timezone").find(".read"),
                            appCountryCode = countlyGlobal['apps'][appId].country;
                        appEditTimezone.find(".flag").css({"background-image":"url("+countlyGlobal["cdn"]+"images/flags/" + appCountryCode.toLowerCase() + ".png)"});
                        appEditTimezone.find(".country").text(appTimezone.n);
                        appEditTimezone.find(".timezone").text(tzone);
                        initCountrySelect("#app-edit-timezone", appCountryCode, tzone, appTimezone.z[i][tzone]);
                        break;
                    }
                }
            }
        }

        function initCountrySelect(parent, countryCode, timezoneText, timezone) {
            $(parent + " #timezone-select").hide();
            $(parent + " #selected").hide();
            $(parent + " #timezone-items").html("");
            $(parent + " #country-items").html("");

            var countrySelect = $(parent + " #country-items");
            var timezoneSelect = $(parent + " #timezone-items");

            for (var key in timezones) {
                countrySelect.append("<div data-value='" + key + "' class='item'><div class='flag' style='background-image:url("+countlyGlobal["cdn"]+"images/flags/" + key.toLowerCase() + ".png)'></div>" + timezones[key].n + "</div>")
            }

            if (countryCode && timezoneText && timezone) {
                var country = timezones[countryCode];

                if (country.z.length == 1) {
                    for (var prop in country.z[0]) {
                        $(parent + " #selected").show();
                        $(parent + " #selected").text(prop);
                        $(parent + " #app-timezone").val(country.z[0][prop]);
                        $(parent + " #app-country").val(countryCode);
                        $(parent + " #country-select .text").html("<div class='flag' style='background-image:url("+countlyGlobal["cdn"]+"images/flags/" + countryCode.toLowerCase() + ".png)'></div>" + country.n);
                    }
                } else {
                    $(parent + " #timezone-select").find(".text").text(prop);
                    var countryTimezones = country.z;

                    for (var i = 0; i < countryTimezones.length; i++) {
                        for (var prop in countryTimezones[i]) {
                            timezoneSelect.append("<div data-value='" + countryTimezones[i][prop] + "' class='item'>" + prop + "</div>")
                        }
                    }

                    $(parent + " #app-timezone").val(timezone);
                    $(parent + " #app-country").val(countryCode);
                    $(parent + " #country-select .text").html("<div class='flag' style='background-image:url("+countlyGlobal["cdn"]+"images/flags/" + countryCode.toLowerCase() + ".png)'></div>" + country.n);
                    $(parent + " #timezone-select .text").text(timezoneText);
                    $(parent + " #timezone-select").show();
                }

                $(parent + " .select-items .item").click(function () {
                    var selectedItem = $(this).parents(".cly-select").find(".text");
                    selectedItem.html($(this).html());
                    selectedItem.data("value", $(this).data("value"));
                });
                $(parent + " #timezone-items .item").click(function () {
                    $(parent + " #app-timezone").val($(this).data("value"));
                });
            }

            $(parent + " #country-items .item").click(function () {
                $(parent + " #selected").text("");
                $(parent + " #timezone-select").hide();
                timezoneSelect.html("");
                var attr = $(this).data("value");
                var countryTimezones = timezones[attr].z;

                if (countryTimezones.length == 1) {
                    for (var prop in timezones[attr].z[0]) {
                        $(parent + " #selected").show();
                        $(parent + " #selected").text(prop);
                        $(parent + " #app-timezone").val(timezones[attr].z[0][prop]);
                        $(parent + " #app-country").val(attr);
                    }
                } else {

                    var firstTz = "";

                    for (var i = 0; i < timezones[attr].z.length; i++) {
                        for (var prop in timezones[attr].z[i]) {
                            if (i == 0) {
                                $(parent + " #timezone-select").find(".text").text(prop);
                                firstTz = timezones[attr].z[0][prop];
                                $(parent + " #app-country").val(attr);
                            }

                            timezoneSelect.append("<div data-value='" + timezones[attr].z[i][prop] + "' class='item'>" + prop + "</div>")
                        }
                    }

                    $(parent + " #timezone-select").show();
                    $(parent + " #app-timezone").val(firstTz);
                    $(parent + " .select-items .item").click(function () {
                        var selectedItem = $(this).parents(".cly-select").find(".text");
                        selectedItem.html($(this).html());
                        selectedItem.data("value", $(this).data("value"));
                    });
                    $(parent + " #timezone-items .item").click(function () {
                        $(parent + " #app-timezone").val($(this).data("value"));
                    });
                }
            });
        }

        function hideEdit() {
            $("#edit-app").removeClass("active");
            $(".edit").hide();
            $(".read").show();
            $(".table-edit").hide();
            $(".required").hide();
        }

        function resetAdd() {
            $("#app-add-name").val("");
            $("#app-add-category").text(jQuery.i18n.map["management-applications.category.tip"]);
            $("#app-add-category").data("value", "");
            $("#app-add-timezone #selected").text("");
            $("#app-add-timezone #selected").hide();
            $("#app-add-timezone .text").html(jQuery.i18n.map["management-applications.time-zone.tip"]);
            $("#app-add-timezone .text").data("value", "");
            $("#app-add-timezone #app-timezone").val("");
            $("#app-add-timezone #app-country").val("");
            $("#app-add-timezone #timezone-select").hide();
            $(".required").hide();
        }

        function showAdd() {
            if ($("#app-container-new").is(":visible")) {
                return false;
            }
            $(".app-container").removeClass("active");
            $("#first-app-success").hide();
            hideEdit();
            var manageBarApp = $("#manage-new-app>div").clone();
            manageBarApp.attr("id", "app-container-new");
            manageBarApp.addClass("active");

            if (jQuery.isEmptyObject(countlyGlobal['apps'])) {
                $("#cancel-app-add").hide();
            } else {
                $("#cancel-app-add").show();
            }

            $("#app-management-bar .scrollable").append(manageBarApp);
            $("#add-new-app").show();
            $("#view-app").hide();

            var userTimezone = jstz.determine().name();

            // Set timezone selection defaults to user's current timezone
            for (var countryCode in timezones) {
                for (var i = 0; i < timezones[countryCode].z.length; i++) {
                    for (var countryTimezone in timezones[countryCode].z[i]) {
                        if (timezones[countryCode].z[i][countryTimezone] == userTimezone) {
                            initCountrySelect("#app-add-timezone", countryCode, countryTimezone, userTimezone);
                            break;
                        }
                    }
                }
            }
        }

        function hideAdd() {
            $("#app-container-new").remove();
            $("#add-new-app").hide();
            resetAdd();
            $("#view-app").show();
        }

        initAppManagement(appId);
        initCountrySelect("#app-add-timezone");

        $("#clear-app-data").click(function () {
            if ($(this).hasClass("active")){
                $(this).removeClass("active");
                $(".options").slideUp();
            }
            else{
                $(this).addClass("active")
                $(".options").slideDown();
            }
        });
        
        $("#clear-data.options li").click(function(){
            $("#clear-app-data").removeClass('active');
            $(".options").slideUp();
            var period = $(this).attr("id").replace("clear-", "");
            CountlyHelpers.confirm(jQuery.i18n.map["management-applications.clear-confirm"], "red", function (result) {
                if (!result) {
                    return true;
                }

                var appId = $("#app-edit-id").val();

                $.ajax({
                    type:"GET",
                    url:countlyCommon.API_PARTS.apps.w + '/reset',
                    data:{
                        args:JSON.stringify({
                            app_id:appId,
                            period:period
                        }),
                        api_key:countlyGlobal['member'].api_key
                    },
                    dataType:"jsonp",
                    success:function (result) {

                        if (!result) {
                            CountlyHelpers.alert(jQuery.i18n.map["management-applications.clear-admin"], "red");
                            return false;
                        } else {
                            if(period == "all"){
                                countlySession.reset();
                                countlyLocation.reset();
                                countlyCity.reset();
                                countlyUser.reset();
                                countlyDevice.reset();
                                countlyCarrier.reset();
                                countlyDeviceDetails.reset();
                                countlyAppVersion.reset();
                                countlyEvent.reset();
                            }
                            CountlyHelpers.alert(jQuery.i18n.map["management-applications.clear-success"], "black");
                        }
                    }
                });
            });
        });

        $("#delete-app").click(function () {
            CountlyHelpers.confirm(jQuery.i18n.map["management-applications.delete-confirm"], "red", function (result) {

                if (!result) {
                    return true;
                }

                var appId = $("#app-edit-id").val();

                $.ajax({
                    type:"GET",
                    url:countlyCommon.API_PARTS.apps.w + '/delete',
                    data:{
                        args:JSON.stringify({
                            app_id:appId
                        }),
                        api_key:countlyGlobal['member'].api_key
                    },
                    dataType:"jsonp",
                    success:function () {
                        delete countlyGlobal['apps'][appId];
                        delete countlyGlobal['admin_apps'][appId];
                        var activeApp = $(".app-container").filter(function () {
                            return $(this).data("id") && $(this).data("id") == appId;
                        });

                        var changeApp = (activeApp.prev().length) ? activeApp.prev() : activeApp.next();
                        initAppManagement(changeApp.data("id"));
                        activeApp.fadeOut("slow").remove();

                        if (_.isEmpty(countlyGlobal['apps'])) {
                            $("#new-install-overlay").show();
                            $("#sidebar-app-select .logo").css("background-image", "");
                            $("#sidebar-app-select .text").text("");
                        }
                    },
                    error:function () {
                        CountlyHelpers.alert(jQuery.i18n.map["management-applications.delete-admin"], "red");
                    }
                });
            });
        });

        $("#edit-app").click(function () {
            if ($(".table-edit").is(":visible")) {
                hideEdit();
            } else {
                $(".edit").show();
                $("#edit-app").addClass("active");
                $(".read").hide();
                $(".table-edit").show();
            }
        });

        $("#save-app-edit").click(function () {
            if ($(this).hasClass("disabled")) {
                return false;
            }

            var appId = $("#app-edit-id").val(),
                appName = $("#app-edit-name .edit input").val();

            $(".required").fadeOut().remove();
            var reqSpan = $("<span>").addClass("required").text("*");

            if (!appName) {
                $("#app-edit-name .edit input").after(reqSpan.clone());
            }

            if ($(".required").length) {
                $(".required").fadeIn();
                return false;
            }

            var ext = $('#add-edit-image-form').find("#app_image").val().split('.').pop().toLowerCase();
            if (ext && $.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                return false;
            }

            $(this).addClass("disabled");

            $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.apps.w + '/update',
                data:{
                    args:JSON.stringify({
                        app_id:appId,
                        name:appName,
                        category:$("#app-edit-category .cly-select .text").data("value") + '',
                        timezone:$("#app-edit-timezone #app-timezone").val(),
                        country:$("#app-edit-timezone #app-country").val()
                    }),
                    api_key:countlyGlobal['member'].api_key
                },
                dataType:"jsonp",
                success:function (data) {
                    for (var modAttr in data) {
                        countlyGlobal['apps'][appId][modAttr] = data[modAttr];
                        countlyGlobal['admin_apps'][appId][modAttr] = data[modAttr];
                    }

                    if (!ext) {
                        $("#save-app-edit").removeClass("disabled");
                        initAppManagement(appId);
                        hideEdit();
                        $(".app-container").filter(function () {
                            return $(this).data("id") && $(this).data("id") == appId;
                        }).find(".name").text(appName);

                        var sidebarLogo = $("#sidebar-app-select .logo").attr("style");
                        if (sidebarLogo.indexOf(appId) !== -1) {
                            $("#sidebar-app-select .text").text(appName);
                        }
                        return true;
                    }

                    $('#add-edit-image-form').find("#app_image_id").val(appId);
                    $('#add-edit-image-form').ajaxSubmit({
                        resetForm:true,
                        beforeSubmit:function (formData, jqForm, options) {
                            formData.push({ name:'_csrf', value:countlyGlobal['csrf_token'] });
                        },
                        success:function (file) {
                            $("#save-app-edit").removeClass("disabled");
                            var updatedApp = $(".app-container").filter(function () {
                                return $(this).data("id") && $(this).data("id") == appId;
                            });

                            if (!file) {
                                CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                            } else {
                                updatedApp.find(".logo").css({
                                    "background-image":"url(" + file + "?v" + (new Date().getTime()) + ")"
                                });
                                $("#sidebar-app-select .logo").css("background-image", $("#sidebar-app-select .logo").css("background-image").replace(")","") + "?v" + (new Date().getTime()) + ")");
                            }

                            initAppManagement(appId);
                            hideEdit();
                            updatedApp.find(".name").text(appName);
                        }
                    });
                }
            });
        });

        $("#cancel-app-edit").click(function () {
            hideEdit();
            var appId = $("#app-edit-id").val();
            initAppManagement(appId);
        });

        $(".app-container:not(#app-container-new)").live("click", function () {
            var appId = $(this).data("id");
            hideEdit();
            $(".app-container").removeClass("active");
            $(this).addClass("active");
            initAppManagement(appId);
        });

        $("#add-app-button").click(function () {
            showAdd();
        });

        $("#cancel-app-add").click(function () {
            $("#app-container-new").remove();
            $("#add-new-app").hide();
            $("#view-app").show();
            $(".new-app-name").text(jQuery.i18n.map["management-applications.my-new-app"]);
            resetAdd();
        });

        $("#app-add-name").keyup(function () {
            var newAppName = $(this).val();
            $("#app-container-new .name").text(newAppName);
            $(".new-app-name").text(newAppName);
        });

        $("#save-app-add").click(function () {

            if ($(this).hasClass("disabled")) {
                return false;
            }

            var appName = $("#app-add-name").val(),
                category = $("#app-add-category").data("value") + "",
                timezone = $("#app-add-timezone #app-timezone").val(),
                country = $("#app-add-timezone #app-country").val();

            $(".required").fadeOut().remove();
            var reqSpan = $("<span>").addClass("required").text("*");

            if (!appName) {
                $("#app-add-name").after(reqSpan.clone());
            }

            if (!category) {
                $("#app-add-category").parents(".cly-select").after(reqSpan.clone());
            }

            if (!timezone) {
                $("#app-add-timezone #app-timezone").after(reqSpan.clone());
            }

            if ($(".required").length) {
                $(".required").fadeIn();
                return false;
            }

            var ext = $('#add-app-image-form').find("#app_image").val().split('.').pop().toLowerCase();
            if (ext && $.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                return false;
            }

            $(this).addClass("disabled");

            $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.apps.w + '/create',
                data:{
                    args:JSON.stringify({
                        name:appName,
                        category:category,
                        timezone:timezone,
                        country:country
                    }),
                    api_key:countlyGlobal['member'].api_key
                },
                dataType:"jsonp",
                success:function (data) {

                    var sidebarApp = $("#sidebar-new-app>div").clone();

                    var newAppObj = {
                        "_id":data._id,
                        "name":data.name,
                        "key":data.key,
                        "category":data.category,
                        "timezone":data.timezone,
                        "country":data.country
                    };

                    countlyGlobal['apps'][data._id] = newAppObj;
                    countlyGlobal['admin_apps'][data._id] = newAppObj;

                    var newApp = $("#app-container-new");
                    newApp.data("id", data._id);
                    newApp.data("key", data.key);
                    newApp.removeAttr("id");

                    if (!ext) {
                        $("#save-app-add").removeClass("disabled");
                        sidebarApp.find(".name").text(data.name);
                        sidebarApp.data("id", data._id);
                        sidebarApp.data("key", data.key);

                        $("#app-nav .apps-scrollable").append(sidebarApp);
                        initAppManagement(data._id);
                        return true;
                    }

                    $('#add-app-image-form').find("#app_image_id").val(data._id);
                    $('#add-app-image-form').ajaxSubmit({
                        resetForm:true,
                        beforeSubmit:function (formData, jqForm, options) {
                            formData.push({ name:'_csrf', value:countlyGlobal['csrf_token'] });
                        },
                        success:function (file) {
                            $("#save-app-add").removeClass("disabled");

                            if (!file) {
                                CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                            } else {
                                newApp.find(".logo").css({
                                    "background-image":"url(" + file + ")"
                                });
                                sidebarApp.find(".logo").css({
                                    "background-image":"url(" + file + ")"
                                });
                            }

                            sidebarApp.find(".name").text(data.name);
                            sidebarApp.data("id", data._id);
                            sidebarApp.data("key", data.key);

                            $("#app-nav .apps-scrollable").append(sidebarApp);
                            initAppManagement(data._id);
                        }
                    });
                }
            });
        });
    }
});

window.ManageUsersView = countlyView.extend({
    template:null,
    initialize:function () {
        var self = this;
        T.render('templates/users', function (t) {
            self.template = t;
        });
    },
    renderCommon:function (isRefresh) {
        var self = this;
        $.ajax({
            url:countlyCommon.API_PARTS.users.r + '/all',
            data:{
                api_key:countlyGlobal['member'].api_key
            },
            dataType:"jsonp",
            success:function (users) {
                $('#content').html(self.template({
                    users:users,
                    apps:countlyGlobal['apps'],
                    is_global_admin: (countlyGlobal["member"].global_admin) ? true : false
                }));
            }
        });
    }
});

window.EventsView = countlyView.extend({
    showOnGraph: 2,
    beforeRender: function() {},
    initialize:function () {
        this.template = Handlebars.compile($("#template-events").html());
    },
    pageScript:function () {
        $(".event-container").unbind("click");
        $(".segmentation-option").unbind("click");
        $(".big-numbers").unbind("click");

        var self = this;
        $(".event-container").on("click", function () {
            var tmpCurrEvent = $(this).data("key");
            self.showOnGraph = 2;
            $(".event-container").removeClass("active");
            $(this).addClass("active");

            countlyEvent.setActiveEvent(tmpCurrEvent, function() { self.refresh(true); });
        });
		
		$("#event-nav .event-container").mouseenter(function(){
			var elem = $(this);
			var name = elem.find(".name");
			if(name[0].scrollWidth >  name.innerWidth()){
				$("#event-tooltip").html(elem.clone());
				$("#event-tooltip .event-container").removeClass("active");
				$("#event-tooltip").css(elem.offset());
				$("#event-tooltip .name").css({"width":"auto"});
				$("#event-tooltip").show();
				$("#event-tooltip").bind("click", function(){
					elem.trigger("click");
				});
			}
		});
		$("#event-tooltip").mouseleave(function(){
			if($("#event-tooltip").is(':visible')){
				$("#event-tooltip").hide();
				$("#event-tooltip").unbind("click");
			}
		});

        $(".segmentation-option").on("click", function () {
            var tmpCurrSegmentation = $(this).data("value");
            countlyEvent.setActiveSegmentation(tmpCurrSegmentation, function() {
                self.renderCommon(true);
                newPage = $("<div>" + self.template(self.templateData) + "</div>");

                $(self.el).find("#event-nav .scrollable").html(function () {
                    return newPage.find("#event-nav .scrollable").html();
                });

                $(self.el).find(".widget-footer").html(newPage.find(".widget-footer").html());
                $(self.el).find("#edit-event-container").replaceWith(newPage.find("#edit-event-container"));

                var eventData = countlyEvent.getEventData();
                self.drawGraph(eventData);
                self.pageScript();

                self.drawTable(eventData);

                app.localize();
            });
        });

        $(".big-numbers").on("click", function () {
            if ($(".big-numbers.selected").length == 2) {
                self.showOnGraph = 1 - $(this).index();
            } else if ($(".big-numbers.selected").length == 1) {
                if ($(this).hasClass("selected")) {
                    return true;
                } else {
                    self.showOnGraph = 2;
                }
            }
            $(this).toggleClass("selected");

            self.drawGraph(countlyEvent.getEventData());
        });

        if (countlyGlobal['admin_apps'][countlyCommon.ACTIVE_APP_ID]) {
            $("#edit-events-button").show();
        }
    },
    drawGraph:function(eventData) {
        if (this.showOnGraph != 2) {
            $(".big-numbers").removeClass("selected");
            $(".big-numbers").eq(this.showOnGraph).addClass("selected");

            if (eventData.dataLevel == 2) {
                eventData.chartDP.dp = eventData.chartDP.dp.slice(this.showOnGraph, this.showOnGraph + 1);
            } else {
                eventData.chartDP = eventData.chartDP.slice(this.showOnGraph, this.showOnGraph + 1);
            }
        } else {
            $(".big-numbers").addClass("selected");
        }

        if (eventData.dataLevel == 2) {
            countlyCommon.drawGraph(eventData.chartDP, "#dashboard-graph", "bar", {series:{stack:null}});
        } else {
            countlyCommon.drawTimeGraph(eventData.chartDP, "#dashboard-graph");
        }
    },
    drawTable:function(eventData) {
        if (this.dtable && this.dtable.fnDestroy) {
            this.dtable.fnDestroy(true);
        }

        $("#event-main").append('<table class="d-table" cellpadding="0" cellspacing="0"></table>');

        var aaColumns = [];

        if (countlyEvent.isSegmentedView()) {
            aaColumns.push({"mData":"curr_segment", "sTitle":jQuery.i18n.map["events.table.segmentation"]});
        } else {
            aaColumns.push({"mData":"date", "sType":"customDate", "sTitle":jQuery.i18n.map["common.date"]});
        }

        aaColumns.push({"mData":"c", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle":eventData.tableColumns[1]});

        if (eventData.tableColumns[2]) {
            aaColumns.push({"mData":"s", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle":eventData.tableColumns[2]});
        }

        this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
            "aaData": eventData.chartData,
            "aoColumns": aaColumns
        }));

        $(".d-table").stickyTableHeaders();
    },
    getColumnCount:function(){
        return $(".dataTable").find("thead th").length;
    },
    renderCommon:function (isRefresh) {
        var eventData = countlyEvent.getEventData(),
            eventSummary = countlyEvent.getEventSummary(),
            self = this;

        this.templateData = {
            "page-title":eventData.eventName.toUpperCase(),
            "logo-class":"events",
            "events":countlyEvent.getEvents(),
            "event-map":countlyEvent.getEventMap(),
            "segmentations":countlyEvent.getEventSegmentations(),
            "active-segmentation":countlyEvent.getActiveSegmentation(),
            "big-numbers":eventSummary,
            "chart-data":{
                "columnCount":eventData.tableColumns.length,
                "columns":eventData.tableColumns,
                "rows":eventData.chartData
            }
        };

        if (countlyEvent.getEvents().length == 0) {
            window.location = "dashboard#/";
            CountlyHelpers.alert(jQuery.i18n.map["events.no-event"], "black");
            return true;
        }

        if (!isRefresh) {
            $(this.el).html(this.template(this.templateData));

            this.drawGraph(eventData);
            this.drawTable(eventData);
            this.pageScript();

            $("#edit-events-button").on("click", function () {
                CountlyHelpers.popup("#edit-event-container", "events");

                $(".dialog #edit-event-table-container").slimScroll({
                    height:'100%',
                    start:'top',
                    wheelStep:10,
                    position:'right',
                    disableFadeOut:true
                });

                $(".dialog .events-table").sortable({
                    items:"tr",
                    revert:true,
                    handle:"td:first-child",
                    helper:function (e, elem) {
                        elem.children().each(function () {
                            $(this).width($(this).width());
                        });

                        elem.addClass("moving");

                        return elem;
                    },
                    cursor:"move",
                    containment:"parent",
                    tolerance:"pointer",
                    placeholder:"event-row-placeholder",
                    stop:function (e, elem) {
                        elem.item.removeClass("moving");
                    }
                });

                $(".dialog #events-save").on("click", function () {
                    var eventMap = {},
                        eventOrder = [];

                    $(".dialog .events-table tbody tr").each(function () {
                        var currEvent = $(this);
                        eventKey = currEvent.find(".event-key").text();

                        if (currEvent.find(".event-name").val()) {
                            if (!eventMap[eventKey]) {
                                eventMap[eventKey] = {}
                            }
                            eventMap[eventKey]["name"] = currEvent.find(".event-name").val();
                        }

                        if (currEvent.find(".event-count").val()) {
                            if (!eventMap[eventKey]) {
                                eventMap[eventKey] = {}
                            }
                            eventMap[eventKey]["count"] = currEvent.find(".event-count").val();
                        }

                        if (currEvent.find(".event-sum").val()) {
                            if (!eventMap[eventKey]) {
                                eventMap[eventKey] = {}
                            }
                            eventMap[eventKey]["sum"] = currEvent.find(".event-sum").val();
                        }
                    });

                    $(".dialog .events-table").find(".event-key").each(function () {
                        if ($(this).text()) {
                            eventOrder.push($(this).text());
                        }
                    });

                    $.ajax({
                        type:"POST",
                        url:countlyGlobal["path"]+"/events/map/edit",
                        data:{
                            "app_id":countlyCommon.ACTIVE_APP_ID,
                            "event_map":eventMap,
                            "event_order":eventOrder,
                            _csrf:countlyGlobal['csrf_token']
                        },
                        success:function (result) {
                            self.refresh();
                        }
                    });
                });

                $(".delete-event").on("click", function() {
                    var eventKey = $(this).data("event-key");
                    var dialog = $(this).parents(".dialog");
                    if (eventKey) {
                        CountlyHelpers.confirm(jQuery.i18n.prop('events.delete-confirm', eventKey), "red", function (result) {
                            if (result) {
                                $.ajax({
                                    type:"POST",
                                    url:countlyGlobal["path"]+"/events/delete",
                                    data:{
                                        "event_key":eventKey,
                                        "app_id":countlyCommon.ACTIVE_APP_ID,
                                        _csrf:countlyGlobal['csrf_token']
                                    },
                                    success:function (result) {
                                        countlyEvent.reset();
                                        $.when(countlyEvent.initialize(true)).then(function () {
                                            self.render();
                                        });
                                        $(".dialog #edit-event-table-container tr").each(function(){
                                            if($(this).find(".delete-event").data("event-key") == eventKey){
                                                var height = dialog.outerHeight()-$(this).outerHeight();
                                                $(this).remove();
                                                dialog.css({
                                                    "height":height
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                
                $(".delete-event-selected").on("click", function() {
                    var eventKey = $(this).data("event-key");
                    var dialog = $(this).parents(".dialog");
                    CountlyHelpers.confirm(jQuery.i18n.prop('events.delete-confirm-many'), "red", function (result) {
                        if (result) {
                            var events = [];
                            var recheck = {};
                            var key;
                            $(".dialog .delete-event-check").each(function(){
                                if($(this).is(':checked')){
                                    key = $(this).data("event-key");
                                    events.push(key);
                                    recheck[key] = true;
                                }
                            });
                            $.ajax({
                                type:"POST",
                                url:countlyGlobal["path"]+"/events/delete_multi",
                                data:{
                                    "events":JSON.stringify(events),
                                    "app_id":countlyCommon.ACTIVE_APP_ID,
                                    _csrf:countlyGlobal['csrf_token']
                                },
                                success:function (result) {
                                    countlyEvent.reset();
                                    $.when(countlyEvent.initialize(true)).then(function () {
                                        self.render();
                                    });
                                    $(".dialog #edit-event-table-container tr").each(function(){
                                        if(recheck[$(this).find(".delete-event").data("event-key")]){
                                            var height = dialog.outerHeight()-$(this).outerHeight();
                                            $(this).remove();
                                            dialog.css({
                                                "height":height
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            });
        }
    },
    refresh:function (eventChanged, segmentationChanged) {
        var self = this;
        $.when(countlyEvent.initialize(eventChanged)).then(function () {

            if (app.activeView != self) {
                return false;
            }
            self.renderCommon(true);
            newPage = $("<div>" + self.template(self.templateData) + "</div>");

            $(self.el).find("#event-nav .scrollable").html(function () {
                return newPage.find("#event-nav .scrollable").html();
            });

            // Segmentation change does not require title area refresh
            if (!segmentationChanged) {
                if ($("#event-update-area .cly-select").length && !eventChanged) {
                    // If there is segmentation for this event and this is not an event change refresh
                    // we just refresh the segmentation select's list
                    $(self.el).find("#event-update-area .select-items").html(function () {
                        return newPage.find("#event-update-area .select-items").html();
                    });

                    $("#event-update-area .select-items>div").addClass("scroll-list");
                    $("#event-update-area .select-items").find(".scroll-list").slimScroll({
                        height:'100%',
                        start:'top',
                        wheelStep:10,
                        position:'right',
                        disableFadeOut:true
                    });

                    $(".select-items .item").click(function () {
                        var selectedItem = $(this).parents(".cly-select").find(".text");
                        selectedItem.text($(this).text());
                        selectedItem.data("value", $(this).data("value"));
                    });
                } else {
                    // Otherwise we refresh whole title area including the title and the segmentation select
                    // and afterwards initialize the select since we replaced it with a new element
                    $(self.el).find("#event-update-area").replaceWith(newPage.find("#event-update-area"));
                }
            }

            $(self.el).find(".widget-footer").html(newPage.find(".widget-footer").html());
            $(self.el).find("#edit-event-container").replaceWith(newPage.find("#edit-event-container"));

            var eventData = countlyEvent.getEventData();
            self.drawGraph(eventData);
            self.pageScript();

            if (eventChanged || segmentationChanged) {
                self.drawTable(eventData);
            } else if (self.getColumnCount() != eventData.tableColumns.length) {
                self.drawTable(eventData);
            } else {
                CountlyHelpers.refreshTable(self.dtable, eventData.chartData);
            }

            app.localize();
        });
    }
});

var AppRouter = Backbone.Router.extend({
    routes:{
        "/":"dashboard",
        "/analytics/sessions":"sessions",
        "/analytics/countries":"countries",
		"/analytics/users":"users",
        "/analytics/loyalty":"loyalty",
        "/analytics/devices":"devices",
        "/analytics/platforms":"platforms",
        "/analytics/versions":"versions",
        "/analytics/carriers":"carriers",
        "/analytics/frequency":"frequency",
        "/analytics/events":"events",
        "/analytics/resolutions":"resolutions",
        "/analytics/durations":"durations",
		"/all":"allapps",
        "/manage/apps":"manageApps",
        "/manage/users":"manageUsers",
        "*path":"main"
    },
    activeView:null, //current view
    dateToSelected:null, //date to selected from the date picker
    dateFromSelected:null, //date from selected from the date picker
    activeAppName:'',
    activeAppKey:'',
    main:function () {
        this.navigate("/", true);
    },
    dashboard:function () {
        this.renderWhenReady(this.dashboardView);
    },
    sessions:function () {
        this.renderWhenReady(this.sessionView);
    },
    countries:function () {
        this.renderWhenReady(this.countriesView);
    },
    devices:function () {
        this.renderWhenReady(this.deviceView);
    },
    platforms:function () {
        this.renderWhenReady(this.platformView);
    },
    versions:function () {
        this.renderWhenReady(this.appVersionView);
    },
    users:function () {
        this.renderWhenReady(this.userView);
    },
	allapps:function () {
        this.renderWhenReady(this.allAppsView);
    },
    loyalty:function () {
        this.renderWhenReady(this.loyaltyView);
    },
    frequency:function () {
        this.renderWhenReady(this.frequencyView);
    },
    carriers:function () {
        this.renderWhenReady(this.carrierView);
    },
    manageApps:function () {
        this.renderWhenReady(this.manageAppsView);
    },
    manageUsers:function () {
        this.renderWhenReady(this.manageUsersView);
    },
    events:function () {
        this.renderWhenReady(this.eventsView);
    },
    resolutions:function () {
        this.renderWhenReady(this.resolutionsView);
    },
    durations:function () {
        this.renderWhenReady(this.durationsView);
    },
    refreshActiveView:function () {
    }, //refresh interval function
    renderWhenReady:function (viewName) { //all view renders end up here

        // If there is an active view call its destroy function to perform cleanups before a new view renders
        if (this.activeView) {
            this.activeView.destroy();
        }

        this.activeView = viewName;
        clearInterval(this.refreshActiveView);

        if (_.isEmpty(countlyGlobal['apps'])) {
            if (Backbone.history.fragment != "/manage/apps") {
                this.navigate("/manage/apps", true);
            } else {
                viewName.render();
            }
            return false;
        }

        viewName.render();

        var self = this;
        this.refreshActiveView = setInterval(function () {
            self.activeView.refresh();
			if(self.refreshScripts[Backbone.history.fragment])
				for(var i = 0, l = self.refreshScripts[Backbone.history.fragment].length; i < l; i++)
					self.refreshScripts[Backbone.history.fragment][i]();
			if(self.refreshScripts["#"])
				for(var i = 0, l = self.refreshScripts["#"].length; i < l; i++)
					self.refreshScripts["#"][i]();
        }, countlyCommon.DASHBOARD_REFRESH_MS);
        
        if(countlyGlobal && countlyGlobal["message"]){
            CountlyHelpers.parseAndShowMsg(countlyGlobal["message"]);
        }
    },
    initialize:function () { //initialize the dashboard, register helpers etc.
		this.pageScripts = {};
		this.refreshScripts = {};
        this.dashboardView = new DashboardView();
        this.sessionView = new SessionView();
        this.countriesView = new CountriesView();
        this.userView = new UserView();
		this.allAppsView = new AllAppsView();
        this.loyaltyView = new LoyaltyView();
        this.deviceView = new DeviceView();
        this.platformView = new PlatformView();
        this.appVersionView = new AppVersionView();
        this.frequencyView = new FrequencyView();
        this.carrierView = new CarrierView();
        this.manageAppsView = new ManageAppsView();
        this.manageUsersView = new ManageUsersView();
        this.eventsView = new EventsView();
        this.resolutionsView = new ResolutionView();
        this.durationsView = new DurationView();

        Handlebars.registerPartial("date-selector", $("#template-date-selector").html());
        Handlebars.registerPartial("timezones", $("#template-timezones").html());
        Handlebars.registerPartial("app-categories", $("#template-app-categories").html());
        Handlebars.registerHelper('eachOfObject', function (context, options) {
            var ret = "";
            for (var prop in context) {
                ret = ret + options.fn({property:prop, value:context[prop]});
            }
            return ret;
        });
        Handlebars.registerHelper('eachOfObjectValue', function (context, options) {
            var ret = "";
            for (var prop in context) {
                ret = ret + options.fn(context[prop]);
            }
            return ret;
        });
        Handlebars.registerHelper('eachOfArray', function (context, options) {
            var ret = "";
            for (var i = 0; i < context.length; i++) {
                ret = ret + options.fn({index:i, value:context[i]});
            }
            return ret;
        });
		Handlebars.registerHelper('prettyJSON', function (context, options) {
            return JSON.stringify(context, undefined, 4);
        });
        Handlebars.registerHelper('getShortNumber', function (context, options) {
            return countlyCommon.getShortNumber(context);
        });
        Handlebars.registerHelper('getFormattedNumber', function (context, options) {
            if (isNaN(context)) {
                return context;
            }

            ret = parseFloat((parseFloat(context).toFixed(2)).toString()).toString();
            return ret.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        });
        Handlebars.registerHelper('toUpperCase', function (context, options) {
            return context.toUpperCase();
        });
        Handlebars.registerHelper('appIdsToNames', function (context, options) {
            return CountlyHelpers.appIdsToNames(context);
        });
        Handlebars.registerHelper('forNumberOfTimes', function (context, options) {
            var ret = "";
            for (var i = 0; i < context; i++) {
                ret = ret + options.fn({count:i + 1});
            }
            return ret;
        });
        Handlebars.registerHelper('include', function (templatename, options) {
            var partial = Handlebars.partials[templatename];
            var context = $.extend({}, this, options.hash);
            return partial(context);
        });
		Handlebars.registerHelper('for', function(from, to, incr, block) {
			var accum = '';
			for(var i = from; i < to; i += incr)
				accum += block.fn(i);
			return accum;
		});
		Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
			switch (operator) {
				case '==':
					return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '!=':
					return (v1 != v2) ? options.fn(this) : options.inverse(this);
				case '===':
					return (v1 === v2) ? options.fn(this) : options.inverse(this);
				case '<':
					return (v1 < v2) ? options.fn(this) : options.inverse(this);
				case '<=':
					return (v1 <= v2) ? options.fn(this) : options.inverse(this);
				case '>':
					return (v1 > v2) ? options.fn(this) : options.inverse(this);
				case '>=':
					return (v1 >= v2) ? options.fn(this) : options.inverse(this);
				case '&&':
					return (v1 && v2) ? options.fn(this) : options.inverse(this);
				case '||':
					return (v1 || v2) ? options.fn(this) : options.inverse(this);
				default:
					return options.inverse(this);
			}
		});
        Handlebars.registerHelper('formatTimeAgo', function (context, options) {
            return countlyCommon.formatTimeAgo(parseInt(context)/1000);
        });

        jQuery.i18n.properties({
            name:'locale',
            cache:true,
            language:countlyCommon.BROWSER_LANG_SHORT,
            path:[countlyGlobal["cdn"]+'localization/min/'],
            mode:'map'
        });

        var self = this;
        $(document).ready(function () {

            CountlyHelpers.initializeSelect();
            CountlyHelpers.initializeTextSelect();
            CountlyHelpers.initializeHugeDropdown();
			
			if(countlyGlobal.config["session_timeout"]){
				var minTimeout, tenSecondTimeout, logoutTimeout, actionTimeout;
				var shouldRecordAction = false;
				var extendSession = function(){
					$.ajax({
						url:countlyGlobal["path"]+"/session",
						success:function (result) {
							if(result == "logout"){
								$("#user-logout").click();
								window.location = "/logout";
							}
							else if(result == "success"){
								shouldRecordAction = false;
								setTimeout(function(){
									shouldRecordAction = true;
								}, Math.round(countlyGlobal.config["session_timeout"]/2));
								resetSessionTimeouts(countlyGlobal.config["session_timeout"]);
							}
						}
					});
				}
				var resetSessionTimeouts = function(timeout){
					var minute = timeout - 60*1000;
					if(minTimeout){
						clearTimeout(minTimeout);
						minTimeout = null;
					}
					if(minute > 0){
						minTimeout = setTimeout(function(){
							CountlyHelpers.notify({title:jQuery.i18n.map["common.session-expiration"], message:jQuery.i18n.map["common.expire-minute"], info:jQuery.i18n.map["common.click-to-login"]})
						}, minute);
					}
					var tenSeconds = timeout - 10*1000;
					if(tenSecondTimeout){
						clearTimeout(tenSecondTimeout);
						tenSecondTimeout = null;
					}
					if(tenSeconds > 0){
						tenSecondTimeout = setTimeout(function(){
							CountlyHelpers.notify({title:jQuery.i18n.map["common.session-expiration"], message:jQuery.i18n.map["common.expire-seconds"], info:jQuery.i18n.map["common.click-to-login"]})
						}, tenSeconds);
					}
					if(logoutTimeout){
						clearTimeout(logoutTimeout);
						logoutTimeout = null;
					}
					logoutTimeout = setTimeout(function(){
						extendSession();
					}, timeout+1000);
				}
				resetSessionTimeouts(countlyGlobal.config["session_timeout"]);
				$(document).click(function (event) {
					if(shouldRecordAction)
						extendSession();
				});
				extendSession();
			}

            // If date range is selected initialize the calendar with these
            var periodObj = countlyCommon.getPeriod();
            if (Object.prototype.toString.call(periodObj) === '[object Array]' && periodObj.length == 2) {
                self.dateFromSelected = countlyCommon.getPeriod()[0];
                self.dateToSelected = countlyCommon.getPeriod()[1];
            }

            // Initialize localization related stuff

            // Localization test
            /*
             $.each(jQuery.i18n.map, function (key, value) {
             jQuery.i18n.map[key] = key;
             });
             */

            try {
                moment.lang(countlyCommon.BROWSER_LANG_SHORT);
            } catch(e) {
                moment.lang("en");
            }

            $(".reveal-language-menu").text(countlyCommon.BROWSER_LANG_SHORT.toUpperCase());

            $(".apps-scrollable").sortable({
                items:".app-container.app-navigate",
                revert:true,
                forcePlaceholderSize:true,
                handle:".drag",
                containment:"parent",
                tolerance:"pointer",
                stop:function () {
                    var orderArr = [];
                    $(".app-container.app-navigate").each(function () {
                        if ($(this).data("id")) {
                            orderArr.push($(this).data("id"))
                        }
                    });

                    $.ajax({
                        type:"POST",
                        url:countlyGlobal["path"]+"/dashboard/settings",
                        data:{
                            "app_sort_list":orderArr,
                            _csrf:countlyGlobal['csrf_token']
                        },
                        success:function (result) {
                        }
                    });
                }
            });
            $("#sort-app-button").click(function () {
                $(".app-container.app-navigate .drag").fadeToggle();
                setTimeout(function(){
                    if($(".app-container.app-navigate .drag").is(":visible")){
                        self.disableAppTooltip();
                    }
                    else{
                        self.enableAppTooltip();
                    }
                },500);
            });

            $(".app-navigate").live("click", function () {
                self.closeAppTooltip();
                self.disableAppTooltip();
                var appKey = $(this).data("key"),
                    appId = $(this).data("id"),
                    appName = $(this).find(".name").text(),
                    appImage = $(this).find(".logo").css("background-image"),
                    sidebarApp = $("#sidebar-app-select");

				if (appId == "allapps") {
					window.location.hash = "/all";
					sidebarApp.removeClass("active");
                    $("#app-nav").animate({left:'31px'}, {duration:500, easing:'easeInBack'});
					self.activeAppKey = appKey;
                    setTimeout(function(){
                        $("#sidebar-menu > .item").addClass("hide");
                        $("#management-menu").removeClass("hide");
                        $("#allapps-menu").removeClass("hide").css("display", "block");
                    },500);
                    return false;
				}
				else{
					$("#sidebar-menu > .item").removeClass("hide");
					$("#allapps-menu").css("display", "none");
				}

				if(window.location.hash.toString() == "#/all")
					window.location.hash = "/";

                if (self.activeAppKey == appKey) {
                    sidebarApp.removeClass("active");
                    $("#app-nav").animate({left:'31px'}, {duration:500, easing:'easeInBack'});
                    return false;
                }

                self.activeAppName = appName;
                self.activeAppKey = appKey;
                
                $("#app-nav").animate({left:'31px'}, {duration:500, easing:'easeInBack', complete:function () {
                    countlyCommon.setActiveApp(appId);
                    sidebarApp.find(".text").text(appName);
                    sidebarApp.find(".logo").css("background-image", appImage);
                    sidebarApp.removeClass("active");
                    self.activeView.appChanged();
                }});
            });
            
            $(document).on("mouseenter", ".app-container", function(){
                if(self.appTooltip){
                    var elem = $(this);
                    var name = elem.find(".name");
                    if(name[0].scrollWidth >  name.innerWidth()){
                        if(elem.parents("#app-nav").length)
                            $("#app-tooltip").css("margin-left", "21px");
                        else
                            $("#app-tooltip").css({"margin-left":"3px", "padding-left":"1px"});
                        $("#app-tooltip").html(elem.clone());
                        $("#app-tooltip .app-container").removeClass("active");
                        $("#app-tooltip").css(elem.offset());
                        $("#app-tooltip .name").css({"width":"auto"});
                        $("#app-tooltip").show();
                        $("#app-tooltip").bind("click", function(){
                            elem.trigger("click");
                            elem.addClass("active");
                        });
                    }
                }
            });
            $("#app-tooltip").mouseleave(function(){self.closeAppTooltip()});

            $("#sidebar-events").click(function (e) {
                $.when(countlyEvent.refreshEvents()).then(function () {
                    if (countlyEvent.getEvents().length == 0) {
                        CountlyHelpers.alert(jQuery.i18n.map["events.no-event"], "black");
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                });
            });

            $("#sidebar-menu").on("click", ".item", function () {
                var elNext = $(this).next(),
                    isElActive = $(this).hasClass("active");

                if (elNext.hasClass("sidebar-submenu") && !(isElActive)) {
                    elNext.slideToggle();
                } else {
                    $("#sidebar-menu>.item").removeClass("active");
                    $(this).addClass("active");
                    var subMenu = $(this).parent(".sidebar-submenu");
                    subMenu.prev(".item").addClass("active");

                    if ($("#app-nav").offset().left == 201) {
                        self.closeAppTooltip();
                        $("#app-nav").animate({left:'31px'}, {duration:500, easing:'easeInBack'});
                        $("#sidebar-app-select").removeClass("active");
                    }
                }
            });
			$('#sidebar-menu').slimScroll({
				height: ($(window).height()-123-96)+'px',
				railVisible: true,
				railColor : '#4CC04F',
				railOpacity : .2,
				color: '#4CC04F'
			});
			$( window ).resize(function() {
				$('#sidebar-menu').slimScroll({
					height: ($(window).height()-123-96)+'px'
				});
			});

            $(".sidebar-submenu").on("click", ".item", function () {

                if ($(this).hasClass("disabled")) {
                    return true;
                }

                if ($("#app-nav").offset().left == 201) {
                    $("#app-nav").animate({left:'31px'}, {duration:500, easing:'easeInBack'});
                    $("#sidebar-app-select").removeClass("active");
                }

                $(".sidebar-submenu .item").removeClass("active");
                $(this).addClass("active");
                $(this).parent().prev(".item").addClass("active");
            });

            $("#sidebar-app-select").click(function () {

                if ($(this).hasClass("disabled")) {
                    return true;
                }

                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    $(this).addClass("active");
                }

                $("#app-nav").show();
                var left = $("#app-nav").offset().left;

                if (left == 201) {
                    $("#app-nav").animate({left:'31px'}, {duration:500, easing:'easeInBack', complete:function(){self.disableAppTooltip();}});
                } else {
                    $("#app-nav").animate({left:'201px'}, {duration:500, easing:'easeOutBack', complete:function(){self.enableAppTooltip();}});
                }

            });

            $("#sidebar-bottom-container .reveal-menu").click(function () {
                $("#language-menu").hide();
                $("#sidebar-bottom-container .menu").toggle();
            });

            $("#sidebar-bottom-container .reveal-language-menu").click(function () {
                $("#sidebar-bottom-container .menu").hide();
                $("#language-menu").toggle();
            });

            $("#sidebar-bottom-container .item").click(function () {
                $("#sidebar-bottom-container .menu").hide();
                $("#language-menu").hide();
            });

            $("#language-menu .item").click(function () {
                var langCode = $(this).data("language-code"),
                    langCodeUpper = langCode.toUpperCase();

                store.set("countly_lang", langCode);
                $(".reveal-language-menu").text(langCodeUpper);

                countlyCommon.BROWSER_LANG_SHORT = langCode;
                countlyCommon.BROWSER_LANG = langCode;

                try {
                    moment.lang(countlyCommon.BROWSER_LANG_SHORT);
                } catch(e) {
                    moment.lang("en");
                }

                $("#date-to").datepicker("option", $.datepicker.regional[countlyCommon.BROWSER_LANG]);
                $("#date-from").datepicker("option", $.datepicker.regional[countlyCommon.BROWSER_LANG]);

                jQuery.i18n.properties({
                    name:'locale',
                    cache:true,
                    language:countlyCommon.BROWSER_LANG_SHORT,
                    path:[countlyGlobal["cdn"]+'localization/min/'],
                    mode:'map',
                    callback:function () {
                        $.when(countlyLocation.changeLanguage()).then(function () {
                            self.activeView.render();
                            self.pageScript();
                        });
                    }
                });
            });

            $("#account-settings").click(function () {
                CountlyHelpers.popup("#edit-account-details");
                $(".dialog #username").val($("#menu-username").text());
                $(".dialog #api-key").val($("#user-api-key").val());
            });

            $("#save-account-details:not(.disabled)").live('click', function () {
                var username = $(".dialog #username").val(),
                    old_pwd = $(".dialog #old_pwd").val(),
                    new_pwd = $(".dialog #new_pwd").val(),
                    re_new_pwd = $(".dialog #re_new_pwd").val();

                if (new_pwd != re_new_pwd) {
                    $(".dialog #settings-save-result").addClass("red").text(jQuery.i18n.map["user-settings.password-match"]);
                    return true;
                }

                $(this).addClass("disabled");

                $.ajax({
                    type:"POST",
                    url:countlyGlobal["path"]+"/user/settings",
                    data:{
                        "username":username,
                        "old_pwd":old_pwd,
                        "new_pwd":new_pwd,
                        _csrf:countlyGlobal['csrf_token']
                    },
                    success:function (result) {
                        var saveResult = $(".dialog #settings-save-result");

                        if (result == "username-exists") {
                            saveResult.removeClass("green").addClass("red").text(jQuery.i18n.map["management-users.username.exists"]);
                        } else if (!result) {
                            saveResult.removeClass("green").addClass("red").text(jQuery.i18n.map["user-settings.alert"]);
                        } else {
                            saveResult.removeClass("red").addClass("green").text(jQuery.i18n.map["user-settings.success"]);
                            $(".dialog #old_pwd").val("");
                            $(".dialog #new_pwd").val("");
                            $(".dialog #re_new_pwd").val("");
                            $("#menu-username").text(username);
                        }

                        $(".dialog #save-account-details").removeClass("disabled");
                    }
                });
            });

            $('.apps-scrollable').slimScroll({
                height:'100%',
                start:'top',
                wheelStep:10,
                position:'right',
                disableFadeOut:true
            });

            var help = _.once(function () {
                CountlyHelpers.alert(jQuery.i18n.map["help.help-mode-welcome"], "black");
            });
            $(".help-toggle, #help-toggle").click(function (e) {
                e.stopPropagation();
                $("#help-toggle").toggleClass("active");

                app.tipsify($("#help-toggle").hasClass("active"));

                if ($("#help-toggle").hasClass("active")) {
                    help();
                    $.idleTimer('destroy');
                    clearInterval(self.refreshActiveView);
                } else {
                    self.refreshActiveView = setInterval(function () {
                        self.activeView.refresh();
                    }, countlyCommon.DASHBOARD_REFRESH_MS);
                    $.idleTimer(countlyCommon.DASHBOARD_IDLE_MS);
                }
            });

            $("#user-logout").click(function () {
                store.remove('countly_active_app');
                store.remove('countly_date');
                store.remove('countly_location_city');
            });
	    
            $(".beta-button").click(function () {
                CountlyHelpers.alert("This feature is currently in beta so the data you see in this view might change or disappear into thin air.<br/><br/>If you find any bugs or have suggestions please let us know!<br/><br/><a style='font-weight:500;'>Captain Obvious:</a> You can use the message box that appears when you click the question mark on the bottom right corner of this page.", "black");
            });

            $("#content").on("click", "#graph-note", function () {
                CountlyHelpers.popup("#graph-note-popup");

                $(".note-date:visible").datepicker({
                    numberOfMonths:1,
                    showOtherMonths:true,
                    onSelect:function () {
                        dateText();
                    }
                });

                $.datepicker.setDefaults($.datepicker.regional[""]);
                $(".note-date:visible").datepicker("option", $.datepicker.regional[countlyCommon.BROWSER_LANG]);

                $('.note-popup:visible .time-picker, .note-popup:visible .note-list').slimScroll({
                    height:'100%',
                    start:'top',
                    wheelStep:10,
                    position:'right',
                    disableFadeOut:true
                });

                $(".note-popup:visible .time-picker span").on("click", function() {
                    $(".note-popup:visible .time-picker span").removeClass("selected");
                    $(this).addClass("selected");
                    dateText();
                });


                $(".note-popup:visible .manage-notes-button").on("click", function() {
                    $(".note-popup:visible .note-create").hide();
                    $(".note-popup:visible .note-manage").show();
                    $(".note-popup:visible .create-note-button").show();
                    $(this).hide();
                    $(".note-popup:visible .create-note").hide();
                });

                $(".note-popup:visible .create-note-button").on("click", function() {
                    $(".note-popup:visible .note-create").show();
                    $(".note-popup:visible .note-manage").hide();
                    $(".note-popup:visible .manage-notes-button").show();
                    $(this).hide();
                    $(".note-popup:visible .create-note").show();
                });

                dateText();

                function dateText() {
                    var selectedDate = $(".note-date:visible").val(),
                        instance = $(".note-date:visible").data("datepicker"),
                        date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);

                    $(".selected-date:visible").text(moment(date).format("D MMM YYYY") + ", " + $(".time-picker:visible span.selected").text());
                }

                if (countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID] && countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID].notes) {
                    var noteDateIds = _.sortBy(_.keys(countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID].notes), function(el) { return -parseInt(el); });

                    for (var i = 0; i < noteDateIds.length; i++) {
                        var currNotes = countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID].notes[noteDateIds[i]];

                        for (var j = 0; j < currNotes.length; j++) {
                            $(".note-popup:visible .note-list").append(
                                '<div class="note">' +
                                    '<div class="date" data-dateid="' + noteDateIds[i] + '">' + moment(noteDateIds[i], "YYYYMMDDHH").format("D MMM YYYY, HH:mm") + '</div>' +
                                    '<div class="content">' + currNotes[j] + '</div>' +
                                    '<div class="delete-note"><i class="fa fa-trash"></i></div>' +
                                '</div>'
                            );
                        }
                    }
                }

                if (!$(".note-popup:visible .note").length) {
                    $(".note-popup:visible .manage-notes-button").hide();
                }

                $('.note-popup:visible .note-content').textcounter({
                    max: 50,
                    countDown: true,
                    countDownText: "remaining "
                });

                $(".note-popup:visible .note .delete-note").on("click", function() {
                    var dateId = $(this).siblings(".date").data("dateid"),
                        note = $(this).siblings(".content").text();

                    $(this).parents(".note").fadeOut().remove();

                    $.ajax({
                        type:"POST",
                        url:countlyGlobal["path"]+'/graphnotes/delete',
                        data:{
                            "app_id":countlyCommon.ACTIVE_APP_ID,
                            "date_id":dateId,
                            "note":note,
                            _csrf:countlyGlobal['csrf_token']
                        },
                        success:function (result) {
                            if (result == false) {
                                return false;
                            } else {
                                updateGlobalNotes({date_id: dateId, note:note}, "delete");
                                app.activeView.refresh();
                            }
                        }
                    });

                    if (!$(".note-popup:visible .note").length) {
                        $(".note-popup:visible .create-note-button").trigger("click");
                        $(".note-popup:visible .manage-notes-button").hide();
                    }
                });

                $(".note-popup:visible .create-note").on("click", function() {
                    if ($(this).hasClass("disabled")) {
                        return true;
                    }

                    $(this).addClass("disabled");

                    var selectedDate = $(".note-date:visible").val(),
                        instance = $(".note-date:visible").data("datepicker"),
                        date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings),
                        dateId = moment(moment(date).format("D MMM YYYY") + ", " + $(".time-picker:visible span.selected").text(), "D MMM YYYY, HH:mm").format("YYYYMMDDHH"),
                        note = $(".note-popup:visible .note-content").val();

                    if (!note.length) {
                        $(".note-popup:visible .note-content").addClass("required-border");
                        $(this).removeClass("disabled");
                        return true;
                    } else {
                        $(".note-popup:visible .note-content").removeClass("required-border");
                    }

                    $.ajax({
                        type:"POST",
                        url:countlyGlobal["path"]+'/graphnotes/create',
                        data:{
                            "app_id":countlyCommon.ACTIVE_APP_ID,
                            "date_id":dateId,
                            "note":note,
                            _csrf:countlyGlobal['csrf_token']
                        },
                        success:function (result) {
                            if (result == false) {
                                return false;
                            } else {
                                updateGlobalNotes({date_id: dateId, note:result}, "create");
                                app.activeView.refresh();
                            }
                        }
                    });

                    $("#overlay").trigger("click");
                });

                function updateGlobalNotes(noteObj, operation) {
                    var globalNotes = countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID].notes;

                    if (operation == "create") {
                        if (globalNotes) {
                            if (globalNotes[noteObj.date_id]) {
                                countlyCommon.arrayAddUniq(globalNotes[noteObj.date_id], noteObj.note);
                            } else {
                                globalNotes[noteObj.date_id] = [noteObj.note];
                            }
                        } else {
                            var tmpNote = {};
                            tmpNote[noteObj.date_id] = [noteObj.note];

                            countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID].notes = tmpNote;
                        }
                    } else if (operation == "delete") {
                        if (globalNotes) {
                            if (globalNotes[noteObj.date_id]) {
                                globalNotes[noteObj.date_id] = _.without(globalNotes[noteObj.date_id], noteObj.note);
                            }
                        }
                    }
                }
            });
        });

        if (!_.isEmpty(countlyGlobal['apps'])) {
            if (!countlyCommon.ACTIVE_APP_ID) {
                for (var appId in countlyGlobal['apps']) {
                    countlyCommon.setActiveApp(appId);
                    self.activeAppName = countlyGlobal['apps'][appId].name;
                    break;
                }
            } else {
                $("#sidebar-app-select").find(".logo").css("background-image", "url('"+countlyGlobal["cdn"]+"appimages/" + countlyCommon.ACTIVE_APP_ID + ".png')");
                $("#sidebar-app-select .text").text(countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID].name);
                self.activeAppName = countlyGlobal['apps'][countlyCommon.ACTIVE_APP_ID].name;
            }
        } else {
            $("#new-install-overlay").show();
        }

        $.idleTimer(countlyCommon.DASHBOARD_IDLE_MS);

        $(document).bind("idle.idleTimer", function () {
            clearInterval(self.refreshActiveView);
        });

        $(document).bind("active.idleTimer", function () {
            self.activeView.restart();
            self.refreshActiveView = setInterval(function () {
                self.activeView.refresh();
            }, countlyCommon.DASHBOARD_REFRESH_MS);
        });

        $.fn.dataTableExt.oPagination.four_button = {
            "fnInit": function ( oSettings, nPaging, fnCallbackDraw )
            {
                nFirst = document.createElement( 'span' );
                nPrevious = document.createElement( 'span' );
                nNext = document.createElement( 'span' );
                nLast = document.createElement( 'span' );

                nFirst.innerHTML = "<i class='fa fa-angle-double-left'></i>";
                nPrevious.innerHTML = "<i class='fa fa-angle-left'></i>";
                nNext.innerHTML = "<i class='fa fa-angle-right'></i>";
                nLast.innerHTML = "<i class='fa fa-angle-double-right'></i>";

                nFirst.className = "paginate_button first";
                nPrevious.className = "paginate_button previous";
                nNext.className="paginate_button next";
                nLast.className = "paginate_button last";

                nPaging.appendChild( nFirst );
                nPaging.appendChild( nPrevious );
                nPaging.appendChild( nNext );
                nPaging.appendChild( nLast );

                $(nFirst).click( function () {
                    oSettings.oApi._fnPageChange( oSettings, "first" );
                    fnCallbackDraw( oSettings );
                } );

                $(nPrevious).click( function() {
                    oSettings.oApi._fnPageChange( oSettings, "previous" );
                    fnCallbackDraw( oSettings );
                } );

                $(nNext).click( function() {
                    oSettings.oApi._fnPageChange( oSettings, "next" );
                    fnCallbackDraw( oSettings );
                } );

                $(nLast).click( function() {
                    oSettings.oApi._fnPageChange( oSettings, "last" );
                    fnCallbackDraw( oSettings );
                } );

                $(nFirst).bind( 'selectstart', function () { return false; } );
                $(nPrevious).bind( 'selectstart', function () { return false; } );
                $(nNext).bind( 'selectstart', function () { return false; } );
                $(nLast).bind( 'selectstart', function () { return false; } );
            },

            "fnUpdate": function ( oSettings, fnCallbackDraw )
            {
                if ( !oSettings.aanFeatures.p )
                {
                    return;
                }

                var an = oSettings.aanFeatures.p;
                for ( var i=0, iLen=an.length ; i<iLen ; i++ )
                {
                    var buttons = an[i].getElementsByTagName('span');
                    if ( oSettings._iDisplayStart === 0 )
                    {
                        buttons[0].className = "paginate_disabled_previous";
                        buttons[1].className = "paginate_disabled_previous";
                    }
                    else
                    {
                        buttons[0].className = "paginate_enabled_previous";
                        buttons[1].className = "paginate_enabled_previous";
                    }

                    if ( oSettings.fnDisplayEnd() == oSettings.fnRecordsDisplay() )
                    {
                        buttons[2].className = "paginate_disabled_next";
                        buttons[3].className = "paginate_disabled_next";
                    }
                    else
                    {
                        buttons[2].className = "paginate_enabled_next";
                        buttons[3].className = "paginate_enabled_next";
                    }
                }
            }
        };

        $.fn.dataTableExt.oApi.fnStandingRedraw = function(oSettings) {
            if(oSettings.oFeatures.bServerSide === false){
                var before = oSettings._iDisplayStart;

                oSettings.oApi._fnReDraw(oSettings);

                // iDisplayStart has been reset to zero - so lets change it back
                oSettings._iDisplayStart = before;
                oSettings.oApi._fnCalculateEnd(oSettings);
            }

            // draw the 'current' page
            oSettings.oApi._fnDraw(oSettings);
        };

        function getCustomDateInt(s) {
            if (s.indexOf(":") != -1) {
                if (s.indexOf(",") != -1) {
                    s = s.replace(/,|:/g,"");
                    var dateParts = s.split(" ");

                    return  parseInt((moment.monthsShort.indexOf(dateParts[1]) + 1) * 1000000) +
                        parseInt(dateParts[0]) * 10000 +
                        parseInt(dateParts[2]);
                } else {
                    return parseInt(s.replace(':', ''));
                }
            } else if (s.length == 3) {
                return moment.monthsShort.indexOf(s);
            } else {
                s = s.replace(",","");
                var dateParts = s.split(" ");

                if (dateParts.length == 3) {
                    return (parseInt(dateParts[2]) * 10000) + parseInt(moment.monthsShort.indexOf(dateParts[1]) * 100) + parseInt(dateParts[0]);
                } else {
                    return parseInt(moment.monthsShort.indexOf(dateParts[1]) * 100) + parseInt(dateParts[0]);
                }
            }
        }

        jQuery.fn.dataTableExt.oSort['customDate-asc']  = function(x, y) {
            x = getCustomDateInt(x);
            y = getCustomDateInt(y);

            return ((x < y) ? -1 : ((x > y) ?  1 : 0));
        };

        jQuery.fn.dataTableExt.oSort['customDate-desc'] = function(x, y) {
            x = getCustomDateInt(x);
            y = getCustomDateInt(y);

            return ((x < y) ?  1 : ((x > y) ? -1 : 0));
        };

        function getDateRangeInt(s) {
            s = s.split("-")[0];
            var mEnglish = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            if (s.indexOf(":") != -1) {
                var mName = (s.split(" ")[1]).split(",")[0];

                return s.replace(mName, parseInt(mEnglish.indexOf(mName))).replace(/[:, ]/g, "");
            } else {
                var parts = s.split(" ");
                if (parts.length > 1) {
                    return parseInt(mEnglish.indexOf(parts[1]) * 100) + parseInt(parts[0]);
                } else {
                    return parts[0].replace(/[><]/g, "");
                }
            }
        }

        jQuery.fn.dataTableExt.oSort['dateRange-asc']  = function(x, y) {
            x = getDateRangeInt(x);
            y = getDateRangeInt(y);

            return ((x < y) ? -1 : ((x > y) ?  1 : 0));
        };

        jQuery.fn.dataTableExt.oSort['dateRange-desc'] = function(x, y) {
            x = getDateRangeInt(x);
            y = getDateRangeInt(y);

            return ((x < y) ?  1 : ((x > y) ? -1 : 0));
        };

        jQuery.fn.dataTableExt.oSort['percent-asc']  = function(x, y) {
            x = parseFloat($("<a></a>").html(x).text().replace("%",""));
            y = parseFloat($("<a></a>").html(y).text().replace("%",""));

            return ((x < y) ? -1 : ((x > y) ?  1 : 0));
        };

        jQuery.fn.dataTableExt.oSort['percent-desc']  = function(x, y) {
            x = parseFloat($("<a></a>").html(x).text().replace("%",""));
            y = parseFloat($("<a></a>").html(y).text().replace("%",""));

            return ((x < y) ?  1 : ((x > y) ? -1 : 0));
        };

        jQuery.fn.dataTableExt.oSort['formatted-num-asc'] = function (x, y) {
            'use strict';

            // Define vars
            var a = [], b = [];

            // Match any character except: digits (0-9), dash (-), period (.), or backslash (/) and replace those characters with empty string.
            x = x.replace(/[^\d\-\.\/]/g, '');
            y = y.replace(/[^\d\-\.\/]/g, '');

            // Handle simple fractions
            if (x.indexOf('/') >= 0) {
                a = x.split("/");
                x = parseInt(a[0], 10) / parseInt(a[1], 10);
            }
            if (y.indexOf('/') >= 0) {
                b = y.split("/");
                y = parseInt(b[0], 10) / parseInt(b[1], 10);
            }

            return x - y;
        };

        jQuery.fn.dataTableExt.oSort['formatted-num-desc'] = function (x, y) {
            'use strict';

            // Define vars
            var a = [], b = [];

            // Match any character except: digits (0-9), dash (-), period (.), or backslash (/) and replace those characters with empty string.
            x = x.replace(/[^\d\-\.\/]/g, '');
            y = y.replace(/[^\d\-\.\/]/g, '');

            // Handle simple fractions
            if (x.indexOf('/') >= 0) {
                a = x.split("/");
                x = parseInt(a[0], 10) / parseInt(a[1], 10);
            }
            if (y.indexOf('/') >= 0) {
                b = y.split("/");
                y = parseInt(b[0], 10) / parseInt(b[1], 10);
            }

            return y - x;
        };

        jQuery.fn.dataTableExt.oSort['loyalty-asc']  = function(x, y) {
            x = countlyUser.getLoyaltyIndex(x);
            y = countlyUser.getLoyaltyIndex(y);

            return ((x < y) ? -1 : ((x > y) ?  1 : 0));
        };

        jQuery.fn.dataTableExt.oSort['loyalty-desc']  = function(x, y) {
            x = countlyUser.getLoyaltyIndex(x);
            y = countlyUser.getLoyaltyIndex(y);

            return ((x < y) ?  1 : ((x > y) ? -1 : 0));
        };

        jQuery.fn.dataTableExt.oSort['frequency-asc']  = function(x, y) {
            x = countlyUser.getFrequencyIndex(x);
            y = countlyUser.getFrequencyIndex(y);

            return ((x < y) ? -1 : ((x > y) ?  1 : 0));
        };

        jQuery.fn.dataTableExt.oSort['frequency-desc']  = function(x, y) {
            x = countlyUser.getFrequencyIndex(x);
            y = countlyUser.getFrequencyIndex(y);

            return ((x < y) ?  1 : ((x > y) ? -1 : 0));
        };

        jQuery.fn.dataTableExt.oSort['session-duration-asc']  = function(x, y) {
            x = countlySession.getDurationIndex(x);
            y = countlySession.getDurationIndex(y);

            return ((x < y) ? -1 : ((x > y) ?  1 : 0));
        };

        jQuery.fn.dataTableExt.oSort['session-duration-desc']  = function(x, y) {
            x = countlySession.getDurationIndex(x);
            y = countlySession.getDurationIndex(y);

            return ((x < y) ?  1 : ((x > y) ? -1 : 0));
        };

        $.extend($.fn.dataTable.defaults, {
            "sDom": '<"dataTable-top"fpT>t<"dataTable-bottom"i>',
            "bAutoWidth": false,
            "sPaginationType": "four_button",
            "iDisplayLength": 50,
            "bDestroy": true,
            "bDeferRender": true,
            "oTableTools": {
                "sSwfPath": countlyGlobal["cdn"]+"javascripts/dom/dataTables/swf/copy_csv_xls.swf",
                "aButtons": [
                    {
                        "sExtends": "csv",
                        "sButtonText": "Save to CSV",
                        "fnClick": function (nButton, oConfig, flash) {
                            var tableCols = $(nButton).parents(".dataTables_wrapper").find(".dataTable").dataTable().fnSettings().aoColumns,
                                tableData = this.fnGetTableData(oConfig).split(/\r\n|\r|\n/g).join('","').split('","'),
                                retStr = "";

                            for (var i = 0;  i < tableData.length; i++) {
                                tableData[i] = tableData[i].replace("\"", "");

                                if (i >= tableCols.length) {
                                    var colIndex = i % tableCols.length;

                                    if (tableCols[colIndex].sType == "formatted-num") {
                                        tableData[i] = tableData[i].replace(/,/g, "");
                                    } else if (tableCols[colIndex].sType == "percent") {
                                        tableData[i] = tableData[i].replace("%", "");
                                    }
                                }

                                if ((i + 1) % tableCols.length == 0) {
                                    retStr += "\"" + tableData[i] + "\"\r\n";
                                } else {
                                    retStr += "\"" + tableData[i] + "\", ";
                                }
                            }

                            this.fnSetText(flash, retStr);
                        }
                    },
                    {
                        "sExtends": "xls",
                        "sButtonText": "Save for Excel",
                        "fnClick": function (nButton, oConfig, flash) {
                            var tableCols = $(nButton).parents(".dataTables_wrapper").find(".dataTable").dataTable().fnSettings().aoColumns,
                                tableData = this.fnGetTableData(oConfig).split(/\r\n|\r|\n/g).join('\t').split('\t'),
                                retStr = "";

                            for (var i = 0;  i < tableData.length; i++) {
                                if (i >= tableCols.length) {
                                    var colIndex = i % tableCols.length;

                                    if (tableCols[colIndex].sType == "formatted-num") {
                                        tableData[i] = parseFloat(tableData[i].replace(/,/g, "")).toLocaleString();
                                    } else if (tableCols[colIndex].sType == "percent") {
                                        tableData[i] = parseFloat(tableData[i].replace("%", "")).toLocaleString();
                                    } else if (tableCols[colIndex].sType == "numeric") {
                                        tableData[i] = parseFloat(tableData[i]).toLocaleString();
                                    }
                                }

                                if ((i + 1) % tableCols.length == 0) {
                                    retStr += tableData[i] + "\r\n";
                                } else {
                                    retStr += tableData[i] + "\t";
                                }
                            }

                            this.fnSetText(flash, retStr);
                        }
                    }
                ]
            },
            "fnInitComplete": function(oSettings, json) {
                var saveHTML = "<div class='save-table-data'><i class='fa fa-download'></i></div>",
                    searchHTML = "<div class='search-table-data'><i class='fa fa-search'></i></div>",
                    tableWrapper = $("#" + oSettings.sTableId + "_wrapper");

                $(saveHTML).insertBefore(tableWrapper.find(".DTTT_container"));
                $(searchHTML).insertBefore(tableWrapper.find(".dataTables_filter"));
                tableWrapper.find(".dataTables_filter").html(tableWrapper.find(".dataTables_filter").find("input").attr("Placeholder","Search").clone(true));

                tableWrapper.find(".save-table-data").on("click", function() {
                    if ($(this).next(".DTTT_container").css('visibility') == 'hidden') {
                        $(this).next(".DTTT_container").css("visibility", 'visible');
                    } else {
                        $(this).next(".DTTT_container").css("visibility", 'hidden');
                    }
                });

                tableWrapper.find(".search-table-data").on("click", function() {
                    $(this).next(".dataTables_filter").toggle();
                    $(this).next(".dataTables_filter").find("input").focus();
                });

                tableWrapper.css({"min-height": tableWrapper.height()});
            }
        });

        $.fn.dataTableExt.sErrMode = 'throw';
    },
    localize:function (el) {

        var helpers = {
            onlyFirstUpper:function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            },
            upper:function (str) {
                return str.toUpperCase();
            }
        };

        // translate help module
        (el ? el.find('[data-help-localize]') : $("[data-help-localize]")).each(function () {
            var elem = $(this);
            if (elem.data("help-localize") != undefined) {
                elem.data("help", jQuery.i18n.map[elem.data("help-localize")]);
            }
        });

        // translate dashboard
        (el ? el.find('[data-localize]') : $("[data-localize]")).each(function () {
            var elem = $(this),
                toLocal = elem.data("localize").split("!"),
                localizedValue = "";

            if (toLocal.length == 2) {
                if (helpers[toLocal[0]]) {
                    localizedValue = helpers[toLocal[0]](jQuery.i18n.map[toLocal[1]]);
                } else {
                    localizedValue = jQuery.i18n.prop(toLocal[0], jQuery.i18n.map[toLocal[1]]);
                }
            } else {
                localizedValue = jQuery.i18n.map[elem.data("localize")];
            }

            if (elem.is("input[type=text]") || elem.is("input[type=password]") || elem.is("textarea")) {
                elem.attr("placeholder", localizedValue);
            } else if (elem.is("input[type=button]") || elem.is("input[type=submit]")) {
                elem.attr("value", localizedValue);
            } else {
                elem.text(localizedValue);
            }
        });
    },
    tipsify: function(enable, el){
        var vs = el ? el.find('.help-zone-vs') : $('.help-zone-vs'),
            vb = el ? el.find('.help-zone-vb') : $('.help-zone-vb'),
            both = el ? el.find('.help-zone-vs, .help-zone-vb') : $(".help-zone-vs, .help-zone-vb");

        vb.tipsy({gravity:$.fn.tipsy.autoNS, trigger:'manual', title:function () {
            return $(this).data("help") || "";
        }, fade:true, offset:5, cssClass:'yellow', opacity:1, html:true});
        vs.tipsy({gravity:$.fn.tipsy.autoNS, trigger:'manual', title:function () {
            return $(this).data("help") || "";
        }, fade:true, offset:5, cssClass:'yellow narrow', opacity:1, html:true});

        if (enable) {
            both.off('mouseenter mouseleave')
                .on('mouseenter', function () {
                    $(this).tipsy("show");
                })
                .on('mouseleave', function () {
                    $(this).tipsy("hide");
                });
        } else {
           both.off('mouseenter mouseleave');
        }
    },
    enableAppTooltip: function(){
        this.appTooltip = true;
    },
    disableAppTooltip: function(){
        this.appTooltip = false;
    },
    closeAppTooltip: function(){
        if($("#app-tooltip").is(':visible')){
            $("#app-tooltip").hide();
            $("#app-tooltip").unbind("click");
        }
    },
	addPageScript:function(view, callback){
		if(!this.pageScripts[view])
			this.pageScripts[view] = [];
		this.pageScripts[view].push(callback);
	},
	addRefreshScript:function(view, callback){
		if(!this.refreshScripts[view])
			this.refreshScripts[view] = [];
		this.refreshScripts[view].push(callback);
	},
    pageScript:function () { //scripts to be executed on each view change
        $("#month").text(moment().year());
        $("#day").text(moment().format("MMM"));
        $("#yesterday").text(moment().subtract("days",1).format("Do"));

        var self = this;
        $(document).ready(function () {
  
			$("#sidebar-menu").find("a").removeClass("active");

            var currentMenu = $("#sidebar-menu").find("a[href='#" + Backbone.history.fragment + "']");
            currentMenu.addClass("active");

            var subMenu = currentMenu.parent(".sidebar-submenu");
            subMenu.prev(".item").addClass("active");

            if (currentMenu.not(":visible")) {
                subMenu.slideDown();
            }

            $(".sidebar-submenu").not(subMenu).slideUp();

            var selectedDateID = countlyCommon.getPeriod();

            if (Object.prototype.toString.call(selectedDateID) !== '[object Array]') {
                $("#" + selectedDateID).addClass("active");
            }
			
			if (Backbone.history.fragment == "/manage/apps" ||
                Backbone.history.fragment == "/manage/account" ||
                Backbone.history.fragment == "/manage/users") {
                $("#sidebar-app-select").addClass("disabled");
                $("#sidebar-app-select").removeClass("active");
            } else {
                $("#sidebar-app-select").removeClass("disabled");
            }
			
			if(self.pageScripts[Backbone.history.fragment])
				for(var i = 0, l = self.pageScripts[Backbone.history.fragment].length; i < l; i++)
					self.pageScripts[Backbone.history.fragment][i]();
            for(var k in self.pageScripts) 
                if (k !== '#' && k.indexOf('#') !== -1 && Backbone.history.fragment.match(k.replace(/#/g, '[A-Za-z_0-9]+')))
                    for(var i = 0, l = self.pageScripts[k].length; i < l; i++)
                        self.pageScripts[k][i]();
			if(self.pageScripts["#"])
				for(var i = 0, l = self.pageScripts["#"].length; i < l; i++)
					self.pageScripts["#"][i]();

            // Translate all elements with a data-help-localize or data-localize attribute
            self.localize();

            if ($("#help-toggle").hasClass("active")) {
                $('.help-zone-vb').tipsy({gravity:$.fn.tipsy.autoNS, trigger:'manual', title:function () {
                    return ($(this).data("help")) ? $(this).data("help") : "";
                }, fade:true, offset:5, cssClass:'yellow', opacity:1, html:true});
                $('.help-zone-vs').tipsy({gravity:$.fn.tipsy.autoNS, trigger:'manual', title:function () {
                    return ($(this).data("help")) ? $(this).data("help") : "";
                }, fade:true, offset:5, cssClass:'yellow narrow', opacity:1, html:true});

                $.idleTimer('destroy');
                clearInterval(self.refreshActiveView);
                $(".help-zone-vs, .help-zone-vb").hover(
                    function () {
                        $(this).tipsy("show");
                    },
                    function () {
                        $(this).tipsy("hide");
                    }
                );
            }

            $(".usparkline").peity("bar", { width:"100%", height:"30", colour:"#6BB96E", strokeColour:"#6BB96E", strokeWidth:2 });
            $(".dsparkline").peity("bar", { width:"100%", height:"30", colour:"#C94C4C", strokeColour:"#C94C4C", strokeWidth:2 });

            CountlyHelpers.setUpDateSelectors(self.activeView); 

            $(window).click(function () {
                $("#date-picker").hide();
                $(".cly-select").removeClass("active");
            });

            $("#date-picker").click(function (e) {
                e.stopPropagation();
            });

            $("#date-picker-button").click(function (e) {
                $("#date-picker").toggle();

                if (self.dateToSelected) {
                    dateTo.datepicker("setDate", moment(self.dateToSelected).toDate());
                    dateFrom.datepicker("option", "maxDate", moment(self.dateToSelected).toDate());
                    //dateFrom.datepicker("option", "maxDate", moment(self.dateToSelected).subtract("days", 1).toDate());
                } else {
                    self.dateToSelected = moment().toDate().getTime();
                    dateTo.datepicker("setDate",moment().toDate());
                    dateFrom.datepicker("option", "maxDate", moment(self.dateToSelected).toDate());
                }

                if (self.dateFromSelected) {
                    dateFrom.datepicker("setDate", moment(self.dateFromSelected).toDate());
                    dateTo.datepicker("option", "minDate", moment(self.dateFromSelected).toDate());
                } else {
                    extendDate = moment(dateTo.datepicker("getDate")).subtract('days', 30).toDate();
                    dateFrom.datepicker("setDate", extendDate);
                    self.dateFromSelected = moment(dateTo.datepicker("getDate")).subtract('days', 30).toDate().getTime();
                    dateTo.datepicker("option", "minDate", moment(self.dateFromSelected).toDate());
                }

                e.stopPropagation();
            });

            var dateTo = $("#date-to").datepicker({
                numberOfMonths:1,
                showOtherMonths:true,
                maxDate:moment().toDate(),
                onSelect:function (selectedDate) {
                    var instance = $(this).data("datepicker"),
                        date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings),
                        dateCopy = new Date(date.getTime()),
                        fromLimit = dateCopy;//moment(dateCopy).subtract("days", 1).toDate();

                    // If limit of the left datepicker is less than the global we store in self
                    // than we should update the global with the new value
                    if (fromLimit.getTime() < self.dateFromSelected) {
                        self.dateFromSelected = fromLimit.getTime();
                    }

                    dateFrom.datepicker("option", "maxDate", fromLimit);
                    self.dateToSelected = date.getTime();
                }
            });

            var dateFrom = $("#date-from").datepicker({
                numberOfMonths:1,
                showOtherMonths:true,
                maxDate:moment().subtract('days', 1).toDate(),
                onSelect:function (selectedDate) {
                    var instance = $(this).data("datepicker"),
                        date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings),
                        dateCopy = new Date(date.getTime()),
                        toLimit = dateCopy;//moment(dateCopy).add("days", 1).toDate();

                    // If limit of the right datepicker is bigger than the global we store in self
                    // than we should update the global with the new value
                    if (toLimit.getTime() > self.dateToSelected) {
                        self.dateToSelected = toLimit.getTime();
                    }

                    dateTo.datepicker("option", "minDate", toLimit);
                    self.dateFromSelected = date.getTime();
                }
            });

            $.datepicker.setDefaults($.datepicker.regional[""]);
            $("#date-to").datepicker("option", $.datepicker.regional[countlyCommon.BROWSER_LANG]);
            $("#date-from").datepicker("option", $.datepicker.regional[countlyCommon.BROWSER_LANG]);

            $("#date-submit").click(function () {
                if (!self.dateFromSelected && !self.dateToSelected) {
                    return false;
                }

                countlyCommon.setPeriod([self.dateFromSelected, self.dateToSelected]);

                self.activeView.dateChanged();

                $(".date-selector").removeClass("selected").removeClass("active");
            });

            $('.scrollable').slimScroll({
                height:'100%',
                start:'top',
                wheelStep:10,
                position:'right',
                disableFadeOut:true
            });

            $('.widget-header').noisy({
                intensity:0.9,
                size:50,
                opacity:0.04,
                monochrome:true
            });

            $(".checkbox").on('click', function () {
                $(this).toggleClass("checked");
            });

            $(".resource-link").on('click', function() {
                if ($(this).data("link")) {
                    CountlyHelpers.openResource($(this).data("link"));
                }
            });
        });
    }
});

var app = new AppRouter();