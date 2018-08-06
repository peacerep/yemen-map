/*
Timeline with agreements grouped by year
*/

// Define one key/value pair per category (code) by which to filter which
// agreements the timeline and map visualize, checking all paxfilters
// (value = 1) upon page load so all agreements are visible
var paxHrFra = window.localStorage.setItem("paxHrFra",1); // Human rights framework
var paxHrGen = window.localStorage.setItem("paxHrGen",1);; // Human rights/Rule of law
var paxMps = window.localStorage.setItem("paxPol",1); // Military power sharing
var paxEps = window.localStorage.setItem("paxEps",1); // Economic power sharing
var paxTerps = window.localStorage.setItem("paxMps",1); // Territorial power sharing
var paxPolps = window.localStorage.setItem("paxPolps",1); // Political power sharing
var paxPol = window.localStorage.setItem("paxTerps",1); // Political institutions
var paxGeWom = window.localStorage.setItem("paxTjMech",1); // Women, girls and gender
var paxTjMech = window.localStorage.setItem("paxGeWom",1); // Transitional justice past mechanism

// var paxRule = window.localStorage.setItem("paxRule",1); // Selected ALL filter rule
var paxANY = window.localStorage.setItem("paxANY",1); // Selected ANY filter rule
var paxALL = window.localStorage.setItem("paxALL",0); // Selected ALL filter rule

//window.localStorage.setItem("agtInfo", "Hover over an agreement to view its details.");

callFunction();
d3.select(window).on("resize", callFunction);
window.addEventListener("storage", callFunction);

function getFilters(){
  var locStor = window.localStorage;
  // Filter rule
  // paxRule = locStor.getItem("paxRule");
  paxANY = locStor.getItem("paxANY");
  paxALL = locStor.getItem("paxALL");
  // Filter codes
  paxHrFra = locStor.getItem("paxHrFra");
  paxHrGen = locStor.getItem("paxHrGen");
  paxMps = locStor.getItem("paxMps");
  paxEps = locStor.getItem("paxEps");
  paxTerps = locStor.getItem("paxTerps");
  paxPolps = locStor.getItem("paxPolps");
  paxPol = locStor.getItem("paxPol");
  paxGeWom = locStor.getItem("paxGeWom");
  paxTjMech = locStor.getItem("paxTjMech");
};

function callFunction() {

  getFilters();

  // Agreement information to display upon hover
  var agt = "Hover over an agreement to view its details.",
      dat = "",
      reg = "",
      con = "",
      status = "",
      agtp = "",
      stage = "";
  window.localStorage.setItem("paxagt", agt);
  window.localStorage.setItem("paxdat", dat);
  window.localStorage.setItem("paxreg", reg);
  window.localStorage.setItem("paxcon", con);
  window.localStorage.setItem("paxstatus", status);
  window.localStorage.setItem("paxagtp", agtp);
  window.localStorage.setItem("paxstage", stage);

  // Date parsers & formatters
  var parseDate = d3.timeParse("%d/%m/%Y");
  var parseMonth = d3.timeParse("%m");
  var parseYear = d3.timeParse("%Y");
  var parseDay = d3.timeParse("%j");
  var formatDate = d3.timeFormat("%d %B %Y");
  var formatMonth = d3.timeFormat("%m");
  var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
  var formatYear = d3.timeFormat("%Y");

  var margin = {top: 5, right: 5, bottom: 5, left: 5}, //read clockwise from top
      width = parseInt(d3.select("body").style("width"), 10),
      width = width - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom,
      agtHeight = height/3,
      xHeight = 17,
      agtPadding = 5;

  // Obtain data
  d3.csv("PAX_with_additional.csv")
      .row(function(d){ return{ Year:+d.Year, //parseYear(d.Year),
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

          var svgtest = d3.select("body").select("svg");
          if (!svgtest.empty()) {
            svgtest.remove();
          };

          // Create bar chart tooltip
          var tooltip = d3.select("body").append("div")
              .style("opacity","0")
              .style("position","absolute");

          // Group agreements by Year (create an array of objects whose key is the year and value is an array of objects (one per agreement))
          var dats = d3.nest()
               .key(function(d){ return d.Dat; }).sortKeys(d3.ascending)         // sort by Agreement's Date Signed
               .sortValues(function(a,b){ return d3.ascending(a.Agt, b.Agt); })  // sort by Agreement's Name
               .entries(data);
          var datList = (d3.map(dats, function(dat){ return dat.key; })).keys(); // array of Dat values
          // console.log(years); // an array of objects
          // console.log(years[0].values); // array of objects (one for each agreement in 1990)
          // console.log(years[0].values[0]); // first agreement object from 1990
          // console.log(years[0].values[0].Year); // Year (as number) of the first agreement object from 1990

          // Count the total agreements in each year
          var yr_count = d3.nest()
               .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
               .rollup(function(leaves){ return leaves.length; })
               .entries(data);

          // Find the maximum number of agreements on a date
          var maxAgts = d3.max(dats, function(dat){ return dat.values.length; });  // 9

          // Calculate the size of each agreement in the display space
          var agtWidth = (width/data.length)*4;

          // Set up the x axis (for the timeline and bar chart)
          // Find the earliest & latest day of the year on which agreements are written
          var minDay = d3.min(data,function(d){ return (d.Dat); });
          var maxDay = d3.max(data,function(d){ return (d.Dat); });
          var x = d3.scaleTime()
                      .domain([minDay,maxDay])  // data space
                      .range([0,width]);  // display space

          var maxAgtsYr = d3.max(yr_count, function(d){ return d.value; });  // 91
          // Set up the y axis (for the bar chart)
          var y = d3.scaleLinear()
                      .domain([0,maxAgtsYr])
                      .rangeRound([(height - (xHeight+agtHeight)),margin.top]);

          // Define the full timeline chart SVG element
          var svg = d3.select("body").select("#chart").append("svg")
              .attr("height", height + margin.top + margin.bottom)
              .attr("width", width + margin.left + margin.right)

          var chartGroup = svg.append("g")
                      .attr("class","chartGroup")
                      .attr("transform","translate("+margin.left+","+margin.top+")")
                      // .call(d3.zoom()
                      //           .scaleExtent([1,100]) // prevent zoom out, restrict zoom in
                      //           .translateExtent([ [0, 0], [width,height]]) // restrict panning (<- & ->)
                      //           .on("zoom",zoom));
                      // Draw bar graph

          chartGroup.selectAll(".bar")
              .data(yr_count)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d){ return x(parseYear(d.key))+margin.left; })
              .attr("y", function(d){ return y(d.value); })
              .attr("width", (width/yr_count.length))
              .attr("height", function(d){ return (height-xHeight-agtHeight) - y(d.value); })
              .attr("stroke","#c4c4c4")  // same as html background-color
              .attr("stroke-width","1px")
              /*
              WHY DOES HOVER FLASH THE RECTANGLES???
              */
              .on("mousemove", function(d){
                this.style.fill = "#ffffff";
                tooltip.style("opacity","0.9")
                  .style("left", d3.event.pageX+"px")
                  .style("top", d3.event.pageY+"px")
                  .style("background","#ffffff")
                  .style("padding","5px")
                  .attr("class","tooltip");
                tooltip.html("<p>Total Agreements in "+d.key+":<br/><b>"+d.value+"</b></p>");
              })
              .on("mouseout",function(d) {
                this.style.fill = "black"
                tooltip.style("opacity","0")
                  .style("left",d3.event.pageX+"px")
                  .style("top",d3.event.pageY+"px");
              });

          for (dat = 0; dat < datList.length; dat++){
            var yearGroup = chartGroup.append("g")
                .attr("class","yearGroup");
                // .attr("transform","translate(0,0)");

            var rects = yearGroup.selectAll("rects.agt")
                .data(dats[dat].values)
              .enter().append("rect")
                .attr("class","agt")
                .attr("id",function(d){ return d.AgtId; })
                .attr("fill","black")
                .attr("stroke","#c4c4c4")  // same as html background-color
                .attr("stroke-width","1px")
                .style("opacity", "0.7")
                .attr("x", function(d){ return x(d.Dat); })
                .attr("y",function(d,i){ return (height - xHeight - (agtHeight-1) + ((agtHeight/(dats[dat].values.length)) * i) )+"px"; })
                .attr("width", agtWidth+"px")
                .attr("height", (agtHeight/dats[dat].values.length)+"px");

            rects.on("mousemove",function(d){
                   if (this.style.opacity != "0"){
                     this.style.fill = "#ffffff";
                     this.style.stroke = "#ffffff";
                     // Core agreement information (name, date, region, country/entity, status, type & stage)
                     agt = d.Agt;
                     dat = formatDate(d.Dat);
                     reg = d.Reg;
                     con = d.Con;
                     status = d.Status;
                     agtp = d.Agtp;
                     stage = d.Stage;
                     window.localStorage.setItem("paxagt", agt);
                     window.localStorage.setItem("paxdat", dat);
                     window.localStorage.setItem("paxreg", reg);
                     window.localStorage.setItem("paxcon", con);
                     window.localStorage.setItem("paxstatus", status);
                     window.localStorage.setItem("paxagtp", agtp);
                     window.localStorage.setItem("paxstage", stage);
                   }
                 });
            rects.on("mouseout",function(d) {
                   this.style.fill = "black"
                   this.style.stroke = "#c4c4c4";
                   window.localStorage.setItem("paxagt", "Hover over an agreement to view its details.");
                   window.localStorage.setItem("paxdat", "");
                   window.localStorage.setItem("paxreg", "");
                   window.localStorage.setItem("paxcon", "");
                   window.localStorage.setItem("paxstatus", "");
                   window.localStorage.setItem("paxagtp", "");
                   window.localStorage.setItem("paxstage", "");
                 });

          } // end of for loop

           // Draw y axis (for the bar chart)
           chartGroup.append("g")
                   .attr("class","yaxis bar")
                   .style("opacity","0")
                   .call(d3.axisLeft(y));

          // Draw x axis (for the timeline & bar chart)
          var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%d %b %Y")).tickPadding([5]);

          var gX = chartGroup.append("g")
               .attr("class","xaxis")
               .attr("transform","translate(0,"+(height-xHeight)+")")
               .call(xAxis);

           // NEED TO FIX ZOOM!
           // function zoom() {
           //   // chartGroup.attr("transform", d3.event.transform);

           //   var newX = d3.event.transform.rescaleX(x);
           //   gX.transition()
           //     .duration(50)
           //     .call(xAxis.scale(newX));
           //   rects.attr("x",function(d){ return newX(d.Dat); });
           // }


      }) // end of .get(error,data)

  }; // end of callFunction()
