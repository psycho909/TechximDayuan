$(".area-toggle__btn").on("click",function(){
    if($(".area-panel").length){
        $(".area-panel").toggleClass("hide")
    }
    if($(".fault-panel").length){
        $(".fault-panel").toggleClass("hide")
    }
})

// 修改
/*
function _switchDisplayType() {
    if ($(".searchResults-box").is(":hidden")) {
        $(".searchResults-box").show();
        $("#resultMap").hide();
        $("#showMapBtn").show();
        $("#showDataBtn").hide();
    } else {
        $(".searchResults-box").hide();
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
*/