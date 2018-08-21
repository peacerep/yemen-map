window.onload = function() {
  localStorage.setItem("paxVertConC","None");
  document.getElementById("None").checked = true;

  // Country/entity listeners for vertical timelines (left to right)
  document.getElementById("VertConRadiosC").onclick = function(event){
    let target = event.target;
    if (target.name == "ConRadio"){
      window.localStorage.setItem("updatePaxVertical","true");
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      localStorage.setItem("paxVertConC",String(target.id));
      console.log("Set paxVertConC to "+target.id);
    }
  }

}
