function changeFilter() {
  document.getElementById("code_filters").classList.toggle("show");
  //console.log("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    //console.log(event.target.id);
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
}
