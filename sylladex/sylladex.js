/////////////////
// init canvas //
/////////////////

let canvas = document.getElementById('bitmap');
let context = canvas.getContext('2d');

let clearcanvas = () => { 
  let fill = context.fillStyle; // save current fillstyle
  context.fillStyle = 'rgb(255,255,255)';
  context.fillRect(0,0,canvas.width, canvas.height); 
  context.fillStyle = fill; // reset to saved fillstyle
}
clearcanvas() // GIF can't do transparent so do white

//////////////////
// init Options //
//////////////////

let previewUpload = (event, element, key) => {
  let output = element.nextElementSibling;
  let source = URL.createObjectURL(event.target.files[0])
  output.src = source;
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  }
}

let updatecardlist = cardnumber => {
  const cardlist = document.getElementById('uploadcardlist')
  cardlist.innerHTML = ""

  for (let index = 0; index < cardnumber; index++) {
    let id = "card" + index

    //create upload box
    let div = document.createElement('div')
    div.id = "carddiv" + index

    let label = document.createElement('label')
    label.for = id
    label.innerText = "Select image for card " + (index+1) + ":"

    let input = document.createElement('input')
    input.type = "file"
    input.id = id
    input.name = id
    input.accept = "image/*"
    input.setAttribute("onchange", "previewUpload(event, this, " + (index + 2) + ")")

    let img = document.createElement('img')
    img.src = "assets/placeholders/temp item.png"
    img.setAttribute("class", "uploadedItem")

    let namelabel = document.createElement('label')
    namelabel.for = id + "name"
    namelabel.innerText = "Item name:"

    let name = document.createElement('input')
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
    let blankcards = document.createElement('input')
    blankcards.type = "number";
    blankcards.id = "blankcards"
    blankcards.value = 2
    optionslist.push([blankcards, "Number of extra blank cards: "]);
  }

  let createchoosecardinput = () => {
    let choosecard = document.createElement('input')
    choosecard.type = "number";
    choosecard.id = "choosecard"
    choosecard.value = 1
    optionslist.push([choosecard, "If applicable, choose which card to eject: "]);
  }

  let assetcount = 0
  let optionslist = []
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
    
    case "wallet":
      assetcount = 4
      createblankinput()
      break;

    case "walletNoBar":
      assetcount = 4
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
    let label = document.createElement('label')
    label.innerText = e[1]
    options.appendChild(label)
    options.appendChild(e[0])
    options.appendChild(document.createElement('br'))
  })
}

/////////////////
// Load Assets //
/////////////////

let loadtally = 0
let tallyLoads = max => {
  loadtally++
  document.getElementById('loadtally').innerText = loadtally + " / " + max
}

let loadGifassets = (file, count) => {
  document.getElementById('preload').innerHTML = ""

  loadtally = 0
  document.getElementById('loadtally').innerText = "0 / 0"

  for (let index = 0; index < count; index++) {
    let path = "assets/" + file + "/" + index + ".png";
    let img = document.createElement('img');
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
    let topbar = canvas.height - this.barheight + Vpos
    context.drawImage(this.cardbar, 0, topbar)
  
    let itemcount = this.displaylist.length
  
    this.cardwidth = 56
    let cardcount = parseInt(itemcount) + parseInt(this.blankcount)
    let cardlistwidth = cardcount * this.cardwidth
    let cardlistStartpos = (canvas.width / 2) - (cardlistwidth / 2)
  
    this.drawcardbarcards(cardcount, cardlistStartpos, topbar)
  }

  //Draw bar card deck
  drawcardbarcards = (cardcount, startpos, topbar) => {
    for (let i = 0; i < cardcount; i++) {
      let xpos =  startpos + i * this.cardwidth
      let ypos =  topbar + 30
      context.drawImage(this.cardmini, xpos, ypos)
  
      if (this.displaylist[i]) {
        context.drawImage(this.displaylist[i], xpos + 2, ypos + 10, 40, 50)
      }
    }
  }
  
  // Draw one card at index
  drawcard = (index, itemimg, bumnp) => {
    let xpos = 12 + 23 * index
    let ypos = 10 + 23 * index
    if (bumnp) {ypos += 2; xpos += 2}
  
    context.drawImage(this.cardback, xpos, ypos)
    context.drawImage(itemimg, xpos + 14, ypos + 36, 100, 125)
  }
  
  // Draw deck of cards
  drawcarddeck = () => {
    this.displaylist.forEach((e, index) => {
      let i = this.displaylist.length - index - 1
      this.drawcard(i, this.displaylist[i])
    });
  }
  
  // Render intro & outro
  renderintro = ifBackwards => {

    // Draw inital frame without bar
    if (!ifBackwards) {
      clearcanvas();
      context.drawImage(this.bg, 0, 0)
      this.drawcarddeck()
      this.gif.addFrame(canvas, {copy: true, delay: 500});
    }

    // Draw n frames of bar fade in
    let n = 5
    for (let i = 0; i < n; i++) {
      let j = ifBackwards ? n - i - 1 : i
  
      clearcanvas();
      context.drawImage(this.bg, 0, 0)
      this.drawcarddeck()
      context.globalAlpha = (1 / n) * (1 + j)
      this.drawcardbar(100 - (50 + j * (50 / (n-1))))
      context.globalAlpha = 1
      this.gif.addFrame(canvas, {copy: true, delay: 300/n});
    }

    if (ifBackwards) {
      //Draw final frame
      clearcanvas();
      context.drawImage(this.bg, 0, 0)
      this.drawcarddeck()
      this.gif.addFrame(canvas, {copy: true, delay: 500})
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
    let list = document.querySelectorAll("#preload img")
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
        let i = this.displaylist.length - index - 1
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

  extraAnimationBefore = pick => {
    this.drawhold()
    this.gif.addFrame(canvas, {copy: true, delay: 500});
  }

  extraAnimationAfter = pick => {
    this.drawhold()
    this.gif.addFrame(canvas, {copy: true, delay: 1500});
  }
  
  // ----------- CREATE THE GIF ----------- //
  
  createGIF = () => {
    //Get input values
    this.getassetlist();
    this.uploadlist = document.querySelectorAll(".uploadedItem")
    const sdexaction = document.getElementById('sdex').value
    const itemaction = document.getElementById('item').value
    const backgrounds = document.querySelectorAll(".uploadedbg")
    let tickback = document.getElementById("check").checked

    //get bg
    this.bg = backgrounds[0]
  
    //Get custom value
    this.blankcount = this.getblanks()
  
    // init pick
    let pick = itemaction == "pick" ? true : false
    this.pick = pick
    this.displaylist = this.startdeck(pick)
    this.blankcount += pick ? 1 : 0
  
    //Drawing!!!
    this.gif = new GIF({
      workers: 2,
      quality: 10
    });
  
    //STEP 1: if intro
    if (sdexaction.includes("open")) {
      this.renderintro(false)
    }

    //STEP 2: hold frame, all on screen
    this.extraAnimationBefore(pick)

  
    //STEP 3: change bg & bumnp cards
    pick ^= true;
    this.displaylist = this.enddeck(pick)
    this.blankcount += pick ? 1 : -1
    this.bg = backgrounds[1]
  
    this.bumnpcards(pick, tickback, backgrounds[2])

    //STEP 4: hold frame 2
    this.extraAnimationAfter(pick)
  
  
    //STEP 5: if close
    if (sdexaction.includes("close")) {
      this.renderintro(true)
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
  let xpos = 12 + 18 * index
  let ypos = 10 + 5 * index
  if (bumnp) {ypos += 2; xpos += 2}

  context.drawImage(filo.cardback, xpos, ypos)
  context.drawImage(itemimg, xpos + 14, ypos + 36, 100, 125)
}

//align card bar
filo.drawcardbarcards = (cardcount, startpos, topbar) => {
  for (let i = 0; i < cardcount; i++) {
    let xpos =  startpos + i * filo.cardwidth
    let ypos =  topbar + 30
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
  let xpos = 12 + 16 * index
  let ypos = 10 + 23 * index
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

// ----------- WALLET ----------- //
// THIS IS VERY BAD DON'T FOLLOW THIS STRUCTURE

let wallet = new basicModus

//Change deck layout
wallet.drawcard = (index, itemimg, bumnp) => {4
  xpos = bumnp ? 127 : 129
  ypos = bumnp ? 23 : 25

  context.drawImage(wallet.walletback, 11, 5)
  context.drawImage(wallet.cardback, 127, 23)

  if (wallet.bg == document.querySelectorAll(".uploadedbg")[1] && wallet.pick) {
    let lastItem = Array.prototype.slice.call(document.querySelectorAll(".uploadedItem")).pop()
    context.drawImage(lastItem, xpos + 11, ypos + 25, 60, 75)
  }
}

wallet.drawcarddeck = () => {
  context.drawImage(wallet.walletback, 11, 5)
}

wallet.getassetlist = () => {
  let list = document.querySelectorAll("#preload img")
  wallet.cardback = list[0]
  wallet.cardbar = list[1]
  wallet.cardmini = list[2]
  wallet.walletback = list[3]
}

wallet.extraAnimationBefore = (pick) => {
  let xPosArray = [23, 54, 131, 127]
  let frameLengths = [500, 50, 50, 1000]
  ypos = 23

  for (let i = 0; i < xPosArray.length; i++) {
    clearcanvas();
    context.drawImage(wallet.bg, 0, 0)
    wallet.drawcardbar(0)

    context.drawImage(wallet.cardback, xPosArray[i], ypos)
    if (!pick) {
      let itemimg = Array.prototype.slice.call(document.querySelectorAll(".uploadedItem")).pop()
      context.drawImage(itemimg, xPosArray[i] + 11, ypos + 25, 60, 75)
    }
    context.drawImage(wallet.walletback, 11, 5)

    wallet.gif.addFrame(canvas, {copy: true, delay: frameLengths[i]})
  }
}

wallet.extraAnimationAfter = (pick) => {
  let xPosArray = [23, 54, 131, 127].reverse()
  let frameLengths = [1000, 50, 50, 1000]
  ypos = 23

  for (let i = 0; i < xPosArray.length; i++) {
    clearcanvas();
    context.drawImage(wallet.bg, 0, 0)
    wallet.drawcardbar(0)

    context.drawImage(wallet.cardback, xPosArray[i], ypos)
    if (!pick) {
      let itemimg = Array.prototype.slice.call(document.querySelectorAll(".uploadedItem")).pop()
      context.drawImage(itemimg, xPosArray[i] + 11, ypos + 25, 60, 75)
    }
    context.drawImage(wallet.walletback, 11, 5)

    wallet.gif.addFrame(canvas, {copy: true, delay: frameLengths[i]})
  }
}

// THIS IS REALLY BAD PRACTICE HOLY SHIT
// DON'T DO THIS AGAIN

const walletRenderIntro = wallet.renderintro.bind({})
const walletDrawCardBar = wallet.drawcardbar.bind({})

let createGifwallet = () => {
  wallet.renderintro = walletRenderIntro
  wallet.drawcardbar = walletDrawCardBar
  wallet.createGIF()
}

let createGifwalletNoBar = () => {
  wallet.renderintro = lmao => {}
  wallet.drawcardbar = hehe => {}
  wallet.createGIF()
}