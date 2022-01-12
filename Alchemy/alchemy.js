//Preview

let previewUpload = (event, element, key) => {
  var output = element.nextElementSibling;
  var source = URL.createObjectURL(event.target.files[0])
  output.src = source;
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  }
}

//Grist UI

var gristwrap = document.getElementById("gristwrap").cloneNode(true)

let addtypes = () => {
  var gristtypecount = document.getElementById("types").value
  var gristwrapwrap = document.getElementById("gristwrapwrap")

  gristwrapwrap.innerHTML = ""
  for (let i = 0; i < gristtypecount; i++) {
    gristwrapwrap.appendChild(gristwrap.cloneNode(true))
  }
}

addtypes()

//Make image

var canvas = document.getElementById('bitmap');
var context = canvas.getContext('2d');

context.drawImage(document.getElementById("canvas"), 0, 0);

let createAlchemy = () => {
  var assets = document.querySelectorAll("#preload img")
  var options = document.querySelectorAll("#useroptions select")
  var uploads = Array.prototype.slice.call(document.querySelectorAll("#uploadbg img"))
  var name = document.getElementById("name").value.toUpperCase()

  var bg = document.getElementById("blank")
  var box = document.getElementById("box")
  var equal = document.getElementById("equal")

  // Clear screen
  context.drawImage(bg, 0, 0)
  var boxpos = []

  // Draw boxes and items
  if (options[0].value == "2") {
    boxpos = [127, 283, 435]

    context.drawImage(assets[options[1].value], 222, 119)
    context.drawImage(equal, 374, 119)

    uploads.splice(2, 1)
  } else {
    boxpos = [56, 204, 351, 500]

    context.drawImage(assets[options[1].value], 146, 119)
    context.drawImage(assets[options[2].value], 294, 119)
    context.drawImage(equal, 441, 119)
  }

  boxpos.forEach((e, i) => {
    context.drawImage(box, e, 92)
    context.drawImage(uploads[i], e + 5, 97, 80, 80)
  })

  // Write Name
  context.font = "16.7pt Verdana"
  context.fillStyle='#C6C7C7';
  context.textAlign='center';
  context.textBaseline='alphabetic';
  
  context.fillText(name, 325, 236);
  
  // Write Cost
  var imgs = document.querySelectorAll("#gristimg img")
  var types = document.querySelectorAll("#gristwrap #grist")
  var costs = document.querySelectorAll("#gristwrap #cost")
  var gristLengths = []

  context.font = "16.7pt Verdana"
  context.textAlign='left';
  context.fillStyle='#21AFEE';

  //context.fillText("000", 325, 267);
  var totalLength = 0
  costs.forEach(e => {
    var length = e.value.length * 14 + 36
    gristLengths.push(length)
    totalLength += length
  })
  
  var startpos = 325 - (totalLength / 2)
  var currentpos = startpos
  gristLengths.forEach((e, i) => {
    //context.fillRect(currentpos, 250, e, 16);
    context.fillText(costs[i].value, currentpos + 32, 267)
    context.drawImage(imgs[types[i].value], currentpos + 3, 248, 24, 24);
    currentpos += e + 1
  })
}