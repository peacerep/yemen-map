
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

  var agtInfo = "<em>"+agt+"</em>"+"<br/><br/>"+dat+"<br/>"+reg+"<br/>"+con+"<br/>"+status+"<br/>"+agtp+"<br/>"+stage;

  var margin = {top: 160, right: 2, bottom: 30, left: 2}, //read clockwise from top
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
