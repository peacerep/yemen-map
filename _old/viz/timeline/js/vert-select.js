window.onload = function() {
  // window.localStorage.setItem("updatePaxMap", "false");
  window.localStorage.setItem("updatePaxVerticalA","false");
  window.localStorage.setItem("updatePaxVerticalB","false");
  window.localStorage.setItem("updatePaxVerticalC","false");
  // window.localStorage.setItem("updatePaxHorizontal","false");

  window.localStorage.setItem("paxselectionV", JSON.stringify([])); // Agreement selection
  window.localStorage.setItem("paxhover", JSON.stringify([])); // Hovered agreement

  paxFilterUncheck(); // Check all code filters
  paxRuleAll(); // Pick code filter rule ALL
  // window.localStorage.setItem("updatePaxVerticalA","true");
  // window.localStorage.setItem("updatePaxVerticalB","true");
  // window.localStorage.setItem("updatePaxVerticalC","true");

  // Filter rule listeners
  document.getElementById("anyV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxRuleAny();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
    //updateURL();
  }
  document.getElementById("allV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxRuleAll();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
    //updateURL();
  }

  // Code filter listeners
  document.getElementById("DeselectAllCodesV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxFilterUncheck();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
    //updateURL();
  }
  document.getElementById("SelectAllCodesV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxFilterCheck();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
    //updateURL();
  }

  // Code filter listeners
  document.getElementById("CodesV").onclick = function(event){
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    let target = event.target;
    if (+localStorage.getItem(target.id) == 0){
      localStorage.setItem(target.id, 1);
      target.checked = true;
      console.log("Checked "+target.id);
    } else {
      localStorage.setItem(target.id, 0);
      target.checked = false;
      console.log("Unchecked "+target.id);
    }
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
    //updateURL();
  }

  // Page refresh listener
    if (window.performance) {
      if ((performance.navigation.TYPE_RELOAD)) { //|| (window.localStorage.getItem("paxReset") == "true")
        window.localStorage.setItem("updatePaxVerticalA","false");
        window.localStorage.setItem("updatePaxVerticalB","false");
        window.localStorage.setItem("updatePaxVerticalC","false");

        // Agreement selection
        window.localStorage.setItem("paxselectionV", 0);
        // Hovered agreement
        window.localStorage.setItem("paxagtidV", 0);

        paxFilterUncheck(); // Check all code filters
        paxRuleAll(); // Pick code filter rule ALL
        window.localStorage.setItem("updatePaxVerticalA","true");
        window.localStorage.setItem("updatePaxVerticalB","true");
        window.localStorage.setItem("updatePaxVerticalC","true");
    }
  }
}

function paxRuleAny() {
  document.getElementById("anyV").checked = true;
  window.localStorage.setItem("paxANYV",1);
  window.localStorage.setItem("paxALLV",0);
  console.log("Selected ANY for vertical timelines")
}
function paxRuleAll() {
  document.getElementById("allV").checked = true;
  window.localStorage.setItem("paxANYV",0);
  window.localStorage.setItem("paxALLV",1);
  console.log("Selected ALL for vertical timelines")
}
function paxFilterUncheck() {
  var filters = document.getElementsByName("filterV");
  for (i = 0; i < filters.length; i++) {
  filters[i].checked = false;
  window.localStorage.setItem(filters[i].id,0);
}
console.log("Unchecked all code filters for vertical timelines");
}
function paxFilterCheck() {
  var filters = document.getElementsByName("filterV");
  for (i = 0; i < filters.length; i++) {
  filters[i].checked = true;
  window.localStorage.setItem(filters[i].id,1);
}
console.log("Checked all code filters for vertical timelines");
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
//   var paxHrGen = localStorage.getItem("paxHrGen");
//   var paxPol = localStorage.getItem("paxPol");
//   var paxEps = localStorage.getItem("paxEps");
//   var paxMps = localStorage.getItem("paxMps");
//   var paxPolps = localStorage.getItem("paxPolps");
//   var paxTerps = localStorage.getItem("paxTerps");
//   var paxTjMech = localStorage.getItem("paxTjMech");
//   var paxGeWom = localStorage.getItem("paxGeWom");
//   var codes = [+paxHrGen, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom];
//   var codeNames = ["HrGen", "Pol", "Eps", "Mps", "Polps", "Terps", "TjMech", "GeWom"];
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
//   var paxHrGenV = window.localStorage.getItem("paxHrGenV");
//   var paxMpsV = window.localStorage.getItem("paxMpsV");
//   var paxEpsV = window.localStorage.getItem("paxEpsV");
//   var paxTerpsV = window.localStorage.getItem("paxTerpsV");
//   var paxPolpsV = window.localStorage.getItem("paxPolpsV");
//   var paxPolV = window.localStorage.getItem("paxPolV");
//   var paxGeWomV = window.localStorage.getItem("paxGeWomV");
//   var paxTjMechV = window.localStorage.getItem("paxTjMechV");
//   var codesV = [+paxHrGenV, +paxPolV, +paxEpsV, +paxMpsV, +paxPolpsV, +paxTerpsV, +paxTjMechV, +paxGeWomV];
//   // same codeNames as above --> ["HrGen", "Pol", "Eps", "Mps", "Polps", "Terps", "TjMech", "GeWom"];
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
