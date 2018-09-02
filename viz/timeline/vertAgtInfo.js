/*
Display selected filters
(Countries/Entities, Codes)
*/

function callVertFilterFunction() {
  /*
  Retrieve possible filter values
  */
  var paxANY = window.localStorage.getItem("paxANYV"),
      paxALL = window.localStorage.getItem("paxALLV"),
      // Code selections
      // paxHrFra = window.localStorage.getItem("paxHrFraV"),
      paxHrGen = window.localStorage.getItem("paxHrGenV"),
      paxPol = window.localStorage.getItem("paxPolV"),
      paxEps = window.localStorage.getItem("paxEpsV"),
      paxMps = window.localStorage.getItem("paxMpsV"),
      paxPolps = window.localStorage.getItem("paxPolpsV"),
      paxTerps = window.localStorage.getItem("paxTerpsV"),
      paxTjMech = window.localStorage.getItem("paxTjMechV"),
      paxGeWom = window.localStorage.getItem("paxGeWomV");

  /*
  Display visualization selections
  */
  var codeText = getCodeText();
  console.log(codeText);

  // var newTCons = document.createTextNode(conText);
  // var pCons = document.getElementById("selectionsCon");
  // pCons.removeChild(pCons.childNodes[0]);
  // pCons.appendChild(newTCons);

  var newTCodes = document.createTextNode(codeText);
  var pCodes = document.getElementById("selectionsCode");
  pCodes.removeChild(pCodes.childNodes[0]);
  pCodes.appendChild(newTCodes);

  /*
  Functions to compose selections text
  */
  function getCodeText(){
    var codeFilters = [+paxHrGen, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom]; //+paxHrFra,
    var codeFilterCount = codeFilters.length;
    var codeText = "";
    var vizCodes = ["Human Rights/Rule of Law", "Political Institutions", "Power Sharing: Economic", "Power Sharing: Military", "Power Sharing: Political", "Power Sharing: Territorial", "Transitional Justice Past Mechanism", "Women, Girls and Gender"]; //"Human Rights Framework", 
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
