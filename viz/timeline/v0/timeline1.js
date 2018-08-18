/*
Timeline with agreements grouped by year
*/


callFunction();

d3.select(window).on("resize", callFunction);

function callFunction() {

var parseDate = d3.timeParse("%d/%m/%Y");
var parseMonth = d3.timeParse("%m");
var parseDay = d3.timeParse("%d");
var parseYear = d3.timeParse("%Y");

var formatDate = d3.timeFormat("%d %B %Y");
var formatMonth = d3.timeFormat("%m");
var formatDay = d3.timeFormat("%d");  // %j day of the year as decimal number
var formatYear = d3.timeFormat("%Y");

// var y = d3.scaleLinear()
//             //.domain([0,(max*30)]) // data space - assume rects height of 30px...?
//             .rangeRound([height,0]); // display space
// var x = d3.scaleTime()
//             //.domain([minDay,maxDay])  // data space
//             .range([0,width]);  // display space

d3.csv("PAX_with_additional.csv")
    .row(function(d){ return {Year: d.Year,
                              Day: formatDay(parseDate(d.Dat)),
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

        //d3.map(data,function(d,i,j){ console.log(d[j][i]); });

        var svg = d3.select("body").select("#chart").append("svg"),
          margin = {top: 20, right: 50, bottom: 20, left: 70}, //read clockwise from top
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom; //defines w & h as inner dimensions of chart area

        // Create hierarchical arrays of agreements, grouping by time, location, categories, etc.
        var time_nest = d3.nest()
            .key(function(d) {return (d.Year);}).sortKeys(d3.ascending)
            .key(function(d) {return formatMonth(d.Month);}).sortKeys(d3.ascending)
            .key(function(d) {return (d.Day);}).sortKeys(d3.ascending)
            //.entries(data);
            .map(data);
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
        var yearMap = d3.map(yr_count_nest,function(d){ return d.key; });
        var years = yearMap.keys();

        // Find the maximum number of agreements that occur in a single year
        var maxAgts = d3.max(yr_count_nest,function(d){ return d.value; });

        // Find the earliest & latest year in which agreements occur
        var minYear = d3.min(yr_count_nest,function(d){ return d.key; });
        var maxYear = d3.max(yr_count_nest,function(d){ return d.key; });

        // Find the earliest & latest day of the year on which agreements are written
        var minDay = d3.min(data,function(d){ return (d.Dat); });
        var maxDay = d3.max(data,function(d){ return (d.Dat); });

        var y = d3.scaleLinear()
                    .domain([0,maxAgts]) // range of possible total agreements in a year
                    .range([height,0]); // display space
        var x = d3.scaleTime()
                    .domain([parseYear(minYear),parseYear(+maxYear+1)])  // data space
                    .range([0,width]);  // display space

        var svg = d3.select("body").select("#chart").append("svg")
            .attr("height", height + margin.top + margin.bottom)//"100%")
            .attr("width", width + margin.left + margin.right);//"100%");

        var chartGroup = svg.append("g")
                    .attr("transform","translate("+margin.left+","+margin.top+")");


        chartGroup.selectAll("rect.agt")
          .data(data)
            .enter().append("rect")
              .attr("class","agt")
              .attr("fill","black")
              .attr("stroke","white")
              .attr("stroke-width","0.5px")
              .attr("x",function(d){ return x(parseYear(d.Year)); })
              .attr("y",function(d){ return y(parseDay(d.Day)); })
              .attr("width",(width/(years.length))+"px")
              .attr("height","2px") // TO DO: calculate height based on max # of agmts in single year
              .on("mousemove",function(d){
               //console.log(d.Agt);
               this.style.fill = "steelblue"
               tooltip.style("opacity","1")
                 .style("left",margin.left)  //("left",d3.event.pageX+"px")
                 .style("top",(margin.bottom)+140+"px")  //("top",d3.event.pageY+"px")
                 .attr("class","tooltip")
               // Display core agreement information (name, date, region, country/entity, status, type & stage)
               tooltip.html("<h5>Selected: "+d.Agt+"</h5> " +"<p><b>Date:</b> "+formatDate(d.Dat)+"<br/><b>Region:</b> "+d.Reg+"<br/><b>Country/Entity:</b> "+d.Con+"<br/><b>Status:</b> "+d.Status+"<br/><b>Type:</b> "+d.Agtp+"<br/><b>Stage:</b> "+d.Stage+"</p>");
              })
              .on("mouseout",function(d) {
               this.style.fill = "black"
               tooltip.style("opacity","0")
                 .style("left",margin.left)  //("left",d3.event.pageX+"px")
                 .style("top",height+"px");
              });

         chartGroup.append("g")
            .attr("class","x axis")
            .attr("transform","translate(0,"+height/2+")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

         chartGroup.append("g")
            .attr("class","y axis")
            .call(d3.axisLeft(y));

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
