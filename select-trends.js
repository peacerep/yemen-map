/* TRENDS VIEW
   Filtering agreements by category
   Storing paxfilters in local storage
*/

window.onload = function() {
    /*
    Set deafults
    */
    storeUncheckedFilters();
    paxFilterUncheck();
    storeBlankAgtDetails();
    document.getElementById("paxGeWom").checked = true;
    localStorage.setItem("paxGeWom",1);
    console.log("Selected GeWom");

    /*
    Listeners
    */

    function select(selected) {
      var code = selected.id;
      var codes = document.getElementsByName("filter").id;
      console.log("called select on ",selected);
      for (i=0; i < codes.length; i++){
        if (codes[i] != code){
          document.getElementById(codes[i]).checked = false;
          localStorage.setItem(codes[i],0);
        }
      }
      document.getElementById(code).checked = true;
      localStorage.setItem(code,1);
      console.log("Selected ",code);
    }

    // Page refresh listener
    if (window.performance) {
      if (performance.navigation.TYPE_RELOAD) {
        storeUncheckedFilters(); // Record code filters in localStorage
        paxFilterUncheck(); // Check all code filters
        storeBlankAgtDetails();// Empty agreement details in localStorage
        document.getElementById("paxGeWom").checked = true;
        localStorage.setItem("paxGeWom",1);
        console.log("Selected GeWom");
      }
    }
}

function paxFilterUncheck() {
  var filters = document.getElementsByName("filter");
  for (i = 0; i < filters.length; i++) {
    filters[i].checked = false;
  }
  console.log("Unchecked all code filters");
}
function paxFilterCheck() {
  var filters = document.getElementsByName("filter");
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
