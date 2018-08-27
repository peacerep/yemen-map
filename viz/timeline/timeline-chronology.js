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
window.localStorage.setItem("paxagtid", 1370); // default to an agreement that addresses all codes

callFunction();
d3.select(window).on("resize", callFunction);
window.addEventListener("storage", toUpdate);

function toUpdate(){
  if (window.localStorage.getItem("updatePaxHorizontal") == "true"){
    d3.selectAll("rects").remove();
    console.log("Updating horizontal...");
    return callFunction();
  }
}

function callFunction() {
  console.log("Drawing horizontal visualization...");
  var clicked = false;

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
  // Agreement in left sidebar
  var paxAgtId = window.localStorage.getItem("paxagtid");



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

          var svgtest = d3.select("body").select("svg");
          if (!svgtest.empty()) {
            svgtest.remove();
          };

          var margin = {top: 4, right: 5, bottom: 5, left: 5}, //read clockwise from top
              width = parseInt(d3.select("body").style("width"), 10),
              width = width - margin.left - margin.right,
              height = 170 - margin.top - margin.bottom,
              descriptHeight = 20,
              agtHeight = (height/2)-descriptHeight,
              xHeight = 45,//15,
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
          if (agtWidth < 2){
            agtWidth = 2;
          }

          // Set up the x axis
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
              .attr("width", width + margin.left + margin.right)//"100%");

          var chartGroup = svg.append("g")
                      .attr("class","chartGroup") //
                      .attr("transform","translate("+margin.left+","+margin.top+")");

          // Make one rectangle per agreement grouped by Dat
          for (dat = 0; dat < datList.length; dat++){
            var datGroup = chartGroup.append("g")
                .attr("class","datGroup");

            var rects = datGroup.selectAll("rect.agt")
                .data(dats[dat].values)
              .enter().append("rect")
              .filter(function(d){ return setAgtTimePeriod(d); })
              .filter(function(d){ return setAgtFilters(d); })
              .filter(function(d){ return setAgtCons(d); })
                .attr("class","agt")
                .attr("id",function(d){ return d.AgtId; })
                // highlight an agreement if it's hovered over on the map
                .attr("fill",function(d){ if (d.AgtId == paxAgtId){ return "white"; } else { return "black"; } })
                .attr("stroke",function(d){ if (d.AgtId == paxAgtId){ return "white"; } else { return "#737373"; } })  // same as html background-color
                .attr("stroke-width","1px")
                .style("opacity", "0.7")
                // .style("visibility",function(d){ setVisibility(d, zoom, newMinDay, newMaxDay); })
                .attr("x", function(d){ return x(d.Dat); })
                .attr("y",function(d,i){ return (height-xHeight-(agtHeight) + ((agtHeight/(dats[dat].values.length)) * i) )+"px"; })
                .attr("width", function(d){ return agtWidth+"px"; })
                .attr("height", (agtHeight/dats[dat].values.length)+"px");

            rects.on("mousemove",function(d){
              if (!clicked) {
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
            rects.on("click", function(d) {
                  if (!clicked){ clicked = true; }
                  else { clicked = false; }
            });

            } // end of for loop for rects.agt

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
                  } else if (codeFilters[i] == 0){
                  }
                }
              } else { // if paxALL == 1
                var mismatch = false;
                for (j = 0; j < codeFilterCount; j++){
                  if ((codeFilters[j] == 1) && agmtCodes[j] == 0){
                    mismatch = true;
                  } else if (codeFilters[j] == 0){
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

           // Draw axes
           var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%e %b %Y")).tickPadding([5]);

           var gX = chartGroup.append("g")
                .attr("class","xaxis")
                .attr("id","dat")
                .attr("transform","translate("+(margin.left)+","+(height-xHeight)+")")
                .call(xAxis);

      }) // end of .get(error,data)

      window.localStorage.setItem("updatePaxHorizontal","false");
      console.log("horizontal complete.");

      /*
      EXPORT PNG
      from https://github.com/exupero/saveSvgAsPng
      */
      d3.select("#export").on("click", function(){
        saveSvgAsPng(document.getElementsByTagName("svg")[0], "PA-X_HorizontalTimeline_Chronology.png", {scale: 2, backgroundColor: "#737373"});
        // if IE need canvg: canvg passed between scale & backgroundColor
      });

  }; // end of callFunction()
