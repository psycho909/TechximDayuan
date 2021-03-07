var map, nTaoyuanLayer, nCatTVLayer, taiwanCableLayer, topLightLayer, newCenturyLayer, roadNTaoyuanLayer, roadCatTVLayer, roadTaiwanCableLayer, roadTopLightLayer,
    roadNewCenturyLayer, roadAPTGLayer, dayuanVillageZone, dayuanAreaLayer;
var markers = [];
var villageLabelList = [];
var totalCableData;
var hostIP;
var normalIcon = null;
var resultErrorIcon = null
var hightLightIcon = null;
var resultWarningIcon = null;

var layerName = ["nTaoyuanLayer", "nCatTVLayer", "taiwanCableLayer", "topLightLayer", "newCenturyLayer", "roadNTaoyuanLayer", "roadCatTVLayer", "roadTaiwanCableLayer", "roadAPTGLayer", "roadTopLightLayer", "roadNewCenturyLayer", "dayuanVillageZone", "dayuanAreaLayer"];

function _initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 25.0623841, lng: 121.1425703 },
        zoom: 12
    });

    $.ajax({
        url: '/TechximDayuan/Home/GetHostIp',
        type: "GET",
        success: function (ip) {
            hostIP = ip;
        }
    });

    normalIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#00AA00',
        fillOpacity: 1,
        strokeColor: '#00AA00',
        strokeWidth: 8
    };

    noticedIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#9370DB',
        fillOpacity: 1,
        strokeColor: '#9370DB',
        strokeWidth: 8
    };

    restrictIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#FF0000',
        fillOpacity: 1,
        strokeColor: '#FF0000',
        strokeWidth: 8
    };

    impromentedIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#696969',
        fillOpacity: 1,
        strokeColor: '#696969',
        strokeWidth: 8
    };
}

function _initDataForMap() {
    $.blockUI({ message: '<h1><img src="../Images/loading.gif" />查詢中...</h1>' });
    $.ajax({
        url: '/TechximDayuan/Cable/FindCableDataForMap',
        type: "POST",
        data: $("#conditionForm").serialize(),
        dataType: 'json',
        success: function (cableData) {
            if (cableData) {
                totalCableData = cableData;
                _initMapMarkersAndInfoWindows();
                $('input.statusBtn').iCheck("check");   
            }
        }
    }).always(function (msg) {
        $.unblockUI();
    });
}

function _initMapMarkersAndInfoWindows() {
    _clearMarkers();
    for (var i = 0; i < totalCableData.length; i++) {
        data = totalCableData[i];
        var pointtTarget = _getTwd97towgs84(data.location_E, data.location_N);

        var resultIcon = _getIcon(data);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(pointtTarget.getY(), pointtTarget.getX()),
            icon: resultIcon,            
            groupId: data.groupId,
            map: map
        });
        markers.push(marker);

        var gridId = 'markerInfo_' + i;
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<div id="bodyContent">' +
            '<div id="' + gridId + '" />'
        '</div>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', (function (marker) {
            return function () {
                var data = totalCableData[markers.indexOf(marker)];
                var resultIcon = _getIcon(data);
                marker.setIcon(resultIcon);
                infowindow.setContent(contentString);
                infowindow.open(map, marker);

                setTimeout(function () {
                    _initCableDataGrid(gridId, data, markers.indexOf(marker))
                }, 200);
            };
        })(marker, infowindow));

    }
    //var markerCluster = new MarkerClusterer(map, markers, {
    //    averageCenter: true,
    //    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    //});
}

function _downloadExcel() {
    //Download From Grid       
    var condition = $("#conditionForm").serialize();
    condition = decodeURIComponent(condition, true);
    var form = $('<form></form>');
    $(form).hide().attr('method', 'post').attr('action', "/TechximDayuan/Cable/DownloadExcelByCondition");
    $(form).attr('target', '_blank');
    //$(form).append('<input type="hidden" id=inspectionId value=' + inspectionid + "'/");
    var input = $('<input type="hidden" name=condition value="' + condition + '"/>');
    $(form).append(input);
    $(form).appendTo('body').submit();
}

function _downloadWord() {

    var condition = $("#conditionForm").serialize();
    var form = $('<form></form>');
    $(form).hide().attr('method', 'post').attr('action', "/TechximDayuan/Cable/DownloadWord");
    $(form).attr('target', '_blank');
    //$(form).append('<input type="hidden" id=inspectionId value=' + inspectionid + "'/");
    var input = $('<input type="hidden" name=condition value="' + condition + '"/>');
    $(form).append(input);
    $(form).appendTo('body').submit();
}

function _clearMarkers() {
    _setMapOnAll(null);
    markers = [];
}

function _setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Sets the map on all markers in the array.
function _setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function _getHighLightMarker() {
    var targets = [];
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].getIcon().fillColor == hightLightIcon.fillColor) {
            targets.push(markers[i]);
        }
    }
    return targets;
}

function _initCableDataGrid(gridId, result, index) {
    var contentHtml = "";
    var goodCount = 0, badCount = 0;

    for (var i = 0; i < result.Detail.length; i++) {
        contentHtml +=
            '<tr><td>' + result.Detail[i].groupId + '</td><td>' + result.Detail[i].road + '</td><td>' + result.Detail[i].date + '</td>' +
        '<td>' + result.Detail[i].startPoint + '</td><td>' + result.Detail[i].endPoint + '</td><td>' + result.Detail[i].style + '</td><td>' + result.Detail[i].operatorName + '</td><td>' + result.Detail[i].faultInfo + '</td><td>' + result.Detail[i].status + '</td><td>' + result.Detail[i].result + '</td> ' +
            '<td><a onclick="_showImage(' + result.Detail[i].id + ')">檢視照片</a></td></tr > ';
        if (result.Detail[i].result == "符合") {
            goodCount++;
        } else if (result.Detail[i].result == "不符合") {
            badCount++;
        }
    }

    var tableHtml = "<span>此檢查點共有 " + result.Detail.length + " 筆(符合: " + goodCount + " 筆 / 不符合: " + badCount + " 筆)<span>";
    tableHtml += '<table class="table table-striped">' +
        '<tr><th>編號</th><th>檢查道路</th> <th>檢查日期</th> <th>檢查範圍起點</th><th>檢查範圍終點</th> <th>附掛形式</th><th>纜線業者</th><th>缺失</th><th>辦理情形</th><th>檢查結果</th><th>照片</th></tr>';

    tableHtml += contentHtml;
    tableHtml += '</table >';
   
    $("#" + gridId).append(tableHtml);
}

function _showImage(cableId) {
    $.ajax({
        url: '/TechximDayuan/Cable/ShowImage',
        type: "POST",
        data: { cableId: cableId },
        dataType: 'json',
        success: function (image) {
            _showImageModal(image);
        }
    });
}

function _showImageModal(image) {
    $("#imageContent").show();
    $("#flot-placeholder").hide();
    $("#imageModal").modal();
    $('#imageModalTitle').text('檢視圖片');
    var imageHtml = "此筆資料無現況照片</br>"
    var imageHtml1 = "此筆資料無改善照片"
    if (image[0] != "") {
        imageHtml = '現況照片：<img id="cableImage" height="300" width="300" src="data:image/png;base64,' + image[0] + '" />';
    }
    if (image[1] != "") {
        imageHtml1 = '改善照片：<img id="cableImage1" height="300" width="300" src="data:image/png;base64,' + image[1] + '" />';
    }
    $("#imageContent").html('');
    $("#imageContent").append(imageHtml);
    $("#imageContent1").html('');
    $("#imageContent1").append(imageHtml1);
}

function _getIcon(data) {
    if (data.Detail[0].road == "中正東路一段") {
        console.log("dd");
    }

    var worstStatus = "正常";
    for (var i = 0; i < data.Detail.length; i++) {
        if (data.Detail[i].status == "正常") {
            worstStatus = data.Detail[i].status ;
        } else if (data.Detail[i].status == "已通知改善") {
            if (worstStatus != "列管中" && worstStatus != "已改善完成") {
                worstStatus = data.Detail[i].status ;
            }
        } else if (data.Detail[i].status == "列管中") {
            if (worstStatus != "已改善完成") {
                worstStatus = data.Detail[i].status ;
            }
        } else if (data.Detail[i].status == "已改善完成") {
            worstStatus = data.Detail[i].status ;
        } 
    }
    if (worstStatus == "正常") {
        return normalIcon;
    } else if (worstStatus == "已通知改善") {
        return noticedIcon;
    } else if (worstStatus == "列管中") {
        return restrictIcon;
    } else if (worstStatus == "已改善完成") {
        return impromentedIcon;
    }
}

function _addKMLLayerToMap(data, type, checked) {
    if (checked) {
        if (type == "") {
            if (data == "北桃園") {
                _showLayerInMap(layerName[5]);
            } else if (data == "北健") {
                _showLayerInMap(layerName[6]);
            } else if (data == "台灣固網") {
                _showLayerInMap(layerName[7]);
            } else if (data == "亞太") {
                _showLayerInMap(layerName[8]);
            } else if (data == "佳光") {
                _showLayerInMap(layerName[9]);
            } else if (data == "新世紀") {
                _showLayerInMap(layerName[10]);
            } else if (data == "大園區區界") {
                _showLayerInMap(layerName[12]);
            } else if (data == "大園村里界") {
                _showLayerInMap(layerName[11]);
            }
        } else if (type == "rain") {
            if (data == "北桃園") {
                _showLayerInMap(layerName[0]);
            } else if (data == "北健") {
                _showLayerInMap(layerName[1]);
            } else if (data == "台灣固網") {
                _showLayerInMap(layerName[2]);
            } else if (data == "佳光") {
                _showLayerInMap(layerName[3]);
            } else if (data == "新世紀") {
                _showLayerInMap(layerName[4]);
            } 
        } 
        if (data =="雨水下水道圖資(大園區)") {
            for (var i = 0; i <= 4; i++) {
                _showLayerInMap(layerName[i]);
            }
            $('input.rainLayerBtn').iCheck("check");
        }
        if (data == "道路纜線圖資(大園區)") {
            for (var i = 5; i <= 10; i++) {
                _showLayerInMap(layerName[i]);
                $('input.layerBtn').iCheck("check");
            }
        }
    } else {
        if (type == "") {
            if (data == "北桃園") {
                roadNTaoyuanLayer.setMap(null);
            } else if (data == "北健") {
                roadCatTVLayer.setMap(null);
            } else if (data == "台灣固網") {
                roadTaiwanCableLayer.setMap(null);
            } else if (data == "亞太") {
                roadAPTGLayer.setMap(null);
            } else if (data == "佳光") {
                roadTopLightLayer.setMap(null);
            } else if (data == "新世紀") {
                roadNewCenturyLayer.setMap(null);
            } else if (data == "大園區區界") {
                dayuanAreaLayer.setMap(null);
            } else if (data == "大園村里界") {
                dayuanVillageZone.setMap(null);
                _clearVillageLabels();
            }    
        } else if (type == "rain") {
            if (data == "北桃園") {
                nTaoyuanLayer.setMap(null);
            } else if (data == "北健") {
                nCatTVLayer.setMap(null);
            } else if (data == "台灣固網") {
                taiwanCableLayer.setMap(null);
            } else if (data == "佳光") {
                topLightLayer.setMap(null);
            } else if (data == "新世紀") {
                newCenturyLayer.setMap(null);
            }
        } 
        if (data == "雨水下水道圖資(大園區)") {
            $('input.rainLayerBtn').iCheck("uncheck");
            nTaoyuanLayer.setMap(null);
            nCatTVLayer.setMap(null);
            taiwanCableLayer.setMap(null);
            topLightLayer.setMap(null);
            newCenturyLayer.setMap(null);
        }
        if (data == "道路纜線圖資(大園區)") {
            $('input.layerBtn').iCheck("uncheck");
            roadNTaoyuanLayer.setMap(null);
            roadCatTVLayer.setMap(null);
            roadTaiwanCableLayer.setMap(null);
            roadAPTGLayer.setMap(null);
            roadTopLightLayer.setMap(null);
            roadNewCenturyLayer.setMap(null);
        }
    }
}

function _showLayerInMap(layerName) {
    switch (layerName) {
        case "nTaoyuanLayer":
            if (nTaoyuanLayer) {
                nTaoyuanLayer.setMap(map);
            } else {
                nTaoyuanLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/Cable/nTaoyuan.kml',
                    map: map
                });
            }
            break;
        case "nCatTVLayer":
            if (nCatTVLayer) {
                nCatTVLayer.setMap(map);
            } else {
                nCatTVLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/Cable/nCatTV.kml',
                    map: map
                });
            }
            break;
        case "taiwanCableLayer":
            if (taiwanCableLayer) {
                taiwanCableLayer.setMap(map);
            } else {
                taiwanCableLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/Cable/taiwanCable.kml',
                    map: map
                });
            }
            break;
        case "topLightLayer":
            if (topLightLayer) {
                topLightLayer.setMap(map);
            } else {
                topLightLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/Cable/topLight.kml',
                    map: map
                });
            }
            break;
        case "newCenturyLayer":
            if (newCenturyLayer) {
                newCenturyLayer.setMap(map);
            } else {
                newCenturyLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/Cable/newCentury.kml',
                    map: map
                });
            }
            break;
        case "roadNTaoyuanLayer":
            if (roadNTaoyuanLayer) {
                roadNTaoyuanLayer.setMap(map);
            } else {
                roadNTaoyuanLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/Cable/道路纜線圖資(大園區)纜線附掛-北桃20191116.kml',
                    map: map
                });
            }
            break;
        case "roadCatTVLayer":
            if (roadCatTVLayer) {
                roadCatTVLayer.setMap(map);
            } else {
                roadCatTVLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/Cable/道路纜線圖資(大園區)纜線附掛-北健20191116.kml',
                    map: map
                });
            }
            break;
        case "roadTaiwanCableLayer":
            if (roadTaiwanCableLayer) {
                roadTaiwanCableLayer.setMap(map);
            } else {
                roadTaiwanCableLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/Cable/道路纜線圖資(大園區)纜線附掛-台固20191116.kml',
                    map: map
                });
            }
            break;
        case "roadAPTGLayer":
            if (roadAPTGLayer) {
                roadAPTGLayer.setMap(map);
            } else {
                roadAPTGLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/Cable/道路纜線圖資(大園區)纜線附掛-亞太20191116.kml',
                    map: map
                });
            }
            break;
        case "roadTopLightLayer":
            if (roadTopLightLayer) {
                roadTopLightLayer.setMap(map);
            } else {
                roadTopLightLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/Cable/道路纜線圖資(大園區)纜線附掛-佳光20191116.kml',
                    map: map
                });
            }
            break;
        case "roadNewCenturyLayer":
            if (roadNewCenturyLayer) {
                roadNewCenturyLayer.setMap(map);
            } else {
                roadNewCenturyLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/Cable/道路纜線圖資(大園區)纜線附掛-新世紀20191116.kml',
                    map: map
                });
            }
            break;
        case "dayuanVillageZone":
            if (dayuanVillageZone) {
                dayuanVillageZone.setMap(map);
            } else {
                dayuanVillageZone = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/大園區村里界20200923.kml',
                    map: map
                });
            }
            _setVillageLabels("大園區村里界20200923.kml");
            break;
        case "dayuanAreaLayer":
            if (dayuanAreaLayer) {
                dayuanAreaLayer.setMap(map);
            } else {
                dayuanAreaLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/大園區區界_20191028.kml',
                    map: map
                });
            }
            break;
        default: return;
    }
}

function _setMapOnSelectedMarker(data, checked) {   

    if (data == "正常") {
        _findAndSetMapTOMarker(checked, "#00AA00");
    } else if (data=="已通知改善") {
        _findAndSetMapTOMarker(checked, "#9370DB");
    } else if (data=="列管中") {
        _findAndSetMapTOMarker(checked, "#FF0000");
    } else if (data=="已改善完成") {
        _findAndSetMapTOMarker(checked, "#696969");
    } else if (data == "呈現檢查結果") {
        _findAndSetMapTOMarker(checked, "#00AA00");
        _findAndSetMapTOMarker(checked, "#9370DB");
        _findAndSetMapTOMarker(checked, "#FF0000");
        _findAndSetMapTOMarker(checked, "#696969");        
        if (checked) {
            $('input.statusBtn').iCheck("check");
        } else {
            $('input.statusBtn').iCheck("uncheck");
        }
    }
}


function _findAndSetMapTOMarker(checked, color) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].icon.fillColor == color) {
            if (checked) {
                markers[i].setMap(map);
            } else {
                markers[i].setMap(null);
            }
        }
    }
}