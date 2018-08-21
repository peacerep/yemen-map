/*
Reset filter values
*/

function resetFilters(){
  window.localStorage.setItem("paxReset", "true");

    // // Define one key/value pair per category (code) by which to filter which
    // // agreements the timeline and map visualize, checking all paxfilters
    // // (value = 1) upon page load so all agreements are visible
    // // var paxHrFra = window.localStorage.setItem("paxHrFra",0); // Human rights framework
    // var paxHrGen = window.localStorage.setItem("paxHrGen",0); // Human rights/Rule of law
    // var paxPol = window.localStorage.setItem("paxPol",0); // Political institutions
    // var paxEps = window.localStorage.setItem("paxEps",0); // Economic power sharing
    // var paxMps = window.localStorage.setItem("paxMps",0); // Military power sharing
    // var paxPolps = window.localStorage.setItem("paxPolps",0); // Political power sharing
    // var paxTerps = window.localStorage.setItem("paxTerps",0); // Territorial power sharing
    // var paxTjMech = window.localStorage.setItem("paxTjMech",0); // Transitional justice past mechanism
    // var paxGeWom = window.localStorage.setItem("paxGeWom",0); // Women, girls and gender
    //
    // var paxANY = window.localStorage.setItem("paxANY",0); // Selected ANY filter rule
    // var paxALL = window.localStorage.setItem("paxALL",1); // Selected ALL filter rule
    //
    // window.localStorage.setItem("paxConRule","all"); // Selected ANY country/entity rule
    //
    // var newMinDay = window.localStorage.setItem("paxNewMinDay", "01/01/1990");
    // var newMaxDay = window.localStorage.setItem("paxNewMaxDay", "31/12/2015");
    //
    // window.localStorage.setItem("updateHorizontal", "true");
    // window.localStorage.setItem("updateVertical", "true");
}
