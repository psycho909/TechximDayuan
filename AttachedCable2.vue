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
                <h2>纜線檢測查詢</h2>
                <ul class="nav navbar-right panel_toolbox">
                    <li>
                        <a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                    </li>
                </ul>
            </div>
            <div class="x_content init-content">
                <form id="conditionForm" class="form-wrap">
                    <div class="form-panel">
                        <div class="form-col">
                            <label class="form-label" for="SearchYears">年度</label>
                            <div class="form-box">
                                <select id="SearchYears" name="SearchYears" multiple="multiple"></select>
                            </div>
                        </div>
                        <div class="form-col">
                            <label class="form-label" for="SearchMonth">月份</label>
                            <div class="form-box">
                                <select id="SearchMonth" name="SearchMonth" multiple="multiple">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-col">
                            <label class="form-label" for="Type">附掛形式</label>
                            <div class="form-box">
                                <select id="Type" name="Type">
                                    <option value="0">不限</option>
                                    <option value="1">道路側溝</option>
                                    <option value="2">雨水下水道</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-col">
                            <label class="form-label" for="StatusList">辦理情形</label>
                            <div class="form-box">
                                <select id="StatusList" multiple="multiple" name="StatusList"><option value="正常">正常</option>
                                    <option value="已通知改善">已通知改善</option>
                                    <option value="列管中">列管中</option>
                                    <option value="已改善完成">已改善完成</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-col">
                            <label class="form-label" for="OpratorList">纜線業者</label>
                            <div class="form-box">
                                <select id="OpratorList" multiple="multiple" name="OpratorList"><option value="0">無纜線</option>
                                    <option value="1">北桃園</option>
                                    <option value="2">北健</option>
                                    <option value="3">佳光</option>
                                    <option value="4">台灣固網</option>
                                    <option value="5">新世紀</option>
                                    <option value="6">亞太</option>
                                    <option value="7">南桃園</option>
                                    <option value="8">未知</option>
                                    <option value="9">警用纜線</option>
                                    <option value="10">軍用纜線</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-col">
                            <label class="form-label" for="Results">檢查結果</label>
                            <div class="form-box">
                                <select id="Results" name="Results" multiple="multiple">
                                    <option value="false">不符合</option>
                                    <option value="true">符合</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-col form-col--100">
                            <label for="FaultInfoList" class="form-label"><label for="">缺失</label></label>
                            <div class="form-box">
                                <select id="FaultInfoList" multiple="multiple" name="FaultInfoList"><option value="A">A - 擅自暫掛纜線</option>
                                    <option value="B">B - 影響排水設施、妨礙排水之虞者</option>
                                    <option value="C">C - 暫掛纜線除連接管外，至少每5公尺或纜線轉折點處，應以不銹鋼膨脹螺絲及線夾固定，固定前須使用緊線器拉緊纜線，且不得影響結構體承載強度</option>
                                    <option value="D">D - 暫掛纜線未緊貼壁體釘掛而懸空，未佈設於出水高度內或側溝蓋版底20公分內或未依規定位置設置者</option>
                                    <option value="E">E - 暫掛纜線有垂落者</option>
                                    <option value="F">F - 暫掛纜線未依規定標示業者名稱及電話者</option>
                                    <option value="G">G - 纜線橫越箱涵、管涵或人孔等情形者</option>
                                    <option value="H">H - 其他</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-btn-group">
                            <button id="showDataBtn" type="button" class="btn btn-info" onclick="_switchDisplayType()">
                                <span class="icon-view"></span>
                                資料檢示
                            </button>
                            <button id="showMapBtn" type="button" class="btn btn-info" onclick="_switchDisplayType()" style="display: none;">
                                <span class="icon-map"></span>
                                地圖檢示
                            </button>
                            <a class="btn btn-info" onclick="_saveLocalStorage()" href="/TechximDayuan/Cable/NewCableInspection">
                                <span class="icon-add"></span>
                                新增
                            </a>
                            <button type="button" onclick="_search()" class="btn btn-primary">
                                <span class="icon-search"></span>
                                資料查詢
                            </button>
                            <button id="resetBtn" type="button" class="btn btn-warning" onclick="_resetCondition()">
                                <span class="icon-reload"></span>
                                條件重設
                            </button>
                            
                        </div>
                    </div>
                    <div class="form-btn-group form-btn-panel">
                        <div class="dropdown-btn">
                            <button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="icon-view"></span>
                                圓餅圖分析
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onclick="_showPieChart('Oprator')">纜線業者分析</a>
                                <a class="dropdown-item" href="#" onclick="_showPieChart('FaultInfoList')">缺失類型分析</a>
                                <a class="dropdown-item" href="#" onclick="_showPieChart('Status')">辦理情形分析</a>
                                <a class="dropdown-item" href="#" onclick="_showPieChart('Results')">檢查結果分析</a>
                            </div>
                        </div>
                        
                        <button type="button" class="btn btn-pdf btn-size--sm" id="downloadWord" onclick="_downloadWord()">
                            <span class="icon-word"></span>
                            Word
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

        <!-- 重新修改20210321 -->
        <div class="searchResults-box">
            <div id="searchResults" class="x_panel init-panel data-panel AttachedCable-table" style="max-width:1650px; min-height:800px;" style="display: none;">
                <div class="jsgrid-grid-header jsgrid-header-scrollbar">
                    <table class="jsgrid-table">
                        <tbody>
                            <tr class="jsgrid-header-row">
                                <th class="jsgrid-header-cell jsgrid-align-center" style="width: 3%;">
                                    <input type="checkbox" class="singleCheckbox">
                                <th class="jsgrid-header-cell jsgrid-align-right jsgrid-header-sortable" style="width: 5%;">檢查道路</th>
                                <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 5%;">檢查日期</th>
                                <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 10%;">檢查範圍</th>
                                <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">附掛形式</th>
                                <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">纜線業者</th>
                                <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">缺失</th>
                                <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 5%;">情形</th>
                                <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">檢查結果</th>
                                <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 60px;">編輯</th>
                                <th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 100px;">下載</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="jsgrid-grid-body">
                    <table class="jsgrid-table">
                        <tbody>
                            <tr :class="[n%2 == 1?'jsgrid-row':'jsgrid-alt-row']" v-for="n in 15">
                                <td class="jsgrid-cell jsgrid-align-center" style="width: 3%;">
                                    <input type="checkbox" class="singleCheckbox">
                                </td>
                                <td class="jsgrid-cell jsgrid-align-right" style="width: 5%;">三民路二段</td>
                                <td class="jsgrid-cell" style="width: 5%;">2018/8/20</td>
                                <td class="jsgrid-cell" style="width: 10%;">菓林路口 ~ 三民路二段562巷口</td>
                                <td class="jsgrid-cell" style="width: 100px;">道路側溝道路側溝</td>
                                <td class="jsgrid-cell" style="width: 100px;">纜線纜線業者</td>
                                <td class="jsgrid-cell" style="width: 100px;">A，FA，FA，FA，FA，F</td>
                                <td class="jsgrid-cell" style="width: 5%;">
                                    <span class="cable-stats-normal">●</span>
                                </td>
                                <td class="jsgrid-cell" style="width: 100px;">符合</td>
                                <td class="jsgrid-cell" style="width: 60px;">
                                    <input type="button" class="btn btn-round btn-info" onclick="_editCableData(505)" value="編輯"><input type="hidden" class="CableId" value="505">
                                </td>
                                <td class="jsgrid-cell" style="width: 100px;">
                                    <input type="button" class="btn btn-default" onclick="_downloadFile(&quot;3909&quot;)" value="點此下載">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="jsgrid-pager-container"><div class="jsgrid-pager">頁碼: <span class="jsgrid-pager-nav-button jsgrid-pager-nav-inactive-button"><a href="javascript:void(0);">第一頁</a></span> <span class="jsgrid-pager-nav-button jsgrid-pager-nav-inactive-button"><a href="javascript:void(0);">上一頁</a></span> <span class="jsgrid-pager-page jsgrid-pager-current-page">1</span><span class="jsgrid-pager-page"><a href="javascript:void(0);">2</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">3</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">4</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">5</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">6</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">7</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">8</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">9</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">10</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">11</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">12</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">13</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">14</a></span><span class="jsgrid-pager-page"><a href="javascript:void(0);">15</a></span><span class="jsgrid-pager-nav-button"><a href="javascript:void(0);">...</a></span> <span class="jsgrid-pager-nav-button"><a href="javascript:void(0);">下一頁</a></span> <span class="jsgrid-pager-nav-button"><a href="javascript:void(0);">最後一頁</a></span> &nbsp;&nbsp; 1 of 172 &nbsp; 總計 : 1715 筆 </div></div>
                <div class="jsgrid-load-shader" style="display: none; position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; z-index: 1000;"></div>
                <div class="jsgrid-load-panel" style="display: none; position: absolute; top: 50%; left: 50%; z-index: 1000;">請稍候...</div>
            </div>
            <div class="fault-panel">
                <!-- 增加縮放按鈕 -->
                <div class="area-toggle"><a href="javascript:;" class="area-toggle__btn">按鈕</a></div>
                <div class="x_panel init-panel tile fixed_height_320 fault-collapse">
                    <div class="x_title init-title">
                        <h2>缺失圖例</h2>
                        <ul class="nav navbar-right panel_toolbox">
                            <li>
                                <a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                            </li>
                        </ul>
                        <div class="clearfix"></div>
                    </div>
                    <div class="x_content init-content" style="display: block;">
                        <div id="FaultInformation" class="jsgrid FaultInformation-table" style="position: relative; height: 250px; width: 100%;">
                            <div class="jsgrid-grid-header jsgrid-header-scrollbar"><table class="jsgrid-table"><tbody><tr class="jsgrid-header-row"><th class="jsgrid-header-cell jsgrid-header-sortable jsgrid-header-sort jsgrid-header-sort-desc" style="width: 15%;">代號</th><th class="jsgrid-header-cell jsgrid-header-sortable" style="width: 85%;">缺失原因</th></tr><tr class="jsgrid-filter-row" style="display: none;"><td class="jsgrid-cell" style="width: 15%;"><input type="text"></td><td class="jsgrid-cell" style="width: 85%;"><input type="text"></td></tr><tr class="jsgrid-insert-row" style="display: none;"><td class="jsgrid-cell" style="width: 15%;"><input type="text"></td><td class="jsgrid-cell" style="width: 85%;"><input type="text"></td></tr></tbody></table></div>
                            <div class="jsgrid-grid-body" style="height: 166px;"><table class="jsgrid-table"><tbody><tr class="jsgrid-row"><td class="jsgrid-cell" style="width: 15%;">H</td><td class="jsgrid-cell" style="width: 85%;">其他</td></tr><tr class="jsgrid-alt-row"><td class="jsgrid-cell" style="width: 15%;">G</td><td class="jsgrid-cell" style="width: 85%;">纜線橫越箱涵、管涵或人孔等情形者</td></tr><tr class="jsgrid-row"><td class="jsgrid-cell" style="width: 15%;">F</td><td class="jsgrid-cell" style="width: 85%;">暫掛纜線未依規定標示業者名稱及電話者</td></tr><tr class="jsgrid-alt-row"><td class="jsgrid-cell" style="width: 15%;">E</td><td class="jsgrid-cell" style="width: 85%;">暫掛纜線有垂落者</td></tr><tr class="jsgrid-row"><td class="jsgrid-cell" style="width: 15%;">D</td><td class="jsgrid-cell" style="width: 85%;">暫掛纜線未緊貼壁體釘掛而懸空，未佈設於出水高度內或側溝蓋版底20公分內或未依規定位置設置者</td></tr><tr class="jsgrid-alt-row"><td class="jsgrid-cell" style="width: 15%;">C</td><td class="jsgrid-cell" style="width: 85%;">暫掛纜線除連接管外，至少每5公尺或纜線轉折點處，應以不銹鋼膨脹螺絲及線夾固定，固定前須使用緊線器拉緊纜線，且不得影響結構體承載強度</td></tr><tr class="jsgrid-row"><td class="jsgrid-cell" style="width: 15%;">B</td><td class="jsgrid-cell" style="width: 85%;">影響排水設施、妨礙排水之虞者</td></tr><tr class="jsgrid-alt-row"><td class="jsgrid-cell" style="width: 15%;">A</td><td class="jsgrid-cell" style="width: 85%;">擅自暫掛纜線</td></tr></tbody></table></div>
                            <div class="jsgrid-pager-container" style="display: none;"><div class="jsgrid-pager">頁碼: <span class="jsgrid-pager-nav-button jsgrid-pager-nav-inactive-button"><a href="javascript:void(0);">第一頁</a></span> <span class="jsgrid-pager-nav-button jsgrid-pager-nav-inactive-button"><a href="javascript:void(0);">上一頁</a></span> <span class="jsgrid-pager-page jsgrid-pager-current-page">1</span> <span class="jsgrid-pager-nav-button jsgrid-pager-nav-inactive-button"><a href="javascript:void(0);">下一頁</a></span> <span class="jsgrid-pager-nav-button jsgrid-pager-nav-inactive-button"><a href="javascript:void(0);">最後一頁</a></span> &nbsp;&nbsp; 1 / 1 </div></div>
                            <div class="jsgrid-load-shader" style="display: none; position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; z-index: 1000;"></div>
                            <div class="jsgrid-load-panel" style="display: none; position: absolute; top: 50%; left: 50%; z-index: 1000;">請稍候...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="resultMap" class="x_panel map-container" hidden>
            <div id="mapDiv" class="map-panel">
                <div id="map" style="min-height:800px; height:100%"></div>
            </div>
            <div class="area-panel" id="collapseLayers">
                <!-- 增加縮放按鈕 -->
                <div class="area-toggle"><a href="javascript:;" class="area-toggle__btn">按鈕</a></div>
                <div class="x_panel init-panel area-collapse">
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
                        </li>
                        <li class="to_do-box-wrap">
                            <label>
                                <input type="checkbox" class="flat rainLayerBtn">
                                <span>雨水下水道圖資(大園區)</span>
                            </label>
                            <div class="to_do-box">
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat rainLayerBtn">
                                        <span>北桃園</span>
                                    </label>
                                    <span style="background-color: #F00014;">■></span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat rainLayerBtn">
                                        <span>北健</span>
                                    </label>
                                    <span style="background-color: blue;">■></span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat rainLayerBtn">
                                        <span>台灣固網</span>
                                    </label>
                                    <span style="background-color: orange;">■></span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat rainLayerBtn">
                                        <span>佳光</span>
                                    </label>
                                    <span style="background-color: #CC00CC;">■></span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat rainLayerBtn">
                                        <span>新世紀</span>
                                    </label>
                                    <span style="background-color: #989fd4;">■></span>
                                </div>
                            </div>
                        </li>
                        <li class="to_do-box-wrap">
                            <label>
                                <input type="checkbox" class="flat layerBtn">
                                <span>道路纜線圖資(大園區)</span>
                            </label>
                            <div class="to_do-box">
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn">
                                        <span>北桃園</span>
                                    </label>
                                    <span style="background-color: #80ffff;">■></span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn">
                                        <span>北健</span>
                                    </label>
                                    <span style="background-color: #c07a52;">■></span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn">
                                        <span>台灣固網</span>
                                    </label>
                                    <span style="background-color: #DDAE2E;">■></span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn">
                                        <span>亞太</span>
                                    </label>
                                    <span style="background-color: #FF8000;">■></span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn">
                                        <span>佳光</span>
                                    </label>
                                    <span style="background-color: #FF8050;">■></span>
                                </div>
                                <div class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat layerBtn">
                                        <span>新世紀</span>
                                    </label>
                                    <span style="background-color: #FF80C8;">■></span>
                                </div>
                            </div>
                        </li>
                        <li class="to_do-box-wrap">
                            <label>
                                <input type="checkbox" class="flat statusBtn">
                                <span>呈現檢查結果</span>
                            </label>
                            <div class="to_do-box">
                                <div id="status_1" class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat statusBtn">
                                        <span>正常</span>
                                    </label>
                                    <span style="background-color: #00AA00;border-radius:50%">●</span>
                                </div>
                                <div id="status_2" class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat statusBtn">
                                        <span>已通知改善</span>
                                    </label>
                                    <span style="background-color: #9370DB;border-radius:50%">●</span>
                                </div>
                                <div id="status_3" class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat statusBtn">
                                        <span>列管中</span>
                                    </label>
                                    <span style="background-color: #FF0000;border-radius:50%">●</span>
                                </div>
                                <div id="status_4" class="to_do-group">
                                    <label class="to_do-label">
                                        <input type="checkbox" class="flat statusBtn">
                                        <span>已改善完成</span>
                                    </label>
                                    <span style="background-color: #696969;border-radius:50%">●</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="imageModal" role="dialog" aria-hidden="true" data-backdrop="false">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="imageModalTitle">檢視圖片</h4>
                    </div>
                    <div class="modal-body">
                        <div id="flot-placeholder" style="width:500px;height:350px"></div>
                        <div id="imageContent" class="container">
                            <div class="row">
                                <div id="imageContent" class="col">現況照片：</div>
                                <div id="imageContent1" class="col">改善照片：</div>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">關閉</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
