/* Filtering agreements by category
   Storing paxfilters in local storage
*/

window.onload = function() {
    /*
    Set deafults
    */
    paxFilterUncheck(); // Check all code filters
    storeBlankAgtDetails();// Empty agreement details in localStorage
    paxRuleAll(); // Pick code filter rule ALL
    paxConsAllCheck();

    /*
    Listeners
    */
    document.getElementById("Reset").onclick = function(event) {
      paxRuleAll(); // Set default filter rules
      paxFilterUncheck(); // Set default code filters
      storeBlankAgtDetails(); // Set default agreement details
      paxConsAllCheck();
    }

    // Country/entity listeners
    document.getElementById("DeselectAllCons").onclick = function(event) {
      paxConsAllUncheck();
      storeBlankAgtDetails();
    }
    document.getElementById("SelectAllCons").onclick = function(event) {
      paxConsAllCheck();
      storeBlankAgtDetails();
    }
    document.getElementById("Cons").onclick = function(event){
      let target = event.target;
      console.log("Target.id: "+target.id);
      if (target.type == "checkbox"){
        var paxCons = JSON.parse(localStorage.getItem("paxCons"));
        var i = paxCons.indexOf(target.id);
        // if country/entity was unchecked, check it
        if (i == -1) {
          paxCons.push(String(target.id));
          target.checked = true;
          console.log("Added "+target.id+" to paxCons");
        } else {
        // if country/entity was checked, uncheck it
          paxCons.splice(i, 1);
          target.checked = false;
          console.log("Removed "+target.id+" from paxCons");
        }
      // update country/entity list
      localStorage.setItem("paxCons",(JSON.stringify(paxCons)));
      }
    }

    // Filter rule listeners
    document.getElementById("any").onclick = function(event) {
        paxRuleAny();
    }
    document.getElementById("all").onclick = function(event) {
        paxRuleAll();
    }

    // Code filter listeners
    document.getElementById("DeselectAllCodes").onclick = function(event) {
      paxFilterUncheck();
      storeBlankAgtDetails();
    }
    document.getElementById("SelectAllCodes").onclick = function(event) {
      paxFilterCheck();
      storeBlankAgtDetails();
    }

    // Code filter listeners
    document.getElementById("filters").onclick = function(event){
      let target = event.target;
      // console.log("Target.id: "+target.id);
      if ( (target.id.includes("Count")) || (target.id.includes("Prop")) ){
        localStorage.setItem("paxFilterView",target.id);
        console.log("Set filter view to "+target.id);
      } else if (target.name == "filter") {
        if (localStorage.getItem(target.id) == 0){
          localStorage.setItem(target.id, 1);
          target.checked = true;
          console.log("Checked "+target.id);
        } else {
          localStorage.setItem(target.id, 0);
          target.checked = false;
          console.log("Unchecked "+target.id);
        }
      }
    }

    // Page refresh listener
    if (window.performance) {
      if (performance.navigation.TYPE_RELOAD) {
        paxFilterUncheck(); // Check all code filters
        storeBlankAgtDetails();// Empty agreement details in localStorage
        paxRuleAll(); // Pick code filter rule ALL
        paxConsAllCheck(); // Display all agreements for every country/entity
      }
    }
}

function paxConsAllCheck() {
  var paxCons = [];
  var cons = document.getElementsByName("Con");
  for (i = 0; i < cons.length; i++){
    cons[i].checked = true;
    paxCons.push(String(cons[i].id));
  }
  console.log("Checked all Country/Entity values");
  localStorage.setItem("paxCons", JSON.stringify(paxCons));
  //console.log("All Cons: "+JSON.parse(localStorage.getItem("paxCons")));
  //console.log("Showing agreements for every country/entity.");
}
function paxConsAllUncheck() {
  var paxCons = ["none"];
  var cons = document.getElementsByName("Con");
  for (i = 0; i < cons.length; i++){
    cons[i].checked = false;
  }
  console.log("Unchecked all Country/Entity values");
  localStorage.setItem("paxCons", JSON.stringify(paxCons)); // retrieve with JSON.parse(localStorage.getItem("paxCon"));
  // console.log("No Cons: "+(JSON.parse(localStorage.getItem("paxCons"))).length);
}
function paxRuleAny() {
  document.getElementById("any").checked = true;
  localStorage.setItem("paxANY",1);
  localStorage.setItem("paxALL",0);
  console.log("Selected ANY")
}
function paxRuleAll() {
  document.getElementById("all").checked = true;
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
