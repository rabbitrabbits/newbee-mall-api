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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9391304347826087, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "商品充库存"], "isController": true}, {"data": [1.0, 500, 1500, "8. View shop cart - Again（再次浏览购物车）"], "isController": false}, {"data": [1.0, 500, 1500, "1. Register（注册）"], "isController": false}, {"data": [1.0, 500, 1500, "3. Add Address（添加默认地址）"], "isController": false}, {"data": [0.5, 500, 1500, "所有商品充库存"], "isController": false}, {"data": [1.0, 500, 1500, "2. Login（登录）"], "isController": false}, {"data": [0.375, 500, 1500, "购买流程"], "isController": true}, {"data": [1.0, 500, 1500, "6. View shop cart（浏览购物车）"], "isController": false}, {"data": [1.0, 500, 1500, "4.5 Dashboard（浏览首页）"], "isController": false}, {"data": [1.0, 500, 1500, "10. Default Address（默认地址）"], "isController": false}, {"data": [1.0, 500, 1500, "5.5 Good detail（查看商品详情）"], "isController": false}, {"data": [1.0, 500, 1500, "9. Settle（结账）"], "isController": false}, {"data": [1.0, 500, 1500, "仅浏览商品详情"], "isController": true}, {"data": [1.0, 500, 1500, "4. Dashboard（浏览首页）"], "isController": false}, {"data": [1.0, 500, 1500, "12. Payment - Wechat（微信支付）"], "isController": false}, {"data": [1.0, 500, 1500, "4.6 Dashboard（浏览首页）"], "isController": false}, {"data": [0.3, 500, 1500, "未登录刷首页"], "isController": true}, {"data": [1.0, 500, 1500, "Logout（退出登录）"], "isController": false}, {"data": [1.0, 500, 1500, "5. Good detail（查看商品详情）"], "isController": false}, {"data": [1.0, 500, 1500, "11. Save Order（生成订单）"], "isController": false}, {"data": [1.0, 500, 1500, "随机获取商品ID"], "isController": true}, {"data": [1.0, 500, 1500, "随机获取商品id"], "isController": false}, {"data": [1.0, 500, 1500, "注册登录"], "isController": true}, {"data": [1.0, 500, 1500, "7. Add shop cart（添加购物车）"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 199, 0, 0.0, 165.96984924623126, 53, 1002, 154.0, 236.0, 374.0, 474.0, 3.4083513170965642, 11.609897385503373, 0.7334672481416777], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["商品充库存", 1, 0, 0.0, 1002.0, 1002, 1002, 1002.0, 1002.0, 1002.0, 1002.0, 0.998003992015968, 0.008771519461077844, 0.0], "isController": true}, {"data": ["8. View shop cart - Again（再次浏览购物车）", 4, 0, 0.0, 79.5, 73, 84, 80.5, 84.0, 84.0, 84.0, 0.1206018029969548, 0.060624783293635236, 0.029326024361564205], "isController": false}, {"data": ["1. Register（注册）", 5, 0, 0.0, 71.0, 53, 92, 68.0, 92.0, 92.0, 92.0, 0.1414547203440179, 0.043099485104817946, 0.03978414009675503], "isController": false}, {"data": ["3. Add Address（添加默认地址）", 4, 0, 0.0, 195.5, 137, 360, 142.5, 360.0, 360.0, 360.0, 0.1089413623117357, 0.03319307132935698, 0.04447020453740774], "isController": false}, {"data": ["所有商品充库存", 1, 0, 0.0, 1002.0, 1002, 1002, 1002.0, 1002.0, 1002.0, 1002.0, 0.998003992015968, 0.008771519461077844, 0.0], "isController": false}, {"data": ["2. Login（登录）", 5, 0, 0.0, 86.8, 67, 99, 91.0, 99.0, 99.0, 99.0, 0.1403075541587159, 0.04686053078347738, 0.04274995790773375], "isController": false}, {"data": ["购买流程", 4, 0, 0.0, 1349.0, 1197, 1576, 1311.5, 1576.0, 1576.0, 1576.0, 0.10875771500040785, 1.071247561448109, 0.2866572976426765], "isController": true}, {"data": ["6. View shop cart（浏览购物车）", 4, 0, 0.0, 62.5, 55, 67, 64.0, 67.0, 67.0, 67.0, 0.10989312893211352, 0.0332684277040578, 0.02672205967196901], "isController": false}, {"data": ["4.5 Dashboard（浏览首页）", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 27.33797152366864, 1.3001571745562128], "isController": false}, {"data": ["10. Default Address（默认地址）", 4, 0, 0.0, 64.75, 63, 68, 64.0, 68.0, 68.0, 68.0, 0.12608353033884948, 0.0715376280535855, 0.028196414499605988], "isController": false}, {"data": ["5.5 Good detail（查看商品详情）", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 12.520926339285714, 4.045758928571429], "isController": false}, {"data": ["9. Settle（结账）", 4, 0, 0.0, 97.5, 88, 119, 91.5, 119.0, 119.0, 119.0, 0.11912207034158254, 0.059880943074540637, 0.028617216117216116], "isController": false}, {"data": ["仅浏览商品详情", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 23.65017361111111, 1.9835069444444444], "isController": true}, {"data": ["4. Dashboard（浏览首页）", 4, 0, 0.0, 150.0, 132, 161, 153.5, 161.0, 161.0, 161.0, 0.1123059213297021, 0.5188665173933796, 0.024676594042170874], "isController": false}, {"data": ["12. Payment - Wechat（微信支付）", 4, 0, 0.0, 84.5, 58, 123, 78.5, 123.0, 123.0, 123.0, 0.12336921321284275, 0.037589057150788016, 0.03132421429232335], "isController": false}, {"data": ["4.6 Dashboard（浏览首页）", 136, 0, 0.0, 169.8529411764706, 129, 376, 160.0, 200.39999999999998, 255.90000000000003, 375.26, 2.437101283062146, 11.259693525553724, 0.4965411865636872], "isController": false}, {"data": ["未登录刷首页", 15, 0, 0.0, 1540.0000000000002, 150, 3109, 1729.0, 2846.8, 3109.0, 3109.0, 0.5807650611739198, 24.32770394533065, 1.0728273337076042], "isController": true}, {"data": ["Logout（退出登录）", 5, 0, 0.0, 86.6, 73, 97, 92.0, 97.0, 97.0, 97.0, 0.1182704134733655, 0.036035516605166046, 0.028297120411107955], "isController": false}, {"data": ["5. Good detail（查看商品详情）", 4, 0, 0.0, 76.0, 68, 82, 77.0, 82.0, 82.0, 82.0, 0.10835703643505351, 0.22980897839631587, 0.02454964106731681], "isController": false}, {"data": ["11. Save Order（生成订单）", 4, 0, 0.0, 400.25, 344, 474, 391.5, 474.0, 474.0, 474.0, 0.12885352575459844, 0.0411475614470251, 0.038127556937151696], "isController": false}, {"data": ["随机获取商品ID", 5, 0, 0.0, 416.6, 380, 449, 424.0, 449.0, 449.0, 449.0, 0.14575134819997085, 0.0021350295146480105, 0.0], "isController": true}, {"data": ["随机获取商品id", 5, 0, 0.0, 416.6, 380, 449, 424.0, 449.0, 449.0, 449.0, 0.14799029183685553, 0.002167826540578938, 0.0], "isController": false}, {"data": ["注册登录", 5, 0, 0.0, 157.8, 126, 191, 159.0, 191.0, 191.0, 191.0, 0.14932059130954156, 0.09536686202777363, 0.08749253397043452], "isController": true}, {"data": ["7. Add shop cart（添加购物车）", 4, 0, 0.0, 138.5, 127, 154, 136.5, 154.0, 154.0, 154.0, 0.11356860963629653, 0.034602935748559105, 0.031941171460208403], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 199, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
