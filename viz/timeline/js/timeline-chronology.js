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

if (!(window.localStorage.getItem("paxinitialized"))){
  window.localStorage.setItem("paxselection", JSON.stringify([]));
  window.localStorage.setItem("paxhover", JSON.stringify([]));
}

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
  var paxHrFra = localStorage.getItem("paxHrFra");
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
  // Agreement clicked on map or timeline
  var selection = JSON.parse(window.localStorage.getItem("paxselection"));
  // console.log("Selection: "+selection);

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
  d3.csv("data/paxTimelineData_02092018.csv")
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
                                HrFra:d.HrFra, // 1 if topic of human rights/rule of law addressed; 0 if not
                                TjMech:d.TjMech // 1-3 indicating increasing level of detail given about a body to deal with the past; 0 if none given
                              }; })
      .get(function(error,data){

        // // Store data needed for viz in dictionary - BROKE SELECT SIDEBAR'S DISPLAY OF AGMT DETAILS FLOWER...WHY?
        // var vizData = {};
        // for (i = 0; i < data.length; i++){
        //   agt = data[i];
        //   vizData[String(agt.AgtId)] = [String(agt.Agt),
        //                                 String(formatDate(agt.Dat)),
        //                                 String(agt.Con), String(agt.Status),
        //                                 String(agt.Agtp), String(agt.Stage),
        //                                 String(agt.StageSub), String(agt.Pol),
        //                                 String(agt.Polps), String(agt.Terps),
        //                                 String(agt.Eps), String(agt.Mps),
        //                                 String(agt.HrFra), String(agt.GeWom),
        //                                 String(agt.TjMech)];
        // }
        // // console.log(vizData);
        // window.localStorage.setItem("paxVizData", JSON.stringify(vizData));
        var paxVizData = [];

          var svgtest = d3.select("body").select("svg");
          if (!svgtest.empty()) {
            svgtest.remove();
          };

          var margin = {top: 10, right: 10, bottom: 10, left: 10}, //read clockwise from top
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
          if (newMinDay && newMaxDay){
            if ((newMinDay.length > 0) && (newMaxDay.length > 0)){
              var x = d3.scaleTime()
                    .domain([parseDate(newMinDay),parseDate(newMaxDay)])
                    .range([margin.left,(width-margin.right)]);
            } else {
              var minDay = d3.min(data,function(d){ return (d.Dat); });
              window.localStorage.setItem("paxNewMinDay",formatDateShort(minDay));
              var maxDay = d3.max(data,function(d){ return (d.Dat); });
              window.localStorage.setItem("paxNewMaxDay",formatDateShort(maxDay));
              newMinDay = localStorage.getItem("paxNewMinDay");
              newMaxDay = localStorage.getItem("paxNewMaxDay");
              var x = d3.scaleTime()
                          .domain([minDay,maxDay])  // data space
                          .range([margin.left,(width-margin.right)]);  // display space
            }
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
          console.log("Highlight: "+selection[0]);
          for (dat = 0; dat < datList.length; dat++){
            var datGroup = chartGroup.append("g")
                .attr("class","datGroup");

            var rects = datGroup.selectAll("rect")
                .data(dats[dat].values)
              .enter().append("rect")
              .filter(function(d){ return setAgtTimePeriod(d); })
              // .filter(function(d){ return setAgtFilters(d); })
              .filter(function(d){ return setAgtCons(d); })
                .attr("class",function(d){ return String((setAgtColors(d))[1]); })  // .attr("class","agt")
                .attr("id",function(d){ return d.AgtId; })
                .attr("fill", function(d){ return (setAgtColors(d))[0]; })          //.attr("fill",function(d){ if (+d.AgtId == +selection){ return "white"; } else { return "black"; } })
                .attr("stroke",function(d){ if (+d.AgtId == +selection[0]){ return "white"; } else { return "#dee3e8"; } })  // same as html background-color
                .attr("stroke-width",function(d){ if (+d.AgtId == +selection[0]){ return "4px"; } else { return "1px"; } })
                .style("opacity", function(d){ if (+d.AgtId == +selection[0]){ return "1"; } else { return "0.5"; } })
                .attr("x", function(d){ return x(d.Dat) + margin.left; })
                .attr("y",function(d,i){ return (height-xHeight-agtHeight-margin.bottom + ((agtHeight/(dats[dat].values.length)) * i) )+"px"; })
                .attr("width", function(d){ return agtWidth+"px"; })
                .attr("height", (agtHeight/dats[dat].values.length)+"px");

            var selectedRects = chartGroup.selectAll('rect.selected');
            selectedRects.on("click", function(d) {
              if (!clicked){ // if an agreement's been selected
                clicked = true;
                this.style.opacity = 1;
                console.log(this.id);
                if (+this.id == +(selection[0])){
                  window.localStorage.setItem("paxselection", JSON.stringify([]));
                } else {
                  paxVizData = [d.AgtId,d.Agt,formatDate(d.Dat),d.Con,d.Status,d.Agtp,d.Stage,d.StageSub,d.Pol,d.Polps,d.Terps,d.Eps,d.Mps,d.HrFra,d.GeWom,d.TjMech];
                  window.localStorage.setItem("paxselection", JSON.stringify(paxVizData));
                }
                window.localStorage.setItem("updatePaxMap", "true");
                callFunction();

              } else { // if an agreement's not selected
                clicked = false;
                this.style.opacity = 0.5;
                window.localStorage.setItem("paxselection", JSON.stringify([]));
                window.localStorage.setItem("updatePaxMap", "true");
                callFunction();
              }
            });

            selectedRects.on("mouseover",function(d){
              if (!clicked){
                this.style.fill = "#ffffff";
                this.style.stroke = "#ffffff";
                window.localStorage.setItem("updatePaxHorizontal","false");
                window.localStorage.setItem("updatePaxMap", "false");
                paxVizData = [d.AgtId,d.Agt,formatDate(d.Dat),d.Con,d.Status,d.Agtp,d.Stage,d.StageSub,d.Pol,d.Polps,d.Terps,d.Eps,d.Mps,d.HrFra,d.GeWom,d.TjMech];
                window.localStorage.setItem("paxhover", JSON.stringify(paxVizData));
               }
            });
            selectedRects.on("mouseout",function(d) {
              if ((!clicked) && (+this.id != +selection[0])){
                window.localStorage.setItem("updatePaxHorizontal","false");
                window.localStorage.setItem("updatePaxMap", "false");
                window.localStorage.setItem("paxhover", JSON.stringify([]));
                this.style.fill = "black"
                this.style.stroke = "#737373";
               }
            });

          } // end of for loop for rects

            /*
            FUNCTIONS
            */
            // Only visualize agreements signed within the selected time period
            function setAgtTimePeriod(d){
              var minDate = parseDate(newMinDay);
              var maxDate = parseDate(newMaxDay);
              var agmtDat = d.Dat;
              if ((agmtDat >= minDate) && (agmtDat <= maxDate)){
                return d;
              }
            }

            // Draw agreements with selected codes & countries/entities in black,
            // those without selected codes & countries/entities in gray
            function setAgtColors(d){
              var agmtCodes = [d.HrFra, d.Pol, d.Eps, d.Mps, d.Polps, d.Terps, d.TjMech, d.GeWom, ]; //d.HrFra,
              var codeFilters = [+paxHrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom]; //+paxHrFra,
              var codeFilterCount = codeFilters.length;
              if (paxANY == 1){
                pass = false;
                var codeValueTotal = 0;
                for (i = 0; i < codeFilterCount; i++){
                  if (codeFilters[i] == 1){
                    codeValueTotal += 1;
                    if ((agmtCodes[i] > 0)){
                      pass = true;
                    }
                  }
                }
                if ((codeValueTotal > 0) && (pass)){
                  if (+d.AgtId == +selection[0]){
                    return ["white", "selected"];   // if an agreement is selected on the map
                  } else {
                    return ["black", "selected"];
                  }
                  // return getAgtCons(d);
                } else {
                  // deselect agreements that don't meet filter criteria
                  window.localStorage.setItem("paxselection", JSON.stringify([]));
                  selection = JSON.parse(window.localStorage.getItem("paxselection"));
                  return ["#595959", "unselected"];
                }
              }
              else { // if paxALL == 1
                var codeValueTotal = 0;
                var mismatch = false;
                for (j = 0; j < codeFilterCount; j++){
                  if (codeFilters[j] == 1){
                    codeValueTotal += 1;
                    if (agmtCodes[j] == 0){
                      mismatch = true;
                    }
                  }
                }
                if (codeValueTotal == 0){
                  if (+d.AgtId == +selection[0]){
                    return ["white", "selected"];   // if an agreement is selected on the map
                  } else {
                    return ["black", "selected"];
                  }
                } else if ((codeValueTotal > 0) && (!mismatch)){
                  if (+d.AgtId == +selection[0]){
                    return ["white", "selected"];   // if an agreement is selected on the map
                  } else {
                    return ["black", "selected"];
                  }
                  // return getAgtCons(d);
                } else {
                  // deselect agreements that don't meet filter criteria
                  window.localStorage.setItem("paxselection", JSON.stringify([]));
                  selection = JSON.parse(window.localStorage.getItem("paxselection"));
                  return ["#595959", "unselected"];
                }
              }
            }

            // Only visualize agreements with the selected codes
            // function setAgtFilters(d){
            //   var agmtCodes = [d.HrFra, d.Pol, d.Eps, d.Mps, d.Polps, d.Terps, d.TjMech, d.GeWom, ]; //d.HrFra,
            //   var codeFilters = [+paxHrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom]; //+paxHrFra,
            //   var codeFilterCount = codeFilters.length;
            //   if (paxANY == 1){
            //     for (i = 0; i < codeFilterCount; i++){
            //       if ((codeFilters[i] == 1) && (agmtCodes[i] > 0)){
            //         return d;
            //       } else if (codeFilters[i] == 0){
            //       }
            //     }
            //   } else { // if paxALL == 1
            //     var mismatch = false;
            //     for (j = 0; j < codeFilterCount; j++){
            //       if ((codeFilters[j] == 1) && agmtCodes[j] == 0){
            //         mismatch = true;
            //       } else if (codeFilters[j] == 0){
            //       }
            //     }
            //     if (!mismatch){
            //       return d;
            //     }
            //   }
            // }

            // Only visualize agreements with the selected countries/entities
            function setAgtCons(d){
              var agmtCon = String(d.Con);
              if (paxConRule == "any"){
                var allCons = JSON.parse(localStorage.getItem("paxConsAll"));
                if (paxCons.length == allCons.length){
                  return d;
                } else if (paxCons.length > 0){
                  for (i = 0; i < paxCons.length; i++){
                    if ((agmtCon.includes(paxCons[i])) || (paxCons[i].includes(agmtCon))){
                      return d;
                    }
                  }
                }
              }
              if (paxConRule == "all") {
                var mismatch = false;
                for (j = 0; j < paxCons.length; j++){
                  if ((!(agmtCon.includes(paxCons[j]))) && (!(paxCons[j].includes(agmtCon)))){
                    mismatch = true;
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
                .attr("transform","translate("+(margin.left)+","+(height-xHeight-margin.bottom)+")")
                .call(xAxis);

      }) // end of .get(error,data)

      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("paxinitialized", "true");
      console.log("horizontal complete.");

      /*
      EXPORT PNG
      from https://github.com/exupero/saveSvgAsPng
      */
      d3.select("#export").on("click", function(){
        var title = "PA-X_HorizontalTimeline_Chronology";
        var cons = "";
        for (i = 0; i < paxCons.length; i++){
          cons += paxCons[i];
        }
        var codeFilters = [+paxHrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom];
        var codeNames = ["HrFra", "Pol", "Eps", "Mps", "Polps", "Terps", "TjMech", "GeWom"];
        var codes = "";
        for (i = 0; i < codeFilters.length; i++){
          if (codeFilters[i] > 0){
            codes += codeNames[i];
          }
        }
        title = title + "_" + cons + "_" + codes + "_" + newMinDay + "-" + newMaxDay + ".png";
        saveSvgAsPng(document.getElementsByTagName("svg")[0], title, {scale: 5, backgroundColor: "#737373"});
        // if IE need canvg: canvg passed between scale & backgroundColor
      });

  }; // end of callFunction()
