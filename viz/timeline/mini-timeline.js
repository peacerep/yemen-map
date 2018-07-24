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
var paxMps = window.localStorage.setItem("paxPol",1); // Military power sharing
var paxEps = window.localStorage.setItem("paxEps",1); // Economic power sharing
var paxTerps = window.localStorage.setItem("paxMps",1); // Territorial power sharing
var paxPolps = window.localStorage.setItem("paxPolps",1); // Political power sharing
var paxPol = window.localStorage.setItem("paxTerps",1); // Political institutions
var paxGeWom = window.localStorage.setItem("paxTjMech",1); // Women, girls and gender
var paxTjMech = window.localStorage.setItem("paxGeWom",1); // Transitional justice past mechanism
var paxTjMech = window.localStorage.setItem("paxOther",1); // Transitional justice past mechanism

//window.localStorage.setItem("agtInfo", "Hover over an agreement to view its details.");

callFunction();
d3.select(window).on("resize", callFunction);
window.addEventListener("storage", callFunction);

function getFilters(){
  var locStor = window.localStorage;
  paxHrFra = locStor.getItem("paxHrFra");
  paxHrGen = locStor.getItem("paxHrGen");
  paxMps = locStor.getItem("paxMps");
  paxEps = locStor.getItem("paxEps");
  paxTerps = locStor.getItem("paxTerps");
  paxPolps = locStor.getItem("paxPolps");
  paxPol = locStor.getItem("paxPol");
  paxGeWom = locStor.getItem("paxGeWom");
  paxTjMech = locStor.getItem("paxTjMech");
  paxOther = locStor.getItem("paxOther");
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


  var parseDate = d3.timeParse("%d/%m/%Y");
  var parseMonth = d3.timeParse("%m");
  var parseYear = d3.timeParse("%Y");
  var parseDay = d3.timeParse("%j");

  var formatDate = d3.timeFormat("%d %B %Y");
  var formatMonth = d3.timeFormat("%m");
  var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
  var formatYear = d3.timeFormat("%Y");

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

          // var tooltip = d3.select("body").append("div")
          //     .style("opacity","0")
          //     .style("position","absolute");

          var svgtest = d3.select("body").select("svg");
          if (!svgtest.empty()) {
            svgtest.remove();
          };

          var margin = {top: 20, right: 2, bottom: 20, left: 2}, //read clockwise from top
              width = parseInt(d3.select("body").style("width"), 10),
              width = width - margin.left - margin.right,
              height = 100 - margin.top - margin.bottom; //defines w & h as inner dimensions of chart area

          var yr_count_nest = d3.nest()
               .key(function(d) {return formatYear(d.Year);}).sortKeys(d3.ascending)
               .rollup(function(leaves) {return leaves.length;})
               //.entries(data);
               .map(data);
          var years = yr_count_nest.keys();

          // Find the maximum number of agreements that occur in a single year
          var max = d3.max(yr_count_nest,function(d){ return d.value; });

          // Find the earliest & latest year in which agreements occur
          var minYear = d3.min(yr_count_nest,function(d){ return d.key; });
          var maxYear = d3.max(yr_count_nest,function(d){ return d.key; });

          // Create an array of years (non-repeating) in which agreements occur
          //var yearMap = d3.map(yr_count_nest,function(d){ return d.key; });

          // Find the earliest & latest day of the year on which agreements are written
          var minDay = d3.min(data,function(d){ return (d.Dat); });
          var maxDay = d3.max(data,function(d){ return (d.Dat); });

          var y = d3.scaleLinear()
                      .domain([0,(max*30)]) // data space - assume rects height of 30px...?
                      .range([height,margin.bottom]); // display space
          var x = d3.scaleTime()
                      .domain([minDay,maxDay])  // data space
                      .range([margin.left,width]);  // display space
          // var yAxis = d3.axisLeft(y);
          // var xAxis = d3.axisBottom(x)
          //     .ticks(30).tickFormat(d3.timeFormat("%Y"));

          var svg = d3.select("body").select("#chart").append("svg")
              .attr("height", height + margin.top + margin.bottom)//"100%")
              .attr("width", width + margin.left + margin.right);//"100%");

          var chartGroup = svg.append("g")
                      .attr("transform","translate("+margin.left+","+margin.top+")");

          function newVisibility(d){
            var visibility = "visible";
            if ((d.GeWom > 0) && (paxGeWom == 0)){ visibility = "hidden"; }
            if ((d.HrFra > 0) && (paxHrFra == 0)){ visibility = "hidden"; }
            if ((d.HrGen > 0) && (paxHrGen == 0)){ visibility = "hidden"; }
            if ((d.Eps > 0) && (paxEps == 0)){ visibility = "hidden"; }
            if ((d.Mps > 0) && (paxMps == 0)){ visibility = "hidden"; }
            if ((d.Pol > 0) && (paxPol == 0)){ visibility = "hidden"; }
            if ((d.Polps > 0) && (paxPolps == 0)){ visibility = "hidden"; }
            if ((d.Terps > 0) && (paxTerps == 0)){ visibility = "hidden"; }
            if ((d.TjMech > 0) && (paxTjMech == 0)){ visibility = "hidden"; }
            if ((paxOther == 0) && (d.GeWom==0 && d.HrFra==0 && d.Eps==0 && d.Mps==0 && d.Pol==0 && d.Polps==0 && d.Terps==0 && d.TjMech==0)){ visibility = "hidden"; }
            return visibility;
          };

          // MAKE ZOOM ON X AXIS ONLY
          // svg.call(d3.zoom()
          //   .on("zoom",function(){  //on: tell event, then tell function
          //     chartGroup.attr("transform",d3.event.transform);
          // }));


          // Make one rectangle per agreement grouped by Year
          chartGroup.selectAll("rect.agt")
                  .data(data)
                  .enter().append("rect")
                     .attr("class","agt")
                     .attr("id", "test")
                     .attr("fill","black")
                     .attr("stroke","#f1f1f1")
                     .attr("stroke-width","1px")
                     .style("opacity", "0.3")
                     .style("visibility",newVisibility)
                     .attr("x",function(d){ return x(d.Dat); })
                     .attr("y",function(d){ return ((height/2)-29)+"px"; })
                     .attr("width","2px")
                     .attr("height","30px")
                     .on("mousemove",function(d){
                       if (this.style.opacity != "0"){
                         //console.log(d.Agt);
                         this.style.fill = "#dc00ff";
                         this.style.stroke = "#dc00ff";
                         this.style.opactiy = "1";
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
                         //console.log(window.localStorage.getItem("agtInfo"));
                       }
                     })
                     .on("mouseout",function(d) {
                       this.style.fill = "black"
                       this.style.stroke = "#f1f1f1";
                       this.style.opacity = "0.3";
                       window.localStorage.setItem("paxagt", "Hover over an agreement to view its details.");
                       window.localStorage.setItem("paxdat", "");
                       window.localStorage.setItem("paxreg", "");
                       window.localStorage.setItem("paxcon", "");
                       window.localStorage.setItem("paxstatus", "");
                       window.localStorage.setItem("paxagtp", "");
                       window.localStorage.setItem("paxstage", "");
                       //console.log(window.localStorage.getItem("agtInfo"));
                     });

             // Draw axes
             chartGroup.append("g")
                     .attr("class","xaxis")
                     .attr("transform","translate(0,"+height/2+")")
                     .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));
            // TO DO: MAKE 1ST & LAST TICK LABELS APPEAR
      })
  };
