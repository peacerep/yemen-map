callVInfoFunction();
d3.select(window).on("resize", callVInfoFunction);
window.addEventListener("storage", callVInfoFunction);

function callVInfoFunction() {
  var svgtest = d3.select("body").select("svg");
  if (!svgtest.empty()) { svgtest.remove(); }

  var hovered = window.localStorage.getItem("paxagtidV");
  if (+hovered > 0){
      var paxAgtId = +hovered;
  } else {
      var paxAgtId = +window.localStorage.getItem("paxselectionV");
  }

  var margin = {top: 10, right: 10, bottom: 10, left: 10}, //read clockwise from top
      width = parseInt(d3.select("body").style("width"), 10),
      width = width - margin.left - margin.right,
      height = parseInt(d3.select(".selecter").style("height"), 10);

  var svg = d3.select("body").select("#agtV").append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right);

  var textY = margin.top;

  if (+paxAgtId == 0){

      var agt = "Hover over or click agreements on the vertical timelines to view their details.",
          dat = "<b>Date Signed:</b> ",
          con = "<b>Country/Entity:</b> ",
          status = "<b>Status:</b> ",
          agtp = "<b>Type:</b> ",
          stage = "<b>Stage:</b> ",
          stagesub = "<b>Substage:</b> ";

      var details = "<em>"+agt+"</em>"+"<br/><br/><p>"+dat+"</p><br/><p>"
                    +con+"</p><br/><p>"+status+"</p><br/><p>"+agtp+"</p><br/><p>"
                    +stage+"</p><br/>"+stagesub+"</p><br/>";

      svg.append("foreignObject")
          .attr("width",width)
          .attr("height",height)
          .attr("x", 0)
          .attr("y", textY)
        .append("xhtml:body")
          .style("fill","black")
          .html(details)
          .attr("class","agtInfoV");

  } else {

      // Agreement details and flower information
      var agtVizData = JSON.parse(window.localStorage.getItem("paxVizData"));         // vizData[agt.AgtId] = [ agt.Agt,agt.Dat,agt.Con,agt.Status,agt.Agtp,agt.Stage,agt.StageSub,agt.Pol,agt.Polps,agt.Terps,agt.Eps,agt.Mps,agt.HrFra,agt.GeWom,agt.TjMech ]

      // Agreement core information to display ("details")
      var agt = agtVizData[paxAgtId][0],
          dat = "<b>Date Signed:</b> "+ agtVizData[paxAgtId][1],
          // reg = "<b>Region:</b> "+ window.localStorage.getItem("paxreg"),
          con = "<b>Country/Entity:</b> "+ agtVizData[paxAgtId][2],
          status = "<b>Status:</b> "+ agtVizData[paxAgtId][3],
          agtp = "<b>Type:</b> "+ agtVizData[paxAgtId][4],
          stage = "<b>Stage:</b> "+ agtVizData[paxAgtId][5],
          stagesub = "<b>Substage:</b> "+ agtVizData[paxAgtId][6],

      // Agreement's links in PA-X Database to include in "details"
          agtPDF = "https://peaceagreements.org/masterdocument/"+String(paxAgtId),        // PDF document of agreement (to download)
          agtCod = "https://peaceagreements.org/view/"+String(paxAgtId)+"/"+String(agt);  // Coding details of agreement (to view in browser)

    var details = "<em>"+agt+"</em>"+"<br/><br/><p>"+dat+"</p><br/><p>"
                  +con+"</p><br/><p>"+status+"</p><br/><p>"+agtp+"</p><br/><p>"
                  +stage+"</p><br/>"+stagesub+"<br/>"
                  +"<p><b><a class='pdf' href="+agtPDF+">Open PDF</a></b></p>"+
                  "<p><b><a class='cod' target='_blank' href="+agtCod+">View Coding Detail</a></b></p>";

    // Display core agreement information
    svg.append("foreignObject")
        .attr("width",width)
        .attr("height",height)
        .attr("x", 0)
        .attr("y", textY)
      .append("xhtml:body")
        .style("fill","black")
        .html(details)
        .attr("class","agtInfoV");
    }

} // end of callInfoFunction
