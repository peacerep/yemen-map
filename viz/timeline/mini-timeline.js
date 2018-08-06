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

// Define one key/value pair per category (code) by which to filter which
// agreements the timeline and map visualize, checking all paxfilters
// (value = 1) upon page load so all agreements are visible
var paxHrFra = window.localStorage.setItem("paxHrFra",1); // Human rights framework
var paxHrGen = window.localStorage.setItem("paxHrGen",1);; // Human rights/Rule of law
var paxMps = window.localStorage.setItem("paxMps",1); // Military power sharing
var paxEps = window.localStorage.setItem("paxEps",1); // Economic power sharing
var paxTerps = window.localStorage.setItem("paxTerps",1); // Territorial power sharing
var paxPolps = window.localStorage.setItem("paxPolps",1); // Political power sharing
var paxPol = window.localStorage.setItem("paxPol",1); // Political institutions
var paxGeWom = window.localStorage.setItem("paxGeWom",1); // Women, girls and gender
var paxTjMech = window.localStorage.setItem("paxTjMech",1); // Transitional justice past mechanism

var paxANY = window.localStorage.setItem("paxANY",1); // Selected ANY filter rule
var paxALL = window.localStorage.setItem("paxALL",0); // Selected ALL filter rule


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
  // Con (country/entity) filters - NOT WORKING!
  // paxCons = JSON.parse(locStor.getItem("paxCons"));
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

  var clicked = false; // keep track of whether an agreement on timeline has been clicked

  // Obtain data
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

          var svgtest = d3.select("body").select("svg");
          if (!svgtest.empty()) {
            svgtest.remove();
          };

          var margin = {top: 5, right: 5, bottom: 5, left: 5}, //read clockwise from top
              width = parseInt(d3.select("body").style("width"), 10),
              width = width - margin.left - margin.right,
              height = 60 - margin.top - margin.bottom, //defines w & h as inner dimensions of chart area
              agtHeight = 30,
              xHeight = 15;

          // // Group agreements by country/entity
          // var con_count_nest = d3.nest()
          //       .key(function(d){ return d.Con; }).sortKeys(d3.ascending)
          //       .map(data);
          // // Create an array with every country/entity (non-repeating) in which agreements occur
          // var cons = con_count_nest.keys();
          // window.localStorage.setItem("paxCons",JSON.stringify(cons));
          // var paxCons = JSON.parse(window.localStorage.getItem("paxCons"));
          // // console.log("paxCons:"+paxCons);

          // Group agreements by year
          var yr_count_nest = d3.nest()
               .key(function(d){ return formatYear(d.Year); }).sortKeys(d3.ascending)
               .rollup(function(leaves){ return leaves.length; })
               .map(data);  //.entries(data);  //.object(data);
          // Create an array of years (non-repeating) in which agreements occur
          var years = yr_count_nest.keys();

          // Find the maximum number of agreements that occur in a single year
          var max = d3.max(yr_count_nest,function(d){ return d.value; });

          // Find the earliest & latest year in which agreements occur
          var minYear = d3.min(yr_count_nest,function(d){ return d.key; });
          var maxYear = d3.max(yr_count_nest,function(d){ return d.key; });

          // Find the earliest & latest day of the year on which agreements are written
          var minDay = d3.min(data,function(d){ return (d.Dat); });
          var maxDay = d3.max(data,function(d){ return (d.Dat); });

          // WHY ARE AGTS DRAWN BEYOND ENDS OF AXIS?
          var x = d3.scaleTime()
                      .domain([minDay,maxDay])  // data space
                      .range([margin.left,width]);  // display space

          var svg = d3.select("body").select("#chart").append("svg")
              .attr("height", height + margin.top + margin.bottom)//"100%")
              .attr("width", width + margin.left + margin.right)//"100%");
              .call(d3.zoom()
                        .scaleExtent([1,100]) // prevent zoom out, restrict zoom in
                        .translateExtent([ [0, 0], [width,height]]) // restrict panning (<- & ->)
                        .on("zoom",zoom));

          var chartGroup = svg.append("g")
                      .attr("class","chartGroup") //
                      .attr("transform","translate("+margin.left+","+margin.top+")") //;

          function newVisibility(d){
            // Hide agreements from any deselected country/entity - NOT WORKING!
            // if (paxCons.indexOf(d.Con) == -1){ return "hidden";}

            var codeFilters = [paxGeWom, paxHrFra, paxHrGen, paxEps, paxMps, paxPol, paxPolps, paxTerps, paxTjMech];
            var agmtCodes = [d.GeWom, d.HrFra, d.HrGen, d.Eps, d.Mps, d.Pol, d.Polps, d.Terps, d.TjMech];

            // Hide any agreement without at least one checked code
            if (paxANY == 1 && paxALL == 0){
              var matchCount = 0;
              for (i = 0; i < codeFilters.length; i++){
                if ((codeFilters[i] == 1) && (agmtCodes[i] > 0)){
                  matchCount += 1;
                  return "visible";
                }
              }
              if (matchCount == 0){ return "hidden"; }
            }


            // Hide any agreement without all checked codes
            if (paxANY == 0 && paxALL == 1) {
              for (i=0; i < codeFilters.length; i++){
                if ((codeFilters[i] == 1) && (agmtCodes[i] == 0)) {
                  return "hidden";
                }
              }
            }
          };

          // Make one rectangle per agreement grouped by Year
          var rects = chartGroup.selectAll("rect.agt")
                  .data(data)
                  .enter().append("rect")
                     .attr("class","agt")
                     .attr("id", "rects")
                     .attr("fill","black")
                     .attr("stroke","#c4c4c4")  // same as html background-color
                     .attr("stroke-width","2px")
                     .style("opacity", "1")
                     .attr("x",function(d){ return x(d.Dat); })
                     .attr("y",function(d){ return (height-xHeight-(agtHeight-1))+"px"; })
                     .style("visibility",newVisibility)
                     .attr("width","2px")
                     .attr("height",agtHeight+"px");
            rects.on("mousemove",function(d){
                   if ((this.style.opacity != "0") && (clicked == false)){
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
              if (clicked == false){
                this.style.fill = "black"
                this.style.stroke = "#c4c4c4";
                window.localStorage.setItem("paxagt", "Hover over an agreement to view its details.");
                window.localStorage.setItem("paxdat", "");
                window.localStorage.setItem("paxreg", "");
                window.localStorage.setItem("paxcon", "");
                window.localStorage.setItem("paxstatus", "");
                window.localStorage.setItem("paxagtp", "");
                window.localStorage.setItem("paxstage", "");
              }
            });
            rects.on("click", function(d){
              if (clicked == false){
                clicked = true;
              } else {
                clicked = false;
              }
              console.log(clicked);
              if ((this.style.opacity != "0") && (clicked == false)){
                this.style.fill = "black"
                this.style.stroke = "#c4c4c4";
                window.localStorage.setItem("paxagt", "Hover over an agreement to view its details.");
                window.localStorage.setItem("paxdat", "");
                window.localStorage.setItem("paxreg", "");
                window.localStorage.setItem("paxcon", "");
                window.localStorage.setItem("paxstatus", "");
                window.localStorage.setItem("paxagtp", "");
                window.localStorage.setItem("paxstage", "");
              }
              if ((this.style.opacity != "0") && (clicked == true)){
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

             // Draw axes
             var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%e %b %Y")).tickPadding([5]);

             var gX = chartGroup.append("g")
                  .attr("class","xaxis")
                  .attr("transform","translate(0,"+(height-xHeight)+")")
                  .call(xAxis);

            function zoom() {
              gX.transition()
              .duration(50)
              .call(xAxis.scale(d3.event.transform.rescaleX(x)));

              var newX = d3.event.transform.rescaleX(x);
              rects.attr("x",function(d){ return newX(d.Dat); });
            }

      }) // end of .get(error,data)

  }; // end of callFunction()
