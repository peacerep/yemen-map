window.onload = function() {

  // Country/entity listeners for vertical timelines (left to right)
    document.getElementById("VertConRadiosB").onclick = function(event){
      let target = event.target;
      if (target.name == "ConRadio"){
        localStorage.setItem("paxVertConB",String(target.id));
        console.log("Set paxVertConB to "+target.id);
      }
    }

}
