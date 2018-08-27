/*
Reset filter values
*/

function resetFilters(){
  window.localStorage.setItem("paxagtid", 1370); // default to first agreement in the database
  window.localStorage.setItem("updatePaxHorizontal","false");
  window.localStorage.setItem("updatePaxVertical","false");
  window.localStorage.setItem("updatePaxMap", "false");
  window.localStorage.setItem("paxReset", "true");
}
