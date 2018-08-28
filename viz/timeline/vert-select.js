window.onload = function() {

  window.localStorage.setItem("updatePaxMap", "false");
  window.localStorage.setItem("updatePaxVerticalA","false");
  window.localStorage.setItem("updatePaxVerticalB","false");
  window.localStorage.setItem("updatePaxVerticalC","false");
  window.localStorage.setItem("updatePaxHorizontal","false");
  paxFilterUncheck(); // Check all code filters
  paxRuleAll(); // Pick code filter rule ALL
  window.localStorage.setItem("updatePaxVerticalA","true");
  window.localStorage.setItem("updatePaxVerticalB","true");
  window.localStorage.setItem("updatePaxVerticalC","true");

  // Filter rule listeners
  document.getElementById("anyV").onclick = function(event) {
    window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    window.localStorage.setItem("updatePaxHorizontal","false");
    paxRuleAny();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
  }
  document.getElementById("allV").onclick = function(event) {
    window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    window.localStorage.setItem("updatePaxHorizontal","false");
    paxRuleAll();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
  }

  // Code filter listeners
  document.getElementById("DeselectAllCodesV").onclick = function(event) {
    window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    window.localStorage.setItem("updatePaxHorizontal","false");
    paxFilterUncheck();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
  }
  document.getElementById("SelectAllCodesV").onclick = function(event) {
    window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    window.localStorage.setItem("updatePaxHorizontal","false");
    paxFilterCheck();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
  }

  // Code filter listeners
  document.getElementById("CodesV").onclick = function(event){
    window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    window.localStorage.setItem("updatePaxHorizontal","false");
    let target = event.target;
    if (+localStorage.getItem(target.id) == 0){
      localStorage.setItem(target.id, 1);
      target.checked = true;
      console.log("Checked "+target.id);
    } else {
      localStorage.setItem(target.id, 0);
      target.checked = false;
      console.log("Unchecked "+target.id);
    }
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
  }

  // Page refresh listener
    if (window.performance) {
      if ((performance.navigation.TYPE_RELOAD) || (window.localStorage.getItem("paxReset") == "true")) {
        paxFilterUncheck(); // Check all code filters
        paxRuleAll(); // Pick code filter rule ALL
        window.localStorage.setItem("updatePaxVerticalA","true");
        window.localStorage.setItem("updatePaxVerticalB","true");
        window.localStorage.setItem("updatePaxVerticalC","true");
    }
  }

  function paxRuleAny() {
    document.getElementById("anyV").checked = true;
    localStorage.setItem("paxANYV",1);
    localStorage.setItem("paxALLV",0);
    console.log("Selected ANY for vertical timelines")
  }
  function paxRuleAll() {
    document.getElementById("allV").checked = true;
    localStorage.setItem("paxANYV",0);
    localStorage.setItem("paxALLV",1);
    console.log("Selected ALL for vertical timelines")
  }
  function paxFilterUncheck() {
    var filters = document.getElementsByName("filterV");
    for (i = 0; i < filters.length; i++) {
    filters[i].checked = false;
    localStorage.setItem(filters[i].id,0);
  }
  console.log("Unchecked all code filters for vertical timelines");
  }
  function paxFilterCheck() {
    var filters = document.getElementsByName("filterV");
    for (i = 0; i < filters.length; i++) {
    filters[i].checked = true;
    localStorage.setItem(filters[i].id,1);
  }
  console.log("Checked all code filters for vertical timelines");
  }

}
