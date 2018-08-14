/* Filtering agreements by category
   Storing paxfilters in local storage
*/

window.onload = function() {
    /*
    Set deafults
    */
    localStorage.setItem("paxCons", JSON.stringify(document.getElementsByName("Con").id));
    window.localStorage.setItem("updateVertical","false");
    window.localStorage.setItem("updateHorizontal","true");
    paxConsAllUncheck(); // Check all country/entity values
    paxConRuleAll(); // Display agreements with any checked country/entity
    paxFilterUncheck(); // Check all code filters
    storeBlankAgtDetails();// Empty agreement details in localStorage
    paxRuleAll(); // Pick code filter rule ALL
    // localStorage.setItem("paxTimelineView","Chronology");

    /*
    Listeners
    */
    // Timeline view listeners
    // document.getElementById("Chronology").onclick = function(event){
    //   localStorage.setItem("paxTimelineView", "Chronology");
    // }
    // document.getElementById("Counts").onclick = function(event){
    //   localStorage.setItem("paxTimelineView", "Counts");
    // }
    // document.getElementById("Proportions").onclick = function(event){
    //   localStorage.setItem("paxTimelineView", "Proportions");
    // }

    // Country/entity listeners
    document.getElementById("anyCon").onclick = function(event) {
      window.localStorage.setItem("updateVertical","false");
      window.localStorage.setItem("updateHorizontal","true");
      paxConRuleAny();
    }
    document.getElementById("allCons").onclick = function(event) {
      window.localStorage.setItem("updateVertical","false");
      window.localStorage.setItem("updateHorizontal","true");
      paxConRuleAll();
    }
    document.getElementById("DeselectAllCons").onclick = function(event) {
      window.localStorage.setItem("updateVertical","false");
      window.localStorage.setItem("updateHorizontal","true");
      paxConsAllUncheck();
      storeBlankAgtDetails();
    }
    document.getElementById("SelectAllCons").onclick = function(event) {
      window.localStorage.setItem("updateVertical","false");
      window.localStorage.setItem("updateHorizontal","true");
      paxConsAllCheck();
      storeBlankAgtDetails();
    }
    document.getElementById("Cons").onclick = function(event){
      window.localStorage.setItem("updateVertical","false");
      window.localStorage.setItem("updateHorizontal","true");
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
    }

    // Filter rule listeners
    document.getElementById("any").onclick = function(event) {
      window.localStorage.setItem("updateVertical","false");
      window.localStorage.setItem("updateHorizontal","true");
      paxRuleAny();
    }
    document.getElementById("all").onclick = function(event) {
      window.localStorage.setItem("updateVertical","false");
      window.localStorage.setItem("updateHorizontal","true");
      paxRuleAll();
    }

    // Code filter listeners
    document.getElementById("DeselectAllCodes").onclick = function(event) {
      window.localStorage.setItem("updateVertical","false");
      window.localStorage.setItem("updateHorizontal","true");
      paxFilterUncheck();
      storeBlankAgtDetails();
    }
    document.getElementById("SelectAllCodes").onclick = function(event) {
      window.localStorage.setItem("updateVertical","false");
      window.localStorage.setItem("updateHorizontal","true");
      paxFilterCheck();
      storeBlankAgtDetails();
    }

    // Code filter listeners
    document.getElementById("Codes").onclick = function(event){
      window.localStorage.setItem("updateVertical","false");
      window.localStorage.setItem("updateHorizontal","true");
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
    }

    // Page refresh listener
    if (window.performance) {
      if (performance.navigation.TYPE_RELOAD) {
        localStorage.setItem("paxCons", JSON.stringify(document.getElementsByName("Con").id));
        window.localStorage.setItem("updateVertical","false");
        window.localStorage.setItem("updateHorizontal","true");
        paxConsAllUncheck(); // Check all country/entity values
        paxConRuleAll(); // Display agreements with any checked country/entity
        paxFilterUncheck(); // Check all code filters
        storeBlankAgtDetails();// Empty agreement details in localStorage
        paxRuleAll(); // Pick code filter rule ALL
        // localStorage.setItem("paxTimelineView","Chronology");
      }
    }
}

function paxConRuleAny() {
  console.log("Selected ANY Con");
  document.getElementById("anyCon").checked = "true";
  localStorage.setItem("paxConRule","any");
}
function paxConRuleAll() {
  console.log("Selected ALL Cons");
  document.getElementById("allCons").checked = true;
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
