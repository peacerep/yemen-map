// GENERAL DATA IMPORT PATTERN FOR D3 ("Convenience Methods")
// d3.request(url)
//         .row(function(d){*format row*})
//         .get(callback)

// d3.request(url,formatRow,callback);
// function formatRow(){return format(d);}
// function callback(error,rows){
//     if (error) throw error;
//     *do something with the data*
// }
/////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

// d3.html("http://enable-cors.org").get(function(error,data){
//   var frag = data.querySelector("div");
//   console.log(frag); // may show you're blocked if website doesn't want you to scrape data
//   //would need to contact people hosting website to ask for them to change setting on webpage
// });

var parseDate = d3.timeParse("%m/%d/%Y");

// Comma-separated data
d3.csv("prices.csv")
    .row(function(d){ return {month:parseDate(d.month), price:Number(d.price.trim().slice(1))}; })
    .get(function(error,data){

      var nestedData = d3.nest()
                          .key(function(d) {return d.month.getFullYear(); }) //or .getMonth
                          .entries(data);

    //console.log(nestedData);

    });



// Tab-delimited data
// d3.tsv("data.tsv")
//     .row(function(d){ return {month:parseDate(d.month), price:Number(d.price.trim().slice(1))}; })
//     .get(function(error,data){
//       //console.log(data);
//     });

// Pipe-delimited data
// var psv = dsvFormat("|");
// d3.text("data.txt")
//     .get(function(error,data){
//
//       var rows = psv.parse(data);
//       var newRows = [];
//       for (var p=0; p<rows.length; p++) {
//         newRows.push({month:parseDate(rows[p].month), price:Number(d.price.trim().slice(1))}); // replace d from above with rows[p]
//       }
//
//     });

// JSON data (hierarchical, not tabular, so no rows)
// d3.json("treeData.json").get()function(error,data){
//   // console.log(data[0].children);
//   // console.log(data[0].children[1].name);
// };
//
// // XML data
// d3.xml("data.xml").get(function(error,data){
//   // console.log(data);
//   // console.log(data.documentElement);
//
//   // JavaScript approach
//   // var xmlLetter = data.documentElement.getElementsByTagName("letter");
//   // console.log(xmlLetter);
//
//   // D3 approach
//   // var letterNodes = d3.select(data).selectAll("letter");
//   // var letterNodes = d3.select(data).selectAll("letter")_groups[0][0];
//   // console.log(letterNodes);
//
// });

// d3.text("test.txt").get(function(error,data){
//
//   // use RegEx
//   var myTabPositions = [];
//   var myNewLinePositions = [];
//
//   var tabVal = '\\b\t\\b';
//   var tabMod = 'g'; // g stands for global - picks up every instance of search string
//   var tabRegExp = new RegExp(tabVal,tabMod);
//
//   var lineVal = '\\b\n\\b';
//   var lineMod = 'g';
//   var lineRegExp = new RegExp(lineVal,lineMod);
//
//   data.replace(tabRegExp, function(a,b){ myTabPositions.push(b); return a; }); //a = location found, b = found item
//   data.replace(lineRegExp, function(a,b){ myNewLinePositions.push(b); return a; });
//
//   // console.log(myTabPositions);
//   // console.log(myNewLinePositions);
//
// });
