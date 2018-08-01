/*
Country/Entity Dropdown
*/

function GetDropdown() {
  console.log("called GetDropdown");
  // while (window.localStorage.getItem("paxConList") != false){
    var hasCons = JSON.parse(window.localStorage.getItem("paxCons"));
    console.log("hasCons: "+hasCons);
    // Once PA-X data loaded in mini-timeline.js file...
    if (hasCons.length > 0){
      // console.log("hasCons: "+(hasCons));
      // ...create dropdown list of every country/entity in the data...
      var paxConList = hasCons.sort();
      // console.log("paxConList: "+paxConList);
      for (i = 0; i < paxConList.length; i++){
        if (paxConList != "undefined"){
          var p = document.createElement("p");
          // ...with a checkbox...
          var conCheckbox = document.createElement("input");
          conCheckbox.type = "checkbox";
          conCheckbox.class = "Con";
          conCheckbox.name = "Con";
          conCheckbox.value = paxConList[i];
          conCheckbox.id = paxConList[i];
          conCheckbox.checked = true;
          // ...and a label for each country/entity
          var conLabel = document.createElement("label");
          conLabel.id = paxConList[i];
          conLabel.htmlFor = paxConList[i];
          conLabel.appendChild(document.createTextNode(paxConList[i]));
          var br = document.createElement("br");
          // var div = document.getElementById("dropdown");
          p.appendChild(conCheckbox);
          p.appendChild(conLabel);
          p.appendChild(br);
          var cons = document.getElementById("Cons");
          cons.appendChild(p);
        }
      }
    }
}

// When user clicks dropdown button, toggle between hide/show dropdown list
function ConFunction() {
  console.log("Called ConFunction");
  GetDropdown();
  document.getElementById("ConDropdown").classList.toggle("showConContent");
}

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
