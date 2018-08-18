/*
Timeline with agreements displayed continuously on y axis
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

function callFunction() {

  var parseDate = d3.timeParse("%d/%m/%Y");
  var parseMonth = d3.timeParse("%m");
  var parseYear = d3.timeParse("%Y");
  var parseDay = d3.timeParse("%j");

  var formatDate = d3.timeFormat("%d %B %Y");
  var formatMonth = d3.timeFormat("%m");
  var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
  var formatYear = d3.timeFormat("%Y");

  d3.csv("PAX_with_additional.csv")
      .row(function(d){ return {Year:+d.Year,
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
                                TjMech:d.TjMech, // 1-3 indicating increasing level of detail given about a body to deal with the past; 0 if none given
                              }; })
      .get(function(error,data){
        data = data.filter(function(d){ return d.Pol > 0; });

          var tooltip = d3.select("body").append("div")
              .style("opacity","0")
              .style("position","absolute");

          var svgtest = d3.select("body").select("svg");
          if (!svgtest.empty()) {
            svgtest.remove();
          }

          var margin = {top: 20, right: 50, bottom: 20, left: 10}, //read clockwise from top
              tooltipMargin = 230,
              width = parseInt(d3.select("body").style("width"), 10),
              width = width - margin.left - margin.right,
              height = 200 - margin.top - margin.bottom; //defines w & h as inner dimensions of chart area

        /*
        Nested Data
        */
          var yr_count_object = d3.nest()
               .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
               .rollup(function(leaves) {return leaves.length;})
               .object(data);  // access with names: yr_count_array["1990"] => leaf value
         var yr_count_map = d3.nest()
              .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
              .rollup(function(leaves){ return leaves.length; })
              .map(data);
         var years = yr_count_map.keys();
         var yr_count_array = d3.nest()
              .key(function(d) {return d.Year;}).sortKeys(d3.ascending)
              .rollup(function(leaves){ return leaves.length; })
              .entries(data);  // access with indeces: yr_count_array[0] => object
        var yr_group = d3.nest()
              .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
              .entries(data);
        // console.log(yr_group[0].values[0].GeWom);  // TO ACCESS CATEGORIES
        //yr_group.forEach(function(d,i){console.log(yr_group[i].values); });
        //console.log(yr_group_values);
       /***********************************************************************/

          var svg = d3.select("body").select("#chart").append("svg")
              .attr("height", height + margin.top + margin.bottom)//"100%")
              .attr("width", width + margin.left + margin.right);//"100%");

          var chartGroup = svg.append("g")
                      .attr("transform","translate("+margin.left+","+margin.top+")");

          // svg.call(d3.zoom()
          //   .on("zoom",function(){  //on: tell event, then tell function
          //     chartGroup.attr("transform",d3.event.transform);
          // }));

        // Find the maximum number of agreements that occur in a single year
        var max = d3.max(yr_count_array,function(d){ return d.value; });
        // Find the earliest & latest year in which agreements occur
        var minYear = d3.min(yr_count_array,function(d){ return d.key; });
        var maxYear = d3.max(yr_count_array,function(d){ return d.key; });
        // Find the earliest & latest day of the year on which agreements are written
        var minDay = d3.min(data,function(d){ return (d.Dat); });
        var maxDay = d3.max(data,function(d){ return (d.Dat); });

      /*
      Scales (for axes)
      */
        var y = d3.scaleLinear()
                    .domain([0,(max*30)]) // data space - assume rects height of 30px...?
                    .range([height,margin.bottom]); // display space
        var x = d3.scaleTime()
                    .domain([minDay,maxDay])  // data space
                    .range([margin.left,width]);  // display space
      /***********************************************************************/

        // console.log(data);

          chartGroup.selectAll("rect.agt")
            .data(data)
            .enter().append("rect")
               .attr("class","agt")
               .attr("fill","black")
               .attr("stroke","white")
               .attr("stroke-width","1px")
               //.attr("d", function(d,i) { return agt(d.values); })
               .attr("x",function(d){ return x(d.Dat); })
               .attr("y",function(d){ return ((height/2)-19)+"px"; })
               .attr("width","4px")
               .attr("height","20px") // TO DO: calculate height based on max # of agmts in single year
               .on("mousemove",function(d){
                 this.style.fill = "steelblue"
                 tooltip.style("opacity","1")
                   .style("left",margin.left)  //("left",d3.event.pageX+"px")
                   .style("top",(margin.top + tooltipMargin)+"px")  //("top",d3.event.pageY+"px")
                   .attr("class","tooltip");
                 // Display core agreement information (name, date, region, country/entity, status, type & stage)
                 tooltip.html("<h5>"+d.Agt+"</h5> " +"<p><b>Date:</b> "+formatDate(d.Dat)+"<br/><b>Region:</b> "+d.Reg+"<br/><b>Country/Entity:</b> "+d.Con+"<br/><b>Status:</b> "+d.Status+"<br/><b>Type:</b> "+d.Agtp+"<br/><b>Stage:</b> "+d.Stage+"</p>");
               })
               .on("mouseout",function(d) {
                 this.style.fill = "black"
                 tooltip.style("opacity","0")
                   .style("left",margin.left)  //("left",d3.event.pageX+"px")
                   .style("top",height+"px");
               });
        /***********************************************************************/

        /*
        Bar graph
        */
            chartGroup.selectAll("rect.count")
               .data(yr_count_array)
               .enter().append("rect")
                 .attr("class","count")
                 .attr("fill","black")
                 .attr("stroke","white")
                 .attr("stroke-width","0.5px")
                 .attr("x",function(d){ return x(parseYear(d.key)); })
                 .attr("y",function(d){ return ((height/2)+24)+"px"; })
                 .attr("width",width/(years.length))
                 .attr("height",function(d){ return d.value; })
                 .on("mousemove",function(d){
                   this.style.fill = "steelblue"
                   tooltip.style("opacity","1")
                     .style("left",margin.left)  //("left",d3.event.pageX+"px")
                     .style("top",(margin.top + tooltipMargin)+"px")  //("top",d3.event.pageY+"px")
                     .attr("class","tooltip");
                   // Display core agreement information (name, date, region, country/entity, status, type & stage)
                   tooltip.html("<h5>Total Peace Agreements in "+d.key+": "+d.value+"</h5>");
                 })
                 .on("mouseout",function(d) {
                   this.style.fill = "black"
                   tooltip.style("opacity","0")
                     .style("left",margin.left)  //("left",d3.event.pageX+"px")
                     .style("top",height+"px");
                 });

       /***********************************************************************/

       /*
       Axes
       */
           chartGroup.append("g")
             .attr("class","xaxis")
             .attr("transform","translate(0,"+height/2+")")
             .call(d3.axisBottom(x).ticks(years.length).tickFormat(d3.timeFormat("%Y")));
          // TO DO: MAKE 1ST & LAST TICK LABELS APPEAR
      /***********************************************************************/

  });  // end of .get(error,data)
};
