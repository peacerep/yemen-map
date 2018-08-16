/*
Horizontal Timeline with Agreements Grouped by Date
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
var paxPol = window.localStorage.setItem("paxPol",0); // Political institutions
var paxEps = window.localStorage.setItem("paxEps",0); // Economic power sharing
var paxMps = window.localStorage.setItem("paxMps",0); // Military power sharing
var paxPolps = window.localStorage.setItem("paxPolps",0); // Political power sharing
var paxTerps = window.localStorage.setItem("paxTerps",0); // Territorial power sharing
var paxTjMech = window.localStorage.setItem("paxTjMech",0); // Transitional justice past mechanism
var paxGeWom = window.localStorage.setItem("paxGeWom",0); // Women, girls and gender

var paxANY = window.localStorage.setItem("paxANY",0); // Selected ANY filter rule
var paxALL = window.localStorage.setItem("paxALL",1); // Selected ALL filter rule

window.localStorage.setItem("paxConRule","all"); // Selected ANY country/entity rule

var newMinDay = window.localStorage.setItem("paxNewMinDay", "01/01/1990");
var newMaxDay = window.localStorage.getItem("paxNewMaxDay", "31/12/2015");
var zoom = false;

callFunction();
d3.select(window).on("resize", callFunction);
window.addEventListener("storage", toUpdate);

function toUpdate(){
  if (window.localStorage.getItem("updateHorizontal") == "true"){
    return callFunction();
  }
}

function getFilters(){
  var locStor = window.localStorage;
  // Filter rule
  // paxRule = locStor.getItem("paxRule");
  paxANY = locStor.getItem("paxANY");
  paxALL = locStor.getItem("paxALL");
  // Filter codes
  paxHrFra = locStor.getItem("paxHrFra");
  paxHrGen = locStor.getItem("paxHrGen");
  paxPol = locStor.getItem("paxPol");
  paxEps = locStor.getItem("paxEps");
  paxMps = locStor.getItem("paxMps");
  paxPolps = locStor.getItem("paxPolps");
  paxTerps = locStor.getItem("paxTerps");
  paxTjMech = locStor.getItem("paxTjMech");
  paxGeWom = locStor.getItem("paxGeWom");

  newMinDay = locStor.getItem("paxNewMinDay");
  newMaxDay = locStor.getItem("paxNewMaxDay");
};

function callFunction() {
  console.log("Drawing visualization");
  var paxCons = JSON.parse(window.localStorage.getItem("paxCons"));
  var paxConRule = localStorage.getItem("paxConRule");
  getFilters();

  // Agreement information to display upon hover
  var agt = "Hover over an agreement to view its details.",
      dat = "",
      reg = "",
      con = "",
      status = "",
      agtp = "",
      stage = "",
      substage = "";
  window.localStorage.setItem("paxagt", agt);
  window.localStorage.setItem("paxdat", dat);
  window.localStorage.setItem("paxreg", reg);
  window.localStorage.setItem("paxcon", con);
  window.localStorage.setItem("paxstatus", status);
  window.localStorage.setItem("paxagtp", agtp);
  window.localStorage.setItem("paxstage", stage);
  window.localStorage.setItem("paxsubstage", substage);

  // Date parsers & formatters
  var parseDate = d3.timeParse("%d/%m/%Y");
  var parseMonth = d3.timeParse("%m");
  var parseYear = d3.timeParse("%Y");
  var parseDay = d3.timeParse("%j");
  var formatDate = d3.timeFormat("%d %B %Y");
  var formatDateShort = d3.timeFormat("%d/%m/%Y");
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

          // Create dat count tooltip
          var tooltip = d3.select("body").append("div")
              .style("opacity","0")
              .style("position","absolute")
              .attr("class","tooltip");

          var margin = {top: 4, right: 5, bottom: 5, left: 5}, //read clockwise from top
              width = parseInt(d3.select("body").style("width"), 10),
              width = width - margin.left - margin.right,
              height = 170 - margin.top - margin.bottom,
              descriptHeight = 20,
              agtHeight = 10,//(height/2)-descriptHeight,
              xHeight = 45,
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
               // .rollup(function(leaves){ return leaves.length; })
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

          // Set up the x axis (for the timeline and bar chart)
          // Find the earliest & latest day of the year on which agreements are written
          if ((newMinDay.length > 0) && (newMaxDay.length > 0)){
            var x = d3.scaleTime()
                  .domain([parseDate(newMinDay),parseDate(newMaxDay)])
                  .range([margin.left,width]);
          } else {
            var minDay = d3.min(data,function(d){ return (d.Dat); });
            window.localStorage.setItem("paxNewMinDay",formatDateShort(minDay));
            var maxDay = d3.max(data,function(d){ return (d.Dat); });
            window.localStorage.setItem("paxNewMaxDay",formatDateShort(maxDay));
            var x = d3.scaleTime()
                        .domain([minDay,maxDay])  // data space
                        .range([margin.left,width]);  // display space
          }
          // Find the earliest & latest year in which agreements occur
          var minYear = d3.min(yr_count_nest,function(d){ return d.key; });
          var maxYear = d3.max(yr_count_nest,function(d){ return d.key; });

          var svg = d3.select("body").select("#chart").append("svg")
              .attr("height", height + margin.top + margin.bottom)//"100%")
              .attr("width", width + margin.left + margin.right);//"100%");
              // .call(d3.zoom()
              //           .scaleExtent([1,100]) // prevent zoom out, restrict zoom in
              //           .translateExtent([ [0, 0], [width,height]]) // restrict panning (<- & ->)
              //           .on("zoom",zoom));

          var chartGroup = svg.append("g")
                      .attr("class","chartGroup") //
                      .attr("transform","translate("+margin.left+","+margin.top+")");

          // Make one rectangle per Dat with height based on number of agreements
          for (dat = 0; dat < datList.length; dat++){
            var datGroup = chartGroup.append("g")
                .attr("class","datGroup");

            var datCount = getCount(dats[dat].values);

            var rects = chartGroup.selectAll("rect.count")
                .data(dats[dat].values)
              .enter().append("rect")
              .filter(function(d){ return setAgtTimePeriod(d); })
              .filter(function(d){ return setAgtFilters(d); })
              .filter(function(d){ return setAgtCons(d); })
                .attr("class","agt")
                .attr("id", datCount)
                .attr("fill","black")
                .attr("stroke","#c4c4c4")  // same as html background-color
                .attr("stroke-width","1px")
                .style("opacity", "0.7")
                // .style("visibility",function(d){ setVisibility(d, zoom, newMinDay, newMaxDay); })
                .attr("x", function(d){ return x(d.Dat); })
                .attr("y", (height-xHeight-(agtHeight*datCount))+"px")
                .attr("width", agtWidth+"px")
                .attr("height", (agtHeight*datCount)+"px");

            // Display number of agreements signed on date upon hover
            rects.on("mousemove",function(d){
                this.style.fill = "#ffffff";
                tooltip.style("opacity","0.9")
                  .style("left", (d3.event.pageX/2)+"px")
                  .style("top", d3.event.pageY+"px")
                  .style("background","#ffffff")
                  .style("padding","10px")
                  .attr("class","tooltip");
                tooltip.html("<p>Agreements signed on<br/>"+formatDate(d.Dat)+":<br/><b>"+this.id+"</b></p>");
            });
            rects.on("mouseout",function(d) {
               this.style.fill = "black";
               this.style.stroke = "#c4c4c4";
               tooltip.style("opacity","0");
             });

            } // end of for loop for rects.count

            /*
            TIMELINE DESCRIPTION
            */
            chartGroup.append("text")
                        .attr("x", margin.left+"px")
                        .attr("y", margin.top)
                        .attr("class","description")
                        .text("Selected Countries/Entities: "+(getConText(paxCons)));
            chartGroup.append("text")
                        .attr("x", margin.left+"px")
                        .attr("y", margin.top*4)
                        .attr("class","description")
                        .text("Selected Codes:"+(getCodeText()));
            chartGroup.append("text")
                        .attr("x", margin.left+"px")
                        .attr("y", margin.top*7)
                        .attr("class","description")
                        .text("Selected Time Period: "+newMinDay+" through "+newMaxDay);

            /*
            FUNCTIONS
            */
            function getConText(paxCons){
              var paxConsCount = paxCons.length;
              if (paxConsCount == 161){
                return "All";
              } else if (paxConsCount > 0){
                var conText = ""
                for (i = 0; i < (paxConsCount-1); i++){
                  conText += String(paxCons[i]) + ", ";
                }
                conText += String(paxCons[paxConsCount-1]);
                return conText;
              } else {
                return "None";
              }
            }

            function getCodeText(){
              var codeFilters = [+paxHrFra, +paxHrGen, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom];
              var codeFilterCount = codeFilters.length;
              var codeText = "";
              var vizCodes = ["Human Rights Framework", "Human Rights/Rule of Law", "Political Institutions", "Power Sharing: Economic", "Power Sharing: Military", "Power Sharing: Political", "Power Sharing: Territorial", "Transitional Justice Past Mechanism", "Women, Girls and Gender"];
              var codeIndeces = [];
              for (i = 0; i < codeFilterCount; i++){
                if (codeFilters[i] > 0){
                  codeText += " " + vizCodes[i] + ",";
                }
              }
              if (codeText.length == 0){
                return " None";
              }
              codeText = codeText.slice(0,-1);
              return codeText;
            }

            function setAgtTimePeriod(d){
              var minDate = parseDate(newMinDay);
              var maxDate = parseDate(newMaxDay);
              var agmtDat = d.Dat;
              if ((agmtDat >= minDate) && (agmtDat <= maxDate)){
                return d;
              }
            }

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
              var agmtCon = String(d.Con);
              if (paxConRule == "any"){
                if (paxCons.length > 0){
                  for (i = 0; i < paxCons.length; i++){
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
                  }
                }
                if (!mismatch){
                  return d;
                }
              }
            }

            function getCount(values){
              var count = values.length;
              for (v = 0; v < values.length; v++){
                var d = values[v];
                var subtracted = false;
                // Subtract agreements that don't have selected codes
                var agmtCodes = [d.GeWom, d.HrFra, d.HrGen, d.Eps, d.Mps, d.Pol, d.Polps, d.Terps, d.TjMech];
                var codeFilters = [+paxGeWom, +paxHrFra, +paxHrGen, +paxEps, +paxMps, +paxPol, +paxPolps, +paxTerps, +paxTjMech];
                var codeFilterCount = codeFilters.length;
                if (paxANY == 1){
                  var pass = false;
                  for (i = 0; i < codeFilterCount; i++){
                    if ((codeFilters[i] > 0) && (agmtCodes[i] > 0)){ pass = true; }
                  } if (!pass) {
                    count -= 1;
                    subtracted = true;
                  }
                } else { // if paxALL == 1
                  var mismatch = false;
                  for (j = 0; j < codeFilterCount; j++){
                    if ((codeFilters[j] > 0) && agmtCodes[j] == 0){ mismatch = true; }
                  } if (mismatch){
                      count -= 1;
                      subtracted = true;
                  }
                }
                if (!subtracted){
                  // Subtract agreements that don't have selected countries/entities
                  var agmtCon = String(d.Con);
                  if (paxConRule == "any"){
                    if (paxCons.length > 0){
                      for (i = 0; i < paxCons.length; i++){
                        var pass = false;
                        if (agmtCon.includes(paxCons[i])){ pass = true; }
                      } if (!pass){
                        count -= 1;
                        subtracted = true;
                      }
                    }
                  } if (paxConRule == "all") {
                    var mismatch = false;
                    for (j = 0; j < paxCons.length; j++){
                      if (!(agmtCon.includes(paxCons[j]))){
                        mismatch = true;
                      }
                    } if (mismatch){
                      count -= 1;
                      subtracted = true;
                    }
                  }
                }
              }
              return count;
            }

           /*
           DRAW X AXIS
           */
           var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%e %b %Y")).tickPadding([5]);

           var gX = chartGroup.append("g")
                .attr("class","xaxis")
                .attr("id","dat")
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
