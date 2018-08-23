/* Filtering agreements by category
   Storing paxfilters in local storage
*/
window.onload = function() {
    /*
    Set defaults
    */
    window.localStorage.setItem("paxagtid","")
    window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxHorizontal","false");
    window.localStorage.setItem("updatePaxVertical","false");

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
    storeBlankAgtDetails();// Empty agreement details in localStorage
    paxRuleAll(); // Pick code filter rule ALL

    window.localStorage.setItem("updatePaxHorizontal","true");
    window.localStorage.setItem("updatePaxMap", "true");

    /*
    Listeners
    */
    // Time listeners
    document.getElementById("StartYears").onclick = function(event){
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxMap", "false");
      let target = event.target;
      var startDate = "01/01/"+String(target.id);
      window.localStorage.setItem("paxNewMinDay",startDate);
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
    }
    document.getElementById("EndYears").onclick = function(event){
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxMap", "false");
      let target = event.target;
      var endDate = "31/12/"+String(target.id);
      window.localStorage.setItem("paxNewMaxDay",endDate);
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
    }

    // Country/entity listeners
    document.getElementById("anyCon").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxConRuleAny();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
    }
    document.getElementById("allCon").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxConRuleAll();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
    }
    document.getElementById("DeselectAllCons").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxConsAllUncheck();
      storeBlankAgtDetails();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
    }
    document.getElementById("SelectAllCons").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxConsAllCheck();
      storeBlankAgtDetails();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
    }
    document.getElementById("Cons").onclick = function(event){
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
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
    }

    // Filter rule listeners
    document.getElementById("any").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxRuleAny();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
    }
    document.getElementById("all").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxRuleAll();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
    }

    // Code filter listeners
    document.getElementById("DeselectAllCodes").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxFilterUncheck();
      storeBlankAgtDetails();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
    }
    document.getElementById("SelectAllCodes").onclick = function(event) {
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxMap", "false");
      paxFilterCheck();
      storeBlankAgtDetails();
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
    }

    // Code filter listeners
    document.getElementById("Codes").onclick = function(event){
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxMap", "false");
      let target = event.target;
      // console.log("Target.id: "+target.id);
      if (localStorage.getItem(target.id) == 0){
        localStorage.setItem(target.id, 1);
        target.checked = true;
        console.log("Checked "+target.id);
      } else {
        localStorage.setItem(target.id, 0);
        target.checked = false;
        console.log("Unchecked "+target.id);
      }
      window.localStorage.setItem("updatePaxHorizontal","true");
      window.localStorage.setItem("updatePaxMap", "true");
    }

    // Page refresh listener
    if (window.performance) {
      if ((performance.navigation.TYPE_RELOAD) || (window.localStorage.getItem("paxReset") == "true")){
        window.localStorage.setItem("updatePaxHorizontal","false");
        window.localStorage.setItem("updatePaxMap", "false");
        localStorage.setItem("paxCons", JSON.stringify(document.getElementsByName("Con").id));
        paxCheckTime();
        paxConsAllUncheck(); // Check all country/entity values
        paxConRuleAll(); // Display agreements with any checked country/entity
        paxFilterUncheck(); // Check all code filters
        storeBlankAgtDetails();// Empty agreement details in localStorage
        paxRuleAll(); // Pick code filter rule ALL
        // Reset codes, countries/entities, & time period
        // window.localStorage.setItem("paxHrFra",0); // Human rights framework
        window.localStorage.setItem("paxHrGen",0); // Human rights/Rule of law
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
  // document.getElementById("anyCon").checked = "true";
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
  // document.getElementById("allCon").checked = true;
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
  // document.getElementById("all").checked = true;
  localStorage.setItem("paxANY",0);
  localStorage.setItem("paxALL",1);
  console.log("Selected ALL")
}
function paxFilterUncheck() {
  var filters = document.getElementsByName("filter");
  for (i = 0; i < filters.length; i++) {
    filters[i].checked = false;
    localStorage.setItem(filters[i].id,0);
  }
  console.log("Unchecked all code filters");
}
function paxFilterCheck() {
  var filters = document.getElementsByName("filter");
  for (i = 0; i < filters.length; i++) {
    filters[i].checked = true;
    localStorage.setItem(filters[i].id,1);
  }
  console.log("Checked all code filters");
}
function storeBlankAgtDetails() {
  localStorage.setItem("agt", "Hover over an agreement to view its details.");
  window.localStorage.setItem("paxdat", "");
  window.localStorage.setItem("paxreg", "");
  window.localStorage.setItem("paxcon", "");
  window.localStorage.setItem("paxstatus", "");
  window.localStorage.setItem("paxagtp", "");
  window.localStorage.setItem("paxstage", "");  // Set one message for start time, one for end time, codes, regions, countries - each msg as json object so can have list or single
}
