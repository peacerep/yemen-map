/*
Horizontal Timeline with Agreements Grouped by Date
*/

callFunction();
d3.select(window).on("resize", callFunction);
window.addEventListener("storage", toUpdate);

function toUpdate(){
  if (window.localStorage.getItem("updatePaxHorizontal") == "true"){
    d3.selectAll("rects").remove();
    return callFunction();
  }
}

function callFunction() {
  console.log("Drawing visualization of date counts");
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
      // reg = "",
      con = "",
      status = "",
      agtp = "",
      stage = "",
      substage = "";
  window.localStorage.setItem("paxagt", agt);
  window.localStorage.setItem("paxdat", dat);
  // window.localStorage.setItem("paxreg", reg);
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
                                //HrFra:d.HrFra, // 1-3 indicating increasing level of detail given about human rights framework to be established; 0 if none given
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

          var margin = {top: 10, right: 10, bottom: 10, left: 10}, //read clockwise from top
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
               .key(function(d){ return formatDateShort(d.Dat); }).sortKeys(d3.ascending)         // sort by Agreement's Date Signed
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
          if (agtWidth < 2){
            agtWidth = 2;
          }

          // Set up the x axis
          // Find the earliest & latest day of the year on which agreements are written
          if ((newMinDay.length > 0) && (newMaxDay.length > 0)){
            var minDay = parseDate(newMinDay);
            var maxDay = parseDate(newMaxDay)
            var x = d3.scaleTime()
                  .domain([minDay,maxDay])
                  .range([margin.left,(width-margin.right)]);
          } else {
            var minDay = d3.min(data,function(d){ return (d.Dat); });
            window.localStorage.setItem("paxNewMinDay",formatDateShort(minDay));
            var maxDay = d3.max(data,function(d){ return (d.Dat); });
            window.localStorage.setItem("paxNewMaxDay",formatDateShort(maxDay));
            var x = d3.scaleTime()
                        .domain([minDay,maxDay])  // data space
                        .range([margin.left,(width-margin.right)]);  // display space
          }

          // Find the earliest & latest year in which agreements occur
          var minYear = d3.min(yr_count_nest,function(d){ return d.key; });
          var maxYear = d3.max(yr_count_nest,function(d){ return d.key; });

          var svg = d3.select("body").select("#chart").append("svg")
              .attr("height", height + margin.top + margin.bottom)//"100%")
              .attr("width", width + margin.left + margin.right);//"100%");

          var chartGroup = svg.append("g")
                      .attr("class","chartGroup") //
                      .attr("transform","translate("+margin.left+","+margin.top+")");

          // Make one rectangle per Dat with height based on number of agreements
          datCounts = [];
          for (dat = 0; dat < datList.length; dat++){
            var day = parseDate(dats[dat].key);
            // Only draw agreements within the axis bounds
            if ((day > minDay) && (day < maxDay)){
              var datGroup = chartGroup.append("g")
                  .attr("class","datGroup")
                  .attr("id",String(dats[dat].key));

              var datCount = ((dats[dat].values).filter(function(d){ return setAgtFilters(d); }).filter(function(d){ return setAgtCons(d); })).length;
              datCounts.push([day, datCount]);

              var rects = chartGroup.selectAll("rect.count")
                  .data(dats[dat].values)
                .enter().append("rect")
                  .attr("class","count");
             }
          }

          // Draw date count bars
          var rects = chartGroup.selectAll("rect.count")
               .data(datCounts)   //datCounts format: [Dat, datCount]
             .enter().append("rect")
               .attr("class","count")
               .attr("id", function(d){ return d[0]; })
               .attr("fill","black")
               .attr("stroke","#737373")  // same as html background-color
               .attr("stroke-width","1px")
               .style("opacity", "0.7")
               .attr("x", function(d){ return x(d[0]) + margin.left; })
               .attr("y", function(d){ return (height-xHeight-margin.bottom-(agtHeight*d[1]))+"px"; })
               .attr("width", agtWidth+"px")
               .attr("height", function(d){ return (agtHeight*d[1])+"px"; });

           // Display number of agreements signed on date upon hover
           rects.on("mousemove",function(d){
               this.style.fill = "#ffffff";
               tooltip.style("opacity","0.9")
                 .style("left", function(d){
                   if (d3.event.pageX < (margin.left+10)){ return d3.event.pageX+10+"px"; }
                   else if (d3.event.pageX > (margin.right+150)){ return d3.event.pageX-150+"px"; }
                   else { return d3.event.pageX+"px"; }
                 })
                 .style("top", d3.event.pageY+"px")
                 .style("background","#ffffff")
                 .style("padding","10px")
                 .attr("class","tooltip");
               tooltip.html("<p>Agreements signed on<br/>"+formatDate(d[0])+":<br/><b>"+d[1]+"</b></p>");
           });
           rects.on("mouseout",function(d) {
              this.style.fill = "black";
              this.style.stroke = "#737373";
              tooltip.style("opacity","0");
            });

            /*
            FUNCTIONS
            */
            function setAgtFilters(d){
              var agmtCodes = [d.HrGen, d.Pol, d.Eps, d.Mps, d.Polps, d.Terps, d.TjMech, d.GeWom, ]; //d.HrFra,
              var codeFilters = [+paxHrGen, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom]; //+paxHrFra,
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
                if ((pass) && (codeValueTotal > 0)){ return d; }
              }
              else { // if paxALL == 1
                var mismatch = false;
                var codeValueTotal = 0;
                for (j = 0; j < codeFilterCount; j++){
                  if (codeFilters[j] == 1){
                    codeValueTotal += 1;
                    if (agmtCodes[j] == 0){
                      mismatch = true;
                    }
                  }
                }
                if ((!mismatch) || (codeValueTotal == 0)){ return d; }
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
                    if ((agmtCon.includes(paxCons[i])) || (paxCons[i].includes(agmtCon))){
                      return d;
                    }
                  }
                }
              }
              if (paxConRule == "all") {
                var mismatch = false;
                for (j = 0; j < paxCons.length; j++){
                  if ((!(agmtCon.includes(paxCons[j]))) || (!(paxCons[i].includes(agmtCon)))){
                    mismatch = true;
                  }
                }
                if (!mismatch){
                  return d;
                }
              }
            }

            /*
            WRITE COUNTS
            */
            var text = svg.selectAll("text.count")
                 .data(datCounts)   //datCounts format: [Dat, datCount]
               .enter().append("text")
                 .attr("class","count")
                 .attr("x", function(d){ return x(parseDate(d[0])); })
                 .attr("y", function(d){ return height-(xHeight*2)-(d[1]*agtHeight); })
                 .text(function(d){ return d[1]; })
                 .style("font-family", "sans-serif")
                 .style("font-size", "10px")
                 .style("fill","#000")
                 .style("stroke","0px")
                 .style("font-weight","bold")
                 .style("text-anchor", "middle");

           /*
           DRAW X AXIS
           */
           var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%e %b %Y")).tickPadding([5]);

           var gX = chartGroup.append("g")
                .attr("class","xaxis")
                .attr("id","dat")
                .attr("transform","translate("+(margin.left)+","+(height-xHeight-margin.bottom)+")")
                .call(xAxis);

      }) // end of .get(error,data)

      window.localStorage.setItem("updatePaxHorizontal","false");

      /*
      EXPORT PNG
      from https://github.com/exupero/saveSvgAsPng
      */
      d3.select("#export").on("click", function(){
        var title = "PA-X_HorizontalTimeline_CountPerDay";
        var cons = "";
        for (i = 0; i < paxCons.length; i++){
          cons += paxCons[i];
        }
        var codeFilters = [+paxHrGen, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom];
        var codeNames = ["HrGen", "Pol", "Eps", "Mps", "Polps", "Terps", "TjMech", "GeWom"];
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

} // end of callFunction()
