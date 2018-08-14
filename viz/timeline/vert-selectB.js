window.onload = function() {

  localStorage.setItem("paxVertConB",0);
  document.getElementById("None").checked = true;

  // Country/entity listeners for vertical timelines (left to right)
  document.getElementById("VertConRadiosB").onclick = function(event){
    let target = event.target;
    if (target.name == "ConRadio"){
      window.localStorage.setItem("updateVertical","true");
      window.localStorage.setItem("updateHorizontal","false");
      localStorage.setItem("paxVertConB",String(target.id));
      console.log("Set paxVertConB to "+target.id);
    }
  }

}
