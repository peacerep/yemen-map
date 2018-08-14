window.onload = function() {

  localStorage.setItem("paxVertConC",0);
  document.getElementById("None").checked = true;

  // Country/entity listeners for vertical timelines (left to right)
  document.getElementById("VertConRadiosC").onclick = function(event){
    let target = event.target;
    if (target.name == "ConRadio"){
      window.localStorage.setItem("updateVertical","true");
      window.localStorage.setItem("updateHorizontal","false");
      localStorage.setItem("paxVertConC",String(target.id));
      console.log("Set paxVertConC to "+target.id);
    }
  }

}
