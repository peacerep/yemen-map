window.onload = function() {

  // Country/entity listeners for vertical timelines (left to right)
  var vertA = document.getElementById("VertConRadiosA");
  console.log("VertA: "+vertA);
  if (vertA != null){
    document.getElementById("VertConRadiosA").onclick = function(event){
      let target = event.target;
      if (target.name == "ConRadio"){
        localStorage.setItem("paxVertConA",String(target.id));
        console.log("Set paxVertConA to "+target.id);
      }
    }
  }
  var vertB = document.getElementById("VertConRadiosB");
  console.log("VertB: "+vertB);
  if (vertB != null){
    document.getElementById("VertConRadiosB").onclick = function(event){
      let target = event.target;
      if (target.name == "ConRadio"){
        localStorage.setItem("paxVertConB",String(target.id));
        console.log("Set paxVertConB to "+target.id);
      }
    }
  }
  var vertC = document.getElementById("VertConRadiosC");
  console.log("VertC: "+vertC);
  if (vertC != null){
    document.getElementById("VertConRadiosC").onclick = function(event){
      let target = event.target;
      if (target.name == "ConRadio"){
        localStorage.setItem("paxVertConC",String(target.id));
        console.log("Set paxVertConC to "+target.id);
      }
    }
  }

}
