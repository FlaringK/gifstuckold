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

//////////////////
// init Options //
//////////////////

let previewUpload = (event, element, key) => {
  var output = element.nextElementSibling;
  var source = URL.createObjectURL(event.target.files[0])
  output.src = source;
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  }
}

let updatecardlist = cardnumber => {
  const cardlist = document.getElementById('uploadcardlist')
  cardlist.innerHTML = ""

  for (let index = 0; index < cardnumber; index++) {
    var id = "card" + index

    //create upload box
    var div = document.createElement('div')
    div.id = "carddiv" + index

    var label = document.createElement('label')
    label.for = id
    label.innerText = "Select image for card " + (index+1) + ":"

    var input = document.createElement('input')
    input.type = "file"
    input.id = id
    input.name = id
    input.accept = "image/*"
    input.setAttribute("onchange", "previewUpload(event, this, " + (index + 2) + ")")

    var img = document.createElement('img')
    img.src = "assets/placeholders/temp item.png"
    img.setAttribute("class", "uploadedItem")

    var namelabel = document.createElement('label')
    namelabel.for = id + "name"
    namelabel.innerText = "Item name:"

    var name = document.createElement('input')
    name.id = id + "name"
    name.name = id + "name"
    name.value = "Perfectly generic cubes"
    
    div.appendChild(label)
    div.appendChild(input)
    div.appendChild(img)
    div.appendChild(namelabel)
    div.appendChild(name)

    cardlist.appendChild(div)
  }
}

let selectModus = value => {
  const options = document.getElementById("options");
  const button = document.getElementById("createGIF");

  options.innerHTML = "";
  button.setAttribute("onclick", "createGif" + value + "()")

  let createblankinput = () => {
    var blankcards = document.createElement('input')
    blankcards.type = "number";
    blankcards.id = "blankcards"
    blankcards.value = 2
    optionslist.push([blankcards, "Number of extra blank cards: "]);
  }

  let createchoosecardinput = () => {
    var choosecard = document.createElement('input')
    choosecard.type = "number";
    choosecard.id = "choosecard"
    choosecard.value = 1
    optionslist.push([choosecard, "If applicable, choose which card to eject: "]);
  }

  var assetcount = 0
  var optionslist = []
  switch (value) {
    case "hashmap":
      assetcount = 12
      optionslist.push([document.createElement('input'), "Hashmap Hash:"]);
      break;
  
    case "fifo":
      assetcount = 3
      createblankinput()
      break;

    case "filo":
      assetcount = 3
      createblankinput()
      break;

    case "array":
      assetcount = 3
      createblankinput()
      createchoosecardinput()
      break;

    default:
      break;
  }

  //load assets and values
  loadGifassets(value, assetcount)
  optionslist.forEach(e => {
    var label = document.createElement('label')
    label.innerText = e[1]
    options.appendChild(label)
    options.appendChild(e[0])
    options.appendChild(document.createElement('br'))
  })
}

/////////////////
// Load Assets //
/////////////////

var loadtally = 0
let tallyLoads = max => {
  loadtally++
  document.getElementById('loadtally').innerText = loadtally + " / " + max
}

let loadGifassets = (file, count) => {
  document.getElementById('preload').innerHTML = ""

  loadtally = 0
  document.getElementById('loadtally').innerText = "0 / 0"

  for (let index = 0; index < count; index++) {
    var path = "assets/" + file + "/" + index + ".png";
    var img = document.createElement('img');
    img.src = path;
    document.getElementById('preload').appendChild(img);
    img.onload = tallyLoads(count)
  }
}

//on page load
updatecardlist(3)
selectModus("fifo")

//////////////////////
// create GIF CLASS //
//////////////////////

class basicModus {
  constructor() {

  }

  //Draw Card Bar
  drawcardbar = Vpos => {
    this.barheight = 100
    var topbar = canvas.height - this.barheight + Vpos
    context.drawImage(this.cardbar, 0, topbar)
  
    var itemcount = this.displaylist.length
  
    this.cardwidth = 56
    var cardcount = parseInt(itemcount) + parseInt(this.blankcount)
    var cardlistwidth = cardcount * this.cardwidth
    var cardlistStartpos = (canvas.width / 2) - (cardlistwidth / 2)
  
    this.drawcardbarcards(cardcount, cardlistStartpos, topbar)
  }

  //Draw bar card deck
  drawcardbarcards = (cardcount, startpos, topbar) => {
    for (let i = 0; i < cardcount; i++) {
      var xpos =  startpos + i * this.cardwidth
      var ypos =  topbar + 30
      context.drawImage(this.cardmini, xpos, ypos)
  
      if (this.displaylist[i]) {
        context.drawImage(this.displaylist[i], xpos + 2, ypos + 10, 40, 50)
      }
    }
  }
  
  // Draw one card at index
  drawcard = (index, itemimg, bumnp) => {
    var xpos = 12 + 23 * index
    var ypos = 10 + 23 * index
    if (bumnp) {ypos += 2; xpos += 2}
  
    context.drawImage(this.cardback, xpos, ypos)
    context.drawImage(itemimg, xpos + 14, ypos + 36, 100, 125)
  }
  
  // Draw deck of cards
  drawcarddeck = () => {
    this.displaylist.forEach((e, index) => {
      var i = this.displaylist.length - index - 1
      this.drawcard(i, this.displaylist[i])
    });
  }
  
  // Render intro & outro
  renderintro = ifBackwards => {
    // Draw n frames of bar fade in
    var n = 5
    for (let i = 0; i < n; i++) {
      var j = ifBackwards ? n - i - 1 : i
  
      clearcanvas();
      context.drawImage(this.bg, 0, 0)
      this.drawcarddeck()
      context.globalAlpha = (1 / n) * (1 + j)
      this.drawcardbar(100 - (50 + j * (50 / (n-1))))
      context.globalAlpha = 1
      this.gif.addFrame(canvas, {copy: true, delay: 300/n});
    }
  }
  
  //draw hold frame
  drawhold = () => {
    clearcanvas();
    context.drawImage(this.bg, 0, 0)
    this.drawcarddeck()
    this.drawcardbar(0)
  }
  
  getblanks = () => parseInt(document.getElementById('blankcards').value);
  
  startdeck = pick => pick ? Array.from(this.uploadlist).splice(1) : Array.from(this.uploadlist)
  enddeck = pick => pick ? Array.from(this.uploadlist).splice(1) : Array.from(this.uploadlist)

  getassetlist = () => {
    var list = document.querySelectorAll("#preload img")
    this.cardback = list[0]
    this.cardbar = list[1]
    this.cardmini = list[2]
  }

  bumnpcards = (pick, tickback, newbg) => {
    for (let j = 0; j < this.displaylist.length; j++) {
      clearcanvas();
      context.drawImage(this.bg, 0, 0)
  
      //draw card deck
      this.displaylist.forEach((e, index) => {
        var i = this.displaylist.length - index - 1
        if (i == j) {
          this.drawcard(i, this.displaylist[i], true)
        } else if ((i !== this.displaylist.length - 1 && !pick) || pick) {
          this.drawcard(i, this.displaylist[i])
        }
      });
  
      this.drawcardbar(0)
      this.gif.addFrame(canvas, {copy: true, delay: 50});

      if (tickback) {   
        tickback = false
        this.bg = newbg
      }
    }
  }
  
  // ----------- CREATE THE GIF ----------- //
  
  createGIF = () => {
    //Get input values
    this.getassetlist();
    this.uploadlist = document.querySelectorAll(".uploadedItem")
    const sdexaction = document.getElementById('sdex').value
    const itemaction = document.getElementById('item').value
    const backgrounds = document.querySelectorAll(".uploadedbg")
    var tickback = document.getElementById("check").checked

    //get bg
    this.bg = backgrounds[0]
  
    //Get custom value
    this.blankcount = this.getblanks()
  
    // init pick
    var pick = itemaction == "pick" ? true : false
    this.displaylist = this.startdeck( pick)
    this.blankcount += pick ? 1 : 0
  
    //Drawing!!!
    this.gif = new GIF({
      workers: 2,
      quality: 10
    });
  
    //STEP ONE: if intro
    if (sdexaction == 'open') {
      // Draw inital frame without bar
      clearcanvas();
      context.drawImage(backgrounds[0], 0, 0)
      this.drawcarddeck()
      this.gif.addFrame(canvas, {copy: true, delay: 500});
  
      this.renderintro(false)
    }
  
    
    //STEP TWO: hold frame, all on screen
    this.drawhold()
    this.gif.addFrame(canvas, {copy: true, delay: 500});
  
  
    //STEP THREE: change bg & bumnp cards
    pick ^= true;
    this.displaylist = this.enddeck(pick)
    this.blankcount += pick ? 1 : -1
    this.bg = backgrounds[1]
  
    this.bumnpcards(pick, tickback, backgrounds[2])
  
  
    //STEP 4: hold frame 2
    this.drawhold()
    this.gif.addFrame(canvas, {copy: true, delay: 1500});
  
  
    //STEP 5: if close
    if (sdexaction == 'close') {
      this.renderintro(true)
  
      //Draw final frame
      clearcanvas();
      context.drawImage(backgrounds[1], 0, 0)
      this.drawcarddeck()
      this.gif.addFrame(canvas, {copy: true, delay: 500})
    }
  
    // DISPLAY RESULT!!!
    this.gif.render()
  
    this.gif.on('finished', function(blob) {
      const result = document.getElementById('result')
      result.src = URL.createObjectURL(blob)
    });
  }
}

const removeItem = (items, i) => items.slice(0, i-1).concat(items.slice(i, items.length))

////////////////
// create GIF //
////////////////

// ----------- FIFO ----------- //
let fifo = new basicModus

let createGiffifo = () => {
  fifo.createGIF()
}

// ----------- FILO ----------- //

let filo = new basicModus

//Change deck layout
filo.drawcard = (index, itemimg, bumnp) => {
  var xpos = 12 + 18 * index
  var ypos = 10 + 5 * index
  if (bumnp) {ypos += 2; xpos += 2}

  context.drawImage(filo.cardback, xpos, ypos)
  context.drawImage(itemimg, xpos + 14, ypos + 36, 100, 125)
}

//align card bar
filo.drawcardbarcards = (cardcount, startpos, topbar) => {
  for (let i = 0; i < cardcount; i++) {
    var xpos =  startpos + i * filo.cardwidth
    var ypos =  topbar + 30
    context.drawImage(filo.cardmini, xpos, ypos)

    if (i > filo.blankcount - 1) {
      context.drawImage(filo.displaylist[i - filo.blankcount], xpos + 2, ypos + 10, 40, 50)
    }
  }
}

//Take off end card when dropped
filo.enddeck = pick => pick ? Array.from(filo.uploadlist).slice(0,-1) : Array.from(filo.uploadlist)

let createGiffilo = () => {
  filo.createGIF()
}

// ----------- ARRAY ----------- //

let array = new basicModus

//Change deck layout
array.drawcard = (index, itemimg, bumnp) => {
  var xpos = 12 + 16 * index
  var ypos = 10 + 23 * index
  if (bumnp) {ypos += 2; xpos += 2}

  context.drawImage(array.cardback, xpos, ypos)
  context.drawImage(itemimg, xpos + 14, ypos + 36, 100, 125)
}

//Choose card to drop
array.enddeck = pick => {
  i = parseInt(document.getElementById('choosecard').value)
  deck = Array.from(array.uploadlist)

  return pick ? removeItem(deck, i) : deck
}

let createGifarray = () => {
  array.createGIF()
}