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

d3.csv("data_countries.csv")
    .row(function(d){ return {Dat: parseDate(d.Dat), AgtId:Number(d.AgtId), Agt:d.Agt }; }) //price.trim().slice(1) - remove spaces, trim 1st character ($)
    .get(function(error,data){
    //console.log(data);

        var tooltip = d3.select("body").append("div").style("opacity","0").style("position","absolute");

        var svgtest = d3.select("body").select("svg");
        if (!svgtest.empty()) {
          svgtest.remove();
        }

        //var width = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth; //950;
        //var height = window.innerHeight||document.documentElement.clientHeight||document.body.clientWidth; //500;

        var margin = {top: 20, right: 10, bottom: 20, left: 10} //read clockwise from top
          , width = parseInt(d3.select("body").style("width"), 10) //960 - margin.left - margin.right,
          , width = width - margin.left - margin.right
          , height = 500 - margin.top - margin.bottom; //defines w & h as inner dimensions of chart area
          //, percent = d3.format('%');

        var max = d3.max(data,function(d){ return d.AgtId; });
        var minDate = d3.min(data,function(d){ return d.Dat; });
        var maxDate = d3.max(data,function(d){ return d.Dat; });
        //console.log(maxDate);

        // var width = max*4;
        // var height = 300;

        var y = d3.scaleLinear()
                    .domain([0,max])
                    .range([height,0]);
        var x = d3.scaleTime()
                    .domain([minDate,maxDate])
                    .range([0,width]);
        var yAxis = d3.axisLeft(y);
        var xAxis = d3.axisBottom(x);

        var svg = d3.select("body").append("svg")
            .attr("height", height + margin.top + margin.bottom)//"100%")
            .attr("width", width + margin.left + margin.right)//"100%");

        //var margin = {left:50,right:50,top:40,bottom:0};

        var chartGroup = svg.append("g")
                    .attr("transform","translate("+margin.left+","+margin.top+")");

        chartGroup.call(d3.zoom()
          .on("zoom",function(){  //on: tell event, then tell function
            chartGroup.attr("transform",d3.event.transform);
        }));

        chartGroup.selectAll("circle.agt")
                .data(data)
                .enter().append("circle")
                   .attr("class","agt")
                   .attr("fill","lightsteelblue")
                   .attr("stroke","black")
                   .attr("cx",function(d) { return x(d.Dat); })
                   .attr("cy",height/2)
                   .attr("r",width/26)
                   .on("mousemove",function(d){
                     this.style.fill = "steelblue"
                     tooltip.style("opacity","1")
                       .style("background", "white")
                       .style("left",d3.event.pageX+"px")
                       .style("top",d3.event.pageY+"px");
                     //console.log(d3.event);
                     tooltip.html("Agreement: "+d.Agt);
                   })
                   .on("mouseout",function(d) {
                     this.style.fill = "lightsteelblue"
                     tooltip.style("opacity","0");
                   });

        // chartGroup.append("path").attr("d",line(data));
        chartGroup.append("g")
                .attr("class","x axis")
                .attr("transform","translate(0,"+height/2+")")
                .call(xAxis);

      });
}
