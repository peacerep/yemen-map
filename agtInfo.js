
// window.localStorage.setItem("agtInfo", "Hover over an agreement to view its details.");
d3.select(window).on("resize", callInfoFunction);
window.addEventListener("storage", callInfoFunction);
callInfoFunction();

function callInfoFunction() {
  var svgtest = d3.select("body").select("svg");
  if (!svgtest.empty()) {
    svgtest.remove();
  };

  var agt = window.localStorage.getItem("paxagt"),
      dat = "<b>Date Signed:</b> "+ window.localStorage.getItem("paxdat"),
      reg = "<b>Region:</b> "+ window.localStorage.getItem("paxreg"),
      con = "<b>Country/Entity:</b> "+ window.localStorage.getItem("paxcon"),
      status = "<b>Status:</b> "+ window.localStorage.getItem("paxstatus"),
      agtp = "<b>Type:</b> "+ window.localStorage.getItem("paxagtp"),
      stage = "<b>Stage:</b> "+ window.localStorage.getItem("paxstage");
      paxAgtId = "<b>Agreement ID:</b> "+ window.localStorage.getItem("paxAgtId");
      // paxAgtHrGen = "<b>HrGen:</b> "+ window.localStorage.getItem("paxAgtHrGen");
      // paxAgtPol = "<b>Pol:</b> "+ window.localStorage.getItem("paxAgtPol");
      // paxAgtEps = "<b>Eps:</b> "+ window.localStorage.getItem("paxAgtEps");
      // paxAgtMps = "<b>Mps:</b> "+ window.localStorage.getItem("paxAgtMps");
      // paxAgtPolps = "<b>Polps:</b> "+ window.localStorage.getItem("paxAgtPolps");
      // paxAgtTerps = "<b>Terps:</b> "+ window.localStorage.getItem("paxAgtTerps");
      // paxAgtTjMech = "<b>TjMech:</b> "+ window.localStorage.getItem("paxAgtTjMech");
      // paxAgtGeWom = "<b>GeWom:</b> "+ window.localStorage.getItem("paxAgtGeWom");

  var agtInfo = "<em>"+agt+"</em>"+"<br/><br/>"+dat+"<br/>"+reg+"<br/>"+con+"<br/>"+status+"<br/>"+agtp+"<br/>"+stage+"<br/>"+paxAgtId; //+paxAgtHrGen+"<br/>"+paxAgtPol+"<br/>"+paxAgtEps+"<br/>"+paxAgtMps+"<br/>"+paxAgtPolps+"<br/>"+paxAgtTerps+"<br/>"+paxAgtTjMech+"<br/>"+paxAgtGeWom;

  var margin = {top: 160, right: 10, bottom: 30, left: 10}, //read clockwise from top
      width = parseInt(d3.select("body").style("width"), 10),
      width = width - margin.left - margin.right,
      height = parseInt(d3.select(".selecter").style("height"), 10); // + margin.top; //- margin.bottom; //defines w & h as inner dimensions of chart area

  var textposition = (height/4) - 40,
      fontsize = 14;

  var svg = d3.select("body").select("#agt").append("svg")
      .attr("height", height + margin.top + margin.bottom)//"100%")
      .attr("width", width + margin.left + margin.right)//"100%");  // FIX WIDTH SO TEXT DOESN'T GET CUT OFF
      .attr("x",0)
      .attr("y", textposition);

  svg.append("foreignObject")
      .attr("width",width)
      .attr("height",height)
    .append("xhtml:body")
      .style("fill","black")
      .html(agtInfo)
      .attr("class","agtInfo");
}
