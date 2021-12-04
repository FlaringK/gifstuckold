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

let fontstuck = new FontFace('fontstuck', 'url(assets/fontstuck.ttf)');
fontstuck.load().then(function(font){

  // with canvas, if this is ommited won't work
  document.fonts.add(font);
  console.log('Font loaded');

});

/////////////////////
// Create the Gif! //
/////////////////////

let createEnterName = () => {
  var backgrounds = document.querySelectorAll(".uploadedbg")
  var nameplate = document.getElementById('nameplate')

  var name = document.getElementById('name').value 
  var react = document.getElementById('name').value 
  var quip = document.getElementById('quip').value 

  var bg = 0

  var gif = new GIF({
    workers: 2,
    quality: 10
  });

  let drawbg = () => {
    context.drawImage(backgrounds[bg], 0, 0)
    context.drawImage(nameplate, 0, 0)
  }

  clearcanvas();
  drawbg();
}

createEnterName();