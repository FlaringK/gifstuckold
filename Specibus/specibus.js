/////////////////
// init canvas //
/////////////////

var canvas = document.getElementById('bitmap');
var context = canvas.getContext('2d');

let clearcanvas = () => { 
  var fill = context.fillStyle; // save current fillstyle
  context.fillStyle = 'rgb(255,255,255)';
  context.fillRect(0,0,canvas.width, canvas.height); 
  context.fillStyle = fill; // reset to saved fillstyle
}
clearcanvas() // GIF can't do transparent so do white

let previewUpload = (event, element, key) => {
  var output = element.nextElementSibling;
  var source = URL.createObjectURL(event.target.files[0])
  output.src = source;
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  }
}

/////////////////////
// Create the Gif! //
/////////////////////

let createSpecibus = () => {
  var assets = document.querySelectorAll(".uploadedbg")
  var greyblank = document.getElementById('greyblank')
  var greenblank = document.getElementById('greenblank')
  var greentype = document.getElementById('greentype')

  var kind = document.getElementById('name').value 

  context.textAlign = "center"
  context.textBaseline = "alphabetic"
  context.fillStyle = "#00E371"
  context.font = "60px captchacard"

  // BEGIN GIF
  var gif = new GIF({
    workers: 2,
    quality: 10
  });

  //First frame
  clearcanvas();
  context.drawImage(greyblank, 0, 0)
  gif.addFrame(canvas, {copy: true, delay: 500})

  //Drag function
  let dragCaptcha = xpos => {
    context.drawImage(greyblank, 0, 0)
    context.drawImage(assets[2], xpos, 110)
    context.drawImage(assets[0], xpos + 13, 140, 100, 125)
    context.drawImage(assets[3], xpos + 54, 260)
  }

  dragCaptcha(-64)
  gif.addFrame(canvas, {copy: true, delay: 200})
  dragCaptcha(72)
  gif.addFrame(canvas, {copy: true, delay: 200})
  dragCaptcha(182)
  gif.addFrame(canvas, {copy: true, delay: 200})
  dragCaptcha(220)
  gif.addFrame(canvas, {copy: true, delay: 1000})

  context.drawImage(greenblank, 0, 0)
  gif.addFrame(canvas, {copy: true, delay: 50})
  context.drawImage(greyblank, 0, 0)
  gif.addFrame(canvas, {copy: true, delay: 50})
  context.drawImage(greenblank, 0, 0)
  gif.addFrame(canvas, {copy: true, delay: 50})
  context.drawImage(greyblank, 0, 0)
  gif.addFrame(canvas, {copy: true, delay: 50})

  context.drawImage(greentype, 0, 0)
  context.drawImage(assets[1], 197, 85, 185, 215)
  context.drawImage(assets[0], 309, 327, 24, 30)
  context.fillText(kind, 325, 407);
  gif.addFrame(canvas, {copy: true, delay: 5000})

  // DISPLAY RESULT!!!
  gif.render()

  gif.on('finished', function(blob) {
    const result = document.getElementById('result')
    result.src = URL.createObjectURL(blob)
  });
}