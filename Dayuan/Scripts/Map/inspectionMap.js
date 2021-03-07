var map, riverLayer, localDrainLayer, otherDrainLayer, fieldDrainLayer, rainSewerLayer, nonAnnouncementLocalDrainLayer
    , dayuanKLESUrbanPlanLayer, THRTouyuanRainPipleLayer, THRTouyuanSPLayer, dayuanUrbanPlanLayer, dayuanUrbanPlanRainPipleLayer
    , dayuanAreaLayer, dayuanUrbanPlanRainLayer, dayuanKLESUrbanPlanRainPipleLayer, dayuanKLESUrbanPlanRainLayer, THRTouyuanRainLayer,
    dayuanAirPortSPLayer, dayuanAirPortSPRainPipleLayer, dayuanAirPortSPRainLayer, otherDrainCleanLayer107, otherDrainCleanLayer108, otherDrainCleanLayer109, otherDrainCleanLayer106, dayuanVillageZone;
var needUpdate = true;
var NEW = "new", ADD = "add", REMOVE = "remove";
var markers = [];
var labelList = [];
var villageLabelList = [];
var hostIP;
var layverName = ["riverLayer", "localDrainLayer", "otherDrainLayer", "fieldDrainLayer", "rainSewerLayer",
    "nonAnnouncementLocalDrainLayer", "dayuanKLESUrbanPlanLayer", "THRTouyuanRainPipleLayer", "THRTouyuanSPLayer",
    "dayuanUrbanPlanLayer", "dayuanUrbanPlanRainPipleLayer", "dayuanAreaLayer", "dayuanUrbanPlanRainLayer", "dayuanKLESUrbanPlanRainPipleLayer",
    "dayuanKLESUrbanPlanRainLayer", "THRTouyuanRainLayer", "dayuanAirPortSPLayer", "dayuanAirPortSPRainPipleLayer", "dayuanAirPortSPRainLayer", "otherDrainCleanLayer107", "otherDrainCleanLayer108", "otherDrainCleanLayer109", "otherDrainCleanLayer106", "dayuanVillageZone"];

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

}

function _initDataForMap() {
    $.ajax({
        url: '/TechximDayuan/GoogleMap/FindInspectionDataForMap',
        type: "POST",
        data: $("#conditionForm").serialize(),
        dataType: 'json',
        success: function (inspectionData) {
            if (inspectionData) {
                _initMapMarkersAndInfoWindows(inspectionData);
            }
        }
    });
}

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

function _initMapMarkersAndInfoWindows(inspectionData) {
    _clearMarkers();
    for (var i = 0; i < inspectionData.length; i++) {
        data = inspectionData[i];
        var pointtTarget = _getTwd97towgs84(data.location_E, data.location_N);

        var iconColor = _getStatusIconColor(data.improvementStatusName);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(pointtTarget.getY(), pointtTarget.getX()),
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 4,
                fillColor: iconColor,
                fillOpacity: 1,
                strokeColor: iconColor,
                strokeWidth: 3
            },
            map: map
        });
        markers.push(marker);

        var gridTitle = _formatInt(data.pilenumber_K, 3) + 'K+' + _formatInt(data.pilenumber_m, 3)
        var gridId = 'markerInfo_' + i;
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h4 id="firstHeading" class="firstHeading">' + data.localDrainingSite + '</h4> ' +
            '<a>' + gridTitle + '(' + data.inspectionSiteName + ')</a> ' +
            '<div id="bodyContent">' +
            '<div id=' + gridId + ' />'
        '</div>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', (function (marker, contentString, infowindow, gridId, data) {
            return function () {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
                setTimeout(function () {
                    _initInspectionDataGrid(gridId, data)
                }, 200);
            };
        })(marker, contentString, infowindow, gridId, data.details));
    }
}

function _showImprovementStatusData(spanText, checked) {

    if (spanText == "正常") {
        _findAndSetMapTOMarker(checked, "#00AA00");
    } else if (spanText == "計畫改善") {
        _findAndSetMapTOMarker(checked, "#0000FF");
    } else if (spanText == "注意改善") {
        _findAndSetMapTOMarker(checked, "#FFFF00");
    } else if (spanText == "立即改善") {
        _findAndSetMapTOMarker(checked, "#FF0000");
    } else if (spanText == "改善後正常") {
        _findAndSetMapTOMarker(checked, "#808080");
    } else if (spanText == "呈現檢查結果") {
        _findAndSetMapTOMarker(checked, "#00AA00");
        _findAndSetMapTOMarker(checked, "#0000FF");
        _findAndSetMapTOMarker(checked, "#FFFF00");
        _findAndSetMapTOMarker(checked, "#FF0000");
        _findAndSetMapTOMarker(checked, "#808080");
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

function _initInspectionDataGrid(gridId, result) {
    $("#" + gridId).jsGrid({
        sorting: true,
        paging: true,
        pageSize: 10,
        data: result,
        fields: [
            //{ name: "inspectionYear", type: "number", title: "年度", width: "50px" },
            { name: "inspectionYear", type: "number", title: "年度" },
            {
                title: "檢查日期",
                itemTemplate: function (e, item) {
                    return "<span>" + _parseJsonDate(item.inspectionDate) + "</span>";
                }
            },
            { name: "inspectionTypeName", type: "string", title: "定期/不定期" },
            {
                title: "檢查結果",
                itemTemplate: function (e, item) {
                    return "<div class='" + _getSight(item.improvementStatusName) + "'>" + item.improvementStatusName + "</div>";
                }
            },
            {
                title: "下載",
                itemTemplate: function (e, item) {
                    return "<input type='button' class='btn btn-default' onclick='_downloadOneWord(\"" + item.inspectionId + "\")' value='Word'/>";
                }
            },
            {
                title: "照片",
                itemTemplate: function (e, item) {
                    return "<a onclick='_showImage(\"" + item.inspectionId + "\")'>" + "檢視照片" + "</a>";
                }
            },
            {
                title: "斷面資料",
                itemTemplate: function (e, item) {
                    if (item.profilepath) {
                        return "<input type='button' class='btn btn-default' onclick='_showProfile(\"" + item.inspectionId + "\")' value='顯示'/>";
                    }
                }
            },
            {
                title: "相關資料",
                itemTemplate: function (e, item) {
                    if (item.relativefile) {
                        return "<input type='button' class='btn btn-default' onclick='_downloadFile(\"" + item.inspectionId + "\")' value='下載'/>";
                    } else {
                        return "";
                    }
                }
            }
        ]
    });
}

function _showImage(inspectionId) {
    $.ajax({
        url: '/TechximDayuan/Inspection/ShowImages',
        type: "POST",
        data: { inspectionId: inspectionId },
        dataType: 'json',
        success: function (imageList) {
            if (imageList) {
                _showImageModal(imageList);
            }
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });
}

function _showImageModal(imageList) {
    $("#imageModal").modal();
    $("#pieChart").hide();
    $("#flot-placeholder").hide();
    $("#imageList").show();
    $('#modalHeader').text('照片資料');
    $("#imageList").jsGrid({
        width: "100%",
        height: "80%",

        paging: true,
        pageSize: 10,
        data: imageList,
        fields: [
            //{
            //    title: "刪除",
            //    width: "15%",
            //    itemTemplate: function (e, item) {
            //        return "<input type='button' class='btn btn-danger' onclick='_deleteImage(\"" + item.inspectionId + "\")' value='刪除'/>";
            //    }
            //},
            {
                title: "圖片",
                width: "85%",
                itemTemplate: function (e, item) {
                    return '<img src="' + item.imagePath + '" width="300px" height="300px">';
                }
            }
        ]
    });
    $("#imageModal").find(".jsgrid-grid-body")[0].style.height = "350px";
}

function _addKMLLayerToMap(spanText, checked) {
    if (checked) {
        if (spanText == "河川圖資") {
            _showLayerInMap(layverName[0]);
        } else if (spanText == "公告區域排水圖資") {
            _showLayerInMap(layverName[1]);
        } else if (spanText == "其他排水圖資") {
            _showLayerInMap(layverName[2]);
        } else if (spanText == "106其他排水清淤圖資") {
            _showLayerInMap(layverName[22]);
        } else if (spanText == "107其他排水清淤圖資") {
            _showLayerInMap(layverName[19]);
        } else if (spanText == "108其他排水清淤圖資") {
            _showLayerInMap(layverName[20]);
        } else if (spanText == "109其他排水清淤圖資") {
            _showLayerInMap(layverName[21]);
        } else if (spanText == "農田排水圖資") {
            _showLayerInMap(layverName[3]);
        } else if (spanText == "非公告區域排水圖資") {
            _showLayerInMap(layverName[5]);
        } else if (spanText == "高速鐵路桃園車站特定區計畫_雨水竣工管線") {
            _showLayerInMap(layverName[7]);
        } else if (spanText == "高速鐵路桃園車站特定區計畫") {
            _showLayerInMap(layverName[8]);
        } else if (spanText == "大園都市計畫") {
            _showLayerInMap(layverName[9]);
        } else if (spanText == "大園都市計畫_雨水竣工管線") {
            _showLayerInMap(layverName[10]);
        } else if (spanText == "大園區區界") {
            _showLayerInMap(layverName[11]);
        } else if (spanText == "大園村里界") {
            _showLayerInMap(layverName[23]);
        } else if (spanText == "大園都市計畫_雨水竣工人孔") {
            _showLayerInMap(layverName[12]);
        } else if (spanText == "大園(果林地區)都市計畫_雨水竣工管線") {
            _showLayerInMap(layverName[13]);
        } else if (spanText == "大園(果林地區)都市計畫_雨水竣工人孔") {
            _showLayerInMap(layverName[14]);
        } else if (spanText == "大園(果林地區)都市計畫") {
            _showLayerInMap(layverName[6]);
        } else if (spanText == "高速鐵路桃園車站特定區計畫_雨水竣工人孔") {
            _showLayerInMap(layverName[15]);
        } else if (spanText == "桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫") {
            _showLayerInMap(layverName[16]);
        } else if (spanText == "桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_雨水竣工管線") {
            _showLayerInMap(layverName[17]);
        } else if (spanText == "桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_雨水竣工人孔") {
            _showLayerInMap(layverName[18]);
        } else if (spanText == "可套用圖資") {
            for (var i = 0; i < layverName.length; i++) {
                _showLayerInMap(layverName[i]);
            }
        } else if (spanText == "排水") {
            _showLayerInMap(layverName[1]);
            _showLayerInMap(layverName[5]);
            $('input.drainLayer').iCheck("check");
        } else if (spanText == "都市計畫") {
            _showLayerInMap(layverName[8]);
            _showLayerInMap(layverName[9]);
            _showLayerInMap(layverName[6]);
            _showLayerInMap(layverName[16]);
            $('input.urbanPlanLayer').iCheck("check");
        } else if (spanText == "雨水竣工管線") {
            _showLayerInMap(layverName[7]);
            _showLayerInMap(layverName[10]);
            _showLayerInMap(layverName[13]);
            _showLayerInMap(layverName[17]);
            $('input.pipleLayer').iCheck("check");
        } else if (spanText == "雨水竣工人孔") {
            _showLayerInMap(layverName[18]);
            _showLayerInMap(layverName[14]);
            _showLayerInMap(layverName[12]);
            _showLayerInMap(layverName[15]);
            $('input.rainLayer').iCheck("check");
        } else if (spanText == "其他排水清淤圖資") {
            _showLayerInMap(layverName[22]);
            _showLayerInMap(layverName[19]);
            _showLayerInMap(layverName[20]);
            _showLayerInMap(layverName[21]);
            $('input.otherLayer').iCheck("check");
        }
    } else {
        if (spanText == "河川圖資") {
            riverLayer.setMap(null);
        } else if (spanText == "公告區域排水圖資") {
            localDrainLayer.setMap(null);
        } else if (spanText == "其他排水圖資") {
            otherDrainLayer.setMap(null);
        } else if (spanText == "106其他排水清淤圖資") {
            otherDrainCleanLayer106.setMap(null);
        } else if (spanText == "107其他排水清淤圖資") {
            otherDrainCleanLayer107.setMap(null);
        } else if (spanText == "108其他排水清淤圖資") {
            otherDrainCleanLayer108.setMap(null);
        } else if (spanText == "109其他排水清淤圖資") {
            otherDrainCleanLayer109.setMap(null);
        } else if (spanText == "農田排水圖資") {
            fieldDrainLayer.setMap(null);
        } else if (spanText == "非公告區域排水圖資") {
            nonAnnouncementLocalDrainLayer.setMap(null);
        } else if (spanText == "大園都市計畫_雨水竣工管線") {
            dayuanUrbanPlanRainPipleLayer.setMap(null);
        } else if (spanText == "大園都市計畫") {
            dayuanUrbanPlanLayer.setMap(null);
        } else if (spanText == "高速鐵路桃園車站特定區計畫_雨水竣工管線") {
            THRTouyuanRainPipleLayer.setMap(null);
        } else if (spanText == "高速鐵路桃園車站特定區計畫") {
            THRTouyuanSPLayer.setMap(null);
        } else if (spanText == "高速鐵路桃園車站特定區計畫_雨水竣工人孔") {
            THRTouyuanRainLayer.setMap(null);
            _clearLabels("高速鐵路桃園車站特定區計畫_雨水竣工人孔20200915.kml");
        } else if (spanText == "大園區區界") {
            dayuanAreaLayer.setMap(null);
        } else if (spanText == "大園村里界") {
            dayuanVillageZone.setMap(null);
            _clearVillageLabels();
        } else if (spanText == "大園都市計畫_雨水竣工人孔") {
            dayuanUrbanPlanRainLayer.setMap(null);
            _clearLabels("大園都市計畫-雨水竣工人孔20200915.kml");
        } else if (spanText == "大園(果林地區)都市計畫_雨水竣工管線") {
            dayuanKLESUrbanPlanRainPipleLayer.setMap(null);
        } else if (spanText == "大園(果林地區)都市計畫_雨水竣工人孔") {
            dayuanKLESUrbanPlanRainLayer.setMap(null);
            _clearLabels("大園(果林地區)都市計畫_雨水竣工人孔20200914.kml");
        } else if (spanText == "大園(果林地區)都市計畫") {
            dayuanKLESUrbanPlanLayer.setMap(null);
        } else if (spanText == "桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫") {
            dayuanAirPortSPLayer.setMap(null);
        } else if (spanText == "桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_雨水竣工管線") {
            dayuanAirPortSPRainPipleLayer.setMap(null);
        } else if (spanText == "桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_雨水竣工人孔") {
            dayuanAirPortSPRainLayer.setMap(null);
            _clearLabels("桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_雨水竣工人孔20200914.kml");
        } else if (spanText == "可套用圖資") {
            riverLayer.setMap(null);
            dayuanVillageZone.setMap(null);
            localDrainLayer.setMap(null);
            otherDrainLayer.setMap(null);
            fieldDrainLayer.setMap(null);
            nonAnnouncementLocalDrainLayer.setMap(null);
            dayuanUrbanPlanRainPipleLayer.setMap(null)
            dayuanUrbanPlanLayer.setMap(null);
            THRTouyuanSPLayer.setMap(null);
            THRTouyuanRainPipleLayer.setMap(null);
            dayuanAreaLayer.setMap(null);
            dayuanUrbanPlanRainLayer.setMap(null);
            dayuanKLESUrbanPlanRainPipleLayer.setMap(null);
            dayuanKLESUrbanPlanRainLayer.setMap(null);
            dayuanKLESUrbanPlanLayer.setMap(null);
            dayuanAirPortSPLayer.setMap(null);
            dayuanAirPortSPRainPipleLayer.setMap(null);
            dayuanAirPortSPRainLayer.setMap(null);
            otherDrainCleanLayer106.setMap(null);
            otherDrainCleanLayer107.setMap(null);
            otherDrainCleanLayer108.setMap(null);
            otherDrainCleanLayer109.setMap(null);
        } else if (spanText == "排水") {
            localDrainLayer.setMap(null);
            nonAnnouncementLocalDrainLayer.setMap(null);
            $('input.drainLayer').iCheck("uncheck");
        } else if (spanText == "都市計畫") {
            dayuanUrbanPlanLayer.setMap(null);
            THRTouyuanSPLayer.setMap(null);
            dayuanAirPortSPLayer.setMap(null);
            dayuanKLESUrbanPlanLayer.setMap(null);
            $('input.urbanPlanLayer').iCheck("uncheck");
        } else if (spanText == "雨水竣工管線") {
            THRTouyuanRainPipleLayer.setMap(null);
            dayuanKLESUrbanPlanRainPipleLayer.setMap(null);
            dayuanAirPortSPRainPipleLayer.setMap(null);
            dayuanUrbanPlanRainPipleLayer.setMap(null);
            $('input.pipleLayer').iCheck("uncheck");
        } else if (spanText == "雨水竣工人孔") {
            dayuanAirPortSPRainLayer.setMap(null);
            _clearLabels("桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_雨水竣工人孔20200914.kml");
            dayuanKLESUrbanPlanRainLayer.setMap(null);
            _clearLabels("大園(果林地區)都市計畫_雨水竣工人孔20200914.kml");
            dayuanUrbanPlanRainLayer.setMap(null);
            _clearLabels("大園都市計畫-雨水竣工人孔20200915.kml");
            THRTouyuanRainLayer.setMap(null);
            _clearLabels("高速鐵路桃園車站特定區計畫_雨水竣工人孔20200915.kml");
            $('input.rainLayer').iCheck("uncheck");
        } else if (spanText == "其他排水清淤圖資") {
            otherDrainCleanLayer106.setMap(null);
            otherDrainCleanLayer107.setMap(null);
            otherDrainCleanLayer108.setMap(null);
            otherDrainCleanLayer109.setMap(null);
            $('input.otherLayer').iCheck("uncheck");
        }
    }
}
function bindDownloadEvent(kmlEvent) {
    setTimeout(function () {
        var btn = $('input[name="kmlbtn1"]')[0];
        if (btn != null) {
            btn.onclick = function () {
                var targetPath = "";
                if (btn.parentElement.firstElementChild.value.toString().endsWith('.pdf')) {

                    targetPath = btn.parentElement.firstElementChild.value;
                } else {
                    targetPath = btn.parentElement.firstElementChild.value + ".pdf";
                }
                if (btn.parentElement.firstElementChild.value.toString().startsWith('\\data\\')
                    || btn.parentElement.firstElementChild.value.toString().startsWith('/data/')) {
                    targetPath = "https://www.lshydraulic.com/TechximDayuan" + targetPath;
                } else {
                    targetPath = "https://www.lshydraulic.com/TechximDayuan/data" + targetPath;
                }
                window.open(
                    targetPath
                );
            }
        }

        var btn1 = $('input[name="kmlbtn2"]')[0];
        if (btn1 != null) {
            btn1.onclick = function () {
                var targetPath = "";
                if (btn1.parentElement.firstElementChild.value.toString().endsWith('.pdf')) {
                    targetPath = btn1.parentElement.firstElementChild.value;
                } else {
                    targetPath = btn1.parentElement.firstElementChild.value + ".pdf";
                }
                if (btn1.parentElement.firstElementChild.value.toString().startsWith('\\data\\')
                    || btn1.parentElement.firstElementChild.value.toString().startsWith('/data/')) {
                    targetPath = "https://www.lshydraulic.com/TechximDayuan" + targetPath;
                } else {
                    targetPath = "https://www.lshydraulic.com/TechximDayuan/data" + targetPath;
                }
                window.open(
                    targetPath
                );
            }
        }

    }, 500);
}

//"riverLayer", "localDrainLayer", "otherDrainLayer", "fieldDrainLayer", "rainSewerLayer", "nonAnnouncementLocalDrainLayer"
function _showLayerInMap(layerName) {
    var sourceURL;
    switch (layerName) {
        case "riverLayer":
            if (riverLayer) {
                riverLayer.setMap(map);
            } else {
                riverLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/市管河川_20191028.kml',
                    map: map
                });
            }
            break;
        case "localDrainLayer":
            if (localDrainLayer) {
                localDrainLayer.setMap(map);
            } else {
                localDrainLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/公告區域排水_20191028.kml',
                    map: map
                });
            }
            break;
        case "otherDrainLayer":
            if (otherDrainLayer) {
                otherDrainLayer.setMap(map);
            } else {
                otherDrainLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/20200424其他排水圖資20201015.kml',
                    map: map
                });
                otherDrainLayer.addListener("click", bindDownloadEvent);
            }
            break;
        case "fieldDrainLayer":
            if (fieldDrainLayer) {
                fieldDrainLayer.setMap(map);
            } else {
                fieldDrainLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/fieldDrainLayer_20191028.kml',
                    map: map
                });
            }
            break;
        case "nonAnnouncementLocalDrainLayer":
            if (nonAnnouncementLocalDrainLayer) {
                nonAnnouncementLocalDrainLayer.setMap(map);
            } else {
                nonAnnouncementLocalDrainLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/非公告區排_20191028.kml',
                    map: map
                });
            }
            break;
        case "dayuanKLESUrbanPlanLayer":
            if (dayuanKLESUrbanPlanLayer) {
                dayuanKLESUrbanPlanLayer.setMap(map);
            } else {
                dayuanKLESUrbanPlanLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/大園(果林地區)都市計畫_20191029.kml',
                    map: map
                });
            }
            break;
        case "THRTouyuanRainPipleLayer":
            if (THRTouyuanRainPipleLayer) {
                THRTouyuanRainPipleLayer.setMap(map);
            } else {
                THRTouyuanRainPipleLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/高速鐵路桃園車站特定區計畫_雨水竣工管線20200913.kml',
                    map: map
                });
                THRTouyuanRainPipleLayer.addListener("click", bindDownloadEvent);
            }
            break;
        case "THRTouyuanSPLayer":
            if (THRTouyuanSPLayer) {
                THRTouyuanSPLayer.setMap(map);
            } else {
                THRTouyuanSPLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/高速鐵路桃園車站特定區計畫_20191028.kml',
                    map: map
                });
            }
            break;
        case "dayuanUrbanPlanLayer":
            if (dayuanUrbanPlanLayer) {
                dayuanUrbanPlanLayer.setMap(map);
            } else {
                dayuanUrbanPlanLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/大園都市計畫_20191028.kml',
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
        case "dayuanUrbanPlanRainPipleLayer":
            if (dayuanUrbanPlanRainPipleLayer) {
                dayuanUrbanPlanRainPipleLayer.setMap(map);
            } else {
                dayuanUrbanPlanRainPipleLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/大園都市計畫_雨水竣工管線20200913.kml',
                    map: map
                });
                dayuanUrbanPlanRainPipleLayer.addListener("click", bindDownloadEvent);
            }
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
        case "dayuanUrbanPlanRainLayer":
            if (dayuanUrbanPlanRainLayer) {
                dayuanUrbanPlanRainLayer.setMap(map);
            } else {
                dayuanUrbanPlanRainLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/大園都市計畫-雨水竣工人孔20200915.kml',
                    map: map
                });
                dayuanUrbanPlanRainLayer.addListener("click", bindDownloadEvent);
            }
            _setLabels("大園都市計畫-雨水竣工人孔20200915.kml");
            break;
        case "dayuanKLESUrbanPlanRainPipleLayer":
            if (dayuanKLESUrbanPlanRainPipleLayer) {
                dayuanKLESUrbanPlanRainPipleLayer.setMap(map);
            } else {
                dayuanKLESUrbanPlanRainPipleLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/大園(果林地區)都市計畫_雨水竣工管線2020090801.kml',
                    map: map
                });
                dayuanKLESUrbanPlanRainPipleLayer.addListener("click", bindDownloadEvent);
            }
            break;
        case "dayuanKLESUrbanPlanRainLayer":
            sourceURL = 'https://' + hostIP + '/TechximDayuan/KMLData/大園(果林地區)都市計畫_雨水竣工人孔20200914.kml';
            if (dayuanKLESUrbanPlanRainLayer) {
                dayuanKLESUrbanPlanRainLayer.setMap(map);
            } else {
                dayuanKLESUrbanPlanRainLayer = new google.maps.KmlLayer({
                    url: sourceURL,
                    map: map
                });
                dayuanKLESUrbanPlanRainLayer.addListener("click", bindDownloadEvent);
            }
            _setLabels("大園(果林地區)都市計畫_雨水竣工人孔20200914.kml");
            break;
        case "THRTouyuanRainLayer":
            if (THRTouyuanRainLayer) {
                THRTouyuanRainLayer.setMap(map);
            } else {
                THRTouyuanRainLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/高速鐵路桃園車站特定區計畫_雨水竣工人孔20200915.kml',
                    map: map
                });
                THRTouyuanRainLayer.addListener("click", bindDownloadEvent);
            }
            _setLabels("高速鐵路桃園車站特定區計畫_雨水竣工人孔20200915.kml");
            break;
        case "dayuanAirPortSPLayer":
            if (dayuanAirPortSPLayer) {
                dayuanAirPortSPLayer.setMap(map);
            } else {
                dayuanAirPortSPLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_20191028.kml',
                    map: map
                });
            }
            break;
        case "dayuanAirPortSPRainPipleLayer":
            if (dayuanAirPortSPRainPipleLayer) {
                dayuanAirPortSPRainPipleLayer.setMap(map);
            } else {
                dayuanAirPortSPRainPipleLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_雨水竣工管線20200913.kml',
                    map: map
                });
                dayuanAirPortSPRainPipleLayer.addListener("click", bindDownloadEvent);
            }
            break;
        case "dayuanAirPortSPRainLayer":
            if (dayuanAirPortSPRainLayer) {
                dayuanAirPortSPRainLayer.setMap(map);
            } else {
                dayuanAirPortSPRainLayer = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_雨水竣工人孔20200914.kml',
                    map: map
                });
                dayuanAirPortSPRainLayer.addListener("click", bindDownloadEvent);
            }
            _setLabels("桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_雨水竣工人孔20200914.kml");
            break;
        case "otherDrainCleanLayer106":
            if (otherDrainCleanLayer106) {
                otherDrainCleanLayer106.setMap(map);
            } else {
                otherDrainCleanLayer106 = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/106大園區其他排水清淤路段20200831.kml',
                    map: map
                });
            }
            break;
        case "otherDrainCleanLayer107":
            if (otherDrainCleanLayer107) {
                otherDrainCleanLayer107.setMap(map);
            } else {
                otherDrainCleanLayer107 = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/107大園區其他排水清淤路段20200831.kml',
                    map: map
                });
            }
            break;
        case "otherDrainCleanLayer108":
            if (otherDrainCleanLayer108) {
                otherDrainCleanLayer108.setMap(map);
            } else {
                otherDrainCleanLayer108 = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/108大園區其他排水清淤20200831.kml',
                    map: map
                });
            }
            break;
        case "otherDrainCleanLayer109":
            if (otherDrainCleanLayer109) {
                otherDrainCleanLayer109.setMap(map);
            } else {
                otherDrainCleanLayer109 = new google.maps.KmlLayer({
                    url: 'https://' + hostIP + '/TechximDayuan/KMLData/109大園區其他排水清淤路段20200831.kml',
                    map: map
                });
            }
            break;
        default: return;

    }
}

function _setLabels(filePath) {
    $.ajax({
        url: '/TechximDayuan/KML/GetKML',
        type: "POST",
        data: { name: filePath },
        success: function (result) {
            if (result) {
                var labels = [];
                var lableContent = "";
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(result, "text/xml");
                var placemarks = xmlDoc.getElementsByTagName("Placemark");
                for (var k = 0; k < placemarks.length; k++) {
                    var placemark = placemarks[k];
                    var extendedDatas = placemark.getElementsByTagName("ExtendedData");
                    for (var i = 0; i < extendedDatas.length; i++) {
                        var extendedData = extendedDatas[i];
                        var datas = extendedData.getElementsByTagName("Data");
                        for (var j = 0; j < datas.length; j++) {
                            var data = datas[j];
                            if (data.getAttribute("name") == "人孔編號(大園區公所)") {
                                lableContent = data.getElementsByTagName("value")[0].innerHTML;
                                var coordinates = placemark.getElementsByTagName("coordinates")[0].innerHTML;
                                var coor = coordinates.split(",");

                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(coor[1], coor[0]),
                                    label: {
                                        text: lableContent,
                                        fontWeight: "bold"
                                    },
                                    icon: {
                                        path: google.maps.SymbolPath.CIRCLE,
                                        fillColor: '#00CCBB',
                                        fillOpacity: 1,
                                        strokeColor: '',
                                        strokeWeight: 0
                                    },
                                    map: map
                                });

                                marker.set("id", filePath);
                                //var val = marker.get("id");
                                labels.push(marker);
                            }
                        }
                    }
                }
                labelList.push(labels);
            }
        }
    });
}
// Removes the markers from the map, but keeps them in the array.
function _clearMarkers() {
    _setMapOnAll(null);
    markers = [];
}

// Sets the map on all markers in the array.
function _setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function _clearLabels(fileName) {
    _setMapOnAll(null);
    var found = false;
    var deleteTarget;
    for (var i = 0; i < labelList.length; i++) {
        var target = labelList[i];
        for (var j = 0; j < target.length; j++) {
            var label = target[j];
            var labelId = label.get("id");
            if (labelId == fileName) {
                label.setMap(null);
                found = true;
                deleteTarget = i;
            } else {
                break;
            }
        }
    }
    if (found) {
        labelList[deleteTarget] = [];
    }
    if (found) {
        var tempList = [];
        for (var i = 0; i < labelList.length; i++) {
            if (labelList[i].length > 0) {
                tempList.push(labelList[i]);
            }
        }
        labelList = tempList;
        tempList = [];
    }
}

function _formatInt(number, len) {
    var mask = "";
    var returnVal = "";
    for (var i = 0; i < len; i++) mask += "0";
    returnVal = mask + number;
    returnVal = returnVal.substr(returnVal.length - len, len);
    return returnVal;
}

function _parseJsonDate(jsonDate) {
    var offset = new Date().getTimezoneOffset() * 60000;
    var parts = /\/Date\((-?\d+)([+-]\d{2})?(\d{2})?.*/.exec(jsonDate);
    if (parts[2] == undefined) parts[2] = 0;
    if (parts[3] == undefined) parts[3] = 0;
    d = new Date(+parts[1] + offset + parts[2] * 3600000 + parts[3] * 60000);
    date = d.getDate() + 1;
    date = date < 10 ? "0" + date : date;
    mon = d.getMonth() + 1;
    mon = mon < 10 ? "0" + mon : mon;
    year = d.getFullYear();
    return (year + "/" + mon + "/" + date);
};

function _getStatusIconColor(improvementStatusName) {
    switch (improvementStatusName) {
        case "正常":
            return '#00AA00';
        case "計畫改善":
            return '#0000FF';
        case "注意改善":
            return '#FFFF00';
        case "立即改善":
            return '#FF0000';
        case "改善完成":
            return "#808080"
        default:
            return '#00AA00';
    }

}

function _resetConditionForMap() {
    $("#searchYears").val('').trigger('change');
    $("#LocalDrainingSitesList").val('').trigger('change');
    $("#inspectionType").val('').trigger('change');
    $("#InspectionFormList").val('').trigger('change');
    $("#ProtectSubjectList").val('').trigger('change');
    $("#ImprovementTypeList").val('').trigger('change');
    $("#inspectionSite").val('').trigger('change');
    _clearMarkers();
}