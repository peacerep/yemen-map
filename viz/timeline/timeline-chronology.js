/*
HORIZONTAL TIMELINE - AGREEMENTS GROUPED BY DAT
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
var paxHrFra = window.localStorage.setItem("paxHrFra",0); // Human rights framework
var paxHrGen = window.localStorage.setItem("paxHrGen",0); // Human rights/Rule of law
var paxMps = window.localStorage.setItem("paxPol",0); // Military power sharing
var paxEps = window.localStorage.setItem("paxEps",0); // Economic power sharing
var paxTerps = window.localStorage.setItem("paxMps",0); // Territorial power sharing
var paxPolps = window.localStorage.setItem("paxPolps",0); // Political power sharing
var paxPol = window.localStorage.setItem("paxTerps",0); // Political institutions
var paxGeWom = window.localStorage.setItem("paxTjMech",0); // Women, girls and gender
var paxTjMech = window.localStorage.setItem("paxGeWom",0); // Transitional justice past mechanism

var paxANY = window.localStorage.setItem("paxANY",0); // Selected ANY filter rule
var paxALL = window.localStorage.setItem("paxALL",1); // Selected ALL filter rule

window.localStorage.setItem("paxConRule","all"); // Selected ANY country/entity rule

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
  console.log("Drawing visualization");
  var paxCons = JSON.parse(window.localStorage.getItem("paxCons")); // Country/entity list (includes all upon load)
  var paxConRule = localStorage.getItem("paxConRule");
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
              height = 100 - margin.top - margin.bottom,
              agtHeight = height/2,
              xHeight = 15,
              agtPadding = 5,
              agtSpacing = 1;

          // Group agreements by year
          var yr_count_nest = d3.nest()
               .key(function(d){ return formatYear(d.Year); }).sortKeys(d3.ascending)
               .rollup(function(leaves){ return leaves.length; })
               .map(data);  //.entries(data);  //.object(data);
          // Create an array of years (non-repeating) in which agreements occur
          var years = yr_count_nest.keys();

          // Group agreements by Dat (create an array of objects whose key is the year and value is an array of objects (one per agreement))
          var dats = d3.nest()
               .key(function(d){ return d.Dat; }).sortKeys(d3.ascending)         // sort by Agreement's Date Signed
               .sortValues(function(a,b){ return d3.ascending(a.Agt, b.Agt); })  // sort by Agreement's Name
               .entries(data);
          var datList = (d3.map(dats, function(dat){ return dat.key; })).keys(); // array of Dat values

          // Group agreements by country/entity
          var cons = d3.nest() //con_yr_count
                .key(function(d){ return d.Con; }).sortKeys(d3.ascending)
                // .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
                .rollup(function(leaves){ return leaves.length; })
                .entries(data);
          // var conList = (d3.map(cons, function(con){ return con.key; })).keys(); // object with Cons (country/entity values)
          // localStorage.setItem("paxCons",JSON.stringify(conList));

          // Find the maximum number of agreements that occur in a single year
          var max = d3.max(yr_count_nest,function(d){ return d.value; });

          // Calculate the size of each agreement in the display space
          var agtWidth = (width/data.length)*2;
          // var agtWidth = (width/(years.length))-agtPadding;

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
              // .call(d3.zoom()
              //           .scaleExtent([1,100]) // prevent zoom out, restrict zoom in
              //           .translateExtent([ [0, 0], [width,height]]) // restrict panning (<- & ->)
              //           .on("zoom",zoom));

          var chartGroup = svg.append("g")
                      .attr("class","chartGroup") //
                      .attr("transform","translate("+margin.left+","+margin.top+")") //;

          // function setVisibility(d){
          //   // Hide agreements from any deselected country/entity
          //   var paxCon = window.localStorage.getItem("paxCons");  // For array of cons: var paxCons = JSON.parse(window.localStorage.getItem("paxCons"));
          //   console.log(paxCon);
          //   if ((paxCon != "allCons") && (paxCon != d.Con)){ return "hidden"; }  // CHANGE TO INCLUDE ANY COUNTRY OR ENTITY NAME AS DB SEARCH PAGE DOES
          //
          //   var codeFilters = [paxGeWom, paxHrFra, paxHrGen, paxEps, paxMps, paxPol, paxPolps, paxTerps, paxTjMech];
          //   var agmtCodes = [d.GeWom, d.HrFra, d.HrGen, d.Eps, d.Mps, d.Pol, d.Polps, d.Terps, d.TjMech];
          //   // Hide any agreement without at least one checked code
          //   if (paxANY == 1 && paxALL == 0){
          //     var matchCount = 0;
          //     for (i = 0; i < codeFilters.length; i++){
          //       if ((codeFilters[i] == 1) && (agmtCodes[i] > 0)){
          //         matchCount += 1;
          //         return "visible";
          //       }
          //     }
          //     if (matchCount == 0){ return "hidden"; }
          //   }
          //   // Hide any agreement without all checked codes
          //   if (paxANY == 0 && paxALL == 1) {
          //     for (i=0; i < codeFilters.length; i++){
          //       if ((codeFilters[i] == 1) && (agmtCodes[i] == 0)) {
          //         return "hidden";
          //       }
          //     }
          //   }
          // };

          // Make one rectangle per agreement grouped by Year
          for (dat = 0; dat < datList.length; dat++){
            var yearGroup = chartGroup.append("g")
                .attr("class","yearGroup");

            var rects = yearGroup.selectAll("rects.agt")
                .data(dats[dat].values)
              .enter().append("rect")
              .filter(function(d){ return setAgtFilters(d); })
              .filter(function(d){ return setAgtCons(d); })
                .attr("class","agt")
                .attr("id",function(d){ return d.AgtId; })
                .attr("fill","black")
                .attr("stroke","#c4c4c4")  // same as html background-color
                .attr("stroke-width","1px")
                .style("opacity", "0.7")
                // .style("visibility",setVisibility)
                .attr("x", function(d){ return x(d.Dat); })
                .attr("y",function(d,i){ return (height-xHeight-(agtHeight) + ((agtHeight/(dats[dat].values.length)) * i) )+"px"; })
                // .attr("y",function(d,i){ return (height-xHeight-margin.bottom-(agtHeight*1.5)-((agtHeight)*(i*agtSpacing)))+"px"; })
                .attr("width", agtWidth+"px")
                .attr("height", (agtHeight/dats[dat].values.length)+"px");

            rects.on("mousemove",function(d){
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
            // rects.on("click", function(d){
            //   if (clicked == false){
            //     clicked = true;
            //   } else {
            //     clicked = false;
            //   }
            //   console.log(clicked);
            //   if ((this.style.opacity != "0") && (clicked == false)){
            //     this.style.fill = "black"
            //     this.style.stroke = "#c4c4c4";
            //     window.localStorage.setItem("paxagt", "Hover over an agreement to view its details.");
            //     window.localStorage.setItem("paxdat", "");
            //     window.localStorage.setItem("paxreg", "");
            //     window.localStorage.setItem("paxcon", "");
            //     window.localStorage.setItem("paxstatus", "");
            //     window.localStorage.setItem("paxagtp", "");
            //     window.localStorage.setItem("paxstage", "");
            //   }
            //   if ((this.style.opacity != "0") && (clicked == true)){
            //     this.style.fill = "#ffffff";
            //     this.style.stroke = "#ffffff";
            //     // Core agreement information (name, date, region, country/entity, status, type & stage)
            //     agt = d.Agt;
            //     dat = formatDate(d.Dat);
            //     reg = d.Reg;
            //     con = d.Con;
            //     status = d.Status;
            //     agtp = d.Agtp;
            //     stage = d.Stage;
            //     window.localStorage.setItem("paxagt", agt);
            //     window.localStorage.setItem("paxdat", dat);
            //     window.localStorage.setItem("paxreg", reg);
            //     window.localStorage.setItem("paxcon", con);
            //     window.localStorage.setItem("paxstatus", status);
            //     window.localStorage.setItem("paxagtp", agtp);
            //     window.localStorage.setItem("paxstage", stage);
            //   }
            // });
            } // end of for loop for rects.agt

            function setAgtFilters(d){
              var agmtCodes = [d.GeWom, d.HrFra, d.HrGen, d.Eps, d.Mps, d.Pol, d.Polps, d.Terps, d.TjMech];
              var codeFilters = [+paxGeWom, +paxHrFra, +paxHrGen, +paxEps, +paxMps, +paxPol, +paxPolps, +paxTerps, +paxTjMech];
              var codeFilterCount = codeFilters.length;
              if (paxANY == 1){
                for (i = 0; i < codeFilterCount; i++){
                  if ((codeFilters[i] == 1) && (agmtCodes[i] > 0)){
                    return d;
                  }
                }
              } else { // if paxALL == 1
                var mismatch = false;
                for (j = 0; j < codeFilterCount; j++){
                  if ((codeFilters[j] == 1) && agmtCodes[j] == 0){
                    mismatch = true;
                  }
                }
                if (!mismatch){
                  return d;
                }
              }
            }

            function setAgtCons(d){
              // TO DO: list item is single con/entity
              var agmtCon = String(d.Con);
              if (paxConRule == "any"){
                if (paxCons.length > 0){
                  for (i = 0; i < paxCons.length; i++){
                    // if (!(agmtCon.includes(paxCons[i]))){
                    //   console.log(agmtCon);
                    // }
                    if (agmtCon.includes(paxCons[i])){
                      return d;
                    }
                  }
                }
              }
              if (paxConRule == "all") {
                var mismatch = false;
                for (j = 0; j < paxCons.length; j++){
                  if (!(agmtCon.includes(paxCons[j]))){
                    mismatch = true;
                    // console.log("Mismatched: "+agmtCon);
                  }
                }
                if (!mismatch){
                  return d;
                }
              }
            }

           // Draw axes
           var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%e %b %Y")).tickPadding([5]);

           var gX = chartGroup.append("g")
                .attr("class","xaxis")
                .attr("transform","translate(0,"+(height-xHeight)+")")
                .call(xAxis);

            /*
            NEED TO FIX ZOOM
            */
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
