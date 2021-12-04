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

/////////////////////
// Create the Gif! //
/////////////////////

let createEnterName = () => {
  var backgrounds = document.querySelectorAll(".uploadedbg")
  var nameplate = document.getElementById('nameplate')
  var tick = document.getElementById('tick')

  var name = document.getElementById('name').value 
  var react = document.getElementById('react').value 
  var quip = document.getElementById('quip').value 

  var bg = 0

  let drawbg = () => {
    context.drawImage(backgrounds[bg], 0, 0)
    context.drawImage(nameplate, 0, 0)
  }

  //Letters are 30 x 32px
  var lw = 30
  var lh = 32
  //Gotta draw letter individually because fontstuck isn't monospace >:(

  var startpos = 325 - (name.length * 15)
  console.log((name.length * 20), startpos)

  context.font = "32px fontstuck";
  context.fillStyle = "black"
  //context.fillText(name, startpos, 82)

  // BEGIN GIF
  var gif = new GIF({
    workers: 2,
    quality: 10
  });

  //First frame
  clearcanvas();
  drawbg();
  context.fillRect(startpos + (lw * 0.5), 78, 27, 5)
  gif.addFrame(canvas, {copy: true, delay: 500})
  context.fillStyle = "white"
  context.fillRect(startpos + (lw * 0.5), 78, 27, 5)
  
  //Write text 1 letter at a time
  context.textAlign = "center";
  for (let i = 0; i < name.length; i ++) {
    var letterpos = startpos + ((i + 0.5) * lw)

    context.fillStyle = "white"
    context.fillRect(letterpos - (lw * 0.5), 78, 27, 5)
    context.fillStyle = "black"
    context.fillText(name[i], letterpos, 82)

    if (name[i + 1]) { context.fillRect(letterpos + (lw * 0.5), 78, 27, 5) }

    gif.addFrame(canvas, {copy: true, delay: 100})
  }
  gif.addFrame(canvas, {copy: true, delay: 400})

  let drawneutral = text => {
    var newstartpos = 325 - (text.length * 15)
    clearcanvas();
    drawbg();
    for (let i = 0; i < text.length; i ++) {
      var letterpos = newstartpos + ((i + 0.5) * lw)
      context.fillText(text[i], letterpos, 82)
    }
  }

  //If correct name
  if (react == "yes") {
    bg = 1

    drawneutral(name);
    context.drawImage(tick, startpos - 70, 38)
    gif.addFrame(canvas, {copy: true, delay: 50})
    drawneutral(name);
    gif.addFrame(canvas, {copy: true, delay: 50})
    context.drawImage(tick, startpos - 70, 38)
    gif.addFrame(canvas, {copy: true, delay: 50})
    drawneutral(name);
    gif.addFrame(canvas, {copy: true, delay: 50})
    context.drawImage(tick, startpos - 70, 38)
    gif.addFrame(canvas, {copy: true, delay: 2000})
  } else {
    //blur effect
    var n = 3
    for (let l = 0; l < 8; l ++) {
      for (let i = 0; i < name.length; i ++) {
        var letterpos = startpos + ((i + 0.5) * lw)
        for (let j = 0; j < n; j ++) {
          for (let k = 0; k < n; k ++) {
            context.fillStyle = randomGreyHex()
            context.fillRect(letterpos - (j * lw / n) + 3, 82 - ((k + 1) * lh / n), 10, 11)
          }
        }
      }
      gif.addFrame(canvas, {copy: true, delay: 50})
    }

    bg = 1
    //Draw quip
    context.fillStyle = "red"
    drawneutral(quip);

    gif.addFrame(canvas, {copy: true, delay: 2000})
  }

  // DISPLAY RESULT!!!
  gif.render()

  gif.on('finished', function(blob) {
    const result = document.getElementById('result')
    result.src = URL.createObjectURL(blob)
  });
}

function randomGreyHex() {
  var v = (Math.random()*(256)|0).toString(16);//bitwise OR. Gives value in the range 0-255 which is then converted to base 16 (hex).
  return "#" + v + v + v;
}