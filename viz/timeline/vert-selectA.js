window.onload = function() {
  localStorage.setItem("paxVertConA","None selected");
  document.getElementById("None").checked = true;
  // window.localStorage.setItem("updatePaxVerticalA","true");

  // Country/entity listeners for vertical timelines (left to right)
  document.getElementById("VertConRadiosA").onclick = function(event){
    let target = event.target;
    if (target.name == "ConRadio"){
      window.localStorage.setItem("updatePaxVerticalA","true");
      window.localStorage.setItem("updatePaxVerticalB","false");
      window.localStorage.setItem("updatePaxVerticalC","false");
      window.localStorage.setItem("updatePaxHorizontal","false");
      window.localStorage.setItem("updatePaxMap", "false");
      localStorage.setItem("paxVertConA",String(target.id));
      console.log("Set paxVertConA to "+target.id);
    }
  }

}
