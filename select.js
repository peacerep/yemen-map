/* Filtering agreements by category
   Storing paxfilters in local storage
   Updating URL based on filter selections
*/
window.onload = function() {
    /*
    Set defaults
    */
    window.localStorage.setItem("updatePaxHorizontal","false");
    window.localStorage.setItem("updatePaxMap", "false");
    
    window.localStorage.setItem("paxagtid", 0);
    window.localStorage.setItem("paxselection", 0);

    var allCons = document.getElementsByName("Con");
    var paxConsAll = [];
    for (i = 0; i < allCons.length; i++){
      paxConsAll.push(String(allCons[i].id))
    }
    localStorage.setItem("paxConsAll", JSON.stringify(paxConsAll));

    localStorage.setItem("paxCons", JSON.stringify([]));
    paxCheckTime();
    paxConsAllUncheck(); // Check all country/entity values
    paxConRuleAll(); // Display agreements with any checked country/entity
    paxFilterUncheck(); // Check all code filters
    paxRuleAll(); // Pick code filter rule ALL

    window.localStorage.setItem("updatePaxHorizontal","true");
    window.localStorage.setItem("updatePaxMap", "true");

    /*
    Listeners
    */
    // Time listeners
    document.getElementById("StartYears").onclick = function(event){
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      let target = event.target;
      var startDate = "01/01/"+String(target.id);
      window.localStorage.setItem("paxNewMinDay",startDate);
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }
    document.getElementById("EndYears").onclick = function(event){
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      let target = event.target;
      var endDate = "31/12/"+String(target.id);
      window.localStorage.setItem("paxNewMaxDay",endDate);
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }

    // Country/entity listeners
    document.getElementById("anyCon").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxConRuleAny();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }
    document.getElementById("allCon").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxConRuleAll();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }
    document.getElementById("DeselectAllCons").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxConsAllUncheck();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }
    document.getElementById("SelectAllCons").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxConsAllCheck();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }
    document.getElementById("Cons").onclick = function(event){
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      let target = event.target;
      var con = target.id;
      if (target.name == "Con"){
        var conList = JSON.parse(localStorage.getItem("paxCons"));
        if (conList.includes(target.id)){
          var conI = conList.indexOf(con);
          var removed = conList.splice(conI, 1);
          localStorage.setItem("paxCons",JSON.stringify(conList));
          target.checked = false;
          console.log("Removed from paxCons: "+removed);
        } else {
          conList.push(con);
          localStorage.setItem("paxCons",JSON.stringify(conList));
          target.checked = true;
          console.log("Added to paxCons: "+target.id);
        }
      }
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }

    // Filter rule listeners
    document.getElementById("any").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxRuleAny();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }
    document.getElementById("all").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxRuleAll();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }

    // Code filter listeners
    document.getElementById("DeselectAllCodes").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxFilterUncheck();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }
    document.getElementById("SelectAllCodes").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxFilterCheck();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }

    // Code filter listeners
    document.getElementById("Codes").onclick = function(event){
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      let target = event.target;
      var code = target.id;
      var filters = document.getElementsByName("text");
      for (i = 0; i < filters.length; i++) {
        if (filters[i].id == code){
          if (filters[i].style.color == "silver"){
          filters[i].style.color = "black";
          localStorage.setItem(code, 1);
          console.log("Checked "+target.id);
          } else {
          filters[i].style.color = "silver";
          localStorage.setItem(code, 0);
          console.log("Unchecked "+target.id);
          }
        }
      }
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
      //updateURL();
    }

    // Page refresh listener
    if (window.performance) {
      if ((performance.navigation.TYPE_RELOAD) || (window.localStorage.getItem("paxReset") == "true")){
        localStorage.setItem("paxCons", JSON.stringify(document.getElementsByName("Con").id));
        paxCheckTime();
        paxConsAllUncheck(); // Check all country/entity values
        paxConRuleAll(); // Display agreements with any checked country/entity
        paxFilterUncheck(); // Check all code filters
        paxRuleAll(); // Pick code filter rule ALL
        // Reset codes, countries/entities, & time period
        // window.localStorage.setItem("paxHrFra",0); // Human rights framework
        window.localStorage.setItem("pax HrFra",0); // Human rights/Rule of law
        window.localStorage.setItem("paxPol",0); // Political institutions
        window.localStorage.setItem("paxEps",0); // Economic power sharing
        window.localStorage.setItem("paxMps",0); // Military power sharing
        window.localStorage.setItem("paxPolps",0); // Political power sharing
        window.localStorage.setItem("paxTerps",0); // Territorial power sharing
        window.localStorage.setItem("paxTjMech",0); // Transitional justice past mechanism
        window.localStorage.setItem("paxGeWom",0); // Women, girls and gender
        window.localStorage.setItem("paxANY",0); // Selected ANY filter rule
        window.localStorage.setItem("paxALL",1); // Selected ALL filter rule
        window.localStorage.setItem("paxConRule","all"); // Selected ANY country/entity rule
        window.localStorage.setItem("paxNewMinDay", "01/01/1990");
        window.localStorage.setItem("paxNewMaxDay", "31/12/2015");

        window.localStorage.setItem("paxagtid", 1370);
        window.localStorage.setItem("paxselection", 1370);

        window.localStorage.setItem("updatePaxHorizontal","true");
        window.localStorage.setItem("updatePaxMap", "true");

        window.localStorage.setItem("paxReset", "false");
      }
    }
}

function paxCheckTime(){
  window.localStorage.setItem("paxNewMinDay","01/01/1990");
  window.localStorage.setItem("paxNewMaxDay","31/12/2015");
  var startYears = document.getElementsByName("StartYear")
  for (i = 0; i < startYears.length; i++){
    if (startYears[i].id == "1990"){
      startYears[i].checked == true;
    } else {
      startYears[i].checked == false;
    }
  }
  var endYears = document.getElementsByName("EndYear")
  for (i = 0; i < endYears.length; i++){
    if (endYears[i].id == "2015"){
      endYears[i].checked == true;
    } else {
      endYears[i].checked == false;
    }
  }
}
function paxConRuleAny() {
  var conRadios = document.getElementsByName("conRule");
  for (i = 0; i < conRadios.length; i++){
    if (conRadios[i].id == "anyCon"){
      conRadios[i].checked == true;
    }
  }
  console.log("Selected ANY Con");
  localStorage.setItem("paxConRule","any");
}
function paxConRuleAll() {
  var conRadios = document.getElementsByName("conRule");
  for (i = 0; i < conRadios.length; i++){
    if (conRadios[i].id == "allCon"){
      conRadios[i].checked == true;
    }
  }
  console.log("Selected ALL Cons");
  localStorage.setItem("paxConRule","all");
}
function paxConsAllCheck() {
  var cons = document.getElementsByName("Con");
  var newPaxCons = [];
  for (i = 0; i < cons.length; i++){
    cons[i].checked = true;
    newPaxCons.push(String(cons[i].id))
  }
  console.log("Checked all Country/Entity values"); // array of 158 country/entity strings
  localStorage.setItem("paxCons", JSON.stringify(newPaxCons)); // retrieve with JSON.parse(localStorage.getItem("paxCons"));
}
function paxConsAllUncheck() {
  var cons = document.getElementsByName("Con");
  for (i = 0; i < cons.length; i++){
    cons[i].checked = false;
  }
  var newPaxCons = [];
  console.log("Unchecked all Country/Entity values");
  localStorage.setItem("paxCons", JSON.stringify(newPaxCons)); // retrieve with JSON.parse(localStorage.getItem("paxCons"));
}
function paxRuleAny() {
  var filterRadios = document.getElementsByName("filterRule");
  for (i = 0; i < filterRadios.length; i++){
    if (filterRadios[i].id == "any"){
      filterRadios[i].checked == true;
    }
  }
  // document.getElementById("any").checked = true;
  localStorage.setItem("paxANY",1);
  localStorage.setItem("paxALL",0);
  console.log("Selected ANY")
}
function paxRuleAll() {
  var filterRadios = document.getElementsByName("filterRule");
  for (i = 0; i < filterRadios.length; i++){
    if (filterRadios[i].id == "all"){
      filterRadios[i].checked == true;
    }
  }
  localStorage.setItem("paxANY",0);
  localStorage.setItem("paxALL",1);
  console.log("Selected ALL")
}
function paxFilterUncheck() {
  var filters = document.getElementsByName("text");
  for (i = 0; i < filters.length; i++) {
    filters[i].style.color = "silver";
    localStorage.setItem(filters[i].id,0);
  }
  console.log("Unchecked all code filters");
}
function paxFilterCheck() {
  var filters = document.getElementsByName("text");
  for (i = 0; i < filters.length; i++) {
    filters[i].style.color = "black";
    localStorage.setItem(filters[i].id,1);
  }
  console.log("Checked all code filters");
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
//   var pax HrFra = localStorage.getItem("pax HrFra");
//   var paxPol = localStorage.getItem("paxPol");
//   var paxEps = localStorage.getItem("paxEps");
//   var paxMps = localStorage.getItem("paxMps");
//   var paxPolps = localStorage.getItem("paxPolps");
//   var paxTerps = localStorage.getItem("paxTerps");
//   var paxTjMech = localStorage.getItem("paxTjMech");
//   var paxGeWom = localStorage.getItem("paxGeWom");
//   var codes = [+pax HrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom];
//   var codeNames = [" HrFra", "Pol", "Eps", "Mps", "Polps", "Terps", "TjMech", "GeWom"];
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
//   var pax HrFraV = window.localStorage.getItem("pax HrFraV");
//   var paxMpsV = window.localStorage.getItem("paxMpsV");
//   var paxEpsV = window.localStorage.getItem("paxEpsV");
//   var paxTerpsV = window.localStorage.getItem("paxTerpsV");
//   var paxPolpsV = window.localStorage.getItem("paxPolpsV");
//   var paxPolV = window.localStorage.getItem("paxPolV");
//   var paxGeWomV = window.localStorage.getItem("paxGeWomV");
//   var paxTjMechV = window.localStorage.getItem("paxTjMechV");
//   var codesV = [+pax HrFraV, +paxPolV, +paxEpsV, +paxMpsV, +paxPolpsV, +paxTerpsV, +paxTjMechV, +paxGeWomV];
//   // same codeNames as above --> [" HrFra", "Pol", "Eps", "Mps", "Polps", "Terps", "TjMech", "GeWom"];
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
