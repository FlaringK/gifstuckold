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

//Make image

var canvas = document.getElementById('bitmap');
var context = canvas.getContext('2d');

let createAlchemy = () => {
  var assets = document.querySelectorAll("#preload img")
  var options = document.querySelectorAll("#useroptions select")
  var uploads = Array.prototype.slice.call(document.querySelectorAll("#uploadbg img"))

  var bg = assets[3]
  var box = assets[4]

  // Clear screen
  context.drawImage(bg, 0, 0)
  var boxpos = []

  // Draw boxes and items
  if (options[0].value == "2") {
    boxpos = [127, 283, 435]

    context.drawImage(assets[options[1].value], 222, 119)
    context.drawImage(assets[2], 374, 119)

    uploads.splice(2, 1)
  } else {
    boxpos = [56, 204, 351, 500]

    context.drawImage(assets[options[1].value], 146, 119)
    context.drawImage(assets[options[2].value], 294, 119)
    context.drawImage(assets[2], 441, 119)
  }

  boxpos.forEach((e, i) => {
    context.drawImage(box, e, 92)
    context.drawImage(uploads[i], e + 5, 97, 80, 80)
  })

  // Write cost and text
  
}