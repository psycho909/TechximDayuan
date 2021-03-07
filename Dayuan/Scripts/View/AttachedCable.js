var pageIndex = 1;
var isDelete = false;
var targetIds = [];
var isDeleteAll = false;

$(document).ready(function () {
    jsGrid.locale("zh-tw");
    _getFaultInfoList();

    for (var i = 0; i >= -3; i--) {
        var text = (new Date()).getFullYear() - 1911 + i;
        $("#SearchYears").append($("<option></option>").attr("value", text).text(text));
    }

    $('input.layerBtn').on('ifChecked', function (event) {        
		var spanText = $(this).closest('li').find('span')[0].innerText;
        _addKMLLayerToMap(spanText, "",true);
    });

    $('input.layerBtn').on('ifUnchecked', function (event) {
        var spanText = $(this).closest('li').find('span')[0].innerText;
        _addKMLLayerToMap(spanText, "", false);
    });

    $('input.rainLayerBtn').on('ifChecked', function (event) {
        var spanText = $(this).closest('li').find('span')[0].innerText;
        _addKMLLayerToMap(spanText, "rain",  true);
    });

    $('input.rainLayerBtn').on('ifUnchecked', function (event) {
        var spanText = $(this).closest('li').find('span')[0].innerText;
        _addKMLLayerToMap(spanText, "rain", false);
    });

    $('input.statusBtn').on('ifChecked', function (event) {
        var spanText = $(this).closest('li').find('span')[0].innerText;
        _setMapOnSelectedMarker(spanText, true);
    });

    $('input.statusBtn').on('ifUnchecked', function (event) {
        var spanText = $(this).closest('li').find('span')[0].innerText;
        _setMapOnSelectedMarker(spanText, false);
    });

    $('#SearchYears').select2({
        placeholder: '請選擇',
        width: '100%'
    });

    $('#SearchMonth').select2({
        placeholder: '請選擇',
        width: '100%'
    });

    $('#FaultInfoList').select2({
        placeholder: '請選擇',
        width: '100%'
    });

    $('#OpratorList').select2({
        placeholder: '不限',
        width: '100%'
    });

    $('#Results').select2({
        placeholder: '不限',
        width: '100%'
    });

    $('#StatusList').select2({
        placeholder: '不限',
        width: '100%'
    });

    $('#Type').select2({
        width: '100%'
    });

    _loadingLocalStorage();    
});

function _search(page) {
    _saveLocalStorage();
    $.blockUI({ message: '<h1><img src="../Images/loading.gif" />查詢中...</h1>' });
    $.ajax({
        type: "POST",
        url: "/TechximDayuan/Cable/FindByCondistion",
        data: $("#conditionForm").serialize()
    }).done(function (data) {
        _initGrid(data);
        if (page) {
            $("#searchResults").jsGrid("option", "pageIndex", page);
        }
        _initDataForMap();
    }).always(function (msg) {
        $.unblockUI();
    });
}

function _getFaultInfoList() {
    $.ajax({
        type: "GET",
        url: "/TechximDayuan/Cable/FindFaultInfo"
    }).done(function (results) {
        $("#FaultInformation").jsGrid({
            width: "100%",
            height: '250',

            sorting: true,
            paging: true,
            pageSize: 10,

            data: results,
            fields: [
                { name: "Id", type: "text", title: "代號", width: "15%" },
                { name: "Name", type: "text", title: "缺失原因", width: "85%" }
            ]
        });
    });
}

function _initGrid(results) {
    $("#searchResults").jsGrid({
        width: "100%",
        height: 'auto',
        pagerFormat: "頁碼: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} of {pageCount} &nbsp; 總計 : {itemCount} 筆",
        sorting: true,
        paging: true,
        pageSize: 10,
        data: results,
        onPageChanged: function (args) {
            pageIndex = $("#searchResults").jsGrid("option", "pageIndex");
            $("#selectAllCheckbox").prop("checked", false);
            isDeleteAll = false;
            targetIds = [];
        },
        fields: [
            {
                headerTemplate: function (e) {
                    return $("<input>").attr("type", "checkbox").attr("id", "selectAllCheckbox").on("change", function (target) {
                        if ($("#selectAllCheckbox").prop("checked")) {
                            $(".singleCheckbox").each(function () {
                                $(this).prop("checked", true);
                            });
                            isDeleteAll = true;
                            var Ids = $('.CableId');
                            for (var i = 0; i < Ids.length; i++) {
                                _addTargetIds(Ids[i].value);
                            }
                        } else {
                            $(".singleCheckbox").each(function () {
                                $(this).prop("checked", false);
                            });
                            isDeleteAll = false;
                            var Ids = $('.CableId');
                            for (var i = 0; i < Ids.length; i++) {
                                _removeTargetIds(Ids[i].value);
                            }
                        }
                    });
                },
                itemTemplate: function (e, item) {
                    return $("<input>").attr("type", "checkbox").attr("class", "singleCheckbox")
                        .on("change", { id: item.Id }, function (target) {
                            if ($(this).prop("checked")) {
                                _addTargetIds(target.data.id);
                            } else {
                                _removeTargetIds(target.data.id)
                            }
                        });
                },
                align: "center",
                width: "3%",
                sorting: false
            },
            {
                title: "編輯",
                width: "60px",
                itemTemplate: function (e, item) {
                    return "<input type='button' class='btn btn-round btn-info'  onclick='_editCableData(" + item.Id + ")' value='選擇'/>"
                        + "<input  type='hidden' class='CableId' value='" + item.Id + "' />";;
                }
            },
            { name: "RoadName", type: "number", title: "檢查道路", width: "5%" },
            { name: "Date", type: "text", title: "檢查日期", width: "5%" },
            { name: "Range", type: "text", title: "檢查範圍", width: "10%" },
            { name: "Type", type: "text", title: "附掛形式" },
            { name: "Operator", type: "text", title: "纜線業者" },
            { name: "FaultInfos", type: "text", title: "缺失" },
            {
                title: "辦理情形",
                width: "5%",
                itemTemplate: function (e, item) {
                    if (item.Status) {
                        return "<span class=" + _getCss(item.Status) + ">●</span>";
                    } else {
                        return "<span class=cable-stats-normal>●</span>";
                    }
                }
            },
            { name: "Result", type: "text", title: "檢查結果" },
            {
                title: "下載",
                itemTemplate: function (e, item) {
                    if (item.RelativeFile) {
                        return "<input type='button' class='btn btn-default'  onclick='_downloadFile(\"" + item.Id + "\")' value='相關檔案'/>";
                    }
                }
            }
        ]
    });
	$(".jsgrid-pager-container").show();
}

function _showPieChart(type) {
    $.blockUI({ message: '<h1><img src="/Images/loading.gif" />查詢中...</h1>' });
    $.ajax({
        type: "POST",
        url: "/TechximDayuan/Cable/FindByCondistionForPieChart",
        data: { condition: $("#conditionForm").serialize(), type: type }
    }).done(function (response) {
        if (response.length > 0) {
            $("#imageContent").hide();
            $("#flot-placeholder").show();

            var options = {
                series: {
                    pie: {
                        show: true,
                    }
                },
                legend: {
                    show: false
                }
            };

            $.plot($("#flot-placeholder"), response, options);

            $('#imageModal').modal('show');
            $('#imageModalTitle').text('圓餅圖');
        }
    }).always(function (msg) {
        $.unblockUI();
    });
}
function _addTargetIds(inspectionId) {
    if (!targetIds.includes(inspectionId)) {
        targetIds.push(inspectionId);
    }
}

function _removeTargetIds(inspectionId) {
    var index = targetIds.indexOf(inspectionId);
    targetIds.splice(index, 1);
}

function _deleteAllSelected() {
    if (confirm('是否刪除所勾選的資料?')) {
        $.ajax({
            type: "POST",
            url: "/TechximDayuan/Cable/DeleteCableIds",
            data: { Ids: targetIds }
        }).done(function (data) {
            alert("刪除資料成功!");
            _search(pageIndex);
        });
    }
}

function _getCss(result) {
    if (result == "正常") {
        return "cable-stats-normal";
    } else if (result == "已通知改善") {
        return "cable-stats-noticedImproments"
    } else if (result == "列管中") {
        return "cable-stats-restrict"
    } else if (result == "已改善完成") {
        return "cable-stats-impromented"
    } else {
        return "cable-stats-noData";
    }
}

function _resetCondition() {
    $("#SearchYears").val('').trigger('change');
    $("#SearchMonth").val('').trigger('change');
    $("#FaultInfoList").val('').trigger('change');
    $("#OpratorList").val('').trigger('change');
    $("#Results").val('').trigger('change');
    $("#StatusList").val('').trigger('change');
    _initGrid(null);
}

function _switchDisplayType() {
    if ($("#searchResults").is(":hidden")) {
        $("#searchResults").show();
        $("#resultMap").hide();
        $("#showMapBtn").show();
        $("#showDataBtn").hide();
    } else {
        $("#searchResults").hide();
        $("#resultMap").show();
        setTimeout(function () {
            _showLayerInMap(layerName[11]);
            _showLayerInMap(layerName[12]);
            $('#dayuanZoneChk').iCheck("check");
            $('#dayuanVillageZoneChk').iCheck("check");
        }, 1000);
        $("#showMapBtn").hide();
        $("#showDataBtn").show();
    }
}

function _downloadFile(id) {
    var form = $('<form></form>');
    $(form).hide().attr('method', 'post').attr('action', "/TechximDayuan/Cable/DownloadFile");
    $(form).attr('target', '_blank');
    var input = $('<input type="hidden" name=id value="' + id + '"/>');
    $(form).append(input);
    $(form).appendTo('body').submit();
}

function _loadingLocalStorage() {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        var condition = localStorage.getItem("searchCondition");
        if (condition) {
            condition = decodeURIComponent(condition, true)
            var conditionSplit = condition.split("&");
            var length = conditionSplit.length;
            for (var i = 0; i < length; i++) {
                var conditionTarget = conditionSplit[i].split("=");
                _putInSelection(conditionTarget);
            }
        }
        urlParams = new URLSearchParams(window.location.search);
        myParam = urlParams.get('page');
        if (myParam || parseInt(myParam) > 1) {
            _search(myParam);
        }
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

function _saveLocalStorage() {
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("searchCondition", $("#conditionForm").serialize());
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

function _putInSelection(conditionTarget) {
    var oldValue = [];
    if (!$('#' + conditionTarget[0]).val() == null || !$('#' + conditionTarget[0]).val() == '') {
        oldValue = $('#' + conditionTarget[0]).val();
    }
    if (Array.isArray(oldValue)) {
        oldValue.push(conditionTarget[1]);
    }

    $('#' + conditionTarget[0]).val(oldValue);
    $('#' + conditionTarget[0]).trigger('change');
}

function _editCableData(id) {
    window.location.href = "/TechximDayuan/Cable/EditCableInspection?id=" + id + "&page=" + pageIndex;
}