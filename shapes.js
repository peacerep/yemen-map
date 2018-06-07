var dataArray = [5,11,18];

var svg = d3.select("body").append("svg").attr("height","500").attr("width","100%");

svg.selectAll("rect")
      .data(dataArray)
      .enter().append("rect")
                .attr("height",function(d,i){ return d*15; })
                .attr("width", "50")
                .attr("fill", "steelblue")
                .attr("x",function(d,i){ return 60*i ; })
                .attr("y",function(d,i){ return 300-(d*15); });

var newX = 300;
svg.selectAll("cirle.first")
      .data(dataArray)
      .enter().append("circle")
                .attr("class","first")
                .attr("cx",function(d,i){ newX=(d*6)+(i*100); return newX+200; })
                .attr("cy","100")
                .attr("r",function(d){ return d*3; });

var newX = 600;
svg.selectAll("ellipse.second")
      .data(dataArray)
      .enter().append("ellipse")
                .attr("class","second")
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
