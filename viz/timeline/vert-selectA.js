window.onload = function() {

  // Country/entity listeners for vertical timelines (left to right)
    document.getElementById("VertConRadiosA").onclick = function(event){
      let target = event.target;
      if (target.name == "ConRadio"){
        localStorage.setItem("paxVertConA",String(target.id));
        console.log("Set paxVertConA to "+target.id);
      }
    }

}
