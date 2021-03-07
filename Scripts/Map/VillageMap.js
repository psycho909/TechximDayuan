function _setVillageLabels(filePath) {
    if (villageLabelList.length > 0) {
        _setMapOnAll(null);
        for (var i = 0; i < villageLabelList.length; i++) {
            villageLabelList[i].setMap(map);
        }
    } else {
        $.ajax({
            url: '/TechximDayuan/KML/GetKML',
            type: "POST",
            data: { name: filePath },
            success: function (result) {
                if (result) {
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
                                if (data.getAttribute("name") == "村里界") {
                                    lableContent = data.getElementsByTagName("value")[0].innerHTML;
                                    var req = /\s+/g;
                                    var coordinates = placemark.getElementsByTagName("coordinates")[0].innerHTML.trim().replace(req, ',');
                                    var coor = coordinates.split(",0,");
                                    const polygonCoords = [];

                                    for (var i = 0; i < coor.length; i++) {
                                        var coorstr = coor[i];
                                        var targetcor = coorstr.split(",");
                                        polygonCoords.push(new google.maps.LatLng(targetcor[1], targetcor[0]));
                                    }
                                    var bounds = new google.maps.LatLngBounds();
                                    for (i = 0; i < polygonCoords.length; i++) {
                                        bounds.extend(polygonCoords[i]);
                                    }

                                    var marker = new google.maps.Marker({
                                        label: {
                                            text: lableContent,
                                            fontWeight: "bold",
                                            color: "black"
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

                                    if (lableContent == "田心里") {										
                                         var	nwLng = polygonCoords[0].lng() + 0.006;						
                                        marker.setPosition(new google.maps.LatLng(polygonCoords[0].lat(), nwLng ));
                                    } else if (lableContent == "竹圍里") {										
                                         var	nwLat = polygonCoords[0].lat() - 0.004;						
                                        marker.setPosition(new google.maps.LatLng(nwLat, polygonCoords[0].lng() ));
                                    } else {
                                        marker.setPosition(bounds.getCenter());
                                    }

                                   

                                    marker.set("id", filePath);
                                    //var val = marker.get("id");
                                    villageLabelList.push(marker);
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}

function _clearVillageLabels() {
    for (var i = 0; i < villageLabelList.length; i++) {
        var label = villageLabelList[i];
        label.setMap(null);
    }
}