var pageIndex = 0;
var isDelete = false;
var targetIds = [];
var isDeleteAll = false;

$(document).ready(function () {
    jsGrid.locale("zh-tw");
    _initSelection();

    $('input.layerBtn').on('ifChecked', function (event) {
        var spanText = $(this).closest('li').find('span')[0].innerText;
        _addKMLLayerToMap(spanText, true);
    });

    $('input.layerBtn').on('ifUnchecked', function (event) {
        var spanText = $(this).closest('li').find('span')[0].innerText;
        _addKMLLayerToMap(spanText, false);
    });

    $('input.statusBtn').on('ifChecked', function (event) {
        var spanText = $(this).closest('li').find('span')[0].innerText;
        _showImprovementStatusData(spanText, true);
    });

    $('input.statusBtn').on('ifUnchecked', function (event) {
        var spanText = $(this).closest('li').find('span')[0].innerText;
        _showImprovementStatusData(spanText, false);
    });

    $('input.statusBtn').iCheck("check");

    function _initSelection() {
        for (var i = 0; i >= -3; i--) {
            var text = (new Date()).getFullYear() - 1911 + i;
            $("#searchYears").append($("<option></option>").attr("value", text).text(text));
        }

        $('#searchYears').select2({
            placeholder: '請選擇',
            width: '100%'
        });

        $('#LocalDrainingSitesList').select2({
            placeholder: '請選擇',
            width: '100%'
        });

        $('#inspectionType').select2({
            placeholder: '不限',
            width: '100%'
        });

        $('#InspectionFormList').select2({
            placeholder: '不限',
            width: '100%'
        });

        $('#ProtectSubjectList').select2({
            placeholder: '不限',
            width: '100%'
        });

        $('#ImprovementTypeList').select2({
            placeholder: '不限',
            width: '100%'
        });

        $('#inspectionSite').select2({
            placeholder: '不限',
            width: '100%'
        });
    }

    setTimeout(function () {
        _showLayerInMap(layverName[11]);
        _showLayerInMap(layverName[23]);
        $('#dayuanZoneChk').iCheck("check");
        $('#dayuanVillageZoneChk').iCheck("check");
    }, 1000);
});

var previousPoint = null;

$.fn.UseTooltip = function () {
    $(this).bind("plothover", function (event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;

                $("#tooltip").remove();

                var x = item.datapoint[0];
                var y = item.datapoint[1];

                console.log(x + "," + y);
                console.log(item.pageX + "," + item.pageY);

                _showTooltip(item.pageX, item.pageY,
                    "<strong>" + x + "</strong>" + "<br/>" + "<strong>" + y + "</strong> (" + item.series.label + ")");
            }
        }
        else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });
};

function _showProfile(inspectionId) {
    $.ajax({
        type: "POST",
        url: "/TechximDayuan/Inspection/ShowProfile",
        data: { 'inspectionId': inspectionId },
    }).done(function (data) {
        if (data.length > 2) {
            $("#imageList").hide();
            $("#flot-placeholder").show();
            var dataset = [
                {
                    label: "比例尺(1:100)",
                    data: data
                }
            ];
            var options = {
                series: {
                    lines: { show: true },
                    points: {
                        radius: 3,
                        show: true
                    }
                },
                grid: {
                    hoverable: true,
                    borderWidth: 3,
                    mouseActiveRadius: 50,
                    backgroundColor: { colors: ["#ffffff", "#EDF5FF"] },
                    axisMargin: 20
                }
            };
            $('#imageModal').modal('show');
            $('#modalHeader').text('斷面資料');
            $.plot($("#flot-placeholder"), dataset, options);
            $("#flot-placeholder").UseTooltip();
        } else {
            alert("查無斷面資料");
        }
    });
}

function _showTooltip(x, y, contents) {
    $('<div id="tooltip">' + contents + '</div>').css({
        position: 'absolute',
        zIndex: 9999,
        display: 'none',
        top: y + 5,
        left: x + 20,
        border: '2px solid #4572A7',
        padding: '2px',
        size: '10',
        'border-radius': '6px 6px 6px 6px',
        'background-color': '#fff',
        opacity: 0.80
    }).appendTo("body").fadeIn(200);
}

function _search() {
    $.blockUI({ message: '<h1><img src="../Images/loading.gif" />查詢中...</h1>' });
    $.ajax({
        type: "POST",
        url: "/TechximDayuan/Inspection/FindInspectionData",
        data: $("#conditionForm").serialize()
    }).done(function (data) {
        if (data.length > 0) {
            $('#pieChartBtn').show();
        } else {
            $('#pieChartBtn').hide();
        }
        inspectionData = data;
        _initGrid(data);
        _initDataForMap();
    }).always(function (msg) {
        $.unblockUI();
    });
}

function _initGrid(results) {
    $("#searchResults").jsGrid({
        width: "100%",
        height: 'auto',
        sorting: true,
        paging: true,
        multiselect: true,
        pageSize: 15,
        confirmDeleting: true,
        pagerFormat: "頁碼: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} of {pageCount} &nbsp; 總計 : {itemCount} 筆",
        deleteConfirm: "確認刪除此筆資料?",
        deleteButtonTooltip: "刪除資料",
        onRefreshed: function (args) {
            //If in grid data has beedn load then length will > 0
            if (args.grid.data.length) {
                //First find the {jsgrid-grid-body} to scroll the top
                var gridBody = $("#jsGrid").find('.jsgrid-grid-body');
                //fire the click event of first row to select first item.
                gridBody.find('.jsgrid-table tr:first-child').trigger('click');
                //scroll to top after click event fire
                gridBody.animate({
                    scrollTop: 0,
                    scrollLeft: 0
                }, 250);
            }
        },
        onPageChanged: function (args) {
            if (!isDelete) {
                pageIndex = $("#searchResults").jsGrid("option", "pageIndex");
                isDelete = false;
            }
            $("#selectAllCheckbox").prop("checked", false);
            isDeleteAll = false;
            targetIds = [];
        },
        data: results,
        fields: [
            {
                headerTemplate: function (e) {
                    return $("<input>").attr("type", "checkbox").attr("id", "selectAllCheckbox").on("change", function (target) {
                        if ($("#selectAllCheckbox").prop("checked")) {
                            $(".singleCheckbox").each(function () {
                                $(this).prop("checked", true);
                            });
                            isDeleteAll = true;
                            var allInspectionIds = $('.inspectionID');
                            for (var i = 0; i < allInspectionIds.length; i++) {
                                _addTargetIds(allInspectionIds[i].value);
                            }
                        } else {
                            $(".singleCheckbox").each(function () {
                                $(this).prop("checked", false);
                            });
                            isDeleteAll = false;
                            var allInspectionIds = $('.inspectionID');
                            for (var i = 0; i < allInspectionIds.length; i++) {
                                _removeTargetIds(allInspectionIds[i].value);
                            }
                        }
                    });
                },
                itemTemplate: function (e, item) {
                    return $("<input>").attr("type", "checkbox").attr("class", "singleCheckbox")
                        .on("change", { inspectionId: item.inspectionId }, function (target) {
                            if ($(this).prop("checked")) {
                                _addTargetIds(target.data.inspectionId);
                            } else {
                                _removeTargetIds(target.data.inspectionId)
                            }
                        });
                },
                align: "center",
                width: "3%",
                sorting: false
            },
            { name: "inspectionYear", type: "number", title: "年度", width: "5%" },
            { name: "inspectionId", type: "number", title: "編號", width: "10%" },
            { name: "localDrainingSite", type: "text", title: "區域排水名稱" },
            { name: "inspectionTypeName", type: "text", title: "檢查類別" },
            { name: "improvementStatusName", type: "text", title: "檢查結果" },
            {
                title: "燈號",
                itemTemplate: function (e, item) {
                    return "<div class='" + _getSight(item.improvementStatusName) + "' style='font-size : x-large;'>●</div>"
                        + "<input  type='hidden' class='inspectionID' value='" + item.inspectionId + "' />";
                }
            },
            {
                title: "斷面資料",
                itemTemplate: function (e, item) {
                    if (item.profilepath) {
                        return "<input type='button' class='btn btn-round btn-info' onclick='_showProfile(\"" + item.inspectionId + "\")' value='顯示'/>";
                    }
                }
            },
            {
                title: "下載",
                itemTemplate: function (e, item) {
                    var result = "<input type='button' class='btn btn-round btn-primary' onclick='_downloadOneWord(\"" + item.inspectionId + "\")' value='Word'/>"
                        + "<input type='button' class='btn btn-round btn-success'  onclick='_downloadOnePDF(\"" + item.inspectionId + "\")' value='PDF'/>";

                    if (item.relativefile) {
                        return result += "<input type='button' class='btn btn-round btn-info'  onclick='_downloadFile(\"" + item.inspectionId + "\")' value='相關檔案'/>";
                    } else {
                        return result;
                    }
                }
            }
        ]
    });
	$(".jsgrid-pager-container").show();
}

function _showPieChart(data) {
    $.blockUI({ message: '<h1><img src="../Images/loading.gif" />查詢中...</h1>' });
    $.ajax({
        type: "POST",
        url: "/TechximDayuan/Inspection/FindPieChartData",
        data: $("#conditionForm").serialize()
    }).done(function (response) {
        if (response.length > 0) {
            $("#imageList").hide();
            $("#flot-placeholder").show();
            var data = [];

            for (var i = 0; i < response.length; i++) {
                data[i] = {
                    label: response[i].StatusName,
                    data: response[i].Count
                }
            }

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

            $.plot($("#flot-placeholder"), data, options);

            $('#imageModal').modal('show');
            $('#modalHeader').text('圓餅圖');
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
            url: "/TechximDayuan/Inspection/DeleteAllInspectionIds",
            data: { inspectionIds: targetIds }
        }).done(function (data) {
            alert("刪除資料成功!");
            _search();

        });
    }
}

function _getSight(improvementStatusName) {
    switch (improvementStatusName) {
        case "計畫改善":
            return "improvement-sight-plan";
        case "注意改善":
            return "improvement-sight-warn";
        case "立即改善":
            return "improvement-sight-immediate";
        case "改善完成":
            return "improvement-sight-resolved";
        default: return "improvement-sight-normal";

    }
}

function _downloadOneWord(inspectionid) {
    var form = $('<form></form>');
    $(form).hide().attr('method', 'post').attr('action', "/TechximDayuan/Inspection/DownloadWord");
    $(form).attr('target', '_blank');
    var input = $('<input type="hidden" name=inspectionId value="' + inspectionid + '"/>');
    $(form).append(input);
    $(form).appendTo('body').submit();
}

function _downloadOnePDF(inspectionid) {
    var form = $('<form></form>');
    $(form).hide().attr('method', 'post').attr('action', "/TechximDayuan/Inspection/DownloadPDF");
    $(form).attr('target', '_blank');
    var input = $('<input type="hidden" name=inspectionId value="' + inspectionid + '"/>');
    $(form).append(input);
    $(form).appendTo('body').submit();
}

function _downloadFile(inspectionid) {
    var form = $('<form></form>');
    $(form).hide().attr('method', 'post').attr('action', "/TechximDayuan/Inspection/DownloadFile");
    $(form).attr('target', '_blank');
    var input = $('<input type="hidden" name=inspectionId value="' + inspectionid + '"/>');
    $(form).append(input);
    $(form).appendTo('body').submit();
}

function _downloadExcel() {
    //Download From Grid       
    var condition = $("#conditionForm").serialize();
    condition = decodeURIComponent(condition, true);
    var form = $('<form></form>');
    $(form).hide().attr('method', 'post').attr('action', "/TechximDayuan/Inspection/DownloadExcelByCondition");
    $(form).attr('target', '_blank');
    //$(form).append('<input type="hidden" id=inspectionId value=' + inspectionid + "'/");
    var input = $('<input type="hidden" name=condition value="' + condition + '"/>');
    $(form).append(input);
    $(form).appendTo('body').submit();
}

function _downloadPDF() {
    var condition = $("#conditionForm").serialize();
    if (condition == "") {
        condition += "OutputTypes=3";
    } else {
        condition += "&OutputTypes=3";
    }

    $.ajax({
        type: "POST",
        url: "/TechximDayuan/Inspection/BatchTransForm",
        data: condition
    }).done(function (data) {
        inspectionData = data;
        _initGrid(data);
        _initDataForMap();
        alert("已加入轉檔排程，結果請參考批次轉檔檢視頁面!");
    });
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
        $("#showMapBtn").hide();
        $("#showDataBtn").show();
    }
}

function _resetCondition() {
    $("#searchYears").val('').trigger('change');
    $("#LocalDrainingSitesList").val('').trigger('change');
    $("#inspectionType").val('').trigger('change');
    $("#InspectionFormList").val('').trigger('change');
    $("#ProtectSubjectList").val('').trigger('change');
    $("#ImprovementTypeList").val('').trigger('change');
    $("#inspectionSite").val('').trigger('change');
    _initGrid(null);
}