var dataArray = [25,26,28,32,37,45,55,70,90,120,135,150,160,168,172,177,180];

var dataYears = ['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016'];

//convert strings to dates
var parseDate = d3.timeParse("%Y");
// console.log(parseDate('2003'))
// console.log('2003')
// console.log(d3.extent(dataYears,function(d){ return parseDate(d); }));

var height = 200;
var width = 500;

var margin = {left:50, right:50,top:40,bottom:0}

var y = d3.scaleLinear()
            .domain([0,d3.max(dataArray)])  //input
            .range([height,0]);             // output

var x = d3.scaleTime()                      //runs horizontally
            .domain(d3.extent(dataYears,function(d){ return parseDate(d); }))
            .range([0, width]);

var yAxis = d3.axisLeft(y).ticks(3).tickPadding(10).tickSize(10); // ticks issue suggestion, D3 decides what will look good
var xAxis = d3.axisBottom(x);

var area = d3.area()
                .x(function(d,i){ return x(parseDate(dataYears[i])); })
                .y0(height) // stays constant
                .y1(function(d){ return y(d); })// active variable, drawing upper value of chart

var svg = d3.select("body").append("svg").attr("height","100%").attr("width","100%");
var chartGroup = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");

chartGroup.append("path").attr("d",area(dataArray));
chartGroup.append("g")
       .attr("class","axis y")
       .call(yAxis);
chartGroup.append("g")
       .attr("class","axis x")
       .attr("transform","translate(0,"+height+")")
       .call(xAxis);
