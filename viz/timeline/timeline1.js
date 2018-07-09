// GENERAL DATA IMPORT PATTERN FOR D3 ("Convenience Methods")
// d3.request(url)
//         .row(function(d){*format row*})
//         .get(callback)

// d3.request(url,formatRow,callback);
// function formatRow(){return format(d);}
// function callback(error,rows){
//     if (error) throw error;
//     *do something with the data*
// }


callFunction();

d3.select(window).on("resize", callFunction);

function callFunction() {

function dragged() {
  d3.select(this).attr("transform","translate("+d3.event.x+","+d3.event.y+")"); // drags entire chart
}

var parseDate = d3.timeParse("%d/%m/%Y");
//var parseMonth = d3.timeParse("%m");
//var parseDay = d3.timeParse(%d");
//var parseYear = d3.timeParse("%Y");

var formatDate = d3.timeFormat("%d %B %Y");
var formatMonth = d3.timeFormat("%m");
var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
var formatYear = d3.timeFormat("%Y");

d3.csv("PAX_with_additional_cleaning.csv")
    .row(function(d){ return {Year: formatYear(parseDate(d.Dat)),
                              Day: formatDay(parseDate(d.Dat)),
                              Dat: formatDate(parseDate(d.Dat)),
                              AgtId:Number(d.AgtId),
                              Reg:d.Reg,
                              Con:d.Con,
                              Agt:d.Agt }; }) //price.trim().slice(1) - remove spaces, trim 1st character ($)
    .get(function(error,data){

      // Create hierarchical arrays of agreements, grouping by time, location, categories, etc.
      var time_nest = d3.nest()
          .key(function(d) {return (d.Year);}).sortKeys(d3.ascending)
          //.rollup(function(leaves) {return leaves.length;}) // leaf level replaced by value at parent level that indicates total # of leaves for that key
          //.key(function(d) {return formatMonth(d.Month);}).sortKeys(d3.ascending)
          .key(function(d) {return (d.Day);}).sortKeys(d3.ascending)
          .entries(data)
      console.log(time_nest);
      var loc_nest = d3.nest()
          .key(function(d) {return d.Reg;})
          .key(function(d) {return d.Con;})
          .entries(data)
      //console.log(loc_nest);
      var yr_count_nest = d3.nest()
           .key(function(d) {return d.Year;}).sortKeys(d3.ascending)
           .rollup(function(leaves) {return leaves.length;})
           .entries(data)
      //console.log(yr_count_nest);

        var tooltip = d3.select("body").append("div")
            .style("opacity","0")
            .style("position","absolute");

        var svgtest = d3.select("body").select("svg");
        if (!svgtest.empty()) {
          svgtest.remove();
        }

        var margin = {top: 20, right: 40, bottom: 20, left: 10} //read clockwise from top
          , width = parseInt(d3.select("body").style("width"), 10) //960 - margin.left - margin.right,
          , width = width - margin.left - margin.right
          , height = 500 - margin.top - margin.bottom; //defines w & h as inner dimensions of chart area

        var max = d3.max(yr_count_nest,function(d){ return d.value; }); // max agmts in a year
        var minYear = d3.min(time_nest,function(d){ return d.key; });
        var maxYear = d3.max(time_nest,function(d){ return d.key; });
        // console.log(minYear);
        // console.log(maxYear);
        // console.log(max);

        var y = d3.scaleLinear()
                    .domain([0,(max*12)]) // data space - assume rects height of 12px...?
                    .range([height,0]); // display space
        var x = d3.scaleTime()
                    .domain([minYear,maxYear])  // data space
                    .range([0,width]);  // display space
        var yAxis = d3.axisLeft(y);
        var xAxis = d3.axisBottom(x);

        var svg = d3.select("body").select("#chart").append("svg")
            .attr("height", height + margin.top + margin.bottom)//"100%")
            .attr("width", width + margin.left + margin.right);//"100%");

        var chartGroup = svg.append("g")
                    .attr("transform","translate("+margin.left+","+margin.top+")");

        chartGroup.call(d3.zoom()
          .on("zoom",function(){  //on: tell event, then tell function
            chartGroup.attr("transform",d3.event.transform);
        }));

        // Make one rectangle per agreement grouped by Year, sorted ascending from bottom to top
        chartGroup.selectAll("rect.agt")
                .data(time_nest)
                .enter().append("rect")
                   .attr("class","agt")
                   .attr("fill","black")
                   .attr("stroke","white")
                   //.attr("d", function(d,i) { return agt(d.values); })
                   .attr("x",function(d) { return x(d.key); })
                   .attr("y",function(d, i) { return ((height/2)-12*i)+"px"; }) //TO DO: stack bars of the same year on top of one another
                   .attr("width","5px") // TO DO: width of bar should span width of 1 year on chart
                   .attr("height","12px") // TO DO: calculate height based on max # of agmts in single year
                   .on("mousemove",function(d){
                     this.style.fill = "steelblue"
                     tooltip.style("opacity","1")
                       .style("left",margin.left)  //("left",d3.event.pageX+"px")
                       .style("top",(margin.top + 140)+"px")  //("top",d3.event.pageY+"px")
                       .attr("class","tooltip");
                     //console.log(d3.event);
                     tooltip.html("Name: <br/>Year: "+d.key);  // HOW TO ACCESS AGMT DETAILS?
                   })
                   .on("mouseout",function(d) {
                     this.style.fill = "black"
                     tooltip.style("opacity","0");
                   });
                   //console.log(data);

        // chartGroup.append("path").attr("d",line(data));
        chartGroup.append("g")
                .attr("class","x axis")
                .attr("transform","translate(0,"+height/2+")")
                .call(xAxis);  // WHY NOT SHOWING 4 DIGIT DATE?

      });
}
