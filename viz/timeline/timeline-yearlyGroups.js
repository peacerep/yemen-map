/*
Timeline with agreements grouped by year
TRY ONE Y AXIS PER YEAR - didn't work
TRY EACH YEAR AS Y AXIS USING SCALEPOINT, space out SVG element per year instead of using x axis
TRY EACH YEAR AS INDIVIDUAL BAR CHART
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

  // getFilters();
  //
  // // Agreement information to display upon hover
  // var agt = "Hover over an agreement to view its details.",
  //     dat = "",
  //     reg = "",
  //     con = "",
  //     status = "",
  //     agtp = "",
  //     stage = "";
  // window.localStorage.setItem("paxagt", agt);
  // window.localStorage.setItem("paxdat", dat);
  // window.localStorage.setItem("paxreg", reg);
  // window.localStorage.setItem("paxcon", con);
  // window.localStorage.setItem("paxstatus", status);
  // window.localStorage.setItem("paxagtp", agtp);
  // window.localStorage.setItem("paxstage", stage);

  // Date parsers & formatters
  var parseDate = d3.timeParse("%d/%m/%Y");
  var parseMonth = d3.timeParse("%m");
  var parseYear = d3.timeParse("%Y");
  var parseDay = d3.timeParse("%j");
  var formatDate = d3.timeFormat("%d %B %Y");
  var formatMonth = d3.timeFormat("%m");
  var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
  var formatYear = d3.timeFormat("%Y");

  var margin = {top: 5, right: 65, bottom: 5, left: 5}, //read clockwise from top
      width = parseInt(d3.select("body").style("width"), 10),
      width = width - margin.left - margin.right,
      agtHeight = 2,
      xTickHeight = 15,
      agtPadding = 5;

  // var y = d3.scaleLinear()
  //     .range([margin.top,height]);  // display space
  //
  var x = d3.scalePoint()
      .range([margin.left, width]);

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

          // // Group agreements by Reg (region)
          // var regs = d3.nest()
          //      .key(function(d){ return d.Reg; }).sortKeys(d3.ascending)
          //      .entries(data);

          // Group agreements by Year (create an array of objects whose key is the year and value is an array of objects (one per agreement))
          var years = d3.nest()
               .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
               .sortValues(function(a,b){ return d3.ascending(a.Dat, b.Dat); })
               .entries(data);
          var yrList = (d3.map(years, function(year){ return year.key; })).keys(); // array of year values
          // console.log(years); // an array of objects
          // console.log(years[0].values); // array of objects (one for each agreement in 1990)
          // console.log(years[0].values[0]); // first agreement object from 1990
          // console.log(years[0].values[0].Year); // Year (as number) of the first agreement object from 1990

          // Find the maximum number of agreements in a single year
          var maxAgts = d3.max(years, function(year){ return year.values.length; });
          var height = (maxAgts*(agtHeight*1.5))+(xTickHeight*2) + margin.top + margin.bottom; //defines w & h as inner dimensions of chart area
          // console.log(maxAgts); // 91

          // Calculate the size of each agreement in the display space
          var agtWidth = (width/(yrList.length))-agtPadding;

          // Set up the x axis
          var minYear = d3.min(data,function(d){ return parseYear(d.Year-1); });
          var maxYear = d3.max(data,function(d){ return parseYear(d.Year); });
          var x = d3.scaleTime()
                      .domain([minYear,maxYear])  // data space
                      .range([margin.left,width]);  // display space

          // Define the full timeline chart SVG element
          var svg = d3.select("body").select("#chart").append("svg")
              .attr("height", height + margin.top + margin.bottom)
              .attr("width", width + margin.left + margin.right)

          for (year = 0; year < yrList.length; year++){
            var chartGroup = svg.append("g")
                        .attr("class","chartGroup") //
                        .attr("transform","translate("+margin.left+","+margin.top+")")
                        // .call(d3.zoom()
                        //           .scaleExtent([1,100]) // prevent zoom out, restrict zoom in
                        //           .translateExtent([ [0, 0], [width,height]]) // restrict panning (<- & ->)
                        //           .on("zoom",zoom));
            console.log(years[year].values);
            var rects = chartGroup.selectAll("rects.agt")
                .data(years[year].values)
              .enter().append("rect")
                .attr("class","agt")
                .attr("id",function(d){ return d.AgtId; })
                .attr("name",function(d){ return d.Agt; })
                .attr("value",function(d){ return d.Year; })
                .attr("fill","black")
                .attr("stroke","#c4c4c4")  // same as html background-color
                .attr("stroke-width","1px")
                .style("opacity", "1")
                .attr("x", function(d){ return x(parseYear(d.Year)) - (agtWidth/2); })
                // .attr("y", function(d){ return y((years[i].values.indexOf(d)) * agtHeight); })
                .attr("y",function(d,i){ return (height-xTickHeight-2-((agtHeight*1.5)*(i)))+"px"; })
                .attr("width", agtWidth+"px")
                .attr("height", agtHeight+"px");

            rects.on("mousemove",function(d){
                   if (this.style.opacity != "0"){
                     //console.log(d.Agt);
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
          }

          // Draw X axis for the entire chart
          var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")).tickPadding([5]);

          var gX = chartGroup.append("g")
               .attr("class","xaxis")
               .attr("transform","translate(0,"+(height-xTickHeight)+")")
               .call(xAxis);

         // function zoom() {
         //   gX.transition()
         //   .duration(50)
         //   .call(xAxis.scale(d3.event.transform.rescaleX(x)));
         //
         //   var newX = d3.event.transform.rescaleX(x);
         //   rects.attr("x",function(d){ return newX(d.Dat); });
         // }

      }) // end of .get(error,data)

  }; // end of callFunction()
