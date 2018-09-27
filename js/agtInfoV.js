/*
BOTTOM SELECTER AGREEMENT INFORMATION
Displays the symbol (flower) and details (core information) of the agreement
from the vertical timelines on which a user hovers or clicks
*/

callVInfoFunction();
d3.select(window).on("resize", callVInfoFunction);
window.addEventListener("storage", callVInfoFunction);

function callVInfoFunction() {
  var svgtest = d3.select("body").select("svg");
  if (!svgtest.empty()) { svgtest.remove(); }

  var hovered = JSON.parse(window.localStorage.getItem("paxhoverV"));
  if (hovered && (hovered.length > 1)){
      var agtVizData = hovered;
  } else {
      var selection = JSON.parse(window.localStorage.getItem("paxselectionV"));
      if (selection && (selection.length > 1)){
        var agtVizData = selection;
      } else {
        var agtVizData = 0;
      }
  }

  var margin = {top: 10, right: 10, bottom: 10, left: 10}, //read clockwise from top
      width = parseInt(d3.select("body").style("width"), 10),
      width = width - margin.left - margin.right,
      height = parseInt(d3.select(".selecter").style("height"), 10);

  var svg = d3.select("body").select("#agtV").append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right);

  var textY = margin.top;

  if (agtVizData == 0){

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

      // Agreement details
      //  [agt.AgtId,agt.Agt,agt.Dat,agt.Con,agt.Status,agt.Agtp,agt.Stage,agt.StageSub,agt.Pol,agt.Polps,agt.Terps,agt.Eps,agt.Mps,agt.HrFra,agt.GeWom,agt.TjMech ]

      // Agreement core information to display ("details")
      var agt = agtVizData[1],
          dat = "<b>Date Signed:</b> "+ agtVizData[2],
          // reg = "<b>Region:</b> "+ window.localStorage.getItem("paxreg"),
          con = "<b>Country/Entity:</b> "+ agtVizData[3],
          status = "<b>Status:</b> "+ agtVizData[4],
          agtp = "<b>Type:</b> "+ agtVizData[5],
          stage = "<b>Stage:</b> "+ agtVizData[6],
          stagesub = "<b>Substage:</b> "+ agtVizData[7],

      // Agreement's links in PA-X Database to include in "details"
          paxAgtId = agtVizData[0],
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
