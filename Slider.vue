<template>
    <div class="flex-col menu-wrap">
        <div class="nav toggle menu__toggle">
            <a id="menu_toggle" class="menu__btn"></a>
        </div>
        <div class="scroll-view menu__list-wrap">
            <!-- sidebar menu -->
            <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
                <div class="menu_section">
                    <ul class="nav side-menu">
                        <li>
                            <a class="menu__link"><span class="icon-water"></span></i> 排水 <span class="icon-slide"></span></a>
                            <ul class="nav child_menu">
                                <li><a href="/Home/Index">排水檢視</a></li>
                                <li><a href="/FileConverter/UploadFile">排水資料上傳</a></li>
                            </ul>
                        </li>
                        <li>
                            <a class="menu__link"><span class="icon-cable"></span> 纜線 <span class="icon-slide"></span></a>
                            <ul class="nav child_menu">
                                <li><a href="/Cable/AttachedCable">纜線檢視</a></li>
                                <li><a href="/FileConverter/UploadCableFile">纜線資料上傳</a></li>
                            </ul>
                        </li>
                        <li><a class="menu__link" href="/ConverterResult/BatchDownloadSchedule"><span class="icon-downloadview"></span>批次下載排程檢視</a></li>
                        <li><a class="menu__link" href="/ConverterResult/ConvertFileSchedule"><span class="icon-uploadview"></span>資料上傳轉檔排程檢視</a></li>
                    </ul>
                </div>
            </div>
            <!-- /sidebar menu -->
            <!-- /menu footer buttons -->
            <div class="sidebar-footer hidden-small">
            </div>
            <!-- /menu footer buttons -->
        </div>
    </div>
</template>

<script>
module.exports={

}
</script>