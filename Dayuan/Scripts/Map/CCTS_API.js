
function _getTwd97towgs84(twd97X, twd97Y) {
    var tf = new Transformation();
    var point;
    tf.twd97towgs84(twd97X, twd97Y, function (result, status) {
        if (result != "" && result != null) {
            point = result;
        }
    });
    return point;
}

if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function (elt /*, from*/)
    {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++)
        {
            if (from in this && this[from] === elt)
                return from;
        }
        return -1;
    };
}
var getWebProtocal = function ()
{
    return ('https:' == document.location.protocol ? 'https://' : 'http://');
}
var getAPIPath = function ()
{
    return ("ccts.sinica.edu.tw/api/");
    //return ("localhost:51384/");
}
var script_path = getWebProtocal() + getAPIPath() + "src/";
var timecrossService = getWebProtocal() + getAPIPath() + "tcqserv.aspx";

document.writeln('<script type="text/javascript" src="../Scripts/Map/AjaxAgent.js"></script>');
document.writeln('<script type="text/javascript" src="../Scripts/Map/Framework.js"></script>');
document.writeln('<script type="text/javascript" src="../Scripts/Map/CoordSys.js"></script>');
document.writeln('<script type="text/javascript" src="../Scripts/Map/Mercator.js"></script>');

var $tc = {};
$tc.util = {};
$tc.util.isArray = function (obj)
{
    return obj.constructor === Array;
}

// Check integer
$tc.util.isInt = function (obj)
{
    return !isNaN(parseInt(obj)) && typeof (obj) == 'number';
}
// Check unsigned integer
$tc.util.isUInt = function (obj)
{
    return !isNaN(parseInt(obj)) && parseInt(obj) >= 0 && typeof (obj) == 'number';
}
// Check integer
$tc.util.isFloat = function (obj)
{
    return !isNaN(parseFloat(obj)) && typeof (obj) == 'number';
}

// Check lon lat format
$tc.util.checkLonLat = function (obj)
{
    var lon_ = obj.lon;
    var lat_ = obj.lat;
    return $tc.util.isFloat(lon_) && (lon_ >= -180) && (lon_ <= 180) && $tc.util.isFloat(lat_) && (lat_ >= -90) && (lat_ <= 90);
}


$tc.buildTimeRangeString = function (ranges)
{
    var rangeStr = "";
    if (!ranges && !$tc.util.isArray(ranges))
        throw "Not a valid range";
    for (var r = 0; r < ranges.length; r++)
    {
        if (ranges[r].startdate == null && ranges[r].startdate == null)
            continue;
        rangeStr = rangeStr + ranges[r].startdate + "|" + ranges[r].enddate;
    }

    if (rangeStr[rangeStr.length - 1] == ";")
        rangeStr = rangeStr.slice(0, rangeStr.length - 1);

    return rangeStr;
}


$tc.buildTimeRangeString_bak = function (ranges)
{
    var rangeStr = "";
    if (!ranges && !$tc.util.isArray(ranges))
        throw "Not a valid range";
    for (var r = 0; r < ranges.length; r++)
    {
        if (!ranges[r].startdate || !$tc.util.isInt(ranges[r].startdate))
            throw "Not a valid startdate";
        if (!ranges[r].enddate || !$tc.util.isInt(ranges[r].enddate))
            throw "Not a valid end date";
        rangeStr = rangeStr + ranges[r].startdate + "|" + ranges[r].enddate;
        if (r < ranges.length - 1)
            rangeStr = rangeStr + ";";
    }
    return rangeStr;
}

$tc.buildDistrictListStr = function (dists)
{
    if (!$tc.util.isArray(dists))
        throw "Invalid District list";
    var distStr = ""
    for (var f = 0; f < dists.length; f++)
    {
        distStr = distStr + dists[f];
        if (f < dists.length - 1)
            distStr = distStr + "|";
    }
    return distStr;
}

$tc.appendQStr = function (qstr, key, value)
{
    if (!qstr)
        qstr = "";
    if (typeof (value) === "undefined")
        value = "";

    if (qstr.indexOf("?") > -1)
        qstr = qstr.concat("&" + key + "=" + value);
    else
        qstr = qstr.concat("?" + key + "=" + value);

    return qstr;
}

$tc.concatQStr = function (qstr, qstr2)
{
    if (!qstr)
        qstr = "";
    if (qstr.indexOf("?") > -1)
        qstr = qstr.concat();
    else
        qstr = qstr.concat("?" + key + "=" + value);

    return qstr;
}


$tc.buildFieldStr = function (fields)
{
    if (!$tc.util.isArray(fields))
        throw "Invalid fields";
    var fieldStr = ""
    for (var f = 0; f < fields.length; f++)
    {
        fieldStr = fieldStr + fields[f];
        if (f < fields.length - 1)
            fieldStr = fieldStr + "|";
    }
    return fieldStr;
}

$tc.trim = function (str)
{
    var start = -1,
    end = str.length;
    while (str.charCodeAt(--end) < 33);
    while (str.charCodeAt(++start) < 33);
    return str.slice(start, end + 1);
}


$tc.util.wgs84FromWKT = function (wkt)
{
    var temp = wkt;

    if (!temp)
        return null;

    if (temp.indexOf("POINT") < 0)
        return null;
    temp = temp.replace("POINT", "");
    temp = $tc.trim(temp);

    var parts = temp.split(' ');
    if (parts > 2)
        return null;

    var tLon = parseFloat(parts[0].substring(1, parts[0].length - 1));
    var tLat = parseFloat(parts[1]);

    if (!$tc.util.checkLonLat({
        lon: tLon,
        lat: tLat
    }))
        return null;
    return {
        lon: tLon,
        lat: tLat
    }
}


$tc.buildPlaceQueryString = function (option, qstr)
{
    if (option && option.timeOption)
    {
        var rangeStr = $tc.buildTimeRangeString(option.timeOption);
        qstr = $tc.appendQStr(qstr, "ranges", rangeStr);
    }
    if (option && option.level)
    {
        qstr = $tc.appendQStr(qstr, "level", option.level);
    }

    if (option && $tc.util.isUInt(option.order))
    {

        switch (option.order)
        {
            case 0:
                qstr = $tc.appendQStr(qstr, "orderby", "DYNASTYDISTRICT|LEVEL");
                break;
            case 1:
                qstr = $tc.appendQStr(qstr, "orderby", "LEVEL|DYNASTYDISTRICT");
                break;
            default:
                break;
        }
    }


    if (option && option.startdaterange)
    {
        if (!$tc.util.isUInt(option.startdaterange) || option.startdaterange > 100)
            throw "Invalid startdaterange";
        qstr = $tc.appendQStr(qstr, "srange", option.startdaterange);
    }
    if (option && option.enddaterange)
    {
        if (!$tc.util.isUInt(option.enddaterange) || option.enddaterange > 100)
            throw "Invalid enddaterange";
        qstr = $tc.appendQStr(qstr, "erange", option.enddaterange);
    }
    if (option && option.typeName)
    {
        qstr = $tc.appendQStr(qstr, "tname", option.typeName);
    }
    if (option && option.dynastDistrict)
    {
        qstr = $tc.appendQStr(qstr, "nandd", option.dynastDistrict);
    }
    if (option && option.resultLimit)
    {
        if (!$tc.util.isUInt(option.resultLimit))
            throw "Invalid resultLimit";
        qstr = $tc.appendQStr(qstr, "rlimit", option.resultLimit);
    }
    if (option && typeof (option.queryNum) == 'number')
    {
        if (parseInt(option.queryNum) == 0)
            qstr = $tc.appendQStr(qstr, "qnum", "true");
    }
    if (option && option.mapTypeIds)
    {
        var fieldStr = $tc.buildFieldStr(option.mapTypeIds);
        qstr = $tc.appendQStr(qstr, "fields", fieldStr);
    }
    return qstr;
}
$tc.buildDistrictQueryString = function (option, qstr)
{
    if (option && option.timeOption)
    {
        var rangeStr = $tc.buildTimeRangeString(option.timeOption);
        qstr = $tc.appendQStr(qstr, "ranges", rangeStr);
    }

    if (option && $tc.util.isUInt(option.order))
    {

        switch (option.order)
        {
            case 0:
                qstr = $tc.appendQStr(qstr, "orderby", "DYNASTY");
                break;
            default:
                break;
        }
    }
    if (option && option.startdaterange)
    {
        if (!$tc.util.isUInt(option.startdaterange) || option.startdaterange > 100)
            throw "Invalid startdaterange";
        qstr = $tc.appendQStr(qstr, "srange", option.startdaterange);
    }
    if (option && option.enddaterange)
    {
        if (!$tc.util.isUInt(option.enddaterange) || option.enddaterange > 100)
            throw "Invalid enddaterange";
        qstr = $tc.appendQStr(qstr, "erange", option.enddaterange);
    }
    if (option && option.resultLimit)
    {
        if (!$tc.util.isUInt(option.resultLimit))
            throw "Invalid resultLimit";
        qstr = $tc.appendQStr(qstr, "rlimit", option.resultLimit);
    }
    if (option && typeof (option.queryNum) == 'number')
    {
        if (parseInt(option.queryNum) == 0)
            qstr = $tc.appendQStr(qstr, "qnum", "true");
    }
    if (option && option.mapTypeIds)
    {
        var fieldStr = $tc.buildFieldStr(option.mapTypeIds);
        qstr = $tc.appendQStr(qstr, "fields", fieldStr);
    }
    return qstr;
}

//20140710 Write By CX
$tc.buildAttributeQueryString = function (option, qstr) {
    if (option && option.timeOption) {
        var rangeStr = $tc.buildTimeRangeString(option.timeOption);
        qstr = $tc.appendQStr(qstr, "ranges", rangeStr);
    }

    if (option && $tc.util.isUInt(option.order)) {

        switch (option.order) {
            case 0:
                //qstr = $tc.appendQStr(qstr, "orderbyh", "COUNTY");
                qstr = $tc.appendQStr(qstr, "orderby", "DYNASTY");
                break;
            default:
                break;
        }
    }

    if (option && option.startdaterange) {
        if (!$tc.util.isUInt(option.startdaterange) || option.startdaterange > 100)
            throw "Invalid startdaterange";
        qstr = $tc.appendQStr(qstr, "srange", option.startdaterange);
    }
    if (option && option.enddaterange) {
        if (!$tc.util.isUInt(option.enddaterange) || option.enddaterange > 100)
            throw "Invalid enddaterange";
        qstr = $tc.appendQStr(qstr, "erange", option.enddaterange);
    }
    if (option && option.resultLimit) {
        if (!$tc.util.isUInt(option.resultLimit))
            throw "Invalid resultLimit";
        qstr = $tc.appendQStr(qstr, "rlimit", option.resultLimit);
    }
    if (option && typeof (option.queryNum) == 'number') {
        if (parseInt(option.queryNum) == 0)
            qstr = $tc.appendQStr(qstr, "qnum", "true");
    }
    if (option && option.mapTypeIds) {
        var fieldStr = $tc.buildFieldStr(option.mapTypeIds);
        qstr = $tc.appendQStr(qstr, "fields", fieldStr);
    }
    if (option && option.dynastDistrict) {
        qstr = $tc.appendQStr(qstr, "nandd", option.dynastDistrict);
    }
    return qstr;
}

//bw
$tc.buildRiverQueryString = function (option, qstr) {

    qstr = $tc.appendQStr(qstr, "queryNum", option.queryNum);
    qstr = $tc.appendQStr(qstr, "resultLimit", option.resultLimit);
    qstr = $tc.appendQStr(qstr, "order", option.order);
    qstr = $tc.appendQStr(qstr, "mapTypeIds", option.mapTypeIds);
    return qstr;
}

$tc.outputResult = function (dataobj, callback)
{
    var status = "";
    if (!dataobj || dataobj.error)
    {
        status = "ERROR";
        callback.call(this, [], status);
        return;
    }
    var results = $tc.buildResult(dataobj);
    if (results.length == 0)
        status = "ZERO_RESULTS";
    else
        status = "OK";
    callback.call(this, results, status);

}

$tc.buildResult = function (dataObj)
{
    if (!dataObj.Table || dataObj.Table == 0)
        return [];

    //Build field names
    var fieldNames = "";
    var table = [];
    for (var field in dataObj.Table[0])
    {
        fieldNames += (field + ",");
    }
    fieldNames = fieldNames.substring(0, fieldNames.length - 1);

    //Build 2d array from table;

    for (var r = 0; r < dataObj.Table.length; r++)
    {
        var row = [];
        table.push(row);
        for (var field in dataObj.Table[r])
        {
            row.push(dataObj.Table[r][field]);
        }
    }

    return [{
        fieldName: fieldNames,
        fieldAttr: table
    }]

}

$tc.assert = function (condition, failMsg)
{
    if (!condition)
        throw failMsg;
}

function YearTablelist()
{
    this.getdynasty = function (callback)
    {
		var qstr = "";
        qstr = $tc.appendQStr(qstr, "op", "dst");
		qstr = $tc.appendQStr(qstr, "query", "dynasty");
        LoadScript(timecrossService + qstr, function (pScp, dataobj)
        {
			$tc.outputResult(dataobj, callback);
        });
	};

    this.getreigntitle = function (dynasty, callback)
    {
		var qstr = "";
        qstr = $tc.appendQStr(qstr, "op", "rt");
		qstr = $tc.appendQStr(qstr, "query", "reigntitle");
		qstr = $tc.appendQStr(qstr, "dynasty", dynasty);
        LoadScript(timecrossService + qstr, function (pScp, dataobj)
        {
			$tc.outputResult(dataobj, callback);
        });
    };

    this.getyears = function (dynasty, reigntitle, callback)
     {
		var qstr = "";
        qstr = $tc.appendQStr(qstr, "op", "ys");
		qstr = $tc.appendQStr(qstr, "query", "years");
		qstr = $tc.appendQStr(qstr, "dynasty", dynasty);
		qstr = $tc.appendQStr(qstr, "YearsName", reigntitle);
        LoadScript(timecrossService + qstr, function (pScp, dataobj)
        {
			$tc.outputResult(dataobj, callback);
        });
    };
}

function QueryTablelist()
{
    this.getQuerytablelist = function (callback)
    {
        var qstr = "";
        qstr = $tc.appendQStr(qstr, "op", "qtl");
        LoadScript(timecrossService + qstr, function (pScp, dataobj)
        {
            $tc.outputResult(dataobj, callback);
        });
    };
}

function PlaceQuery()
{

    function BuildPlaceQueryString(request, option)
    {
        var qstr = "";
        if (!request || !(!request.placename != !request.placeID))
        {
            throw "Place name or placeID must be provided";
        }
        qstr = $tc.appendQStr(qstr, "pname", request.placename);
        qstr = $tc.appendQStr(qstr, "placeid", request.placeID);
        qstr = $tc.buildPlaceQueryString(option, qstr);
        return qstr;
    }


    this.identify = function (request, option, callback)
    {
        var qstr = BuildPlaceQueryString(request, option);
        qstr = $tc.appendQStr(qstr, "op", "pq");
        LoadScript(timecrossService + qstr, function (pScp, dataobj)
        {
            $tc.outputResult(dataobj, callback);
        });
    };
}

PlaceQuery.Fields =
    {
        CHINAME: 0,
        ENGNAME: 0,
        NOWNAME: 0,
        YEARSTART: 0,
        YEAREND: 0,
        DYNASTYDISTRICT: 0,
        LEVEL: 0,
        TYPE: 0,
        REFERENCE: 0,
        PUBLISHER: 0,
        VERSION: 0,
        PUBYEAR: 0,
        LON: 0,
        LAT: 0,
        MEMO: 0

    };


function PointBuffer()
{

    var counter = 0;
    var currentRange = 0;
    var stepRange = 4000;
    var tempQStr = "";
    this.stepCount = 5;
    this.defaultDistanceRange = 40000;

    var that = this;
    function BuildPointBufferString(request, placeOption, districtOption, rRange)
    {
        var qstr = "";
        if (!request || !request.pointwkt)
        {
            throw "pointwkt must be provided";
        }

        var lonlat = $tc.util.wgs84FromWKT(request.pointwkt);
        if (!lonlat)
            throw "Invalid pointwkt";

        qstr = $tc.appendQStr(qstr, "lon", lonlat.lon);
        qstr = $tc.appendQStr(qstr, "lat", lonlat.lat);

        if (!request || (request.distance == "" && request.distance == null))
        {
            throw "distance must be provided";
        }

        if (!$tc.util.isUInt(request.distance) || request.distance > 20000)
            throw "Invalid Buffer Range";



        if ($tc.util.isUInt(rRange))
            qstr = $tc.appendQStr(qstr, "range", parseInt(rRange));
        else
            qstr = $tc.appendQStr(qstr, "range", parseInt(request.distance));


        var bufferType = placeOption ? "place" : districtOption ? "dist" : "none";

        var optional = "";
        switch (bufferType)
        {
            case "place":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildPlaceQueryString(placeOption, qstr);
                break;
            case "dist":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildDistrictQueryString(districtOption, qstr);
                break;
            default:
                throw "You must choose between place option or district query";
                break;
        }
        return qstr;
    }

    this.identify = function (request, placeOption, districtOption, callback)
    {
        counter = 0;
        if (request && $tc.util.isUInt(request.distancerange))
        {
            this.defaultDistanceRange = request.distancerange;
        }
        stepRange = (this.defaultDistanceRange - request.distance) / this.stepCount;
        var qstr = BuildPointBufferString(request, placeOption, districtOption);
        qstr = $tc.appendQStr(qstr, "op", "pb");

        tempQStr = qstr;
        currentRange = parseInt(request.distance);
        function loop()
        {
            LoadScript(timecrossService + tempQStr, function (pScp, dataobj)
            {
                counter++;
                if ((dataobj.Table && dataobj.Table.length > 0) || counter > that.stepCount)
                {
                    $tc.outputResult(dataobj, callback);
                    return;
                }
                currentRange += stepRange;
                tempQStr = BuildPointBufferString(request, placeOption, districtOption, currentRange);
                tempQStr = $tc.appendQStr(tempQStr, "op", "pb");
                loop();
            });
        }
        loop();
    };
}



function DistrictQuery()
{

    function BuildDistrictQueryString(request, option)
    {
        var qstr = "";
        if (!request || !(request.dynasty || request.District))
        {
            throw "dynasty or District or districtID must be provided";
        }
        if (request && request.District)
        {
            var distStr = $tc.buildDistrictListStr(request.District)
            qstr = $tc.appendQStr(qstr, "dnames", distStr);
        }
        qstr = $tc.appendQStr(qstr, "dynasty", option.dynasty);

        qstr = $tc.buildDistrictQueryString(option, qstr);
        return qstr;
    }
    this.identify = function (request, option, callback)
    {
        var qstr = BuildDistrictQueryString(request, option);
        qstr = $tc.appendQStr(qstr, "op", "dq");
        LoadScript(timecrossService + qstr, function (pScp, dataobj)
        {
            $tc.outputResult(dataobj, callback);
        });
    }
}

DistrictQuery.Fields =
    {
        ID: 0,
        NAME: 0,
        U_CLASS: 0,
        B_YEAR: 0,
        E_YEAR: 0,
        NOTE: 0
    }


// Define Year Convert class
function YearConvert() { };

YearConvert.prototype.getyearinterval = function (dynasty, reigntitle, callback)
{

    function getIntervals(dataobj)
    {

        var intervals = [];
        if (dataobj.Table.length == 0)
            return null;

        for (var iter = 0; iter < dataobj.Table.length; iter++)
        {
            intervals.push({
                startdate: parseInt(dataobj.Table[iter].StartTime),
                enddate: parseInt(dataobj.Table[iter].EndTime)
            });
        }

        return intervals;
    }

    $tc.assert(dynasty || reigntitle, "You must provide both dynasty or reigntitle ");

    var qstr = "";
    qstr = $tc.appendQStr(qstr, "op", "yc");
    qstr = $tc.appendQStr(qstr, "dynasty", dynasty);
    qstr = $tc.appendQStr(qstr, "yname", reigntitle);
    LoadScript(timecrossService + qstr, function (pScp, dataobj)
    {
        //Error
        if (!dataobj || dataobj.error)
        {
            callback.call(this, [], "ERROR");
            return;
        }
        //No Result?
        var intervals = getIntervals(dataobj);
        if (intervals == null)
        {
            callback.call(this, [], "ZERO_RESULTS");
            return;
        }
        //OK
        callback.call(this, intervals, "OK");
    });
}

YearConvert.prototype.getadyear = function (dynasty, reigntitle, yearinterval, callback)
{

    function getADYear(dataobj)
    {
        if (dataobj.Table.length == 0)
            return null;
        return dataobj.Table[0].converted;
    }
    var qstr = "";
    $tc.assert(dynasty || reigntitle, "You must provide either dynasty or reigntitle");
    $tc.assert($tc.util.isUInt(yearinterval), "Invalid yearInterval");
    qstr = $tc.appendQStr(qstr, "dynasty", dynasty);
    qstr = $tc.appendQStr(qstr, "yname", reigntitle);
    qstr = $tc.appendQStr(qstr, "interval", yearinterval);
    qstr = $tc.appendQStr(qstr, "op", "yc");
    LoadScript(timecrossService + qstr, function (pScp, dataobj)
    {
        //Error
        if (!dataobj || dataobj.error)
        {
            callback.call(this, null, "ERROR");
            return;
        }
        //No Result?
        var result = $tc.buildResult(dataobj);
        if (result == null)
        {
            callback.call(this, null, "ZERO_RESULTS");
            return;
        }
        //OK
        callback.call(this, result, "OK");
    });
}
YearConvert.prototype.getreignyear = function (adyear, callback)
{


    var qstr = "";
    $tc.assert($tc.util.isInt(adyear), "Invalid adyear");
    qstr = $tc.appendQStr(qstr, "ady", adyear);
    qstr = $tc.appendQStr(qstr, "op", "yc");
    LoadScript(timecrossService + qstr, function (pScp, dataobj)
    {
        $tc.outputResult(dataobj, callback);
    });
}


// Define Year Table Query Class
function YearTableQuery() { }
YearTableQuery.prototype.getYearTable = function (request, callback)
{
    var qstr = "";
    qstr = $tc.appendQStr(qstr, "dynasty", request.dynasty);
    qstr = $tc.appendQStr(qstr, "op", "yq");
    LoadScript(timecrossService + qstr, function (pScp, dataobj)
    {
        $tc.outputResult(dataobj, callback);
    });
}

function PolylineBuffer()
{

    var counter = 0;
    var currentRange = 0;
    var stepRange = 4000;
    var tempQStr = "";
    this.stepCount = 5;
    this.defaultDistanceRange = 40000;

    var that = this;
    function BuildPolylineBufferString(request, placeOption, districtOption, rRange)
    {
        var qstr = "";
        if (!request || !request.LineStrwkt)
        {
            throw "LineStrwkt must be provided";
        } else
        {
            qstr = $tc.appendQStr(qstr, "LineStr", request.LineStrwkt);
        }

        if (!request || (request.distance == "" && request.distance == null))
        {
            throw "distance must be provided";
        }

        if (!$tc.util.isUInt(request.distance) || request.distance > 20000)
            throw "Invalid Buffer Range";

        if ($tc.util.isUInt(rRange))
            qstr = $tc.appendQStr(qstr, "range", parseInt(rRange));
        else
            qstr = $tc.appendQStr(qstr, "range", parseInt(request.distance));

        var bufferType = placeOption ? "place" : districtOption ? "dist" : "none";
        var optional = "";
        switch (bufferType)
        {
            case "place":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildPlaceQueryString(placeOption, qstr);
                break;
            case "dist":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildDistrictQueryString(districtOption, qstr);
                break;
            default:
                throw "You must choose between place option or district query";
                break;
        }
        return qstr;
    }

    this.identify = function (request, placeOption, districtOption, callback)
    {
        counter = 0;
        if (request && $tc.util.isUInt(request.distancerange))
        {
            this.defaultDistanceRange = request.distancerange;
        }
        stepRange = (this.defaultDistanceRange - request.distance) / this.stepCount;
        var qstr = BuildPolylineBufferString(request, placeOption, districtOption);
        qstr = $tc.appendQStr(qstr, "op", "plb");

        tempQStr = qstr;
        currentRange = parseInt(request.distance);
        function loop()
        {
            LoadScript(timecrossService + tempQStr, function (pScp, dataobj)
            {
                counter++;
                if ((dataobj.Table && dataobj.Table.length > 0) || counter > that.stepCount)
                {
                    $tc.outputResult(dataobj, callback);
                    return;
                }
                currentRange += stepRange;
                tempQStr = BuildPolylineBufferString(request, placeOption, districtOption, currentRange);
                tempQStr = $tc.appendQStr(tempQStr, "op", "plb");
                loop();
            });
        }
        loop();
    };
}

function UnitConvert()
{
    function getintervals(dataobj)
    {
        var intervals = "";
        if (dataobj.Table.length == 0 || dataobj.Table[0].value == null)
            return null;

        intervals = Math.round(dataobj.Table[0].value * 1e10) / 1e10;
        return intervals;
    }
    this.getUnitval = function (request, callback)
    {
        var qstr = "";
        qstr = $tc.appendQStr(qstr, "op", "uc");
        qstr = $tc.appendQStr(qstr, "dynasty1", request.dynasty1);
        qstr = $tc.appendQStr(qstr, "dynasty2", request.dynasty2);
        qstr = $tc.appendQStr(qstr, "Unit1", request.Unit1);
        qstr = $tc.appendQStr(qstr, "Unit2", request.Unit2);
        qstr = $tc.appendQStr(qstr, "unitval", request.unitval);
        var tempQStr = qstr;
        LoadScript(timecrossService + tempQStr, function (pScp, dataobj)
        {
            if (!dataobj || dataobj.error)
            {
                status = "ERROR";
                callback.call(null, status);
                return;
            }
            var results = getintervals(dataobj);
            if (results != null)
            {
                status = "OK";
            }
            else
            {
                status = "ZERO_RESULTS";
                callback.call(this, results, status);
                return;
            }
            callback.call(this, results, status);
        });
    }
}

function PolygonQuery()
{

    var tempQStr = "";
    var that = this;
    function BuildPolygonQueryString(request, placeOption, districtOption)
    {
        var qstr = "";
        if (!request || !request.polygonwkt)
        {
            throw "polygonwkt must be provided";
        }

        qstr = $tc.appendQStr(qstr, "polygonwkt", request.polygonwkt);

        var bufferType = placeOption ? "place" : districtOption ? "dist" : "none";

        var optional = "";
        switch (bufferType)
        {
            case "place":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildPlaceQueryString(placeOption, qstr);
                break;
            case "dist":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildDistrictQueryString(districtOption, qstr);
                break;
            default:
                throw "You must choose between place option or district query";
                break;
        }
        return qstr;
    }

    this.identify = function (request, placeOption, districtOption, callback)
    {
        var qstr = BuildPolygonQueryString(request, placeOption, districtOption);
        qstr = $tc.appendQStr(qstr, "op", "pgq");
        tempQStr = qstr;
        LoadScript(timecrossService + tempQStr, function (pScp, dataobj)
        {
            $tc.outputResult(dataobj, callback);
        });
    };
}

function wgs84PolygonMeasure()
{
    var qstr = "";

    this.identify = function (request, callback)
    {
        if (!request || !request.polygonwkt)
        {
            throw "polygonwkt must be provided";
        }
        qstr = $tc.appendQStr(qstr, "polygonwkt", request.polygonwkt);
        qstr = $tc.appendQStr(qstr, "op", "wpm");
        tempQStr = qstr;
        LoadScript(timecrossService + tempQStr, function (pScp, dataobj)
        {
            $tc.outputResult(dataobj, callback);
        });
    };
}

function wgs84LineMeasure()
{
    var qstr = "";
    this.identify = function (request, callback)
    {
        //if (!request || !request.wktString || !request.measuremethod)
        if (!request || !request.wktString)
        {
            throw "wktString must be provided";
        }
        qstr = $tc.appendQStr(qstr, "wktString", request.wktString);
        //qstr = $tc.appendQStr(qstr, "measuremethod", request.measuremethod);
        qstr = $tc.appendQStr(qstr, "op", "wlm");
        tempQStr = qstr;
        LoadScript(timecrossService + tempQStr, function (pScp, dataobj)
        {
            $tc.outputResult(dataobj, callback);
        });
    };
}

function PolygonBuffer()
{
    var counter = 0;
    var currentRange = 0;
    var stepRange = 4000;
    var tempQStr = "";
    this.stepCount = 5;
    this.defaultDistanceRange = 40000;

    var that = this;
    function BuildPolygonBufferString(request, placeOption, districtOption, rRange)
    {
        var qstr = "";
        if (!request || !request.polygonwkt)
        {
            throw "polygonwkt must be provided";
        } else
        {
            qstr = $tc.appendQStr(qstr, "polygonwkt", request.polygonwkt);
        }

        if (!request || (request.distance == "" && request.distance == null))
        {
            throw "distance must be provided";
        }

        if (!$tc.util.isUInt(request.distance) || request.distance > 20000)
            throw "Invalid Buffer Range";

        if ($tc.util.isUInt(rRange))
            qstr = $tc.appendQStr(qstr, "range", parseInt(rRange));
        else
            qstr = $tc.appendQStr(qstr, "range", parseInt(request.distance));

        var bufferType = placeOption ? "place" : districtOption ? "dist" : "none";
        var optional = "";
        switch (bufferType)
        {
            case "place":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildPlaceQueryString(placeOption, qstr);
                break;
            case "dist":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildDistrictQueryString(districtOption, qstr);
                break;
            default:
                throw "You must choose between place option or district query";
                break;
        }
        return qstr;
    }

    this.identify = function (request, placeOption, districtOption, callback)
    {
        counter = 0;
        if (request && $tc.util.isUInt(request.distancerange))
        {
            this.defaultDistanceRange = request.distancerange;
        }
        stepRange = (this.defaultDistanceRange - request.distance) / this.stepCount;
        var qstr = BuildPolygonBufferString(request, placeOption, districtOption);
        qstr = $tc.appendQStr(qstr, "op", "pgb");

        tempQStr = qstr;
        currentRange = parseInt(request.distance);
        function loop()
        {
            LoadScript(timecrossService + tempQStr, function (pScp, dataobj)
            {
                counter++;
                if ((dataobj.Table && dataobj.Table.length > 0) || counter > that.stepCount)
                {
                    $tc.outputResult(dataobj, callback);
                    return;
                }
                currentRange += stepRange;
                tempQStr = BuildPolygonBufferString(request, placeOption, districtOption, currentRange);
                tempQStr = $tc.appendQStr(tempQStr, "op", "pgb");
                loop();
            });
        }
        loop();
    };
}

function Location(x, y)
{
    var px = x;
    var py = y;
    this.getX = function () { return px };
    this.getY = function () { return py };
}

var TransStatus = {
    INVALID_REQUEST: "INVALID_REQUEST",
    OK: "OK"
};

function Transformation()
{
    this.datum_WGS84 = new HorizontalDatum(6378137, 1 / 298.257223563);
    this.datum_GRS97 = new HorizontalDatum(6378137, 1 / 298.257222101);
}
Transformation.prototype.datum_WGS84 = null;
Transformation.prototype.datum_GRS97 = null;
Transformation.prototype.twd97towgs84 = function (x, y, callback)
{
    var pt = new Location(x, y);
    var tm2_Projection = new TransverseMercatorProjection(121, 250000, 0, 0, 0.9999);
    var pos = new CPoint3(pt.getX(), pt.getY(), 0);
    pos = CoordinateTransform(this.datum_GRS97, tm2_Projection, this.datum_WGS84, null, null, pos);

    if ($tc.util.checkLonLat({ lon: pos.X, lat: pos.Y }))
        callback.call(this, new Location(pos.X, pos.Y), TransStatus.OK);
    else
        callback.call(this, new Location(0, 0), TransStatus.INVALID_REQUEST);
};

Transformation.prototype.twd97_119towgs84 = function (x, y, callback)
{
    var pt = new Location(x, y);
    var tm2_Projection = new TransverseMercatorProjection(119, 250000, 0, 0, 0.9999);
    var pos = new CPoint3(pt.getX(), pt.getY(), 0);
    pos = CoordinateTransform(this.datum_GRS97, tm2_Projection, this.datum_WGS84, null, null, pos);

    if ($tc.util.checkLonLat({ lon: pos.X, lat: pos.Y }))
        callback.call(this, new Location(pos.X, pos.Y), TransStatus.OK);
    else
        callback.call(this, new Location(0, 0), TransStatus.INVALID_REQUEST);
};

Transformation.prototype.lccptowgs84 = function (x, y, callback)
{
    var pt = new Location(x, y);
    var qstr = "";
    qstr = $tc.appendQStr(qstr, "op", "tf");
    qstr = $tc.appendQStr(qstr, "x", pt.getX());
    qstr = $tc.appendQStr(qstr, "y", pt.getY());
    qstr = $tc.appendQStr(qstr, "sourceProj", "lambert");
    qstr = $tc.appendQStr(qstr, "targetProj", "wgs84");

    LoadScript(timecrossService + qstr, function (pScp, dataobj)
    {
        if (dataobj || !dataobj.error)
            if (dataobj.Table.length > 0)
                callback.call(this, new Location(dataobj.Table[0].x, dataobj.Table[0].y), TransStatus.OK);
            else
                callback.call(this, new Location(0, 0), TransStatus.INVALID_REQUEST);
    });
};

function PinyinConvert()
{
	this.pinyinId = {
        hanyoue : "hanyoue",
        wadegiles : "wg",
        general : "general"
    };
	
    function getResult(dataobj)
    {
        var intervals = "";
        if (dataobj.Table.length == 0)
            return null;
        for (var num = 0; num < dataobj.Table.length; num++)
        {
            intervals += dataobj.Table[num].value;
            if (num < dataobj.Table.length - 1)
            {
                intervals += " ";
            }
        }
        return intervals;
    }

    function getStatus(dataobj)
    {
        var intervals = "";
        if (dataobj.Table.length == 0)
            return null;
        for (var num = 0; num < dataobj.Table.length; num++)
        {
            if (dataobj.Table[num].status == 1)
            {
                intervals = "Similar_RESULTS";
                return intervals;
            }
        }
        return intervals;
    }
    this.getPinyinval = function (request, callback)
    {
        var qstr = "";
        qstr = $tc.appendQStr(qstr, "op", "pc");
        qstr = $tc.appendQStr(qstr, "SourcePinyin", request.SourcePinyin);
        qstr = $tc.appendQStr(qstr, "TargetPinyin", request.TargetPinyin);
        qstr = $tc.appendQStr(qstr, "Pinyinval", request.Pinyinval);

        var tempQStr = qstr;
        LoadScript(timecrossService + tempQStr, function (pScp, dataobj)
        {
            if (!dataobj || dataobj.error)
            {
                status = "ERROR";
                callback.call(this, null, status);
                return;
            }
            var results = getResult(dataobj);
            var st = getStatus(dataobj); //getResult
            if (results != null)
            {
                if (st != "Similar_RESULTS")
                {
                    status = "OK";
                }
                else
                {
                    status = st;
                }
            }
            else
            {
                status = "ZERO_RESULTS";
                callback.call(this, results, status);
                return;
            }
            callback.call(this, results, status);
        });
    }
}

//20140709 Write By CX
function AttributeQuery() {

    function BuildAttributeQueryString(request, option) {
        var qstr = "";
        if (!request || !request.placename) {
            throw "Place name or placeID must be provided";
        }
        qstr = $tc.appendQStr(qstr, "pname", request.placename);
        qstr = $tc.buildAttributeQueryString(option, qstr);
        return qstr;
    }

    this.identify = function (request, option, callback) {
        var qstr = BuildAttributeQueryString(request, option);
        qstr = $tc.appendQStr(qstr, "op", "abq");
        LoadScript(timecrossService + qstr, function (pScp, dataobj) {
            $tc.outputResult(dataobj, callback);
        });
    };

}

//20140709 Write By CX
function PointBuffer2() {

    var counter = 0;
    var currentRange = 0;
    var stepRange = 4000;
    var tempQStr = "";
    this.stepCount = 5;
    this.defaultDistanceRange = 40000;

    var that = this;
    function BuildPointBufferString2(request, AttributeOption, RiverOption, rRange) {
        var qstr = "";
        if (!request || !request.pointwkt) {
            throw "pointwkt must be provided";
        }

        var lonlat = $tc.util.wgs84FromWKT(request.pointwkt);
        if (!lonlat)
            throw "Invalid pointwkt";

        qstr = $tc.appendQStr(qstr, "lon", lonlat.lon);
        qstr = $tc.appendQStr(qstr, "lat", lonlat.lat);

        if (!request || (request.distance == "" && request.distance == null)) {
            throw "distance must be provided";
        }

        if (!$tc.util.isUInt(request.distance) || request.distance > 20000)
            throw "Invalid Buffer Range";

        if ($tc.util.isUInt(rRange))
            qstr = $tc.appendQStr(qstr, "range", parseInt(rRange));
        else
            qstr = $tc.appendQStr(qstr, "range", parseInt(request.distance));


        var bufferType = AttributeOption ? "attr" : RiverOption ? "river" : "none";

        var optional = "";
        switch (bufferType) {
            case "attr":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildAttributeQueryString(AttributeOption, qstr);
                break;
            case "river":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildRiverQueryString(RiverOption, qstr);
                break;
            default:
                throw "You must choose between place option or district query";
                break;
        }
        return qstr;
    }

    this.identify = function (request, AttributeOption, RiverOption, callback) {
        counter = 0;
        if (request && $tc.util.isUInt(request.distancerange)) {
            this.defaultDistanceRange = request.distancerange;
        }
        stepRange = (this.defaultDistanceRange - request.distance) / this.stepCount;
        var qstr = BuildPointBufferString2(request, AttributeOption, RiverOption);
        qstr = $tc.appendQStr(qstr, "op", "pb2");

        tempQStr = qstr;
        currentRange = parseInt(request.distance);
        function loop() {
            LoadScript(timecrossService + tempQStr, function (pScp, dataobj) {
                counter++;
                if ((dataobj.Table && dataobj.Table.length > 0) || counter > that.stepCount) {
                    $tc.outputResult(dataobj, callback);
                    return;
                }
                currentRange += stepRange;
                tempQStr = BuildPointBufferString2(request, AttributeOption, RiverOption, currentRange);
                tempQStr = $tc.appendQStr(tempQStr, "op", "pb2");
                loop();
            });
        }
        loop();
    };
}
//20140710 Write By CX 
function PolygonBuffer2() {
    var counter = 0;
    var currentRange = 0;
    var stepRange = 4000;
    var tempQStr = "";
    this.stepCount = 5;
    this.defaultDistanceRange = 40000;

    var that = this;
    function BuildPolygonBufferString(request, AttributeOption, RiverOption, rRange) {
        var qstr = "";
        if (!request || !request.polygonwkt) {
            throw "polygonwkt must be provided";
        } else {
            qstr = $tc.appendQStr(qstr, "polygonwkt", request.polygonwkt);
        }

        if (!request || (request.distance == "" && request.distance == null)) {
            throw "distance must be provided";
        }

        if (!$tc.util.isUInt(request.distance) || request.distance > 20000)
            throw "Invalid Buffer Range";

        if ($tc.util.isUInt(rRange))
            qstr = $tc.appendQStr(qstr, "range", parseInt(rRange));
        else
            qstr = $tc.appendQStr(qstr, "range", parseInt(request.distance));

        var bufferType = AttributeOption ? "attr" : RiverOption ? "river" : "none";
        var optional = "";
        switch (bufferType) {
            case "attr":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildAttributeQueryString(AttributeOption, qstr);
                break;
            case "river":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildRiverQueryString(RiverOption, qstr);
                break;
            default:
                throw "You must choose between place option or district query";
                break;
        }
        return qstr;
    }

    this.identify = function (request, AttributeOption, RiverOption, callback) {
        counter = 0;
        if (request && $tc.util.isUInt(request.distancerange)) {
            this.defaultDistanceRange = request.distancerange;
        }
        stepRange = (this.defaultDistanceRange - request.distance) / this.stepCount;
        var qstr = BuildPolygonBufferString(request, AttributeOption, RiverOption);
        qstr = $tc.appendQStr(qstr, "op", "pgb2");

        tempQStr = qstr;
        currentRange = parseInt(request.distance);
        function loop() {
            LoadScript(timecrossService + tempQStr, function (pScp, dataobj) {
                counter++;
                if ((dataobj.Table && dataobj.Table.length > 0) || counter > that.stepCount) {
                    $tc.outputResult(dataobj, callback);
                    return;
                }
                currentRange += stepRange;
                tempQStr = BuildPolygonBufferString(request, AttributeOption, RiverOption, currentRange);
                tempQStr = $tc.appendQStr(tempQStr, "op", "pgb2");
                loop();
            });
        }
        loop();
    };
}
//20140711 Write By CX
function PolylineBuffer2() {

    var counter = 0;
    var currentRange = 0;
    var stepRange = 4000;
    var tempQStr = "";
    this.stepCount = 5;
    this.defaultDistanceRange = 40000;

    var that = this;
    function BuildPolylineBufferString(request, AttributeOption, RiverOption, rRange) {
        var qstr = "";
        if (!request || !request.LineStrwkt) {
            throw "LineStrwkt must be provided";
        } else {
            qstr = $tc.appendQStr(qstr, "LineStr", request.LineStrwkt);
        }

        if (!request || (request.distance == "" && request.distance == null)) {
            throw "distance must be provided";
        }

        if (!$tc.util.isUInt(request.distance) || request.distance > 20000)
            throw "Invalid Buffer Range";

        if ($tc.util.isUInt(rRange))
            qstr = $tc.appendQStr(qstr, "range", parseInt(rRange));
        else
            qstr = $tc.appendQStr(qstr, "range", parseInt(request.distance));

        var bufferType = AttributeOption ? "attr" : RiverOption ? "river" : "none";
        var optional = "";
        switch (bufferType) {
            case "attr":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildAttributeQueryString(AttributeOption, qstr);
                break;
            case "river":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildRiverQueryString(RiverOption, qstr);
                break;
            default:
                throw "You must choose between place option or district query";
                break;
        }
        return qstr;
    }

    this.identify = function (request, AttributeOption, RiverOption, callback) {
        counter = 0;
        if (request && $tc.util.isUInt(request.distancerange)) {
            this.defaultDistanceRange = request.distancerange;
        }
        stepRange = (this.defaultDistanceRange - request.distance) / this.stepCount;
        var qstr = BuildPolylineBufferString(request, AttributeOption, RiverOption);
        qstr = $tc.appendQStr(qstr, "op", "plb2");

        tempQStr = qstr;
        currentRange = parseInt(request.distance);
        function loop() {
            LoadScript(timecrossService + tempQStr, function (pScp, dataobj) {
                counter++;
                if ((dataobj.Table && dataobj.Table.length > 0) || counter > that.stepCount) {
                    $tc.outputResult(dataobj, callback);
                    return;
                }
                currentRange += stepRange;
                tempQStr = BuildPolylineBufferString(request, AttributeOption, RiverOption, currentRange);
                tempQStr = $tc.appendQStr(tempQStr, "op", "plb2");
                loop();
            });
        }
        loop();
    };
}
//20140711 Wtrite By CX
function PolygonQuery2() {

    var tempQStr = "";
    var that = this;
    function BuildPolygonQueryString(request, AttributeOption, RiverOption) {
        var qstr = "";
        if (!request || !request.polygonwkt) {
            throw "polygonwkt must be provided";
        }

        qstr = $tc.appendQStr(qstr, "polygonwkt", request.polygonwkt);

        var bufferType = AttributeOption ? "attr" : RiverOption ? "river" : "none";
        // AttributeOption, RiverOption
        var optional = "";
        switch (bufferType) {
            case "attr":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildAttributeQueryString(AttributeOption, qstr);
                break;
            case "river":
                qstr = $tc.appendQStr(qstr, "ptype", bufferType);
                qstr = $tc.buildRiverQueryString(RiverOption, qstr);
                break;
            default:
                throw "You must choose between place option or district query";
                break;
        }
        return qstr;
    }

    this.identify = function (request, AttributeOption, RiverOption, callback) {
        var qstr = BuildPolygonQueryString(request, AttributeOption, RiverOption);
        qstr = $tc.appendQStr(qstr, "op", "pgq2");
        tempQStr = qstr;
        LoadScript(timecrossService + tempQStr, function (pScp, dataobj) {
            $tc.outputResult(dataobj, callback);
        });
    };
}

//ornage --------------------------------------------------------------------
function RelationQuery() {
    this.identify = function (request, option, callback) {
        var tmpColumnName = new Array();

        if (option.mapTypeIds) {
            for (var i = 0; i < option.mapTypeIds.length; i++) {

                if (option.mapTypeIds[i].replace(/^\s+|\s+$/g, "") == "")
                    continue;

                var isExist = false;
                for (var j = 0; j < tmpColumnName.length; j++) {
                    if (option.mapTypeIds[i] == tmpColumnName[j]) {
                        isExist = true;
                        break;
                    }
                }

                if (!isExist)
                    tmpColumnName.push(option.mapTypeIds[i]);
            }
        }

        var allColumnName = "";
        if (tmpColumnName.length > 0) {
            for (var i = 0; i < tmpColumnName.length; i++) {
                allColumnName += tmpColumnName[i];

                if (i < (tmpColumnName.length - 1))
                    allColumnName += ",";
            }
        } else {
            allColumnName = "ID,NAME,DYNASTY,RELATION_NAME,YEARSTART,YEAREND,WKT,WKTTYPE";
        }

        var qstr = "";
        qstr = $tc.appendQStr(qstr, "op", "rr");
        qstr = $tc.appendQStr(qstr, "name", request.name);
        qstr = $tc.appendQStr(qstr, "relation", request.relation);
        qstr = $tc.appendQStr(qstr, "queryNum", option.queryNum);
        qstr = $tc.appendQStr(qstr, "resultLimit", option.resultLimit);
        qstr = $tc.appendQStr(qstr, "mapTypeIds", allColumnName);
        qstr = $tc.appendQStr(qstr, "order", option.order);

        LoadScript(timecrossService + qstr, function (pScp, pResult) {
            var status = "OK";
            var mResult = null;

            if (dataobj) {
                if (dataobj.Table.length == 0) {
                    status = "ZERO_RESULTS";
                } else {
                    mResult = $tc.buildResult(dataobj);
                }
            } else {
                status = "ERROR";
            }

            callback.call(this, mResult, status);
        });

    };
}
//ornage --------------------------------------------------------------------
//bw
function RiverQuery() {

    this.identify = function (request, option, callback) {
        var qstr = "";
        qstr = $tc.appendQStr(qstr, "op", "rq");
        qstr = $tc.appendQStr(qstr, "River", request.River);
        qstr = $tc.appendQStr(qstr, "dynasty", request.dynasty);

        qstr = $tc.buildRiverQueryString(option, qstr);

        var tempQStr = qstr;
        LoadScript(timecrossService + tempQStr, function (pScp, dataobj) {
            $tc.outputResult(dataobj, callback);
        });
    }
}

