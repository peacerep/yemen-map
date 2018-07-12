/*
Timeline with agreements grouped by year
*/


callFunction();

d3.select(window).on("resize", callFunction);

function callFunction() {

var parseDate = d3.timeParse("%d/%m/%Y");
//var parseMonth = d3.timeParse("%m");
//var parseDay = d3.timeParse(%d");
//var parseYear = d3.timeParse("%Y");

var formatDate = d3.timeFormat("%d %B %Y");
var formatMonth = d3.timeFormat("%m");
var formatDay = d3.timeFormat("%d");  // %j day of the year as decimal number
var formatYear = d3.timeFormat("%Y");

var svg = d3.select("body").select("#chart").append("svg"),
  margin = {top: 20, right: 50, bottom: 20, left: 10}, //read clockwise from top
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom, //defines w & h as inner dimensions of chart area
  g = svg.append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

var y = d3.scaleLinear()
            //.domain([0,(max*30)]) // data space - assume rects height of 30px...?
            .rangeRound([height,0]); // display space
var x = d3.scaleTime()
            //.domain([minDay,maxDay])  // data space
            .range([0,width]);  // display space

d3.csv("PAX_with_additional_cleaning.csv")
    .row(function(d){ return {Year: d.Year,
                              Day: d.Day,
                              Month: d.Month,
                              Dat: parseDate(d.Dat),
                              AgtId:Number(d.AgtId),
                              Reg:d.Reg,
                              Con:d.Con,
                              Status:d.Status,
                              Agtp:d.Agtp,
                              Stage:d.Stage,
                              Agt:d.Agt }; })
      .get(function(error,data){

        // Create hierarchical arrays of agreements, grouping by time, location, categories, etc.
        var time_nest = d3.nest()
            .key(function(d) {return (d.Year);}).sortKeys(d3.ascending)
            //.key(function(d) {return formatMonth(d.Month);}).sortKeys(d3.ascending)
            //.key(function(d) {return (d.Day);}).sortKeys(d3.ascending)
            .entries(data);
        //console.log(time_nest);
        // var loc_nest = d3.nest()
        //     .key(function(d) {return d.Reg;})
        //     .key(function(d) {return d.Con;})
        //     .entries(data)
        //console.log(loc_nest);
        var yr_count_nest = d3.nest()
             .key(function(d) {return d.Year;}).sortKeys(d3.ascending)
             .rollup(function(leaves) {return leaves.length;}) // leaf level replaced by value at parent level that indicates total # of leaves for that key
             .entries(data);
        //console.log(yr_count_nest);

        // Find the maximum number of agreements that occur in a single year
        var maxAgts = d3.max(yr_count_nest,function(d){ return d.value; });

        // Find the earliest & latest year in which agreements occur
        var minYear = d3.min(yr_count_nest,function(d){ return d.key; });
        var maxYear = d3.max(yr_count_nest,function(d){ return d.key; });

        // Find the earliest & latest day of the year on which agreements are written
        var minDay = d3.min(data,function(d){ return (d.Dat); });
        var maxDay = d3.max(data,function(d){ return (d.Dat); });

        x.domain(data.map(function(d){ return d.Year; }));
        y.domain([0, maxAgts]);

        g.append("g")
           .attr("class","x axis")
           .attr("transform","translate(0,"+height/2+")")
           .call(d3.axisBottom(x));

        g.append("g")
           .attr("class","y axis")
           .call(d3.axisLeft(y));

        g.append("g")
          .selectAll("g")
          .data(data)
          .enter().append("g")
            .attr("transform",function(d){ return "translate(" + x(d.Year) + ",0)"; })
          .selectAll("rect")
             .data(function(d){ return time_nest.map(function(key, index){ return {key: key, yrIndex: index, value: d[key]}; }); })
          .enter().append("rect")
               .attr("x",function(d){ return x(d.key); })
               .attr("y",function(d){ return y((height/2)+d.yrIndex); })
               .attr("width","2px")
               .attr("height",(height/2)/maxAgts) // TO DO: calculate height based on max # of agmts in single year
               .attr("fill","black")
               .attr("stroke","white");

      // // Enable zooming in/out of chart in display space
      // svg.call(d3.zoom()
      //   .on("zoom",function(){  //on: tell event, then tell function
      //     chartGroup.attr("transform",d3.event.transform);
      // }));
      //
      // // Enable dragging in display space upon clicking the chart
      // function dragged() {
      //   d3.select(this).attr("transform","translate("+d3.event.x+","+d3.event.y+")"); // drags entire chart
      // }
  }); // end of .get(function(error,data){
}
