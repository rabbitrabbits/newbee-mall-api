/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9236641221374046, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "商品充库存"], "isController": true}, {"data": [1.0, 500, 1500, "8. View shop cart - Again（再次浏览购物车）"], "isController": false}, {"data": [1.0, 500, 1500, "1. Register（注册）"], "isController": false}, {"data": [1.0, 500, 1500, "3. Add Address（添加默认地址）"], "isController": false}, {"data": [0.5, 500, 1500, "所有商品充库存"], "isController": false}, {"data": [1.0, 500, 1500, "2. Login（登录）"], "isController": false}, {"data": [0.3125, 500, 1500, "购买流程"], "isController": true}, {"data": [1.0, 500, 1500, "6. View shop cart（浏览购物车）"], "isController": false}, {"data": [1.0, 500, 1500, "4.5 Dashboard（浏览首页）"], "isController": false}, {"data": [1.0, 500, 1500, "10. Default Address（默认地址）"], "isController": false}, {"data": [1.0, 500, 1500, "5.5 Good detail（查看商品详情）"], "isController": false}, {"data": [1.0, 500, 1500, "9. Settle（结账）"], "isController": false}, {"data": [1.0, 500, 1500, "仅浏览商品详情"], "isController": true}, {"data": [0.9375, 500, 1500, "4. Dashboard（浏览首页）"], "isController": false}, {"data": [1.0, 500, 1500, "12. Payment - Wechat（微信支付）"], "isController": false}, {"data": [0.9879310344827587, 500, 1500, "4.6 Dashboard（浏览首页）"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "未登录刷首页"], "isController": true}, {"data": [1.0, 500, 1500, "Logout（退出登录）"], "isController": false}, {"data": [1.0, 500, 1500, "5. Good detail（查看商品详情）"], "isController": false}, {"data": [0.8125, 500, 1500, "11. Save Order（生成订单）"], "isController": false}, {"data": [0.75, 500, 1500, "随机获取商品ID"], "isController": true}, {"data": [0.75, 500, 1500, "随机获取商品id"], "isController": false}, {"data": [1.0, 500, 1500, "注册登录"], "isController": true}, {"data": [1.0, 500, 1500, "7. Add shop cart（添加购物车）"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 451, 0, 0.0, 201.538802660754, 15, 972, 164.0, 384.6, 490.4, 663.8000000000002, 7.413251804000855, 24.146666373876094, 1.6026270762447195], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["商品充库存", 1, 0, 0.0, 972.0, 972, 972, 972.0, 972.0, 972.0, 972.0, 1.02880658436214, 0.00904224537037037, 0.0], "isController": true}, {"data": ["8. View shop cart - Again（再次浏览购物车）", 8, 0, 0.0, 128.875, 79, 322, 91.0, 322.0, 322.0, 322.0, 0.22168647989580736, 0.1105455652312467, 0.05390618505278909], "isController": false}, {"data": ["1. Register（注册）", 16, 0, 0.0, 82.4375, 57, 166, 76.0, 130.30000000000004, 166.0, 166.0, 0.5302226935312832, 0.16155222693531285, 0.15048434600344646], "isController": false}, {"data": ["3. Add Address（添加默认地址）", 8, 0, 0.0, 204.375, 142, 412, 151.0, 412.0, 412.0, 412.0, 0.26823134953897737, 0.08172673931265717, 0.10949287510477787], "isController": false}, {"data": ["所有商品充库存", 1, 0, 0.0, 972.0, 972, 972, 972.0, 972.0, 972.0, 972.0, 1.02880658436214, 0.00904224537037037, 0.0], "isController": false}, {"data": ["2. Login（登录）", 16, 0, 0.0, 111.43750000000001, 74, 315, 90.5, 224.00000000000009, 315.0, 315.0, 0.5072119194801078, 0.1694008559201141, 0.15584135758440323], "isController": false}, {"data": ["购买流程", 8, 0, 0.0, 1592.25, 1276, 2181, 1432.5, 2181.0, 2181.0, 2181.0, 0.25041474942874137, 2.10559921510627, 0.6600287194415752], "isController": true}, {"data": ["6. View shop cart（浏览购物车）", 8, 0, 0.0, 71.0, 49, 93, 71.0, 93.0, 93.0, 93.0, 0.2516752131374462, 0.07619073835215655, 0.06119836725705477], "isController": false}, {"data": ["4.5 Dashboard（浏览首页）", 8, 0, 0.0, 242.125, 136, 418, 249.0, 418.0, 418.0, 418.0, 0.5517241379310345, 2.549030172413793, 0.12122844827586207], "isController": false}, {"data": ["10. Default Address（默认地址）", 8, 0, 0.0, 70.125, 49, 114, 62.5, 114.0, 114.0, 114.0, 0.2084799207776301, 0.11828792380058896, 0.04662295103327861], "isController": false}, {"data": ["5.5 Good detail（查看商品详情）", 8, 0, 0.0, 87.0, 51, 246, 65.0, 246.0, 246.0, 246.0, 0.47901323274055446, 0.5754941695108077, 0.10852643554278187], "isController": false}, {"data": ["9. Settle（结账）", 8, 0, 0.0, 77.5, 59, 91, 78.5, 91.0, 91.0, 91.0, 0.20897003892066976, 0.10420442004283885, 0.05020178669383277], "isController": false}, {"data": ["仅浏览商品详情", 8, 0, 0.0, 329.125, 212, 496, 314.5, 496.0, 496.0, 496.0, 0.5633406098162101, 3.2795060647137526, 0.2514127526230547], "isController": true}, {"data": ["4. Dashboard（浏览首页）", 8, 0, 0.0, 242.375, 116, 608, 213.0, 608.0, 608.0, 608.0, 0.25299642642547676, 1.1688731381044244, 0.05559003510325417], "isController": false}, {"data": ["12. Payment - Wechat（微信支付）", 8, 0, 0.0, 94.5, 69, 154, 75.5, 154.0, 154.0, 154.0, 0.21357823637771312, 0.06507461889633447, 0.05422884908027872], "isController": false}, {"data": ["4.6 Dashboard（浏览首页）", 290, 0, 0.0, 214.05862068965524, 108, 629, 174.0, 371.80000000000007, 418.39999999999986, 611.1699999999996, 4.911924119241192, 22.693665047002032, 1.0087672287855691], "isController": false}, {"data": ["未登录刷首页", 24, 0, 0.0, 2586.5416666666665, 357, 5066, 2690.0, 3810.0, 4752.75, 5066.0, 0.6927606511950122, 38.67434431286803, 1.7191322361014896], "isController": true}, {"data": ["Logout（退出登录）", 16, 0, 0.0, 97.18749999999999, 62, 158, 95.0, 130.00000000000003, 158.0, 158.0, 0.34334027166798997, 0.1046114890238407, 0.082146842342439], "isController": false}, {"data": ["5. Good detail（查看商品详情）", 8, 0, 0.0, 71.375, 57, 93, 67.5, 93.0, 93.0, 93.0, 0.24507551389271817, 0.16848941580124374, 0.055524921116318966], "isController": false}, {"data": ["11. Save Order（生成订单）", 8, 0, 0.0, 477.0, 341, 659, 460.0, 659.0, 659.0, 659.0, 0.2074957852418623, 0.06626086110750876, 0.061397678640902606], "isController": false}, {"data": ["随机获取商品ID", 16, 0, 0.0, 488.56250000000006, 15, 818, 501.0, 717.9000000000001, 818.0, 818.0, 0.5483019773140058, 0.00803176724581063, 0.0], "isController": true}, {"data": ["随机获取商品id", 16, 0, 0.0, 488.56250000000006, 15, 818, 501.0, 717.9000000000001, 818.0, 818.0, 0.5264889766370517, 0.007712240868706811, 0.0], "isController": false}, {"data": ["注册登录", 16, 0, 0.0, 193.875, 133, 481, 174.5, 328.40000000000015, 481.0, 481.0, 0.5327118361911103, 0.3402280672548693, 0.31486703013151324], "isController": true}, {"data": ["7. Add shop cart（添加购物车）", 8, 0, 0.0, 155.125, 121, 192, 155.0, 192.0, 192.0, 192.0, 0.23621814745917855, 0.07197271680396847, 0.06643635397289398], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 451, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
