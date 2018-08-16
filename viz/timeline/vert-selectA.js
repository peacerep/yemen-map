window.onload = function() {

  localStorage.setItem("paxVertConA","None");
  document.getElementById("None").checked = true;

  // Country/entity listeners for vertical timelines (left to right)
  document.getElementById("VertConRadiosA").onclick = function(event){
    let target = event.target;
    if (target.name == "ConRadio"){
      window.localStorage.setItem("updateVertical","true");
      window.localStorage.setItem("updateHorizontal","false");
      localStorage.setItem("paxVertConA",String(target.id));
      console.log("Set paxVertConA to "+target.id);
    }
  }

}
