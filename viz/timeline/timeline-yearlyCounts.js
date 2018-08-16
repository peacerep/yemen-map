/*
Horizontal Timeline with Agreements Grouped by Year showing Yearly Total Count
*/

// Define one key/value pair per category (code) by which to filter which
// agreements the timeline and map visualize, checking all paxfilters
// (value = 1) upon page load so all agreements are visible
var paxGeWom = window.localStorage.setItem("paxGeWom",0); // Women, girls and gender
var paxHrFra = window.localStorage.setItem("paxHrFra",0); // Human rights framework
var paxHrGen = window.localStorage.setItem("paxHrGen",0); // Human rights/Rule of law
var paxMps = window.localStorage.setItem("paxMps",0); // Military power sharing
var paxEps = window.localStorage.setItem("paxEps",0); // Economic power sharing
var paxTerps = window.localStorage.setItem("paxTerps",0); // Territorial power sharing
var paxPolps = window.localStorage.setItem("paxPolps",0); // Political power sharing
var paxPol = window.localStorage.setItem("paxPol",0); // Political institutions
var paxTjMech = window.localStorage.setItem("paxTjMech",0); // Transitional justice past mechanism

// var paxRule = window.localStorage.setItem("paxRule",1); // Selected ALL filter rule
var paxANY = window.localStorage.setItem("paxANY",0); // Selected ANY filter rule
var paxALL = window.localStorage.setItem("paxALL",1); // Selected ALL filter rule

window.localStorage.setItem("paxConRule","all"); // Selected ANY country/entity rule

var newMinDay = window.localStorage.setItem("paxNewMinDay", "01/01/1990");
var newMaxDay = window.localStorage.getItem("paxNewMaxDay", "31/12/2015");

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
  paxMps = locStor.getItem("paxMps");
  paxEps = locStor.getItem("paxEps");
  paxTerps = locStor.getItem("paxTerps");
  paxPolps = locStor.getItem("paxPolps");
  paxPol = locStor.getItem("paxPol");
  paxGeWom = locStor.getItem("paxGeWom");
  paxTjMech = locStor.getItem("paxTjMech");

  newMinDay = locStor.getItem("paxNewMinDay");
  newMaxDay = locStor.getItem("paxNewMaxDay");
};

function callFunction() {
  console.log("Drawing visualization of yearly grouping");
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
  var formatMonth = d3.timeFormat("%m");
  var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
  var formatYear = d3.timeFormat("%Y");

  var margin = {top: 4, right: 65, bottom: 5, left: 5}, //read clockwise from top
      width = parseInt(d3.select("body").style("width"), 10),
      width = width - margin.left - margin.right,
      descriptHeight = 20,
      agtHeight = 1.5,
      xHeight = 10,
      agtPadding = 0.5,
      agtSpacing = 1;

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

          var svgTest = d3.select("body").select("svg");
          if (!svgTest.empty()) {
            svgTest.remove();
          };

          // Group agreements by Year (create an array of objects whose key is the year and value is an array of objects (one per agreement))
          var years = d3.nest()
               .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
               .sortValues(function(a,b){ return d3.descending(a.Dat, b.Dat); })
               .entries(data);
          var yrList = (d3.map(years, function(year){ return year.key; })).keys(); // array of year values

          var yr_count = d3.nest()
                .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
                .rollup(function(leaves){ return leaves.length; })
                .entries(data);
          // console.log(years); // an array of objects
          // console.log(years[0].values); // array of objects (one for each agreement in 1990)
          // console.log(years[0].values[0]); // first agreement object from 1990
          // console.log(years[0].values[0].Year); // Year (as number) of the first agreement object from 1990

          // Find the maximum number of agreements in a single year
          var maxAgts = d3.max(years, function(year){ return year.values.length; });
          var height = (maxAgts*agtHeight)+(xHeight*2)+(descriptHeight)+(margin.top*7); //defines w & h as inner dimensions of chart area
          // console.log(maxAgts); // 91

          // Set up the x axis
          // Find the earliest & latest years in which agreements are written
          if ((newMinDay.length > 0) && (newMaxDay.length > 0)){
            var minYear = +(newMinDay.substring(6))-1;
            var maxYear = +(newMaxDay.substring(6))+1;
            var x = d3.scaleTime()
                  .domain([parseYear(minYear),parseYear(maxYear)])
                  .range([margin.left,width]);
          } else {
            var minYear = d3.min(data,function(d){ return parseYear(d.Year-1); });
            window.localStorage.setItem("paxNewMaxDay", ("01/01/"+minYear));
            var maxYear = d3.max(data,function(d){ return parseYear(d.Year+1); });
            window.localStorage.setItem("paxNewMaxDay", ("31/12/"+maxYear));
            var x = d3.scaleTime()
                        .domain([minYear,maxYear])  // data space
                        .range([margin.left,width]);  // display space
          }

          // Calculate the size of each agreement in the display space
          var agtWidth = width/(maxYear-minYear)-agtPadding;

          // Define the full timeline chart SVG element
          var svg = d3.select("body").select("#chart").append("svg")
              .attr("height", height + margin.top + margin.bottom)
              .attr("width", width + margin.left + margin.right)

          for (year = 0; year < yrList.length; year++){
            var chartGroup = svg.append("g")
                        .attr("class","yearGroup")
                        .attr("transform","translate("+margin.left+","+margin.top+")")

            var rects = chartGroup.selectAll("rects.agt")
                .data(years[year].values)
              .enter().append("rect")
              .filter(function(d){ return setAgtTimePeriod(d); })
              .filter(function(d){ return setAgtFilters(d); })
              .filter(function(d){ return setAgtCons(d); })
                .attr("class","agt")
                .attr("id",function(d){ return d.AgtId; })
                .attr("name",function(d){ return d.Agt; })
                .attr("value",function(d){ return d.Year; })
                .attr("fill","black")
                .attr("stroke","#c4c4c4")  // same as html background-color
                .attr("stroke-width","0.5px")
                .style("opacity", "0.7")
                .attr("x", function(d){ return x(parseYear(d.Year)) - (agtWidth/2); })
                .attr("y",function(d,i){ return (height-xHeight-margin.bottom-(agtHeight*1.5)-((agtHeight)*(i*agtSpacing)))+"px"; })
                .attr("width", agtWidth+"px")
                .attr("height", agtHeight+"px");

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
                    substage = d.StageSub;
                    window.localStorage.setItem("updateVertical","false");
                    window.localStorage.setItem("paxagt", agt);
                    window.localStorage.setItem("paxdat", dat);
                    window.localStorage.setItem("paxreg", reg);
                    window.localStorage.setItem("paxcon", con);
                    window.localStorage.setItem("paxstatus", status);
                    window.localStorage.setItem("paxagtp", agtp);
                    window.localStorage.setItem("paxstage", stage);
                    window.localStorage.setItem("paxsubstage", substage);
                 });
            rects.on("mouseout",function(d) {
                   this.style.fill = "black"
                   this.style.stroke = "#c4c4c4";
                   window.localStorage.setItem("updateVertical","false");
                   window.localStorage.setItem("paxagt", "Hover over an agreement to view its details.");
                   window.localStorage.setItem("paxdat", "");
                   window.localStorage.setItem("paxreg", "");
                   window.localStorage.setItem("paxcon", "");
                   window.localStorage.setItem("paxstatus", "");
                   window.localStorage.setItem("paxagtp", "");
                   window.localStorage.setItem("paxstage", "");
                   window.localStorage.setItem("paxsubstage", "");
                 });

            var yrCount = getCount(years[year].values);

            var text = chartGroup.selectAll("text.count")
                  .data(years[year].values)
               .enter().append("text")
                  .attr("class","count")
                  .attr("x", function(d){ return x(parseYear(d.Year))})
                  .attr("y", height-(xHeight*2)-(yrCount*agtHeight))
                  .text(yrCount)
                  .style("font-family", "sans-serif")
                  .style("font-size", "10px")
                  .style("font-weight", "bold")
                  .style("fill","black")
                  .style("font-weight","normal")
                  .attr("text-anchor", "middle");

          }

          /*
          TIMELINE DESCRIPTION
          */
          svg.append("text")
                      .attr("x", margin.left+"px")
                      .attr("y", margin.top*2)
                      .attr("class","description")
                      .text("Selected Countries/Entities: "+(getConText(paxCons)));
          svg.append("text")
                      .attr("x", margin.left+"px")
                      .attr("y", (margin.top*5))
                      .attr("class","description")
                      .text("Selected Codes:"+(getCodeText()));
          svg.append("text")
                      .attr("x", margin.left+"px")
                      .attr("y", (margin.top*8))
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
                // codeIndeces.push(i);
                codeText += " " + vizCodes[i] + ",";
              }
            }
            if (codeText.length == 0){
              return " None";
            }
            codeText = codeText.slice(0,-1);
            return codeText;
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
                      // console.log("Mismatched: "+agmtCon);
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

          function setAgtTimePeriod(d){
            // console.log(newMinDay);
            // console.log(newMaxDay);
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

          // Draw X axis for the entire chart
          var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")).tickPadding([5]);

          var gX = chartGroup.append("g")
               .attr("class","xaxis")
               .attr("transform","translate(0,"+(height-xHeight-margin.bottom)+")")
               .call(xAxis);

      }) // end of .get(error,data)

  }; // end of callFunction()
