/*
Updates right vertical timelines when the webpage is reloaded or a
country/entity is selected from the dropdown list
*/

window.onload = function() {
  window.localStorage.setItem("updatePaxVerticalA","false");
  window.localStorage.setItem("updatePaxVerticalB","false");
  window.localStorage.setItem("updatePaxVerticalC","false");
  localStorage.setItem("paxVertConC","None selected");
  document.getElementById("None").checked = true;
  window.localStorage.setItem("updatePaxVerticalC","true");

  // Country/entity listeners for vertical timelines (left to right)
  document.getElementById("VertConRadiosC").onclick = function(event){
    let target = event.target;
    if (target.name == "ConRadio"){
      window.localStorage.setItem("updatePaxVerticalC","true");
      window.localStorage.setItem("updatePaxVerticalA","false");
      window.localStorage.setItem("updatePaxVerticalB","false");
      // window.localStorage.setItem("updatePaxHorizontal","false");
      // window.localStorage.setItem("updatePaxMap", "false");
      localStorage.setItem("paxVertConC",String(target.id));
      console.log("Set paxVertConC to "+target.id);
      //updateURL();
    }
  }

  // // Put filter selections in website URL (replace state rather than push state)
  // function updateURL() {
  //   /*
  //   TOP: horizontal timeline and map
  //   */
  //   // Country/entity filter rule
  //   var paxConRule = localStorage.getItem("paxConRule");
  //   // Country/entity selections
  //   var paxCons = window.localStorage.getItem("paxCons");
  //   // Code filter rule
  //   var paxANY = localStorage.getItem("paxANY");
  //   var paxALL = localStorage.getItem("paxALL");
  //   var paxCodeRule = "";
  //   if (+paxANY == 1){
  //     paxCodeRule = "any";
  //   } else if (+paxALL == 1){
  //     paxCodeRule = "all";
  //   }
  //   // Code filter selections
  //   var paxHrFra = localStorage.getItem("paxHrFra");
  //   var paxPol = localStorage.getItem("paxPol");
  //   var paxEps = localStorage.getItem("paxEps");
  //   var paxMps = localStorage.getItem("paxMps");
  //   var paxPolps = localStorage.getItem("paxPolps");
  //   var paxTerps = localStorage.getItem("paxTerps");
  //   var paxTjMech = localStorage.getItem("paxTjMech");
  //   var paxGeWom = localStorage.getItem("paxGeWom");
  //   var codes = [+paxHrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom];
  //   var codeNames = ["HrFra", "Pol", "Eps", "Mps", "Polps", "Terps", "TjMech", "GeWom"];
  //   var codeSelections = ""
  //   for (i = 0; i < codes.length; i++){
  //     if (+codes[i] > 0){
  //       codeSelections += codeNames[i];
  //     }
  //   }
  //   // Start and End Dates
  //   var paxNewMinDay = localStorage.getItem("paxNewMinDay");
  //   var paxNewMaxDay = localStorage.getItem("paxNewMaxDay");
  //
  //   /*
  //   Bottom: vertical timelines
  //   */
  //   // Country/entity selections for vertical timelines
  //   var paxVertConA = window.localStorage.getItem("paxVertConA"); // left
  //   var paxVertConB = window.localStorage.getItem("paxVertConB"); // middle
  //   var paxVertConC = window.localStorage.getItem("paxVertConC"); // right
  //   // Code filter rule
  //   var paxANYV = window.localStorage.getItem("paxANYV");
  //   var paxALLV = window.localStorage.getItem("paxALLV");
  //   var paxCodeRuleV = "";
  //   if (+paxANYV == 1){
  //     paxCodeRuleV = "any";
  //   } else if (+paxALLV == 1){
  //     paxCodeRuleV = "all";
  //   }
  //   // Code filter selections
  //   var paxHrFraV = window.localStorage.getItem("paxHrFraV");
  //   var paxHrFraV = window.localStorage.getItem("paxHrFraV");
  //   var paxMpsV = window.localStorage.getItem("paxMpsV");
  //   var paxEpsV = window.localStorage.getItem("paxEpsV");
  //   var paxTerpsV = window.localStorage.getItem("paxTerpsV");
  //   var paxPolpsV = window.localStorage.getItem("paxPolpsV");
  //   var paxPolV = window.localStorage.getItem("paxPolV");
  //   var paxGeWomV = window.localStorage.getItem("paxGeWomV");
  //   var paxTjMechV = window.localStorage.getItem("paxTjMechV");
  //   var codesV = [+paxHrFraV, +paxPolV, +paxEpsV, +paxMpsV, +paxPolpsV, +paxTerpsV, +paxTjMechV, +paxGeWomV];
  //   // same codeNames as above --> ["HrFra", "Pol", "Eps", "Mps", "Polps", "Terps", "TjMech", "GeWom"];
  //   var codeSelectionsV = ""
  //   for (i = 0; i < codesV.length; i++){
  //     if (+codesV[i] > 0){
  //       codeSelectionsV += codeNames[i];
  //     }
  //   }
  //   // Start & end years
  //   var paxMinYearV = window.localStorage.getItem("paxMinYearV");
  //   var paxMaxYearV = window.localStorage.getItem("paxMaxYearV");
  //
  //   /*
  //   Create new state to replace current state
  //   (append filter selections to URL)
  //   */
  //   var top = "/top="+paxConRule+":"+paxCons+paxCodeRule+":"+codeSelections+paxNewMinDay+"-"+paxNewMaxDay;
  //   var bottom = "/bottom=A:"+paxVertConA+"B:"+paxVertConB+"C:"+paxVertConC+paxCodeRuleV+":"+codeSelectionsV+paxMinYearV+"-"+paxMaxYearV;
  //   var endURL = String(top+bottom);
  //   var filterState = { filterSelections : endURL }
  //   window.history.replaceState(filterState, "", endURL);
  // }

  // Page refresh listener
  if (window.performance) {
    if ((performance.navigation.TYPE_RELOAD)) {  // || (window.localStorage.getItem("paxReset") == "true")
      window.localStorage.setItem("updatePaxVerticalA","false");
      window.localStorage.setItem("updatePaxVerticalB","false");
      window.localStorage.setItem("updatePaxVerticalC","false");
      // Agreement selection
      window.localStorage.setItem("paxselectionV", 0);
      // Hovered agreement
      window.localStorage.setItem("paxagtidV", 0);
    }
  }

}
