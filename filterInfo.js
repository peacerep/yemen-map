/*
Display selected filters
(Countries/Entities, Codes)
*/

function callFilterFunction() {
  /*
  Retrieve possible filter values
  */
  var paxANY = window.localStorage.getItem("paxANY"),
      paxALL = window.localStorage.getItem("paxALL"),
      // Code selections
      paxHrFra = window.localStorage.getItem("paxHrFra"),
      paxHrGen = window.localStorage.getItem("paxHrGen"),
      paxPol = window.localStorage.getItem("paxPol"),
      paxEps = window.localStorage.getItem("paxEps"),
      paxMps = window.localStorage.getItem("paxMps"),
      paxPolps = window.localStorage.getItem("paxPolps"),
      paxTerps = window.localStorage.getItem("paxTerps"),
      paxTjMech = window.localStorage.getItem("paxTjMech"),
      paxGeWom = window.localStorage.getItem("paxGeWom"),
      // Country/entity selections
      paxCons = JSON.parse(window.localStorage.getItem("paxCons")),
      paxConRule = localStorage.getItem("paxConRule");
      // // Time selections
      // newMinDay = window.localStorage.getItem("paxNewMinDay"),
      // newMaxDay = window.localStorage.getItem("paxNewMaxDay");

  /*
  Display visualization selections
  */
  var conText = getConText(paxCons),
      codeText = getCodeText();
      // minDayText = "Start Date: "+String(newMinDay),
      // maxDayText = "End Date: "+String(newMaxDay);

  var newTCons = document.createTextNode(conText);
  var pCons = document.getElementById("selectionsCon");
  pCons.removeChild(pCons.childNodes[0]);
  pCons.appendChild(newTCons);

  // var newTCodes = document.createTextNode(codeText);
  // var pCodes = document.getElementById("selectionsCode");
  // pCodes.removeChild(pCodes.childNodes[0]);
  // pCodes.appendChild(newTCodes);

  // var newTStartYr = document.createTextNode(minDayText);
  // var pStartYr = document.getElementById("selectionsStartYr");
  // pStartYr.removeChild(pStartYr.childNodes[0]);
  // pStartYr.appendChild(newTStartYr);
  //
  // var newTEndYr = document.createTextNode(maxDayText);
  // var pEndYr = document.getElementById("selectionsEndYr");
  // pEndYr.removeChild(pEndYr.childNodes[0]);
  // pEndYr.appendChild(newTEndYr);

  /*
  Functions to compose selections text
  */
  function getConText(paxCons){
    // console.log("paxCons length: "+paxCons.length); // 163
    var paxConsCount = paxCons.length;
    var allCons = JSON.parse(localStorage.getItem("paxConsAll"));
    if (paxCons.length == allCons.length){
      return "All";
    } else if (paxConsCount > 0){
      var conText = ""
      for (i = 0; i < (paxConsCount-1); i++){
        conText += String(paxCons[i]) + ", ";
      }
      conText += String(paxCons[paxConsCount-1]);
      return conText;
    } else {
      return "None";
    }
  }

  function getCodeText(){
    var codeFilters = [+paxHrFra, +paxHrGen, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom];
    var codeFilterCount = codeFilters.length;
    var codeText = "";
    var vizCodes = ["Human Rights Framework", "Human Rights/Rule of Law", "Political Institutions", "Power Sharing: Economic", "Power Sharing: Military", "Power Sharing: Political", "Power Sharing: Territorial", "Transitional Justice Past Mechanism", "Women, Girls and Gender"];
    var codeIndeces = [];
    for (i = 0; i < codeFilterCount; i++){
      if (codeFilters[i] > 0){
        // codeIndeces.push(i);
        codeText += " " + vizCodes[i] + ",";
      }
    }
    if (codeText.length == 0){
      return " None";
    }
    codeText = codeText.slice(0,-1);
    return codeText;
  }

}
