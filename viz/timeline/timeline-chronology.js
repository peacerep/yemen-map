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

callFunction();
d3.select(window).on("resize", callFunction);
window.addEventListener("storage", toUpdate);

function toUpdate(){
  if (window.localStorage.getItem("updatePaxHorizontal") == "true"){
    return callFunction();
  }
}

function callFunction() {
  console.log("Drawing visualization");
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
                                // HrFra:d.HrFra, // 1-3 indicating increasing level of detail given about human rights framework to be established; 0 if none given
                                TjMech:d.TjMech // 1-3 indicating increasing level of detail given about a body to deal with the past; 0 if none given
                              }; })
      .get(function(error,data){

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
              .attr("width", width + margin.left + margin.right)//"100%");
              // .call(d3.zoom()
              //           .scaleExtent([1,100]) // prevent zoom out, restrict zoom in
              //           .translateExtent([ [0, 0], [width,height]]) // restrict panning (<- & ->)
              //           .on("zoom",zoom));

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
                .attr("fill","black")
                .attr("stroke","#c4c4c4")  // same as html background-color
                .attr("stroke-width","1px")
                .style("opacity", "0.7")
                // .style("visibility",function(d){ setVisibility(d, zoom, newMinDay, newMaxDay); })
                .attr("x", function(d){ return x(d.Dat); })
                .attr("y",function(d,i){ return (height-xHeight-(agtHeight) + ((agtHeight/(dats[dat].values.length)) * i) )+"px"; })
                .attr("width", function(d){ return agtWidth+"px"; })
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
                   substage = d.StageSub;
                   window.localStorage.setItem("updatePaxVertical","false");
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
                   window.localStorage.setItem("updatePaxVertical","false");
                   window.localStorage.setItem("paxagt", "Hover over an agreement to view its details.");
                   window.localStorage.setItem("paxdat", "");
                   window.localStorage.setItem("paxreg", "");
                   window.localStorage.setItem("paxcon", "");
                   window.localStorage.setItem("paxstatus", "");
                   window.localStorage.setItem("paxagtp", "");
                   window.localStorage.setItem("paxstage", "");
                   window.localStorage.setItem("paxsubstage", "");
                 });

                 // rects.on("click", function(d){
                 //   if (!zoom){
                 //     zoom = true;
                 //     var clickedDat = d.Dat;
                 //     var clickedYear = +d.Year;
                 //     var newMinYear;
                 //     var newMaxYear;
                 //     // Find minimum & maximum dates for zoomed-in x scale domain
                 //     if (clickedYear == 1990){
                 //       newMinYear = 1990;
                 //       newMaxYear = 1992;
                 //     } else if (clickedYear == 2015){
                 //       newMinYear = 2013;
                 //       newMaxYear = 2015;
                 //     } else {
                 //       newMinYear = clickedYear - 1;
                 //       newMaxYear = clickedYear; // + 1;
                 //     }
                 //     var newMinDay = "01/01/"+newMinYear;
                 //     window.localStorage.setItem("paxNewMinDay",newMinDay);
                 //     var newMaxDay = "31/12/"+newMaxYear;
                 //     window.localStorage.setItem("paxNewMaxDay",newMaxDay);
                 //   } else {
                 //     zoom = false;
                 //     window.localStorage.setItem("paxNewMinDay","");
                 //     window.localStorage.setItem("paxNewMaxDay","");
                 //   }
                 //   callFunction();
                 // });

            } // end of for loop for rects.agt

            // chartGroup.selectAll("rect.count")
            //    .data(yr_count_nest)
            //    .enter().append("rect")
            //      .attr("class","count")
            //      .attr("fill","black")
            //      .attr("stroke","white")
            //      .attr("stroke-width","0.5px")
            //      .attr("x",function(d){ return x(parseYear(d.key)); })
            //      .attr("y",function(d){ return ((height/2)+24)+"px"; })
            //      .attr("width",width/(years.length))
            //      .attr("height",function(d){ return d.value; })
            //      .on("mousemove",function(d){
            //        this.style.fill = "steelblue"
            //        tooltip.style("opacity","1")
            //          .style("left",margin.left)  //("left",d3.event.pageX+"px")
            //          .style("top",(margin.top + tooltipMargin)+"px")  //("top",d3.event.pageY+"px")
            //          .attr("class","tooltip");
            //        // Display core agreement information (name, date, region, country/entity, status, type & stage)
            //        tooltip.html("<h5>Total Peace Agreements in "+d.key+": "+d.value+"</h5>");
            //      })
            //      .on("mouseout",function(d) {
            //        this.style.fill = "black"
            //        tooltip.style("opacity","0")
            //          .style("left",margin.left)  //("left",d3.event.pageX+"px")
            //          .style("top",height+"px");
            //      });

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

      window.localStorage.setItem("updatePaxHorizontal","false");

  }; // end of callFunction()
