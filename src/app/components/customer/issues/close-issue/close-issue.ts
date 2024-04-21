import { Component, OnInit } from '@angular/core';
import global from '../../../../config/globals';

@Component({
  selector: 'close-issue',
  templateUrl: './close-issue.html'
})

export class Customer_CloseIssue implements OnInit {
  global = global;

  chartData;
  chartColor;
  areaChartData;
  areaChartColor;
  pieChartData;
  barChartData;
  stackedBarChartData;
  heatMapChartData;
  
  code1 = `<!-- page.ts -->
chartData;
chartColor;

ngOnInit() {
  this.chartData = [{"name":"Congo", "series":[{"value":2377,"name":"Thu 15"},{"value":4567,"name":"Sat 17"},{"value":2865,"name":"Mon 19"},{"value":2060,"name":"Wed 21"},{"value":3287,"name":"Fri 23"}]},{"name":"Micronesia","series":[{"value":5234,"name":"Thu 15"},{"value":2876,"name":"Sat 17"},{"value":4297,"name":"Mon 19"},{"value":2558,"name":"Wed 21"},{"value":2371,"name":"Fri 23"}]},{"name":"Malaysia","series":[{"value":2369,"name":"Thu 15"},{"value":5229,"name":"Sat 17"},{"value":3457,"name":"Mon 19"},{"value":4401,"name":"Wed 21"},{"value":2835,"name":"Fri 23"}]},{"name":"Yemen","series":[{"value":2099,"name":"Thu 15"},{"value":4383,"name":"Sat 17"},{"value":6724,"name":"Mon 19"},{"value":2870,"name":"Wed 21"},{"value":5753,"name":"Fri 23"}]},{"name":"Åland Islands","series":[{"value":4907,"name":"Thu 15"},{"value":2428,"name":"Sat 17"},{"value":5384,"name":"Mon 19"},{"value":5966,"name":"Wed 21"},{"value":2605,"name":"Fri 23"}]}];
  this.chartColor = { domain: [global.color.blue, global.color.success, global.color.purple, global.color.componentColor] };
}

<!-- page.html -->
<ngx-charts-line-chart
  [animations]="false"
  [scheme]="chartColor"
  [results]="chartData"
  [xAxis]="true"
  [yAxis]="true"
  [legend]="true"
  [showXAxisLabel]="true"
  [xAxisLabel]="'Census Date'"
  [showYAxisLabel]="true"
  [yAxisLabel]="'GDP Per Capita'"
  [roundDomains]="true"
  [autoScale]="true">
</ngx-charts-line-chart>
`;

	code2 = `<!-- page.ts -->
areaChartData;
chartColor;

ngOnInit() {
  this.areaChartData=[{name:"Lesotho",series:[{value:6004,name:"2016-09-20T09:49:19.352Z"},{value:5016,name:"2016-09-16T14:29:34.242Z"},{value:4236,name:"2016-09-21T08:15:48.994Z"},{value:5819,name:"2016-09-21T16:08:42.359Z"},{value:2100,name:"2016-09-16T19:27:30.508Z"}]},{name:"Colombia",series:[{value:4499,name:"2016-09-20T09:49:19.352Z"},{value:4259,name:"2016-09-16T14:29:34.242Z"},{value:3294,name:"2016-09-21T08:15:48.994Z"},{value:6188,name:"2016-09-21T16:08:42.359Z"},{value:3634,name:"2016-09-16T19:27:30.508Z"}]},{name:"Aruba",series:[{value:4992,name:"2016-09-20T09:49:19.352Z"},{value:3246,name:"2016-09-16T14:29:34.242Z"},{value:6449,name:"2016-09-21T08:15:48.994Z"},{value:5610,name:"2016-09-21T16:08:42.359Z"},{value:3191,name:"2016-09-16T19:27:30.508Z"}]},{name:"Denmark",series:[{value:6955,name:"2016-09-20T09:49:19.352Z"},{value:3148,name:"2016-09-16T14:29:34.242Z"},{value:6562,name:"2016-09-21T08:15:48.994Z"},{value:4540,name:"2016-09-21T16:08:42.359Z"},{value:6840,name:"2016-09-16T19:27:30.508Z"}]},{name:"Indonesia",series:[{value:3584,name:"2016-09-20T09:49:19.352Z"},{value:6407,name:"2016-09-16T14:29:34.242Z"},{value:3273,name:"2016-09-21T08:15:48.994Z"},{value:4847,name:"2016-09-21T16:08:42.359Z"},{value:3416,name:"2016-09-16T19:27:30.508Z"}]}];
  this.chartColor = { domain: [global.color.blue, global.color.success, global.color.purple, global.color.componentColor] };
}

<!-- page.html -->
<ngx-charts-area-chart-stacked
  [animations]="false"
  [scheme]="chartColor"
  [results]="areaChartData"
  [xAxis]="true"
  [yAxis]="true"
  [legend]="true"
  [showXAxisLabel]="true"
  [xAxisLabel]="'Census Date'"
  [showYAxisLabel]="true"
  [yAxisLabel]="'GDP Per Capita'">
</ngx-charts-area-chart-stacked>
`;

	code3 = `<!-- page.ts -->
barChartData;
chartColor;

ngOnInit() {
  this.barChartData = [{name:"Germany",value:40632},{name:"United States",value:49737},{name:"France",value:36745},{name:"United Kingdom",value:36240},{name:"Spain",value:33e3},{name:"Italy",value:35800}];
  this.chartColor = { domain: [global.color.blue, global.color.success, global.color.purple, global.color.componentColor] };
}

<!-- page.html -->
<ngx-charts-bar-vertical
  [scheme]="chartColor"
  [results]="barChartData"
  [xAxis]="true"
  [yAxis]="true"
  [legend]="true"
  [showXAxisLabel]="true"
  [xAxisLabel]="'Census Date'"
  [showYAxisLabel]="true"
  [yAxisLabel]="'GDP Per Capita'">
</ngx-charts-bar-vertical>
`;

	code4 = `<!-- page.ts -->
stackedBarChartData;
chartColor;

ngOnInit() {
  this.stackedBarChartData = [{name:"Germany",series:[{name:"2010",value:40632},{name:"2000",value:36953},{name:"1990",value:31476}]},{name:"United States",series:[{name:"2010",value:49737},{name:"2000",value:45986},{name:"1990",value:37060}]},{name:"France",series:[{name:"2010",value:36745},{name:"2000",value:34774},{name:"1990",value:29476}]},{name:"United Kingdom",series:[{name:"2010",value:36240},{name:"2000",value:32543},{name:"1990",value:26424}]}];
  this.chartColor = { domain: [global.color.blue, global.color.success, global.color.purple, global.color.componentColor] };
}

<!-- page.html -->
<ngx-charts-bar-vertical-stacked
  [scheme]="chartColor"
  [results]="stackedBarChartData"
  [xAxis]="true"
  [yAxis]="true"
  [legend]="true"
  [showXAxisLabel]="true"
  [xAxisLabel]="'Census Date'"
  [showYAxisLabel]="true"
  [yAxisLabel]="'GDP Per Capita'">
</ngx-charts-bar-vertical-stacked>
`;

	code5 = `<!-- page.ts -->
pieChartData;
chartColor;

ngOnInit() {
  this.pieChartData = [{"name":"Germany","value":8940000},{"name":"USA","value":5000000},{"name":"France","value":7200000}];
  this.chartColor = { domain: [global.color.blue, global.color.success, global.color.purple, global.color.componentColor] };
}

<!-- page.html -->
<ngx-charts-pie-chart
  [scheme]="chartColor"
  [results]="pieChartData"
  [legend]="false"
  [explodeSlices]="false"
  [labels]="true"
  [doughnut]="false">
</ngx-charts-pie-chart>
`;

	code6 = `<!-- page.ts -->
pieChartData;
chartColor;

ngOnInit() {
  this.pieChartData = [{"name":"Germany","value":8940000},{"name":"USA","value":5000000},{"name":"France","value":7200000}];
  this.chartColor = { domain: [global.color.blue, global.color.success, global.color.purple, global.color.componentColor] };
}

<!-- page.html -->
<ngx-charts-pie-grid
  [scheme]="chartColor"
  [results]="pieChartData">
</ngx-charts-pie-grid>
`;

	code7 = `<!-- page.ts -->
heatMapChartData;
chartColor;

ngOnInit() {
  this.heatMapChartData=[{name:"Germany",series:[{name:"2010",value:40632},{name:"2000",value:36953},{name:"1990",value:31476}]},{name:"United States",series:[{name:"2010",value:49737},{name:"2000",value:45986},{name:"1990",value:37060}]},{name:"France",series:[{name:"2010",value:36745},{name:"2000",value:34774},{name:"1990",value:29476}]},{name:"United Kingdom",series:[{name:"2010",value:36240},{name:"2000",value:32543},{name:"1990",value:26424}]}];
  this.chartColor = { domain: [global.color.blue, global.color.success, global.color.purple, global.color.componentColor] };
}

<!-- page.html -->
<ngx-charts-heat-map
  [scheme]="chartColor"
  [results]="heatMapChartData"
  [xAxis]="true"
  [yAxis]="true"
  [legend]="true"
  [showXAxisLabel]="true"
  [xAxisLabel]="'Census Date'"
  [showYAxisLabel]="true"
  [yAxisLabel]="'GDP Per Capita'">
</ngx-charts-heat-map>
`;

	code8 = `<!-- page.ts -->
chartData;
chartColor;

ngOnInit() {
  this.chartData = [{"name":"Congo", "series":[{"value":2377,"name":"Thu 15"},{"value":4567,"name":"Sat 17"},{"value":2865,"name":"Mon 19"},{"value":2060,"name":"Wed 21"},{"value":3287,"name":"Fri 23"}]},{"name":"Micronesia","series":[{"value":5234,"name":"Thu 15"},{"value":2876,"name":"Sat 17"},{"value":4297,"name":"Mon 19"},{"value":2558,"name":"Wed 21"},{"value":2371,"name":"Fri 23"}]},{"name":"Malaysia","series":[{"value":2369,"name":"Thu 15"},{"value":5229,"name":"Sat 17"},{"value":3457,"name":"Mon 19"},{"value":4401,"name":"Wed 21"},{"value":2835,"name":"Fri 23"}]},{"name":"Yemen","series":[{"value":2099,"name":"Thu 15"},{"value":4383,"name":"Sat 17"},{"value":6724,"name":"Mon 19"},{"value":2870,"name":"Wed 21"},{"value":5753,"name":"Fri 23"}]},{"name":"Åland Islands","series":[{"value":4907,"name":"Thu 15"},{"value":2428,"name":"Sat 17"},{"value":5384,"name":"Mon 19"},{"value":5966,"name":"Wed 21"},{"value":2605,"name":"Fri 23"}]}];
  this.chartColor = { domain: [global.color.blue, global.color.success, global.color.purple, global.color.componentColor] };
}

<!-- page.html -->
<ngx-charts-polar-chart
  [animations]="false"
  [scheme]="chartColor"
  [results]="chartData"
  [xAxis]="true"
  [yAxis]="true"
  [legend]="true"
  [showXAxisLabel]="true"
  [xAxisLabel]="'Census Date'"
  [showYAxisLabel]="true"
  [yAxisLabel]="'GDP Per Capita'"
  [roundDomains]="true"
  [autoScale]="true">
</ngx-charts-polar-chart>
`;


  ngOnInit() {
    this.chartData = [{"name":"Congo", "series":[{"value":2377,"name":"Thu 15"},{"value":4567,"name":"Sat 17"},{"value":2865,"name":"Mon 19"},{"value":2060,"name":"Wed 21"},{"value":3287,"name":"Fri 23"}]},{"name":"Micronesia","series":[{"value":5234,"name":"Thu 15"},{"value":2876,"name":"Sat 17"},{"value":4297,"name":"Mon 19"},{"value":2558,"name":"Wed 21"},{"value":2371,"name":"Fri 23"}]},{"name":"Malaysia","series":[{"value":2369,"name":"Thu 15"},{"value":5229,"name":"Sat 17"},{"value":3457,"name":"Mon 19"},{"value":4401,"name":"Wed 21"},{"value":2835,"name":"Fri 23"}]},{"name":"Yemen","series":[{"value":2099,"name":"Thu 15"},{"value":4383,"name":"Sat 17"},{"value":6724,"name":"Mon 19"},{"value":2870,"name":"Wed 21"},{"value":5753,"name":"Fri 23"}]},{"name":"Åland Islands","series":[{"value":4907,"name":"Thu 15"},{"value":2428,"name":"Sat 17"},{"value":5384,"name":"Mon 19"},{"value":5966,"name":"Wed 21"},{"value":2605,"name":"Fri 23"}]}];
    this.chartColor = { domain: [global.color.blue, global.color.success, global.color.purple, global.color.componentColor] };

    this.areaChartData=[{name:"Lesotho",series:[{value:6004,name:"2016-09-20T09:49:19.352Z"},{value:5016,name:"2016-09-16T14:29:34.242Z"},{value:4236,name:"2016-09-21T08:15:48.994Z"},{value:5819,name:"2016-09-21T16:08:42.359Z"},{value:2100,name:"2016-09-16T19:27:30.508Z"}]},{name:"Colombia",series:[{value:4499,name:"2016-09-20T09:49:19.352Z"},{value:4259,name:"2016-09-16T14:29:34.242Z"},{value:3294,name:"2016-09-21T08:15:48.994Z"},{value:6188,name:"2016-09-21T16:08:42.359Z"},{value:3634,name:"2016-09-16T19:27:30.508Z"}]},{name:"Aruba",series:[{value:4992,name:"2016-09-20T09:49:19.352Z"},{value:3246,name:"2016-09-16T14:29:34.242Z"},{value:6449,name:"2016-09-21T08:15:48.994Z"},{value:5610,name:"2016-09-21T16:08:42.359Z"},{value:3191,name:"2016-09-16T19:27:30.508Z"}]},{name:"Denmark",series:[{value:6955,name:"2016-09-20T09:49:19.352Z"},{value:3148,name:"2016-09-16T14:29:34.242Z"},{value:6562,name:"2016-09-21T08:15:48.994Z"},{value:4540,name:"2016-09-21T16:08:42.359Z"},{value:6840,name:"2016-09-16T19:27:30.508Z"}]},{name:"Indonesia",series:[{value:3584,name:"2016-09-20T09:49:19.352Z"},{value:6407,name:"2016-09-16T14:29:34.242Z"},{value:3273,name:"2016-09-21T08:15:48.994Z"},{value:4847,name:"2016-09-21T16:08:42.359Z"},{value:3416,name:"2016-09-16T19:27:30.508Z"}]}];
    this.pieChartData = [{"name":"Germany","value":8940000},{"name":"USA","value":5000000},{"name":"France","value":7200000}];
    this.barChartData = [{name:"Germany",value:40632},{name:"United States",value:49737},{name:"France",value:36745},{name:"United Kingdom",value:36240},{name:"Spain",value:33e3},{name:"Italy",value:35800}];
    this.stackedBarChartData = [{name:"Germany",series:[{name:"2010",value:40632},{name:"2000",value:36953},{name:"1990",value:31476}]},{name:"United States",series:[{name:"2010",value:49737},{name:"2000",value:45986},{name:"1990",value:37060}]},{name:"France",series:[{name:"2010",value:36745},{name:"2000",value:34774},{name:"1990",value:29476}]},{name:"United Kingdom",series:[{name:"2010",value:36240},{name:"2000",value:32543},{name:"1990",value:26424}]}];
    this.heatMapChartData=[{name:"Germany",series:[{name:"2010",value:40632},{name:"2000",value:36953},{name:"1990",value:31476}]},{name:"United States",series:[{name:"2010",value:49737},{name:"2000",value:45986},{name:"1990",value:37060}]},{name:"France",series:[{name:"2010",value:36745},{name:"2000",value:34774},{name:"1990",value:29476}]},{name:"United Kingdom",series:[{name:"2010",value:36240},{name:"2000",value:32543},{name:"1990",value:26424}]}];
  }
}
