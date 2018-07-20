/* Filtering agreements by category
and storing paxfilters in local storage
*/
window.onload = function() {

    document.getElementById("Reset").onclick = function(event) {
      localStorage.setItem("paxHrFra",1);
      localStorage.setItem("paxHrGen",1);
      localStorage.setItem("paxPol",1);
      localStorage.setItem("paxEps",1);
      localStorage.setItem("paxMps",1);
      localStorage.setItem("paxPolps",1);
      localStorage.setItem("paxTerps",1);
      localStorage.setItem("paxTjMech",1);
      localStorage.setItem("paxGeWom",1);
      console.log("Checked all paxfilters");
    }

    document.getElementById("HrFra").onclick = function(event) {
        if (localStorage.getItem("paxHrFra") == 0){
          localStorage.setItem("paxHrFra",1);
          console.log("Checked HrFra");
        } else {
          localStorage.setItem("paxHrFra",0);
          console.log("Unchecked HrFra");
        }
    }
    document.getElementById("HrGen").onclick = function(event) {
      if (localStorage.getItem("paxHrGen") == 0){
        localStorage.setItem("paxHrGen",1);
        console.log("Checked HrGen");
      } else {
        localStorage.setItem("paxHrGen",0);
        console.log("Unchecked HrGen");
      }
    }
    document.getElementById("Pol").onclick = function(event) {
      if (localStorage.getItem("paxPol") == 0){
        localStorage.setItem("paxPol",1);
        console.log("Checked Pol");
      } else {
        localStorage.setItem("paxPol",0);
        console.log("Unchecked Pol");
      }
    }
    document.getElementById("Eps").onclick = function(event) {
      if (localStorage.getItem("paxEps") == 0){
        localStorage.setItem("paxEps",1);
        console.log("Checked Eps");
      } else {
        localStorage.setItem("paxEps",0);
        console.log("Unchecked Eps");
      }
    }
    document.getElementById("Mps").onclick = function(event) {
      if (localStorage.getItem("paxMps") == 0){
        localStorage.setItem("paxMps",1);
        console.log("Checked Mps");
      } else {
        localStorage.setItem("paxMps",0);
        console.log("Unchecked Mps");
      }
    }
    document.getElementById("Polps").onclick = function(event) {
      if (localStorage.getItem("paxPolps") == 0){
        localStorage.setItem("paxPolps",1);
        console.log("Checked Polps");
      } else {
        localStorage.setItem("paxPolps",0);
        console.log("Unchecked Polps");
      }
    }
    document.getElementById("Terps").onclick = function(event) {
      if (localStorage.getItem("paxTerps") == 0){
        localStorage.setItem("paxTerps",1);
        console.log("Checked Terps");
      } else {
        localStorage.setItem("paxTerps",0);
        console.log("Unchecked Terps");
      }
    }
    document.getElementById("TjMech").onclick = function(event) {
      if (localStorage.getItem("paxTjMech") == 0){
        localStorage.setItem("paxTjMech",1);
        console.log("Checked TjMech");
      } else {
        localStorage.setItem("paxTjMech",0);
        console.log("Unchecked TjMech");
      }
    }
    document.getElementById("GeWom").onclick = function(event) {
      if (localStorage.getItem("paxGeWom") == 0){
        localStorage.setItem("paxGeWom",1);
        console.log("Checked GeWom");
        console.log(localStorage.getItem("paxGeWom"));
      } else {
        localStorage.setItem("paxGeWom",0);
        console.log("Unchecked GeWom");
        console.log(localStorage.getItem("paxGeWom"));
      }
    }

    if (window.performance) {
      if (performance.navigation.TYPE_RELOAD) {
        localStorage.setItem("paxHrFra",1);
        document.getElementById("HrFra").checked = true;
        localStorage.setItem("paxHrGen",1);
        document.getElementById("HrGen").checked = true;
        localStorage.setItem("paxPol",1);
        document.getElementById("Pol").checked = true;
        localStorage.setItem("paxEps",1);
        document.getElementById("Eps").checked = true;
        localStorage.setItem("paxMps",1);
        document.getElementById("Mps").checked = true;
        localStorage.setItem("paxPolps",1);
        document.getElementById("Polps").checked = true;
        localStorage.setItem("paxTerps",1);
        document.getElementById("Terps").checked = true;
        localStorage.setItem("paxTjMech",1);
        document.getElementById("TjMech").checked = true;
        localStorage.setItem("paxGeWom",1);
        document.getElementById("GeWom").checked = true;
      }
    }

}
