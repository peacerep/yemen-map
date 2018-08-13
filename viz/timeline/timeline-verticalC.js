/*
Vertical Timeline
*/

callFunction();
d3.select(window).on("resize", callFunction);
window.addEventListener("storage", callFunction);

function callFunction() {
  console.log("Drawing vertical timeline of yearly grouping");

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

  var margin = {top: 5, right: 65, bottom: 5, left: 25}, //read clockwise from top
      // width = parseInt(d3.select("body").style("width"), 10),
      height = 800 - margin.top - margin.bottom,
      width = width = parseInt(d3.select("body").style("width"), 10),
      width = width - margin.left - margin.right,
      yWidth = 10,
      agtPadding = 2,
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

          // Create bar chart tooltip
          var tooltip = d3.select("body").append("div")
              .style("opacity","0")
              .style("position","absolute");

          // Group agreements by Year (create an array of objects whose key is the year and value is an array of objects (one per agreement))
          var years = d3.nest()
               .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
               .sortValues(function(a,b){ return d3.descending(a.Dat, b.Dat); })
               .entries(data);
          var yrList = (d3.map(years, function(year){ return year.key; })).keys(); // array of year values
          // console.log(years); // an array of objects
          // console.log(years[0].values); // array of objects (one for each agreement in 1990)
          // console.log(years[0].values[0]); // first agreement object from 1990
          // console.log(years[0].values[0].Year); // Year (as number) of the first agreement object from 1990

          // Find the maximum number of agreements in a single year for a single country/entity
          var con_year_nest = d3.nest()
              .key(function(d){ return d.Con; })
              .key(function(d){ return d.Year; })
              .rollup(function(leaves){ return leaves.length; })
              .entries(data);
          var maxAgts = 1;
          for (c = 0; c < con_year_nest.length; c++){
            var sub = con_year_nest[c].values;
            // console.log(sub);
            var agts = d3.max(sub, function(d){ return d.value; });
            if (agts > maxAgts){
              maxAgts = agts;
            }
          }
          // Set the agreement width (pixels) based on the maximum possible agts to display in a year
          var agtWidth = (width-yWidth)/(maxAgts);

          // Calculate the size of each agreement in the display space
          var agtHeight = (height/(yrList.length))-agtPadding;

          // Set up the x axis
          var minYear = d3.min(data,function(d){ return parseYear(d.Year-1); });
          var maxYear = d3.max(data,function(d){ return parseYear(d.Year+1); });
          var y = d3.scaleTime()
                      .domain([minYear,maxYear])  // data space
                      .range([margin.top,height]);  // display space

          // Define the full timeline chart SVG element
          var svg = d3.select("body").select("#chartC").append("svg")
              .attr("height", height + margin.top + margin.bottom)
              .attr("width", width + margin.left + margin.right)
              .attr("class","C");

          // Define the color scale for agreement stages
          var stageColors = ["#377eb8","#ffff33","#ff7f00","#4daf4a","#e41a1c","#a65628","#984ea3"];   //from: http://colorbrewer2.org/#type=qualitative&scheme=Set1&n=7
          var stageValues = ["Pre", "SubPar", "SubComp", "Imp", "Cea", "Other", "FrCons"];

          for (year = 0; year < yrList.length; year++){
            var chartGroup = svg.append("g")
                        .attr("class","chartGroup") //
                        .attr("transform","translate("+margin.left+","+margin.top+")")

            var rects = chartGroup.selectAll("rects.agt")
                .data(years[year].values)
              .enter().append("rect")
              .filter(function(d){ return pickAgtCon(d); })
                .attr("class","agt")
                .attr("id",function(d){ return d.AgtId; })
                .attr("name",function(d){ return d.Agt; })
                .attr("value",function(d){ return d.Year; })
                .attr("fill", function(d){ return getStageFill(d, stageValues, stageColors); })//"black")
                .attr("stroke","#c4c4c4")  // same as html background-color
                .attr("stroke-width","1px")
                .style("opacity", "0.7")
                .attr("x",function(d,i){ return (yWidth+margin.left+((agtWidth)*(i*agtSpacing)))+"px"; })
                .attr("y", function(d){ return y(parseYear(d.Year)) - (agtHeight/2); })
                .attr("width", agtWidth+"px")
                .attr("height", agtHeight+"px");

            rects.on("mousemove",function(d){
                  // Get core agreement information (name, date, region, country/entity, status, type & stage)
                  agt = d.Agt;
                  dat = formatDate(d.Dat);
                  reg = d.Reg;
                  con = d.Con;
                  status = d.Status;
                  agtp = d.Agtp;
                  stage = d.Stage;
                  substage = d.StageSub;
                  // Display core information in tooltip
                  this.style.fill = "#ffffff";
                  tooltip.style("opacity","0.9")
                    .style("left", (d3.event.pageX/2)+"px")
                    .style("top", d3.event.pageY+"px")
                    .style("background","#ffffff")
                    .style("padding","10px")
                    .attr("class","tooltip");
                  tooltip.html("<p><em>"+agt+"</em><br/><br/><b>Date Signed:</b> "+dat+"<br/><b>Region:</b> "+reg+"</br><b>Country/Entity:</b> "+con+"<br/><b>Status:</b> "+status+"<br/><b>Type:</b> "+agtp+"<br/><b>Stage:</b> "+stage+"<br/><b>Substage:</b> "+substage);
                 });
            rects.on("mouseout",function(d) {
                   this.style.fill = getStageFill(d, stageValues, stageColors) //"black"
                   this.style.stroke = "#c4c4c4"
                   tooltip.style("opacity","0");
                 });
          }

          // Draw Y axis for the entire chart
          var yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%Y")).tickPadding([5]);

          var gY = chartGroup.append("g")
             .attr("class","yaxis")
             .attr("transform","translate("+(yWidth+margin.left)+","+"0)") //(height-xHeight-margin.bottom)+
             .call(yAxis);

          function pickAgtCon(d){
            var con = String(localStorage.getItem("paxVertConC"));
            var agmtCon = String(d.Con);
            if (agmtCon.includes(con)){
             return d;
            }
          }

          function getStageFill(d, stageValues, stageColors){
            // d.StageSub value to color: "FrCons"
            // d.Stage possible values to color: "Pre", "SubPar", "SubComp", "Imp", "Cea", "Other"
            if (d.StageSub == stageValues[6]){ //"FrCons"
              return stageColors[6];
            } else {
              var stageI = stageValues.indexOf(d.Stage);
              if (stageI != -1){
                return stageColors[stageI];
              } else {
                return "black";
              }
            }
          }

      }) // end of .get(error,data)

  }; // end of callFunction()
