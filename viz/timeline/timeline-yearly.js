/*
Horizontal Timeline with Agreements Grouped by Year
*/

window.localStorage.setItem("paxagtid", 1370); // default to an agreement that addresses all codes

callFunction();
d3.select(window).on("resize", callFunction);
window.addEventListener("storage", toUpdate);

function toUpdate(){
  if (window.localStorage.getItem("updatePaxHorizontal") == "true"){
    return callFunction();
  }
}

function callFunction() {
  console.log("Drawing visualization of yearly grouping");
  var clicked = false; // for displaying hovered agreement info in left sidebar

  // Countries/entities
  var paxCons = JSON.parse(window.localStorage.getItem("paxCons"));
  var paxConRule = localStorage.getItem("paxConRule");
  // Code filter rule
  var paxANY = localStorage.getItem("paxANY");
  var paxALL = localStorage.getItem("paxALL");
  // Code filters
  // var paxHrFra = localStorage.getItem("paxHrFra");
  var paxHrGen = localStorage.getItem("paxHrGen");
  var paxPol = localStorage.getItem("paxPol");
  var paxEps = localStorage.getItem("paxEps");
  var paxMps = localStorage.getItem("paxMps");
  var paxPolps = localStorage.getItem("paxPolps");
  var paxTerps = localStorage.getItem("paxTerps");
  var paxTjMech = localStorage.getItem("paxTjMech");
  var paxGeWom = localStorage.getItem("paxGeWom");
  // Time period
  var newMinDay = localStorage.getItem("paxNewMinDay");
  var newMaxDay = localStorage.getItem("paxNewMaxDay");

  // Date parsers & formatters
  var parseDate = d3.timeParse("%d/%m/%Y");
  var parseMonth = d3.timeParse("%m");
  var parseYear = d3.timeParse("%Y");
  var parseDay = d3.timeParse("%j");
  var formatDate = d3.timeFormat("%d %B %Y");
  var formatMonth = d3.timeFormat("%m");
  var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
  var formatYear = d3.timeFormat("%Y");

  var margin = {top: 4, right: 65, bottom: 15, left: 5}, //read clockwise from top
      width = parseInt(d3.select("body").style("width"), 10),
      width = width - margin.left - margin.right,
      agtHeight = 1.5,
      xHeight = 20,
      agtPadding = 0.5,
      agtSpacing = 1;

  // Obtain data
  d3.csv("paxTimelineData_24Aug2018.csv")
      .row(function(d){ return{ Year:+d.Year,
                                Dat:parseDate(d.Dat),
                                AgtId:Number(d.AgtId),
                                // Reg:d.Reg,
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
                                // HrFra:d.HrFra, // 1-3 indicating increasing level of detail given about human rights framework to be established; 0 if none given
                                TjMech:d.TjMech // 1-3 indicating increasing level of detail given about a body to deal with the past; 0 if none given
                              }; })
      .get(function(error,data){

          var svgTest = d3.select("body").select("svg");
          if (!svgTest.empty()) {
            svgTest.remove();
          };

          // Store data needed for viz in dictionary
          var vizData = {};
          for (i = 0; i < data.length; i++){
            agt = data[i];
            vizData[String(agt.AgtId)] = [String(agt.Agt),
                                          String(formatDate(agt.Dat)),
                                          String(agt.Con), String(agt.Status),
                                          String(agt.Agtp), String(agt.Stage),
                                          String(agt.StageSub), String(agt.Pol),
                                          String(agt.Polps), String(agt.Terps),
                                          String(agt.Eps), String(agt.Mps),
                                          String(agt.HrGen), String(agt.GeWom),
                                          String(agt.TjMech)];
          }
          // console.log(vizData);
          window.localStorage.setItem("paxVizData", JSON.stringify(vizData));

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
          var height = (maxAgts*agtHeight)+(xHeight*2)+(margin.top*7); //defines w & h as inner dimensions of chart area
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

          yrCounts = [];
          for (year = 0; year < yrList.length; year++){
            var y = +(years[year].key);
            // Only draw agreements within the axis bounds
            if ((y > minYear) && (y < maxYear)){
              var chartGroup = svg.append("g")
                          .attr("class","yearGroup")
                          .attr("transform","translate("+(margin.left*2)+","+margin.top+")")

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
                  .attr("stroke","#737373")  // same as html background-color
                  .attr("stroke-width","0.5px")
                  .style("opacity", "0.7")
                  .attr("x", function(d){ return x(parseYear(d.Year)) - (agtWidth/2) + (margin.left*2); })
                  .attr("y",function(d,i){ return (height-xHeight-margin.bottom-(agtHeight*1.5)-((agtHeight)*(i*agtSpacing)))+"px"; })
                  .attr("width", agtWidth+"px")
                  .attr("height", agtHeight+"px");

              rects.on("mousemove",function(d){
                if (!clicked){
                      this.style.fill = "#ffffff";
                      this.style.stroke = "#ffffff";
                      // Core agreement information (name, date, region, country/entity, status, type & stage)
                      agtid = d.AgtId;
                      window.localStorage.setItem("updatePaxVertical","false");
                      window.localStorage.setItem("updatePaxMap", "false");
                      window.localStorage.setItem("paxagtid", agtid);
                    }
                });
              rects.on("mouseout",function(d) {
                // if (!clicked) {
                     this.style.fill = "black"
                     this.style.stroke = "#737373";
                   // }
                 });

               var yrCount = chartGroup.selectAll('rect.agt')._groups[0].length;
               yrCounts.push([(years[year].values[0].Year), yrCount]);

               rects.on("click", function(d) {
                     if (!clicked){ clicked = true; }
                     else { clicked = false; }
               });

             }

          }

          /*
          SHOW COUNTS PER YEAR
          */
          var text = svg.selectAll("text.count")
               .data(yrCounts)   //yrCounts format: [Year, yrCount]
             .enter().append("text")
               .attr("class","count")
               .attr("x", function(d){ return x(parseYear(d[0]))+(margin.left*2.5); })
               .attr("y", function(d){ return height-(xHeight*2)-(d[1]*agtHeight); })
               .text(function(d){ return d[1]; })
               .style("font-family", "sans-serif")
               .style("font-size", "10px")
               .style("fill","#000")
               .style("stroke","0px")
               .style("font-weight","bold");

          /*
          FUNCTIONS
          */
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
            var agmtCodes = [d.HrGen, d.Pol, d.Eps, d.Mps, d.Polps, d.Terps, d.TjMech, d.GeWom, ]; //d.HrFra,
            var codeFilters = [+paxHrGen, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom]; //+paxHrFra,
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
              var allCons = JSON.parse(localStorage.getItem("paxConsAll"));
              if (paxCons.length == allCons.length){
                return d;
              } else if (paxCons.length > 0){
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
                  // console.log("Mismatched: "+agmtCon);
                }
              }
              if (!mismatch){
                return d;
              }
            }
          }

          // Draw X axis for the entire chart
          var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")).tickPadding([5]).ticks(4);

          var gX = chartGroup.append("g")
               .attr("class","xaxis")
               .attr("transform","translate("+(margin.left*2)+","+(height-xHeight-margin.bottom)+")")
               .call(xAxis);

      }) // end of .get(error,data)

      window.localStorage.setItem("updatePaxHorizontal","false");

      /*
      EXPORT PNG
      from https://github.com/exupero/saveSvgAsPng
      */
      d3.select("#export").on("click", function(){
        saveSvgAsPng(document.getElementsByTagName("svg")[0], "PA-X_HorizontalTimeline_Yearly.png", {scale: 2, backgroundColor: "#737373"});
        // if IE need canvg: canvg passed between scale & backgroundColor
      });

  }; // end of callFunction()
