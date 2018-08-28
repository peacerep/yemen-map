/*
Reset filter values
*/

function resetFilters(){
  window.localStorage.setItem("paxagtid", 1370);
  window.localStorage.setItem("paxMapSelection", 0);
  window.localStorage.setItem("paxTimeSelection", 0);
  window.localStorage.setItem("updatePaxHorizontal","false");
  window.localStorage.setItem("updatePaxVerticalA","false");
  window.localStorage.setItem("updatePaxVerticalB","false");
  window.localStorage.setItem("updatePaxVerticalC","false");
  window.localStorage.setItem("updatePaxMap", "false");

  window.localStorage.setItem("paxReset", "true");
}
