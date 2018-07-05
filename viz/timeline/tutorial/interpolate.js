var dataArray = [{x:5,y:5}, {x:10,y:15}, {x:20,y:7}, {x:30,y:18}, {x:40,y:10}]; //curly braces for object
var interpolateTypes = [d3.curveLinear,d3.curveNatural,d3.curveStep,d3.curveBasis,d3.curveBundle,d3.curveCardinal];
var svg = d3.select("body").append("svg").attr("height","100%").attr("width","100%");

for (var p=0; p<6; p++) {

  // path generator (different from SVG line element - D3 line element is path generator)
  var line = d3.line()
                   .x(function(d,i){ return d.x*6; })
                   .y(function(d,i){ return d.y*4 })
                   .curve(interpolateTypes[p]); //curveStep, curveCardinal...see full list of 18 curves at github.com/d3/d3/blob/master/API.md

  var shiftX = p*250;
  var shiftY = 0;

  var chartGroup = svg.append("g").attr("class","group"+p).attr("transform","translate("+shiftX+",0)");

  chartGroup.append("path")
       .attr("fill","none")
       .attr("stroke","blue")
       .attr("d",line(dataArray));

  chartGroup.selectAll("circle.grp"+p)
    .data(dataArray)
    .enter().append("circle")
              .attr("class",function(d,i){ return "grp"+i; })
              .attr("cx",function(d,i){ return d.x*6; })
              .attr("cy",function(d,i){ return d.y*4; })
              .attr("r","2");

  // svg.append("path")
  //      .attr("fill","none")
  //      .attr("stroke","blue")
  //      .attr("d",line(dataArray));

  // svg.selectAll("circle")
  //   .data(dataArray)
  //   .enter().append("circle")
  //             .attr("cx",function(d,i){ return d.x*6; })
  //             .attr("cy",function(d,i){ return d.x*4; })
  //             .attr("r","2");

};
