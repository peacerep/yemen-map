callInfoFunction();
d3.select(window).on("resize", callInfoFunction);
window.addEventListener("storage", callInfoFunction);

function callInfoFunction() {

  var svgtest = d3.select("body").select("svg");
  if (!svgtest.empty()) { svgtest.remove(); }

  // Agreement details and flower information
  var agtVizData = JSON.parse(window.localStorage.getItem("paxVizData"));
  // vizData[agt.AgtId] = [ agt.Agt,agt.Dat,agt.Con,agt.Status,agt.Agtp,agt.Stage,agt.StageSub,
  //                        agt.Pol,agt.Polps,agt.Terps,agt.Eps,agt.Mps,agt.HrGen,agt.GeWom,agt.TjMech ]
      var paxAgtId = +window.localStorage.getItem("paxagtid"),
          agt = agtVizData[paxAgtId][0], // window.localStorage.getItem("paxagt"),
          dat = "<b>Date Signed:</b> "+ agtVizData[paxAgtId][1], // window.localStorage.getItem("paxdat"),
          // reg = "<b>Region:</b> "+ window.localStorage.getItem("paxreg"),
          con = "<b>Country/Entity:</b> "+ agtVizData[paxAgtId][2], // window.localStorage.getItem("paxcon"),
          status = "<b>Status:</b> "+ agtVizData[paxAgtId][3], // window.localStorage.getItem("paxstatus"),
          agtp = "<b>Type:</b> "+ agtVizData[paxAgtId][4], // window.localStorage.getItem("paxagtp"),
          stage = "<b>Stage:</b> "+ agtVizData[paxAgtId][5], // window.localStorage.getItem("paxstage"),
          // stagesub = "<b>Substage:</b> "+ agtVizData[paxAgtId][6], // window.localStorage.getItem("paxagtid"),
          paxAgtPol = agtVizData[paxAgtId][7],//window.localStorage.getItem("paxAgtPol"),
          paxAgtPolps = agtVizData[paxAgtId][8], //window.localStorage.getItem("paxAgtPolps"),
          paxAgtTerps = agtVizData[paxAgtId][9], //window.localStorage.getItem("paxAgtTerps"),
          paxAgtEps = agtVizData[paxAgtId][10], //window.localStorage.getItem("paxAgtEps"),
          paxAgtMps = agtVizData[paxAgtId][11], //window.localStorage.getItem("paxAgtMps"),
          paxAgtHrGen = agtVizData[paxAgtId][12], //window.localStorage.getItem("paxAgtHrGen"),
          paxAgtGeWom = agtVizData[paxAgtId][13], //window.localStorage.getItem("paxAgtGeWom"),
          paxAgtTjMech = agtVizData[paxAgtId][14]; //window.localStorage.getItem("paxAgtTjMech");

      var details = "<em>"+agt+"</em>"+"<br/><br/>"+dat+"<br/>"+con+"<br/>"+status+"<br/>"+agtp+"<br/>"+stage+"<br/>", //+stagesub+"<br/>",
          data = [paxAgtId, +paxAgtPol, +paxAgtPolps, +paxAgtTerps, +paxAgtEps, +paxAgtMps, +paxAgtHrGen, +paxAgtGeWom, +paxAgtTjMech];

      var margin = {top: 160, right: 10, bottom: 30, left: 10}, //read clockwise from top
          width = parseInt(d3.select("body").style("width"), 10),
          width = width - margin.left - margin.right,
          height = parseInt(d3.select(".selecter").style("height"), 10);

      var flowerX = width/4,
          textposition = (height/4) + 35,
          fontsize = 14,
          ry1 = 25,ry2 = 35,ry3 = 40, r = 10, rx = 10, rx1 = 10,
          rPolX = 0, rPolY = 0,
          rPolpsX = 0, rPolpsY = 0,
          rTerpsX = 0, rTerpsY = 0,
          rEpsX = 0, rEpsY = 0,
          rMpsX = 0, rMpsY = 0,
          rHrGenpsX = 0, rHrGenY = 0,
          rGeWomX = 0, rGeWomY = 0,
          rTjMechX = 0, rTjMechY = 0,
          flowerY = textposition + ry3;

      var circle_opacity = .8,
          circle_stroke = '#343332',
          circle_color = '#dddcda',
          color_pol = '#f5003d',color_polps = '#01557a',color_terps = '#fbdd4b',
          color_eps = '#7a56a0',color_mps = '#029680',color_hrgen = '#f46c38',
          color_gewom = '#59c9df',color_tjmech = '#fc96ab';

      var svg = d3.select("body").select("#agt").append("svg")
          .attr("height", height + margin.top + margin.bottom)
          .attr("width", width + margin.left + margin.right)
          // .attr("x",0)
          // .attr("y", textposition);

      // Create flower tooltip - NOT WORKING
      // var tooltip = svg.append("div")
      //     .style("opacity","0")
      //     .style("position","absolute")
      //     .attr("class","tooltip");

      // Display agreement glyph
      var g = svg.selectAll("g.flower")
          .data([data])
        .enter().append("g")
          .attr("class","hovered")
          .attr("id", data[0])
          .attr("pointer-events","all");
      // console.log(data[0]);

      if (data[1] > 0){
        var ellipse_pol = g.selectAll("ellipse.pol")//0 1 2 3
               .data([data[1]])
            .enter().append("ellipse")
              .attr("class","pol")
              .style("opacity", circle_opacity)
              .style("fill", color_pol)
               .attr("pointer-events","all")
              .attr('rx', function(d){
                   if (d == 1){ rPolX = rx1; } else { rPolX = rx; }
                   return rPolX;
              })
              .attr("ry", function(d){
                   if (d ==1){ rPolY = ry1; }
                   else if (d ==2){ rPolY = ry2; }
                   else if (d ==3){ rPolY = ry3; }
                   return rPolY;
              })
              .attr("cx",flowerX)
              .attr("cy",(flowerY-rPolY))
              // .on("mouseover", function(d){
              //   this.style.opacity = 1;
              //   tooltip.style("opacity", "0.9")
              //     .style("background","#ffffff")
              //     .style("padding","10px")
              //     .style("left", width/2)
              //     .style("top", height/2)
              //     .attr("class","tooltip");
              //   tooltip.html("Political Institutions<br/><b>"+d+"</b>");
              // })
              // .on("mouseout",function(d){
              //   this.style.opacity = circle_opacity;
              //   tooltip.style("opacity","0");
              // });
       } //end ellipse_pol

       if (data[2] > 0){
         var ellipse_polps = g.selectAll("ellipse.polps")  //0 1 2 3
              .data([data[2]])
            .enter().append("ellipse")
              .attr("class","polps")
              .style("opacity", circle_opacity)
              .style("fill", color_polps)
              .attr("rx", function(d){
                  if (d == 1){ rPolpsX = rx1; } else { rPolpsX = rx; }
                  return rPolpsX;
              })
              .attr("ry", function(d){
                  if (d ==1){ rPolpsY = ry1; }
                  else if (d ==2){ rPolpsY = ry2; }
                  else if (d ==3){ rPolpsY = ry3; }
                  return rPolpsY;
              })
              .attr("cx",(flowerX+(rPolpsX/2)))
              .attr("cy",(flowerY-rPolpsY))
              .attr('transform', 'rotate(45,'+flowerX+','+flowerY+')');
       } //end ellipse_polps

       if (data[3] > 0){
         var ellipse_terps = g.selectAll("ellipse.terps")   //0 1 2 3
             .data([data[3]])
          .enter().append("ellipse")
             .attr("class","terps")
             .style("opacity", circle_opacity)
             .style("fill", color_terps)
             .attr('rx', function(d){
                 if (d == 1){ rTerpsX = rx1; }
                 else { rTerpsX = rx; }
                 return rTerpsX;
              })
             .attr("ry", function(d){
                 if (d ==1){ rTerpsY = ry1; }
                 else if (d ==2){ rTerpsY = ry2; }
                 else if (d ==3){ rTerpsY = ry3; }
                 return rTerpsY;
             })
             .attr("cx",flowerX)
             .attr("cy",(flowerY-rTerpsY))
             .attr('transform','rotate(90,'+flowerX+','+flowerY+')');
        } //ellipse_terps

        if (data[4] > 0) {
          var ellipse_eps = g.selectAll("ellipse.eps")   // 0 1 2 3
              .data([data[4]])
             .enter().append("ellipse")
              .attr("class","eps")
              .style("opacity", circle_opacity)
              .style("fill", color_eps)
              .attr('rx', function(d){
                  if (d == 1){ rEpsX = rx1; } else { rEpsX = rx; }
                  return rEpsX;
              })
              .attr("ry", function(d){
                  if (d ==1){ rEpsY = ry1; }
                  else if (d ==2){ rEpsY = ry2; }
                  else if (d ==3){ rEpsY = ry3; }
                  return rEpsY;
              })
              .attr("cx",(flowerX-(rEpsX/2)))
              .attr("cy",(flowerY-rEpsY))
              .attr('transform','rotate(225,'+flowerX+','+flowerY+')');
        }//ellipse_eps

        if (data[5] > 0){
          var ellipse_mps = g.selectAll("ellipse.mps")   //0 1 2 3
              .data([data[5]])
            .enter().append("ellipse")
              .attr("class","mps")
              .style("opacity", circle_opacity)
              .style("fill", color_mps)
              .attr('rx', function(d){
                  if (d == 1){ rMpsX = rx1; } else { rMpsX = rx; }
                  return rMpsX;
               })
              .attr("ry", function(d){
                  if (d ==1){ rMpsY = ry1; }
                  else if (d == 2){ rMpsY = ry2; }
                  else if (d == 3){ rMpsY = ry3; }
                  return rMpsY;
              })
              .attr("cx",flowerX)
              .attr("cy",(flowerY-rMpsY))
              .attr('transform','rotate(180,'+flowerX+','+flowerY+')');
        }

        if (data[6] > 0){
          var ellipse_hrgen = g.selectAll("ellipse.hrgen")   //0/1
              .data([data[6]])
            .enter().append("ellipse")
            .attr("class","hrgen")
              .style("opacity", circle_opacity)
              .style("fill", color_hrgen)
              .attr('rx', rx1)
              .attr("ry", ry1)
              .attr("cx",flowerX)
              .attr("cy",(flowerY-ry1))
              .attr('transform','rotate(135,'+flowerX+','+flowerY+')');
        }

        if (data[7] > 0){
          var ellipse_gewom = g.selectAll("ellipse.gewom")   // 0/1
              .data([data])
            .enter().append("ellipse")
              .attr("class","gewom")
              .style("opacity", circle_opacity)
              .style("fill", color_gewom)
              .attr('rx', rx1)
              .attr("ry", ry1)
              .attr("cx",flowerX)
              .attr("cy",(flowerY-ry1))
              .attr('transform','rotate(270,'+flowerX+','+flowerY+')');
        }

        if (data[8] > 0){
          var ellipse_tjmech = g.selectAll("ellipse.tjmech")  //0/1/2/3
              .data([data[8]])
            .enter().append("ellipse")
              .attr("class","tjmech")
              .style("opacity", circle_opacity)
              .style("fill", color_tjmech)
              .attr('rx', function(d){
                  if (d == 1){ rTjMechX = rx1; } else { rTjMechX = rx; }
                  return rTjMechX;
              })
              .attr("ry", function(d){
                  if (d ==1){ rTjMechY = ry1; }
                  else if (d ==2){ rTjMechY = ry2; }
                  else if (d ==3){ rTjMechY = ry3; }
                  return rTjMechY;
              })
              .attr("cx",flowerX)
              .attr("cy",(flowerY-rTjMechY))
               .attr('transform','rotate(-45,'+flowerX+','+flowerY+')');
          }

          if (data[0]){
            var circle = g.selectAll("circle.agt")
              .data([data])
            .enter().append("circle")
              .attr("class","agt")
              .style("opacity", 1)
              .style("fill", circle_color)
              .attr("id", data[0])
              .attr("cx",flowerX)
              .attr("cy",flowerY)
              .attr('r', r);
          }

          // Display core agreement information
          svg.append("foreignObject")
              .attr("width",width)
              .attr("height",height)
            .append("xhtml:body")
              .style("fill","black")
              .html(details)
              .attr("class","agtInfo")
              .attr("x", 0)
              .attr("y", textposition);
} // end of callInfoFunction
