<template>
    <div class="main-wrap" role="main">
        <!-- 大園區水利工程及災害防汛資訊系統 -->
        <div class="top_nav">
            <div class="nav_menu">
                <nav class="nav navbar-nav">
                    <ul class="navbar-right">
                        <li class="nav-item">
                            <img src="/Images/LOGO.png" style="width:30pt; height:30pt " />
                        </li>
                        <li class="nav-item">
                            <h3>大園區水利工程及災害防汛資訊系統</h3>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="x_panel init-panel">
            <div class="main-title">
                <h2>資料上傳轉檔排程檢視</h2>
                <ul class="nav navbar-right panel_toolbox">
                    <li>
                        <a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                    </li>
                </ul>
            </div>

            <div class="x_content init-content">
                <div id="convertedResults" class="jsgrid data-panel ConvertFileSchedule-table" style="position: relative; height: auto; width: 100%;">
                    <div class="jsgrid-grid-header jsgrid-header-scrollbar">
                        <table class="jsgrid-table">
                            <tbody>
                                <tr class="jsgrid-header-row">
                                    <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">轉檔狀態</th>
                                    <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">開始時間</th>
                                    <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">結束時間</th>
                                    <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">轉檔狀態</th>
                                    <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">轉檔狀態</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="jsgrid-grid-body">
                        <table class="jsgrid-table">
                            <tbody>
                                <tr :class="[n%2 == 1?'jsgrid-row':'jsgrid-alt-row']" v-for="n in 15">
                                    <td class="jsgrid-cell" style="width: 100px;">110年2月.zip</td>
                                    <td class="jsgrid-cell" style="width: 100px;">2021/2/2 上午 11:46:09</td>
                                    <td class="jsgrid-cell" style="width: 100px;">2021/2/2 上午 11:46:11</td>
                                    <td class="jsgrid-cell" style="width: 100px;">附掛纜線</td>
                                    <td class="jsgrid-cell" style="width: 100px;">ConvertSuccess</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="jsgrid-pager-container"><div class="jsgrid-pager">Pages: <span class="jsgrid-pager-nav-button jsgrid-pager-nav-inactive-button"><a href="javascript:void(0);">First</a></span> <span class="jsgrid-pager-nav-button jsgrid-pager-nav-inactive-button"><a href="javascript:void(0);">Prev</a></span> <span class="jsgrid-pager-page jsgrid-pager-current-page">1</span><span class="jsgrid-pager-page"><a href="javascript:void(0);">2</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">3</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">4</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">5</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">6</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">7</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">8</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">9</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">10</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">11</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">12</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">13</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">14</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">15</a></span><span class="jsgrid-pager-nav-button"><a href="javascript:void(0);">...</a></span> <span class="jsgrid-pager-nav-button"><a href="javascript:void(0);">Next</a></span> <span class="jsgrid-pager-nav-button"><a href="javascript:void(0);">Last</a></span> &nbsp;&nbsp; 1 of 26 </div></div><div class="jsgrid-load-shader" style="display: none; position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; z-index: 1000;"></div><div class="jsgrid-load-panel" style="display: none; position: absolute; top: 50%; left: 50%; z-index: 1000;">Please, wait...</div></div>
            </div>
        </div>
    </div>
</template>
