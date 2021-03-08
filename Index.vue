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

        <!-- 選單區 -->
        <div class="main-select-wrap x_panel init-panel">
            <div class="main-title">
                <h2>排水檢測查詢</h2>
                <ul class="nav navbar-right panel_toolbox">
                    <li>
                        <a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                    </li>
                </ul>
            </div>
            <div class="x_content init-content">
                <form id="conditionForm" class="form-wrap">
                    <div class="form-panel">
                        <div class="form-col form-col--100">
                            <label class="form-label" for="LocalDrainingSitesList">排水名稱</label>
                            <div class="form-box">
                                <select id="LocalDrainingSitesList" multiple="multiple" name="LocalDrainingSitesList"><option value="177">177埔心街支線</option>
                                    <option value="178">178瓦窯溝排水分線</option>
                                    <option value="179">179許厝港排水</option>
                                    <option value="180">180塔腳支線排水</option>
                                    <option value="181">181崙子坪支線</option>
                                    <option value="182">182潮音北路支線</option>
                                    <option value="183">183瓦窯溝排水支線</option>
                                    <option value="184">184果林排水</option>
                                    <option value="185">185果林排水支線</option>
                                    <option value="186">186中華路支線</option>
                                    <option value="187">187機場支線</option>
                                    <option value="188">188軍機場支線</option>
                                    <option value="189">189大園海霸王支線</option>
                                    <option value="190">190連勝停車場支線</option>
                                    <option value="191">191溪海路支線</option>
                                    <option value="192">192和平分線支流</option>
                                    <option value="193">193和東路支線</option>
                                    <option value="194">194雙溪口溪支線</option>
                                    <option value="195">195洽溪支線</option>
                                </select>
                            </div> 
                        </div> 
                        <div class="form-col">
                            <label class="form-label" for="searchYears">年度</label>
                            <div class="form-box">
                                <select id="searchYears" name="searchYears" multiple="multiple"></select>
                            </div>  
                        </div> 

                        <div class="form-col">
                            <label for="inspectionType" class="form-label">檢查類別</label>
                            <div class="form-box">
                                <select id="inspectionType" name="inspectionType" multiple="multiple">
                                    <option value="1">定期</option>
                                    <option value="2">不定期</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-col">
                            <label class="form-label" for="InspectionFormList">護岸型式</label>
                            <div class="form-box">
                                <select id="InspectionFormList" multiple="multiple" name="InspectionFormList">
                                    <option value="1">土堤</option>
                                    <option value="2">石籠護岸</option>
                                    <option value="3">混合式</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-col">
                            <label class="form-label" for="ProtectSubjectList">保全對象</label>
                            <div class="form-box">
                                <select id="ProtectSubjectList" multiple="multiple" name="ProtectSubjectList"><option value="1">社區部落</option>
                                    <option value="2">工廠學校</option>
                                    <option value="4">農田原野</option>
                                    <option value="6">其他</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-col">
                            <label class="form-label" for="ImprovementTypeList">改善分類</label>
                            <div class="form-box">
                                <select id="ImprovementTypeList" multiple="multiple" name="ImprovementTypeList"><option value="1">正常</option>
                                    <option value="2">計畫改善</option>
                                    <option value="3">注意改善</option>
                                    <option value="4">立即改善</option>
                                    <option value="5">改善後正常</option>
                                    <option value="6">無</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-col">
                            <label class="form-label" for="inspectionSite">左/右岸</label>
                            <div class="form-box">
                                <select id="inspectionSite" name="inspectionSite" multiple="multiple">
                                    <option value="2">左岸</option>
                                    <option value="1">右岸</option>
                                </select>
                            </div>
                        </div>

                        <!-- <div class="ln_solid"></div> -->
                        <div class="form-btn-group">
                            <button id="showDataBtn" type="button" class="btn btn-view btn-size--md" onclick="_switchDisplayType()">
                                <span class="icon-view"></span>
                                資料檢示
                            </button>
                            <button id="showMapBtn" type="button" style="display: none;" class="btn btn-map btn-size--md" onclick="_switchDisplayType()">
                                <span class="icon-map"></span>
                                地圖檢示
                            </button>
                            <button type="button" onclick="_search()" class="btn btn-search btn-size--md">
                                <span class="icon-search"></span>
                                資料查詢
                            </button>
                            <button id="resetBtn" type="button" class="btn btn-reload btn-size--md" onclick="_resetCondition()">
                                <span class="icon-reload"></span>
                                條件重設
                            </button>
                        </div>
                    </div>

                    <div class="form-btn-group form-btn-panel">
                        <button type="button" class="btn btn-pie btn-size--sm" id="pieChartBtn" onclick="_showPieChart()">
                            <span class="icon-pie"></span>
                            圓餅圖分析
                        </button>
                        <button type="button" class="btn btn-pdf btn-size--sm" id="pdfChk" onclick="_downloadPDF()">
                            <span class="icon-pdf"></span>
                            PDF
                        </button>
                        <button type="button" class="btn btn-excel btn-size--sm" id="wordChk" onclick="_downloadExcel()">
                            <span class="icon-excel"></span>
                            Excel
                        </button>
                        <button type="button" class="btn btn-del btn-size--sm" id="deleteAllSelected" onclick="_deleteAllSelected()">
                            <span class="icon-del"></span>
                            刪除勾選
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 資料表顯示 -->
        <div id="searchResults" class="x_panel jsgrid data-panel Index-table" style="max-width: 1650px; min-height: 800px; position: relative; height: auto; width: 1385px;">
            <!-- 資料表標題 -->
            <div class="jsgrid-grid-header jsgrid-header-scrollbar">
                <table class="jsgrid-table">
                    <tbody>
                        <tr class="jsgrid-header-row">
                            <th class="jsgrid-header-cell jsgrid-align-center" style="width: 3%;">
                                <input type="checkbox" id="selectAllCheckbox">
                            </th>
                            <th class="jsgrid-header-cell jsgrid-align-right jsgrid-header-sortable" style="width: 5%;">年度</th>
                            <th class="jsgrid-header-cell jsgrid-align-right jsgrid-header-sortable" style="width: 10%;">編號</th>
                            <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">排水名稱</th>
                            <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">類別</th>
                            <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">結果</th>
                            <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">燈號</th>
                            <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">斷面資料</th>
                            <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">下載</th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 資料表內容 -->
            <div class="jsgrid-grid-body">
                <table class="jsgrid-table">
                    <tbody>
                        <tr :class="[n%2 == 1?'jsgrid-row':'jsgrid-alt-row']" v-for="n in 15">
                            <td class="jsgrid-cell jsgrid-align-center" style="width: 3%;">
                                <input type="checkbox" class="singleCheckbox">
                            </td>
                            <td class="jsgrid-cell jsgrid-align-right" style="width: 5%;">107</td>
                            <td class="jsgrid-cell jsgrid-align-right" style="width: 10%;">107-02-178-00K000-L-01</td>
                            <td class="jsgrid-cell" style="width: 100px;">瓦窯溝排水分線</td>
                            <td class="jsgrid-cell" style="width: 100px;">定期</td>
                            <td class="jsgrid-cell" style="width: 100px;">正常</td>
                            <td class="jsgrid-cell" style="width: 100px;">
                                <div class="improvement-sight-normal" style="font-size : x-large;">●</div>
                                <input type="hidden" class="inspectionID" value="107-02-178-00K000-L-01">
                            </td>
                            <td class="jsgrid-cell" style="width: 100px;">
                                <input type="button" class="btn btn-round btn-info" onclick="_showProfile(&quot;108-02-181-00K364-L-01&quot;)" value="顯示">
                            </td>
                            <td class="jsgrid-cell" style="width: 100px;">
                                <button type="button" class="btn icon-wordc btn-icon" onclick="_downloadOneWord(&quot;107-02-178-00K000-L-01&quot;)">
                                    Word
                                </button>
                                <button type="button" class="btn icon-pdfc btn-icon" onclick="_downloadOnePDF(&quot;107-02-178-00K000-L-01&quot;)">
                                    PDF
                                </button>
                            </tr>
                    </tbody>
                </table>
            </div>
            <div class="jsgrid-pager-container"><div class="jsgrid-pager">頁碼: <span class="jsgrid-pager-nav-button jsgrid-pager-nav-inactive-button"><a href="javascript:void(0);">第一頁</a></span> <span class="jsgrid-pager-nav-button jsgrid-pager-nav-inactive-button"><a href="javascript:void(0);">上一頁</a></span> <span class="jsgrid-pager-page jsgrid-pager-current-page">1</span><span class="jsgrid-pager-page"><a href="javascript:void(0);">2</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">3</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">4</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">5</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">6</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">7</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">8</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">9</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">10</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">11</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">12</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">13</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">14</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">15</a></span><span class="jsgrid-pager-nav-button"><a href="javascript:void(0);">...</a></span> <span class="jsgrid-pager-nav-button"><a href="javascript:void(0);">下一頁</a></span> <span class="jsgrid-pager-nav-button"><a href="javascript:void(0);">最後一頁</a></span> &nbsp;&nbsp; 1 of 82 &nbsp; 總計 : 1217 筆 </div></div>
            <div class="jsgrid-load-shader" style="display: none; position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; z-index: 1000;"></div>
            <div class="jsgrid-load-panel" style="display: none; position: absolute; top: 50%; left: 50%; z-index: 1000;">請稍候...</div>
        </div>
        <!-- 地圖圖表顯示 -->
        <div id="resultMap" class="x_panel map-container" style="display: none;">
            <div id="mapDiv" class="map-panel">
                <div id="map" style="min-height:800px; height:100%"></div>
            </div>
            <div class="area-panel" id="collapseLayers">
                <div class="area-toggle">
                    <a href="javascript:;" class="area-toggle__btn">按鈕</a>
                </div>
                <div class="x_panel init-panel">
                    <ul class="to_do">
                        <li class="to_do-box">
                            <div class="to_do-group">
                                <label class="to_do-label">
                                    <input type="checkbox" id="dayuanZoneChk" class="flat layerBtn">
                                    <span>大園區區界</span>
                                </label>
                                <span style="background-color: #DDAE2E;">■</span>
                            </div>
                            <div class="to_do-group">
                                <label class="to_do-label">
                                    <input type="checkbox" id="dayuanVillageZoneChk" class="flat layerBtn">
                                    <span>大園村里界</span>
                                </label>
                                <span style="background-color: #D2B414;">■</span>
                            </div>
                            <div class="to_do-group">
                                <label class="to_do-label">
                                    <input type="checkbox" class="flat layerBtn">
                                    <span>其他排水圖資</span>
                                </label>
                                <span style="background-color: #369CFF;">■</span>
                            </div>
                            <div class="to_do-group">
                                <label class="to_do-label">
                                    <input type="checkbox" class="flat layerBtn">
                                    <span>河川圖資</span>
                                </label>
                                <span style="background-color: #F00014;">■</span>
                            </div>
                        </li>                            
                        <li class="to_do-box-wrap">
                            <label>
                                <input type="checkbox" class="flat layerBtn">
                                <span>排水</span>
                            </label>
                            <div class="to_do-box">
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn drainLayer">
                                        <span>公告區域排水圖資</span>
                                    </label>
                                    <span style="background-color: green;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn drainLayer">
                                        <span>非公告區域排水圖資</span>
                                    </label>
                                    <span style="background-color:darkgreen;">■</span>
                                </div>
                            </div>
                        </li>
                        <li class="to_do-box-wrap">
                            <label>
                                <input type="checkbox" class="flat layerBtn">
                                <span>雨水竣工人孔</span>
                            </label>
                            <div class="to_do-box">
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn rainLayer">
                                        <span>大園都市計畫_雨水竣工人孔</span>
                                    </label>
                                    <span style="background-color: #FF80C8;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn rainLayer">
                                        <span>大園(果林地區)都市計畫_雨水竣工人孔</span>
                                    </label>
                                    <span style="background-color: #bcb276;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn rainLayer">
                                        <span>高速鐵路桃園車站特定區計畫_雨水竣工人孔</span>
                                    </label>
                                    <span style="background-color: #c07a52;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn rainLayer">
                                        <span>桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_雨水竣工人孔</span>
                                    </label>
                                    <span style="background-color: #bcdabc;">■</span>
                                </div>
                            </div>
                        </li>
                        <li class="to_do-box-wrap">
                            <label>
                                <input type="checkbox" class="flat layerBtn">
                                <span>雨水竣工管線</span>
                            </label>
                            <div class="to_do-box">
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn pipleLayer">
                                        <span>大園都市計畫_雨水竣工管線</span>
                                    </label>
                                    <span style="background-color: #FF8050;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn pipleLayer">
                                        <span>大園(果林地區)都市計畫_雨水竣工管線</span>
                                    </label>
                                    <span style="background-color: #bc6276;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn pipleLayer">
                                        <span>高速鐵路桃園車站特定區計畫_雨水竣工管線</span>
                                    </label>
                                    <span style="background-color: #80ffff;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn pipleLayer">
                                        <span>桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫_雨水竣工管線</span>
                                    </label>
                                    <span style="background-color: #bcdabc;">■</span>
                                </div>
                            </div>
                        </li>
                        <li class="to_do-box-wrap">
                            <label>
                                <input type="checkbox" class="flat layerBtn">
                                <span>其他排水清淤圖資</span>
                            </label>
                            <div class="to_do-box">
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn otherLayer">
                                        <span>106其他排水清淤圖資</span>
                                    </label>
                                    <span style="background-color: #F07814;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn otherLayer">
                                        <span>107其他排水清淤圖資</span>
                                    </label>
                                    <span style="background-color: #FF7864;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn otherLayer">
                                        <span>108其他排水清淤圖資</span>
                                    </label>
                                    <span style="background-color: #F07800;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn otherLayer">
                                        <span>109其他排水清淤圖資</span>
                                    </label>
                                    <span style="background-color:#FF7878;">■</span>
                                </div>
                            </div>
                        </li>
                        <li class="to_do-box-wrap">
                            <label>
                                <input type="checkbox" class="flat layerBtn">
                                <span>都市計畫</span>
                            </label>
                            <div class="to_do-box">
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn urbanPlanLayer">
                                        <span>大園都市計畫</span>
                                    </label>
                                    <span style="background-color: #FF8000;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn urbanPlanLayer">
                                        <span>大園(果林地區)都市計畫</span>
                                    </label>
                                    <span style="background-color: #c066c0;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn urbanPlanLayer">
                                        <span>高速鐵路桃園車站特定區計畫</span>
                                    </label>
                                    <span style="background-color: #989fd4;">■</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn urbanPlanLayer">
                                        <span>桃園航空城貨運園區暨客貨園區(大園南港地區)特定區計畫</span>
                                    </label>
                                    <span style="background-color: #bcda76;">■</span>
                                </div>
                            </div>
                        </li>
                        <li class="to_do-box-wrap">
                            <label>
                                <input type="checkbox" class="flat statusBtn">
                                <span>呈現檢查結果</span>
                            </label>
                            <div class="to_do-box">
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat statusBtn">
                                        <span>正常</span>
                                    </label>
                                    <span style="background-color: green;border-radius:50%;">●</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat statusBtn">
                                        <span>計畫改善</span>
                                    </label>
                                    <span style="background-color: blue;border-radius:50%;">●</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat statusBtn">
                                        <span>注意改善</span>
                                    </label>
                                    <span style="background-color: yellow;border-radius:50%;">●</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat statusBtn">
                                        <span>立即改善</span>
                                    </label>
                                    <span style="background-color: red;border-radius:50%;">●</span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat statusBtn">
                                        <span>改善後正常</span>
                                    </label>
                                    <span style="background-color: grey;border-radius:50%;">●</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div id="imageModal" class="modal hide fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="modalHeader">Modal title</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div id="modalBody" class="modal-body">
                        <div id="flot-placeholder" style="width:500px;height:350px"></div>
                        <div id="imageList" />
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">關閉</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>