/*
Reset filter values
*/

function resetFilters(){
  window.localStorage.setItem("updatePaxHorizontal","false");
  window.localStorage.setItem("updatePaxVertical","false");
  window.localStorage.setItem("updatePaxMap", "false");
  window.localStorage.setItem("paxReset", "true");
}
