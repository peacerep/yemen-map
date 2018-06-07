var dataArray = [{x:5,y:5}, {x:10,y:15}, {x:20,y:7}, {x:30,y:18}, {x:40,y:10}]; //curly braces for object

var svg = d3.select("body").append("svg").attr("height","100%").attr("width","100%");

// path generator (different from SVG line element - D3 line element is path generator)
var line = d3.line()
                 .x(function(d,i){ return d.x*6; })
                 .y(function(d,i){ return d.y*4 })
                 .curve(d3.curveCardinal); //curveStep, curveCardinal...see full list of 18 curves at github.com/d3/d3/blob/master/API.md

svg.append("path")
     .attr("fill","none")
     .attr("stroke","blue")
     .attr("d",line(dataArray));
