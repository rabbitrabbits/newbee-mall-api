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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9474248927038627, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "商品充库存"], "isController": true}, {"data": [1.0, 500, 1500, "8. View shop cart - Again（再次浏览购物车）"], "isController": false}, {"data": [1.0, 500, 1500, "1. Register（注册）"], "isController": false}, {"data": [1.0, 500, 1500, "3. Add Address（添加默认地址）"], "isController": false}, {"data": [1.0, 500, 1500, "所有商品充库存"], "isController": false}, {"data": [1.0, 500, 1500, "2. Login（登录）"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "购买流程"], "isController": true}, {"data": [1.0, 500, 1500, "6. View shop cart（浏览购物车）"], "isController": false}, {"data": [1.0, 500, 1500, "4.5 Dashboard（浏览首页）"], "isController": false}, {"data": [1.0, 500, 1500, "10. Default Address（默认地址）"], "isController": false}, {"data": [1.0, 500, 1500, "5.5 Good detail（查看商品详情）"], "isController": false}, {"data": [1.0, 500, 1500, "9. Settle（结账）"], "isController": false}, {"data": [1.0, 500, 1500, "仅浏览商品详情"], "isController": true}, {"data": [1.0, 500, 1500, "4. Dashboard（浏览首页）"], "isController": false}, {"data": [1.0, 500, 1500, "12. Payment - Wechat（微信支付）"], "isController": false}, {"data": [1.0, 500, 1500, "4.6 Dashboard（浏览首页）"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "未登录刷首页"], "isController": true}, {"data": [1.0, 500, 1500, "Logout（退出登录）"], "isController": false}, {"data": [1.0, 500, 1500, "5. Good detail（查看商品详情）"], "isController": false}, {"data": [1.0, 500, 1500, "11. Save Order（生成订单）"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "随机获取商品ID"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "随机获取商品id"], "isController": false}, {"data": [1.0, 500, 1500, "注册登录"], "isController": true}, {"data": [1.0, 500, 1500, "7. Add shop cart（添加购物车）"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 400, 0, 0.0, 160.9050000000001, 48, 525, 141.5, 241.80000000000007, 317.0999999999998, 462.97, 68.11989100817439, 234.6716940565395, 14.595551451805177], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["商品充库存", 2, 0, 0.0, 409.0, 400, 418, 409.0, 418.0, 418.0, 418.0, 3.8314176245210727, 0.03367456896551724, 0.0], "isController": true}, {"data": ["8. View shop cart - Again（再次浏览购物车）", 6, 0, 0.0, 108.5, 62, 162, 109.0, 162.0, 162.0, 162.0, 1.8298261665141813, 0.897341510369015, 0.4449479643183898], "isController": false}, {"data": ["1. Register（注册）", 12, 0, 0.0, 79.49999999999999, 50, 109, 76.0, 105.70000000000002, 109.0, 109.0, 3.3975084937712343, 1.0351783691959229, 0.9555492638731596], "isController": false}, {"data": ["3. Add Address（添加默认地址）", 6, 0, 0.0, 174.33333333333334, 134, 219, 174.5, 219.0, 219.0, 219.0, 1.694915254237288, 0.5164194915254238, 0.6918697033898304], "isController": false}, {"data": ["所有商品充库存", 2, 0, 0.0, 409.0, 400, 418, 409.0, 418.0, 418.0, 418.0, 3.8461538461538463, 0.033804086538461536, 0.0], "isController": false}, {"data": ["2. Login（登录）", 12, 0, 0.0, 109.49999999999999, 65, 136, 109.0, 134.5, 136.0, 136.0, 3.4129692832764507, 1.1398784129692832, 1.0398890784982935], "isController": false}, {"data": ["购买流程", 6, 0, 0.0, 1388.6666666666665, 969, 1585, 1435.5, 1585.0, 1585.0, 1585.0, 1.3714285714285714, 11.484598214285715, 3.614732142857143], "isController": true}, {"data": ["6. View shop cart（浏览购物车）", 6, 0, 0.0, 73.33333333333334, 49, 86, 75.5, 86.0, 86.0, 86.0, 1.7873100983020553, 0.5410802055406613, 0.4346095844504021], "isController": false}, {"data": ["4.5 Dashboard（浏览首页）", 6, 0, 0.0, 207.83333333333334, 186, 260, 198.0, 260.0, 260.0, 260.0, 4.926108374384237, 22.759197967980295, 1.0823968596059113], "isController": false}, {"data": ["10. Default Address（默认地址）", 6, 0, 0.0, 78.16666666666667, 53, 113, 76.5, 113.0, 113.0, 113.0, 1.8738288569643973, 1.06317828700812, 0.4190496174266084], "isController": false}, {"data": ["5.5 Good detail（查看商品详情）", 6, 0, 0.0, 82.83333333333334, 61, 104, 85.5, 104.0, 104.0, 104.0, 5.47945205479452, 3.762664098173516, 1.2414383561643836], "isController": false}, {"data": ["9. Settle（结账）", 6, 0, 0.0, 94.0, 70, 134, 89.0, 134.0, 134.0, 134.0, 1.8610421836228288, 0.9126497557382134, 0.44708630583126546], "isController": false}, {"data": ["仅浏览商品详情", 6, 0, 0.0, 290.66666666666663, 255, 350, 279.5, 350.0, 350.0, 350.0, 4.651162790697675, 24.682806443798448, 2.075763081395349], "isController": true}, {"data": ["4. Dashboard（浏览首页）", 6, 0, 0.0, 183.83333333333334, 118, 230, 192.0, 230.0, 230.0, 230.0, 1.7152658662092624, 7.924729309605488, 0.3768894725557461], "isController": false}, {"data": ["12. Payment - Wechat（微信支付）", 6, 0, 0.0, 72.33333333333333, 54, 105, 66.5, 105.0, 105.0, 105.0, 1.969796454366382, 0.6001723571897571, 0.5001436309914642], "isController": false}, {"data": ["4.6 Dashboard（浏览首页）", 278, 0, 0.0, 160.03237410071947, 108, 374, 147.0, 225.0, 247.30000000000007, 296.0499999999999, 52.45283018867924, 242.33822228773585, 10.813310731132075], "isController": false}, {"data": ["未登录刷首页", 28, 0, 0.0, 1588.8928571428576, 108, 3534, 1635.0, 2740.7000000000003, 3220.349999999998, 3534.0, 5.285013212533031, 242.42970519535675, 10.817392766138166], "isController": true}, {"data": ["Logout（退出登录）", 12, 0, 0.0, 105.41666666666666, 71, 144, 104.0, 140.4, 144.0, 144.0, 3.252914068853348, 0.9911222553537544, 0.7782851043643264], "isController": false}, {"data": ["5. Good detail（查看商品详情）", 6, 0, 0.0, 74.16666666666667, 48, 84, 78.0, 84.0, 84.0, 84.0, 1.7725258493353029, 1.1871653434268834, 0.40158788774002957], "isController": false}, {"data": ["11. Save Order（生成订单）", 6, 0, 0.0, 358.83333333333337, 275, 437, 364.0, 437.0, 437.0, 437.0, 1.7714791851195748, 0.5656969663418955, 0.5241779229406555], "isController": false}, {"data": ["随机获取商品ID", 12, 0, 0.0, 453.83333333333337, 398, 525, 455.5, 514.8000000000001, 525.0, 525.0, 3.021908839083354, 0.04426624276001007, 0.0], "isController": true}, {"data": ["随机获取商品id", 12, 0, 0.0, 453.83333333333337, 398, 525, 455.5, 514.8000000000001, 525.0, 525.0, 3.021908839083354, 0.04426624276001007, 0.0], "isController": false}, {"data": ["注册登录", 12, 0, 0.0, 189.0, 115, 233, 186.5, 231.5, 233.0, 233.0, 3.3379694019471486, 2.131867176634214, 1.9558414464534073], "isController": true}, {"data": ["7. Add shop cart（添加购物车）", 6, 0, 0.0, 171.16666666666666, 106, 214, 178.5, 214.0, 214.0, 214.0, 1.7683465959328026, 0.5387931034482759, 0.4973474801061008], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 400, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
