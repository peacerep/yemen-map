/* Filtering agreements by category
   Storing paxfilters in local storage
*/

window.onload = function() {
    /*
    Set deafults
    */
    storeCheckedFilters(); // Record code filters in localStorage
    paxFilterCheck(); // Check all code filters
    storeBlankAgtDetails();// Empty agreement details in localStorage
    paxRuleAny(); // Pick code filter rule ANY
    storeAllCons(); // Display all agreements for every country/entity

    /*
    Listeners
    */
    document.getElementById("Reset").onclick = function(event) {
      paxRuleAny(); // Set default filter rules
      storeCheckedFilters(); // Set default code filters
      storeBlankAgtDetails(); // Set default agreement details
      storeAllCons(); // Set default country/entity display (show all))
    }

    // Country/entity listeners
    document.getElementById("DeselectAllCons").onclick = function(event) {
      removeAllCons();
    }
    document.getElementById("SelectAllCons").onclick = function(event) {
      storeAllCons();
    }
    // document.getElementById("ConDropdown").onclick = function(event) {
    //   var paxCons = document.getElementsByName("Con").value;
    //   var toAdd = [];
    //   for (i = 0; i < paxCons.length; i++) {
    //     paxCons[i].onclick = function(event) {
    //       if (paxCons[i].checked) {
    //         toAdd += [paxCons[i].value];  // record every checked country/entity
    //       }
    //     }
    //   }
    //   localStorage.setItem("paxCon", JSON.stringify(toAdd));
    //   console.log("paxCon: "+JSON.parse(localStorage.getItem("paxCon")));
    // }

    // Filter rule listeners
    document.getElementById("any").onclick = function(event) {
        paxRuleAny();
    }
    document.getElementById("all").onclick = function(event) {
        paxRuleAll();
    }

    // Code filter listeners
    document.getElementById("DeselectAllCodes").onclick = function(event) {
      storeUncheckedFilters();
      paxFilterUncheck();
      storeBlankAgtDetails();
    }
    document.getElementById("SelectAllCodes").onclick = function(event) {
      storeCheckedFilters();
      paxFilterCheck();
      storeBlankAgtDetails();
    }
    document.getElementById("HrFra").onclick = function(event) {
        if (localStorage.getItem("paxHrFra") == 0){
          localStorage.setItem("paxHrFra",1);
          console.log("Checked HrFra");
        } else {
          localStorage.setItem("paxHrFra",0);
          console.log("Unchecked HrFra");
        }
    }
    document.getElementById("HrGen").onclick = function(event) {
      if (localStorage.getItem("paxHrGen") == 0){
        localStorage.setItem("paxHrGen",1);
        console.log("Checked HrGen");
      } else {
        localStorage.setItem("paxHrGen",0);
        console.log("Unchecked HrGen");
      }
    }
    document.getElementById("Pol").onclick = function(event) {
      if (localStorage.getItem("paxPol") == 0){
        localStorage.setItem("paxPol",1);
        console.log("Checked Pol");
      } else {
        localStorage.setItem("paxPol",0);
        console.log("Unchecked Pol");
      }
    }
    document.getElementById("Eps").onclick = function(event) {
      if (localStorage.getItem("paxEps") == 0){
        localStorage.setItem("paxEps",1);
        console.log("Checked Eps");
      } else {
        localStorage.setItem("paxEps",0);
        console.log("Unchecked Eps");
      }
    }
    document.getElementById("Mps").onclick = function(event) {
      if (localStorage.getItem("paxMps") == 0){
        localStorage.setItem("paxMps",1);
        console.log("Checked Mps");
      } else {
        localStorage.setItem("paxMps",0);
        console.log("Unchecked Mps");
      }
    }
    document.getElementById("Polps").onclick = function(event) {
      if (localStorage.getItem("paxPolps") == 0){
        localStorage.setItem("paxPolps",1);
        console.log("Checked Polps");
      } else {
        localStorage.setItem("paxPolps",0);
        console.log("Unchecked Polps");
      }
    }
    document.getElementById("Terps").onclick = function(event) {
      if (localStorage.getItem("paxTerps") == 0){
        localStorage.setItem("paxTerps",1);
        console.log("Checked Terps");
      } else {
        localStorage.setItem("paxTerps",0);
        console.log("Unchecked Terps");
      }
    }
    document.getElementById("TjMech").onclick = function(event) {
      if (localStorage.getItem("paxTjMech") == 0){
        localStorage.setItem("paxTjMech",1);
        console.log("Checked TjMech");
      } else {
        localStorage.setItem("paxTjMech",0);
        console.log("Unchecked TjMech");
      }
    }
    document.getElementById("GeWom").onclick = function(event) {
      if (localStorage.getItem("paxGeWom") == 0){
        localStorage.setItem("paxGeWom",1);
        console.log("Checked GeWom");
        console.log(localStorage.getItem("paxGeWom"));
      } else {
        localStorage.setItem("paxGeWom",0);
        console.log("Unchecked GeWom");
        console.log(localStorage.getItem("paxGeWom"));
      }
    }
    // Page refresh listener
    if (window.performance) {
      if (performance.navigation.TYPE_RELOAD) {
        storeCheckedFilters(); // Record code filters in localStorage
        paxFilterCheck(); // Check all code filters
        storeBlankAgtDetails();// Empty agreement details in localStorage
        paxRuleAny(); // Pick code filter rule ANY
        storeAllCons(); // Display all agreements for every country/entity
      }
    }
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
  var filters = document.getElementsByName("filter")
  for (i = 0; i < filters.length; i++) {
    filters[i].checked = false;
  }
  console.log("Unchecked all code filters");
}
function paxFilterCheck() {
  var filters = document.getElementsByName("filter")
  for (i = 0; i < filters.length; i++) {
    filters[i].checked = true;
  }
  console.log("Checked all code filters");
}
function storeCheckedFilters() {
  localStorage.setItem("paxHrFra",1);
  localStorage.setItem("paxHrGen",1);
  localStorage.setItem("paxPol",1);
  localStorage.setItem("paxEps",1);
  localStorage.setItem("paxMps",1);
  localStorage.setItem("paxPolps",1);
  localStorage.setItem("paxTerps",1);
  localStorage.setItem("paxTjMech",1);
  localStorage.setItem("paxGeWom",1);
}
function storeUncheckedFilters() {
  localStorage.setItem("paxHrFra",0);
  localStorage.setItem("paxHrGen",0);
  localStorage.setItem("paxPol",0);
  localStorage.setItem("paxEps",0);
  localStorage.setItem("paxMps",0);
  localStorage.setItem("paxPolps",0);
  localStorage.setItem("paxTerps",0);
  localStorage.setItem("paxTjMech",0);
  localStorage.setItem("paxGeWom",0);
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

function storeAllCons() {
  var paxCon = "All";
  // var div = document.getElementById("ConDropdown");
  var Cons = document.getElementsByName("Con");
  for (i = 0; i < Cons.length; i++) {
    Cons[i].checked = true;
    console.log(Cons[i].value);
  }
  localStorage.setItem("paxCon", JSON.stringify(paxCon)); // retrieve with JSON.parse(localStorage.getItem("paxCon"));
  console.log("Showing agreements for every country/entity.");
  // console.log("Parsed: "+JSON.parse(localStorage.getItem("paxCon")));
}
function removeAllCons() {
  var paxCon = "";
  // var div = document.getElementById("ConDropdown");
  var Cons = document.getElementsByName("Con");
  for (i = 0; i < Cons.length; i++){
    Cons[i].checked = false;
  }
  localStorage.setItem("paxCon", JSON.stringify(paxCon)); // retrieve with JSON.parse(localStorage.getItem("paxCon"));
  console.log("Showing agreements for no country/entity.");
}
