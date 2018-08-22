window.onload = function() {
  localStorage.setItem("paxVertConC","None");
  document.getElementById("None").checked = true;
  window.localStorage.setItem("updatePaxVerticalC","true");

  // Country/entity listeners for vertical timelines (left to right)
  document.getElementById("VertConRadiosC").onclick = function(event){
    let target = event.target;
    if (target.name == "ConRadio"){
      window.localStorage.setItem("updatePaxVerticalC","true");
      window.localStorage.setItem("updatePaxVertical","false");
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      localStorage.setItem("paxVertConC",String(target.id));
      console.log("Set paxVertConC to "+target.id);
    }
  }

}
