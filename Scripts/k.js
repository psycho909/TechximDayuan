$(".area-toggle__btn").on("click",function(){
    if($(".area-panel").length){
        $(".area-panel").toggleClass("hide")
    }
    if($(".fault-panel").length){
        $(".fault-panel").toggleClass("hide")
    }
})