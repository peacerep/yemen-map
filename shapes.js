var dataArray = [5,11,18];
var dataDays = ["Mon","Wed","Fri"];

var rainbow = d3.scaleSequential(d3.interpolateRainbow).domain([0,10]);    // apply algorithm to sequential scale input to get output points
var rainbow2 = d3.scaleSequential(d3.interpolateRainbow).domain([0,3]);    // apply algorithm to sequential scale input to get output points
// var x = d3.scaleOrdinal()
//           .domain(dataDays)
//           .range([25,85,145]);
// var x = d3.scalePoint()
//            .domain(dataDays)
//            .range([0,170]);
var x = d3.scaleBand()
           .domain(dataDays)
           .range([0,170])
           .paddingInner(0.1176); // % of chart dedicated to whitespace (value must be between 0 and 1)

var xAxis = d3.axisBottom(x);

var svg = d3.select("body").append("svg").attr("height","500").attr("width","100%");

var cat20 = d3.schemeCategory20;
console.log(cat20);

svg.selectAll("rect")
      .data(dataArray)
      .enter().append("rect")
                .attr("height",function(d,i){ return d*15; })
                .attr("width", "50")
                .attr("fill",function(d,i) {return rainbow(i); })
                .attr("x",function(d,i){ return 60*i ; })
                .attr("y",function(d,i){ return 300-(d*15); });

svg.append("g")
     .attr("class","x axis hidden")
     .attr("transform","translate(0,300)")
     .call(xAxis);

var newX = 300;
svg.selectAll("cirle.first")
      .data(dataArray)
      .enter().append("circle")
                .attr("class","first")
                .attr("fill",function(d,i){ return rainbow2(i); })
                .attr("cx",function(d,i){ newX=(d*6)+(i*100); return newX+200; })
                .attr("cy","100")
                .attr("r",function(d){ return d*3; });

var newX = 600;
svg.selectAll("ellipse.second")
      .data(dataArray)
      .enter().append("ellipse")
                .attr("class","second")
                .attr("fill",function(d,i){ return cat20[i]; })
                .attr("cx",function(d,i){ newX=(d*6)+(i*100); return newX+600; })
                .attr("cy","100")
                .attr("rx",function(d){ return d*3; })
                .attr("ry","30");

var newX = 1000;
svg.selectAll("line")
      .data(dataArray)
      .enter().append("line")
                .attr("x1",newX)
                // .style("stroke","green")
                .attr("stroke-width","2")
                .attr("y1",function(d,i){ return 80+(i*20); })
                .attr("x2",function(d){ return newX+(d*15); })
                .attr("y2",function(d,i){ return 80+(i*20); });

var textArray = ["start","middle","end"];
svg.append("text").selectAll("tspan")
      .data(textArray)
      .enter().append("tspan")
        .attr("x",newX)
        .attr("y",function(d,i){return 150+(i*30); })
        .attr("fill","none")
        .attr("stroke","blue")
        .attr("font-size","30")
        .attr("text-anchor","middle")
        .attr("dominant-baseline","middle")
        .text(function(d){ return d; });
