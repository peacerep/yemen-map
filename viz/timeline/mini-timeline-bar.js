/*
Mini timeline iFrame with agreements displayed continuously on y axis
*/

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

  var parseDate = d3.timeParse("%d/%m/%Y");
  var parseMonth = d3.timeParse("%m");
  var parseYear = d3.timeParse("%Y");
  var parseDay = d3.timeParse("%j");

  var formatDate = d3.timeFormat("%d %B %Y");
  var formatMonth = d3.timeFormat("%m");
  var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
  var formatYear = d3.timeFormat("%Y");

  d3.csv("PAX_with_additional.csv")
      .row(function(d){ return{ Year:+d.Year,
                                Day:+d.Day,
                                Month:+d.Month,
                                Dat:parseDate(d.Dat),
                                AgtId:Number(d.AgtId),
                                Reg:d.Reg,
                                Con:d.Con,
                                Status:d.Status,
                                Agtp:d.Agtp,
                                Stage:d.Stage, // "Pre", "SubPar", "SubComp", "Imp", "Cea", "Other"
                                StageSub:d.StageSub, // "FrCons"
                                Agt:d.Agt,
                                GeWom:d.GeWom, // 1 if topic of Women, girls and gender addressed; 0 if not
                                Polps:d.Polps, // 1-3 indicating increasing level of detail given about Political Power sharing; 0 if none given
                                Terps:d.Terps, // 1-3 indicating increasing level of detail given about Territorial Power sharing; 0 if none given
                                Eps:d.Eps, // 1-3 indicating increasing level of detail given about Economic Power sharing; 0 if none given
                                Mps:d.Mps, // 1-3 indicating increasing level of detail given about Political Power sharing; 0 if none given
                                Pol:d.Pol, // 1-3 indicating increasing level of detail given about political institutions; 0 if none given
                                HrGen:d.HrGen, // 1 if topic of human rights/rule of law addressed; 0 if not
                                HrFra:d.HrFra, // 1-3 indicating increasing level of detail given about human rights framework to be established; 0 if none given
                                TjMech:d.TjMech // 1-3 indicating increasing level of detail given about a body to deal with the past; 0 if none given
                              }; })
      .get(function(error,data){

          var tooltip = d3.select("body").append("div")
              .style("opacity","0")
              .style("position","absolute");

          var svgtest = d3.select("body").select("svg");
          if (!svgtest.empty()) {
            svgtest.remove();
          }

          var margin = {top: 20, right: 10, bottom: 20, left: 10}, //read clockwise from top
              width = parseInt(d3.select("body").style("width"), 10),
              width = width - margin.left - margin.right,
              height = 100 - margin.top - margin.bottom, //defines w & h as inner dimensions of chart area
              agtHeight = 30; // height of agreement rectangles on timeline

          var yr_count_nest = d3.nest()
               .key(function(d) {return formatYear(d.Year);}).sortKeys(d3.ascending)
               .rollup(function(leaves) {return leaves.length;})
               //.entries(data);
               .map(data);
          var years = yr_count_nest.keys();

          // Find the maximum number of agreements that occur in a single year
          var max = d3.max(yr_count_nest,function(d){ return d.value; });

          // Find the earliest & latest year in which agreements occur
          var minYear = d3.min(yr_count_nest,function(d){ return d.key; });
          var maxYear = d3.max(yr_count_nest,function(d){ return d.key; });

          // Create an array of years (non-repeating) in which agreements occur
          //var yearMap = d3.map(yr_count_nest,function(d){ return d.key; });

          // Find the earliest & latest day of the year on which agreements are written
          var minDay = d3.min(data,function(d){ return (d.Dat); });
          var maxDay = d3.max(data,function(d){ return (d.Dat); });

          // Timeline axes
          var y = d3.scaleLinear()
                      .domain([0,agtHeight]) // data space - assume rects height of 30px...?
                      .range([height,margin.bottom]); // display space
          var x = d3.scaleTime()
                      .domain([minDay,maxDay])  // data space
                      .range([margin.left,width]);  // display space
          // Bar graph axis
          var y1 = d3.scaleLinear()
                      .domain([(agtHeight-2),max])
                      .range([height,margin.bottom]);
          // var yAxis = d3.axisLeft(y);
          // var xAxis = d3.axisBottom(x)
          //     .ticks(30).tickFormat(d3.timeFormat("%Y"));

          var svg = d3.select("body").select("#chart").append("svg")
              .attr("height", height + margin.top + margin.bottom)//"100%")
              .attr("width", width + margin.left + margin.right);//"100%");

          var chartGroup = svg.append("g")
                      .attr("transform","translate("+margin.left+","+margin.top+")");

          /*
          Timeline
          */
          // Make one rectangle per agreement grouped by Year
          chartGroup.selectAll("rect.agt")
                  .data(data)
                  .enter().append("rect")
                     .attr("class","agt")
                     .attr("fill","black")
                     .attr("stroke","white")
                     .attr("stroke-width","1px")
                     //.attr("d", function(d,i) { return agt(d.values); })
                     .attr("x",function(d){ return x(d.Dat); })
                     .attr("y",function(d){ return ((height/2)-(agtHeight-1))+"px"; })
                     .attr("width","4px")
                     .attr("height",agtHeight+"px"); // TO DO: calculate height based on max # of agmts in single year
                     // .on("mousemove",function(d){
                     //   this.style.fill = "steelblue"
                     //   tooltip.style("opacity","1")
                     //     .style("left",margin.left)  //("left",d3.event.pageX+"px")
                     //     .style("top",(margin.top + 140)+"px")  //("top",d3.event.pageY+"px")
                     //     .attr("class","tooltip");
                     //   // Display core agreement information (name, date, region, country/entity, status, type & stage)
                     //   tooltip.html("<h5>"+d.Agt+"</h5> " +"<p><b>Date:</b> "+formatDate(d.Dat)+"<br/><b>Region:</b> "+d.Reg+"<br/><b>Country/Entity:</b> "+d.Con+"<br/><b>Status:</b> "+d.Status+"<br/><b>Type:</b> "+d.Agtp+"<br/><b>Stage:</b> "+d.Stage+"</p>");
                     // })
                     // .on("mouseout",function(d) {
                     //   this.style.fill = "black"
                     //   tooltip.style("opacity","0")
                     //     .style("left",margin.left)  //("left",d3.event.pageX+"px")
                     //     .style("top",height+"px");
                     // });
             // Draw timeline axes
             chartGroup.append("g")
                     .attr("class","xaxis1")
                     .attr("transform","translate(0,"+height/2+")")
                     .call(d3.axisBottom(x1).tickFormat(d3.timeFormat("%Y")));
            // TO DO: MAKE 1ST & LAST TICK LABELS APPEAR

            /*
            Bar graph
            */
                chartGroup.selectAll("rect.count")
                   .data(yr_count_array)
                   .enter().append("rect")
                     .attr("class","count")
                     .attr("fill","black")
                     .attr("stroke","white")
                     .attr("stroke-width","0.5px")
                     .attr("x",function(d){ return x(parseYear(d.key)); })
                     .attr("y",function(d){ return ((height/2)+24)+"px"; })
                     .attr("width",width/(years.length))
                     .attr("height",function(d){ return d.value; })
                     .on("mousemove",function(d){
                       this.style.fill = "steelblue"
                       tooltip.style("opacity","1")
                         .style("left",margin.left)  //("left",d3.event.pageX+"px")
                         .style("top",(margin.top + tooltipMargin)+"px")  //("top",d3.event.pageY+"px")
                         .attr("class","tooltip");
                       // Display core agreement information (name, date, region, country/entity, status, type & stage)
                       tooltip.html("<h5>Total Peace Agreements in "+d.key+": "+d.value+"</h5>");
                     })
                     .on("mouseout",function(d) {
                       this.style.fill = "black"
                       tooltip.style("opacity","0")
                         .style("left",margin.left)  //("left",d3.event.pageX+"px")
                         .style("top",height+"px");
                     });

           /***********************************************************************/
           // Draw bar graph axes
           chartGroup.append("g")
                   .attr("class","yaxis1")
                   .attr("transform","translate(0,"+height/2+")")
                   .call(d3.axisLeft(y1);
          // TO DO: MAKE 1ST & LAST TICK LABELS APPEAR
        });
}
