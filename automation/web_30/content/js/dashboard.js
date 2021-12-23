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

    var data = {"OkPercent": 99.72337482710927, "KoPercent": 0.2766251728907331};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9492753623188406, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "商品充库存"], "isController": true}, {"data": [1.0, 500, 1500, "8. View shop cart - Again（再次浏览购物车）"], "isController": false}, {"data": [1.0, 500, 1500, "1. Register（注册）"], "isController": false}, {"data": [1.0, 500, 1500, "3. Add Address（添加默认地址）"], "isController": false}, {"data": [0.5, 500, 1500, "所有商品充库存"], "isController": false}, {"data": [1.0, 500, 1500, "2. Login（登录）"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "购买流程"], "isController": true}, {"data": [1.0, 500, 1500, "6. View shop cart（浏览购物车）"], "isController": false}, {"data": [1.0, 500, 1500, "4.5 Dashboard（浏览首页）"], "isController": false}, {"data": [1.0, 500, 1500, "10. Default Address（默认地址）"], "isController": false}, {"data": [1.0, 500, 1500, "5.5 Good detail（查看商品详情）"], "isController": false}, {"data": [1.0, 500, 1500, "9. Settle（结账）"], "isController": false}, {"data": [1.0, 500, 1500, "仅浏览商品详情"], "isController": true}, {"data": [1.0, 500, 1500, "4. Dashboard（浏览首页）"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "12. Payment - Wechat（微信支付）"], "isController": false}, {"data": [1.0, 500, 1500, "4.6 Dashboard（浏览首页）"], "isController": false}, {"data": [0.17105263157894737, 500, 1500, "未登录刷首页"], "isController": true}, {"data": [1.0, 500, 1500, "Logout（退出登录）"], "isController": false}, {"data": [1.0, 500, 1500, "5. Good detail（查看商品详情）"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "11. Save Order（生成订单）"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "随机获取商品ID"], "isController": true}, {"data": [0.9772727272727273, 500, 1500, "随机获取商品id"], "isController": false}, {"data": [1.0, 500, 1500, "注册登录"], "isController": true}, {"data": [1.0, 500, 1500, "7. Add shop cart（添加购物车）"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 723, 2, 0.2766251728907331, 142.80359612724789, 2, 1015, 143.0, 173.60000000000002, 208.39999999999986, 432.0, 11.141760798878119, 37.952570825499684, 2.383459016851335], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["商品充库存", 1, 0, 0.0, 1015.0, 1015, 1015, 1015.0, 1015.0, 1015.0, 1015.0, 0.9852216748768472, 0.008659174876847291, 0.0], "isController": true}, {"data": ["8. View shop cart - Again（再次浏览购物车）", 12, 0, 0.0, 72.24999999999999, 20, 94, 72.0, 93.10000000000001, 94.0, 94.0, 0.3857404609598508, 0.18420613809508501, 0.09379821755761998], "isController": false}, {"data": ["1. Register（注册）", 22, 0, 0.0, 62.86363636363637, 22, 97, 61.0, 82.4, 94.89999999999998, 97.0, 0.6623314065510597, 0.20221570553347784, 0.18813293104226878], "isController": false}, {"data": ["3. Add Address（添加默认地址）", 12, 0, 0.0, 129.25, 29, 159, 138.5, 154.8, 159.0, 159.0, 0.36284470246734396, 0.11132198309748427, 0.148114341436865], "isController": false}, {"data": ["所有商品充库存", 1, 0, 0.0, 1015.0, 1015, 1015, 1015.0, 1015.0, 1015.0, 1015.0, 0.9852216748768472, 0.008659174876847291, 0.0], "isController": false}, {"data": ["2. Login（登录）", 22, 0, 0.0, 79.90909090909089, 66, 103, 80.0, 91.0, 101.19999999999997, 103.0, 0.643915003219575, 0.21505754990341278, 0.19799357365509573], "isController": false}, {"data": ["购买流程", 12, 1, 8.333333333333334, 1075.0833333333335, 305, 1261, 1137.0, 1241.2, 1261.0, 1261.0, 0.33989519898031445, 2.8272597719869705, 0.8951569359864042], "isController": true}, {"data": ["6. View shop cart（浏览购物车）", 12, 0, 0.0, 58.583333333333336, 23, 78, 61.5, 77.10000000000001, 78.0, 78.0, 0.39290157815467225, 0.11984009724314058, 0.09553954390675136], "isController": false}, {"data": ["4.5 Dashboard（浏览首页）", 10, 0, 0.0, 149.60000000000002, 117, 176, 148.5, 174.4, 176.0, 176.0, 0.30630685821055537, 1.4151735802677123, 0.06730375302478023], "isController": false}, {"data": ["10. Default Address（默认地址）", 12, 0, 0.0, 58.25, 18, 93, 53.0, 88.80000000000001, 93.0, 93.0, 0.35565039566106516, 0.19475679625677958, 0.0795350982484218], "isController": false}, {"data": ["5.5 Good detail（查看商品详情）", 10, 0, 0.0, 59.1, 48, 83, 54.5, 82.2, 83.0, 83.0, 0.29443806495303715, 0.3916256293613638, 0.06670862409092247], "isController": false}, {"data": ["9. Settle（结账）", 12, 0, 0.0, 66.5, 18, 85, 70.5, 82.30000000000001, 85.0, 85.0, 0.3707021716968892, 0.1770247675388465, 0.08896490106885792], "isController": false}, {"data": ["仅浏览商品详情", 10, 0, 0.0, 208.7, 171, 242, 205.5, 240.9, 242.0, 242.0, 0.32359317865579396, 1.9254426147946802, 0.1444160963336893], "isController": true}, {"data": ["4. Dashboard（浏览首页）", 12, 0, 0.0, 138.83333333333331, 118, 164, 139.5, 161.60000000000002, 164.0, 164.0, 0.3699593044765076, 1.7092553412874585, 0.08128988623751388], "isController": false}, {"data": ["12. Payment - Wechat（微信支付）", 12, 1, 8.333333333333334, 63.166666666666664, 19, 84, 63.0, 83.4, 84.0, 84.0, 0.3452939314591546, 0.10551584575432336, 0.08719458571921848], "isController": false}, {"data": ["4.6 Dashboard（浏览首页）", 494, 0, 0.0, 150.6659919028339, 117, 436, 149.0, 171.5, 178.25, 209.0, 7.815342751823317, 36.10779937390245, 1.5871361524861964], "isController": false}, {"data": ["未登录刷首页", 38, 0, 0.0, 1958.657894736842, 315, 3115, 2101.5, 3014.5, 3042.7999999999997, 3115.0, 1.0842273453549418, 65.12034611461424, 2.8623969716531614], "isController": true}, {"data": ["Logout（退出登录）", 22, 0, 0.0, 72.90909090909089, 20, 92, 75.5, 89.4, 91.69999999999999, 92.0, 0.4934948407357559, 0.15093126121579184, 0.11807249607447286], "isController": false}, {"data": ["5. Good detail（查看商品详情）", 12, 0, 0.0, 57.08333333333333, 23, 74, 57.0, 71.9, 74.0, 74.0, 0.38646098354320313, 0.25056434374094233, 0.08755756658400696], "isController": false}, {"data": ["11. Save Order（生成订单）", 12, 1, 8.333333333333334, 310.16666666666663, 2, 388, 323.0, 387.7, 388.0, 388.0, 0.3411998862667046, 0.11009582918680694, 0.10079391171452942], "isController": false}, {"data": ["随机获取商品ID", 22, 0, 0.0, 366.81818181818176, 16, 502, 415.5, 455.4, 495.9999999999999, 502.0, 0.6592747977225053, 0.009657345669763262, 0.0], "isController": true}, {"data": ["随机获取商品id", 22, 0, 0.0, 366.81818181818176, 16, 502, 415.5, 455.4, 495.9999999999999, 502.0, 0.6804193857668636, 0.009967080846194291, 0.0], "isController": false}, {"data": ["注册登录", 22, 0, 0.0, 142.77272727272728, 97, 184, 140.0, 176.8, 183.1, 184.0, 0.6855291038264988, 0.4382541793905023, 0.40551140081640286], "isController": true}, {"data": ["7. Add shop cart（添加购物车）", 12, 0, 0.0, 121.0, 16, 149, 130.0, 146.60000000000002, 149.0, 149.0, 0.3755633450175263, 0.11522410568978467, 0.10562719078617926], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Value expected to be '200', but found '500'", 1, 50.0, 0.13831258644536654], "isController": false}, {"data": ["Value expected to match regexp '200', but it did not match: '500'", 1, 50.0, 0.13831258644536654], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 723, 2, "Value expected to be '200', but found '500'", 1, "Value expected to match regexp '200', but it did not match: '500'", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["12. Payment - Wechat（微信支付）", 12, 1, "Value expected to be '200', but found '500'", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["11. Save Order（生成订单）", 12, 1, "Value expected to match regexp '200', but it did not match: '500'", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
