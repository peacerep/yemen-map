window.onload = function() {

  paxFilterUncheck(); // Check all code filters
  paxRuleAll(); // Pick code filter rule ALL

  // Filter rule listeners
  document.getElementById("anyV").onclick = function(event) {
      paxRuleAny();
  }
  document.getElementById("allV").onclick = function(event) {
      paxRuleAll();
  }

  // Code filter listeners
  document.getElementById("DeselectAllCodesV").onclick = function(event) {
    paxFilterUncheck();
  }
  document.getElementById("SelectAllCodesV").onclick = function(event) {
    paxFilterCheck();
  }

  // Code filter listeners
  document.getElementById("CodesV").onclick = function(event){
    let target = event.target;
    // console.log("Target.id: "+target.id);
    if (+localStorage.getItem(target.id) == 0){
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
        paxFilterUncheck(); // Check all code filters
        paxRuleAll(); // Pick code filter rule ALL
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
