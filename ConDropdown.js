/*
Country/Entity Dropdown
*/


// When user clicks dropdown button, toggle between hide/show dropdown list
// function ConFunction() {
//   console.log("Called ConFunction");
//   //GetDropdown();
//   document.getElementById("ConDropdown").classList.toggle("showConContent");
// }

// NEED TO FIX!!!
// Filter dropdown list values by what user types in search bar
function filterConFunction() {
  var input, filter, div, label, checkbox;
  input = document.getElementById("ConInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("ConDropdown");
  label = div.getElementsByTagName("label");
  checkbox = div.getElementsByTagName("input");
  // console.log(a);
  for (i = 0; i < label.length; i++) {
    if (checkbox[i].type == "checkbox") {
      if (label[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        label[i].style.display = "";
        // console.log("label[i]: "+label[i]);
        console.log("label[i].id: "+label.id);
        checkbox[i].style.display = "";
      } else {
        label[i].style.display = "none";
        checkbox[i].style.display = "none";
      }
    }
  }
}


// var paxCons = JSON.stringify(document.getElementsByName("Con").value);
// window.localStorage.setItem("paxCons",paxCons)
