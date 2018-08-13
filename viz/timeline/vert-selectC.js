window.onload = function() {

  // Country/entity listeners for vertical timelines (left to right)
    document.getElementById("VertConRadiosC").onclick = function(event){
      let target = event.target;
      if (target.name == "ConRadio"){
        localStorage.setItem("paxVertConC",String(target.id));
        console.log("Set paxVertConC to "+target.id);
      }
    }

}
