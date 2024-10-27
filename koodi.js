
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(reg => {
    reg.onupdatefound = () => {
      const newWorker = reg.installing;
      newWorker.onstatechange = () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New content is available, inform the user
          if (confirm("A new version is available. Reload?")) {
            window.location.reload();
          }
        }
      };
    };
  });
}

// Get canvas elements and contexts
var fillingCanvas1 = document.getElementById('fillingCanvas1');
var fillingCtx1 = fillingCanvas1.getContext('2d');
var emptyingCanvas1 = document.getElementById('emptyingCanvas1');
var emptyingCtx1 = emptyingCanvas1.getContext('2d');
var fillingCanvas2 = document.getElementById('fillingCanvas2');
var fillingCtx2 = fillingCanvas2.getContext('2d');
var emptyingCanvas2 = document.getElementById('emptyingCanvas2');
var emptyingCtx2 = emptyingCanvas2.getContext('2d');

// Set initial fill percentage
//arvomuuttujat
var fillPercentage1 = 0;
var fillPercentage2 = 0;
var isDrawing = false;
var fill1 = false;
var fill2 = false;
var tulosteet = 0;
//var vika = false;
var ruokatauko = 0
var vessatauko = 0;
var tupakkatauko = 0;
var palkka = 0;
var lastFrameTime = 0;
var animationSpeed = 0.1; // Adjust this value to control the animation speed
var tulostusSkalaari = 2;
// Set fill speed (1% per second)
var fillSpeed = 1;
//tyomuoto
let palkkamuoto = "urakka";

//ohje
function stats(div) {
  var x = document.getElementById(div);
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

//ohje
/*function todo() {
  var x = document.getElementById("todoDiv");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}*/

//statistiikat
/*function stats() {
  var x = document.getElementById("stats");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}*/

// Cache DOM elements for better performance
const statTulosteet = document.getElementById('statTulosteet');
const statPalkka = document.getElementById('statPalkka');
const statTyoaika = document.getElementById('statTyoaika');
const statPalkkamuoto = document.getElementById('statPalkkamuoto');
const statRuokatauko = document.getElementById('statRuokatauko');
const statVessatauko = document.getElementById('statVessatauko');
const statTupakkatauko = document.getElementById('statTupakkatauko');
const statCount = document.getElementById('statCount');
const statTulostusSkalaari = document.getElementById('statTulostusSkalaari');
const statFillspeed = document.getElementById('statFillspeed');
const statAnimationSpeed = document.getElementById('statAnimationSpeed');
const statTila = document.getElementById('statTila');
const statFill1 = document.getElementById('statFill1');
const statFill2 = document.getElementById('statFill2');


// Update stats every second
function updateSpan() {
  statTulosteet.innerHTML = "tulostettu: " + tulosteet.toFixed(0) + " kpl A4-simplex " + '<s>' + "ja 0 kpl A4-duplex" + '</s>';
  statPalkka.innerHTML = "rahaa: " + palkka.toFixed(2) + " mk";
  statTyoaika.innerHTML = "toteutunut työaika: " + formatTime(count);
  statPalkkamuoto.innerHTML = "palkkamuoto: " + palkkamuoto;
  statRuokatauko.innerHTML = "ruokataukoja: " + ruokatauko + " krt";
  statVessatauko.innerHTML = "vessataukoja: " + vessatauko + " krt";
  statTupakkatauko.innerHTML = "tupakkataukoja: " + tupakkatauko + " krt";
  statCount.innerHTML = "count: " + count;
  statTulostusSkalaari.innerHTML = "tulostusSkalaari: " + tulostusSkalaari;
  statFillspeed.innerHTML = "fillSpeed: " + fillSpeed;
  statAnimationSpeed.innerHTML = "animationSpeed: " + animationSpeed;
  statTila.innerHTML = "tila: " + tila;
  statFill1.innerHTML = "fill1: " + fill1;
  statFill2.innerHTML = "fill2: " + fill2;

  if (isDrawing === true && tila != "taynna" && herjaTimeout === null) {
    document.getElementById("tila").innerHTML = "Printteri tulostaa nopeudella " + fillSpeed;
    var tilaVari = document.getElementById("tila");
    tilaVari.style.color = "green";
  }
}

// Call updateSpan every 1 second
setInterval(updateSpan, 1000);

function formatTime(count) {
  if (isNaN(count)) count = 0; // Ensure count is a valid number

  let days = Math.floor(count / (60 * 60 * 24)); // Calculate total days
  let hours = Math.floor((count % (60 * 60 * 24)) / (60 * 60)); // Remaining hours
  let minutes = Math.floor((count % (60 * 60)) / 60); // Remaining minutes
  let seconds = count % 60; // Remaining seconds

  // Return the formatted time as a string
  return `${days} p ${hours} h ${minutes} m ${seconds} s`;
}

// Salary increment per update (0.10 per second, split across 60 updates per second)
let palkkaIncrement = 0.10 / 60;

//nopeus
// Select the slider element and the element that will display the value
const slider = document.getElementById("mySlider");
const sliderValue = document.getElementById("sliderValue");

// Initialize a variable to hold the slider's value
let variableValue = slider.value;

slider.addEventListener("input", function() {
  variableValue = this.value;
  sliderValue.textContent = variableValue;
  
  fillSpeed = parseFloat(variableValue); // Ensure fillSpeed updates correctly

  tulostusSkalaari = 2 * variableValue;
  animationSpeed = 0.1 * variableValue; // You can use this if needed for other purposes

  console.log("Current value of fillSpeed:", fillSpeed); // Log the value if needed
});

// Call the update function every 1 second (1000 milliseconds)
setInterval(updateSpan, 1000);



// Tallentaa muuttujat selaimen välimuistiin
function tallennaMuuttujat(muuttujat) {
  localStorage.setItem('muuttujat', JSON.stringify(muuttujat));
}

// Lataa muuttujat selaimen välimuistista
function lataaMuuttujat() {
  const arvo = localStorage.getItem('muuttujat');
  return arvo ? JSON.parse(arvo) : {};
}

// Tallennetaan muuttujat ennen kuin sivu suljetaan
window.onbeforeunload = function() {
  //window.addEventListener('beforeunload', function() {
  const muuttujat = {
      muuttuja1: tulosteet,
      muuttuja2: ruokatauko,
      muuttuja3: vessatauko,
      muuttuja4: tupakkatauko,
      muuttuja5: palkka,
      muuttuja6: count
      //muuttujax: { avain: 'arvo', numero: 456 }
  };

  // Päivitä tämä vastaamaan tallennettavia arvoja
  tallennaMuuttujat(muuttujat);
};
//}); //huom )

// Sivun latautuessa lataa tallennetut muuttujat

window.onload = function() {
  const ladatutMuuttujat = lataaMuuttujat();
  console.log('Ladatut muuttujat:', ladatutMuuttujat);
if (ladatutMuuttujat.muuttuja1 != undefined) {
tulosteet = ladatutMuuttujat.muuttuja1;
ruokatauko = ladatutMuuttujat.muuttuja2;
vessatauko = ladatutMuuttujat.muuttuja3;
tupakkatauko = ladatutMuuttujat.muuttuja4;
palkka = ladatutMuuttujat.muuttuja5;
count = ladatutMuuttujat.muuttuja6;

document.getElementById('kokonaistulosteet').innerText = ladatutMuuttujat.muuttuja1.toFixed(0);
document.getElementById('palkka').innerText = ladatutMuuttujat.muuttuja5.toFixed(2) + " mk";
document.getElementById('counter').innerText = ladatutMuuttujat.muuttuja6;
}
//document.getElementById('jotain').innerText = ladatutMuuttujat.muuttuja4
//document.getElementBy1Id('jotain').innerText = ladatutMuuttujat.muuttuja5
//document.getElementById('jotain').innerText = ladatutMuuttujat.muuttuja6
  // Käytä ladattuja muuttujia tarpeen mukaan
  // Esimerkiksi: document.getElementById('jotain').innerText = ladatutMuuttujat.muuttuja1;
};

//tilamuuttujat
const herjaWC1 = "Ei vielä voi olla hätä!";
const herjaWC2 = "Tarviitko imodiumia?";
const herjaWC3 = "Vessassa, trallallaa...";
const herjaRuoka1 = "Ei vielä voi olla nälkä!";
const herjaRuoka2 = "Yksi ruokatauko päivässä!";
const herjaRuoka3 = "Om nom nom... Röyh!";
const herjaRuoka4 = "Nyt ei syödä läski, kone käyntiin!";
const herjaTupakki1 = "Ei sulla oo varaa ostaa tupakkia!";
const herjaTupakki2 = "Tuu tuu tupakilla, röyhyää körssi!";
const herjaTupakki3 = "Ei taukoja nyt laiskuri, kone käyntiin!";
const herjaBinit1 = "Tyhjennetään binit ja täytetään paperilokerot!";
const uusiAlku = "Käynnistä tulostin!";
const herjaBinit2 = "Ei binit oo vielä täynnä, senkin jannu!";
const tyoTilaAktiivi = "Printteri tulostaa nopeudella " + fillSpeed;
const binittaynna = "Binit on täynnä, tartteis poistaa tulosteet!"
const tilaVari1 = "black";
const tilaVari2 = "black";


var tila = "kaynnissa";

let animationInterval = 16; // Roughly 60 updates per second (16ms)

function updateCanvas1() {
  if (isDrawing && fillPercentage1 <= 100) {

    // Clear and fill logic
    fillingCtx1.clearRect(0, 0, fillingCanvas1.width, fillingCanvas1.height);
    fillingCtx1.fillStyle = "white";
    fillingCtx1.fillRect(0, 0, fillingCanvas1.width, fillingCanvas1.height);

    emptyingCtx1.clearRect(0, 0, emptyingCanvas1.width, emptyingCanvas1.height);
    emptyingCtx1.fillStyle = "lightgray";
    emptyingCtx1.fillRect(0, 0, emptyingCanvas1.width, emptyingCanvas1.height);

    emptyingCtx2.clearRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);
    emptyingCtx2.fillStyle = "lightgray";
    emptyingCtx2.fillRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);

    // Calculate fill height
    var fillHeight1 = (fillingCanvas1.height / 100) * fillPercentage1;
    
    // Update the fill
    fillingCtx1.fillStyle = 'lightgray';
    fillingCtx1.fillRect(0, fillingCanvas1.height - fillHeight1, fillingCanvas1.width, fillHeight1);

    // Update the emptying canvas
    emptyingCtx1.fillStyle = 'white';
    emptyingCtx1.fillRect(0, 0, emptyingCanvas1.width, fillHeight1);

    // Increment salary (lixa)
    palkka += (palkkaIncrement * fillSpeed);
    document.getElementById("palkka").innerHTML = palkka.toFixed(2) + " mk";
    
    // Update fill percentage based on fillSpeed and update frequency
    fillPercentage1 += (fillSpeed / 60); // Dividing by 60 since we're updating 60 times per second

    if (fillPercentage1 >= 100) {
      fill1 = true;
      tulosteet += 2500; // Add 2500 printed pages
      document.getElementById("kokonaistulosteet").innerHTML = tulosteet.toFixed(0);

      setTimeout(updateCanvas2, 1500); // Delay to start filling the second canvas
    }

    // Schedule next frame (around 60 updates per second)
    setTimeout(updateCanvas1, animationInterval);
  }
}

function updateCanvas2() {
  if (isDrawing && fillPercentage2 <= 100) {
    
    // Clear and fill logic
    fillingCtx2.clearRect(0, 0, fillingCanvas2.width, fillingCanvas2.height);
    fillingCtx2.fillStyle = "white";
    fillingCtx2.fillRect(0, 0, fillingCanvas2.width, fillingCanvas2.height);

    emptyingCtx2.clearRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);
    emptyingCtx2.fillStyle = "lightgray";
    emptyingCtx2.fillRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);

    // Calculate fill height
    var fillHeight2 = (fillingCanvas2.height / 100) * fillPercentage2;

    // Update the fill
    fillingCtx2.fillStyle = 'lightgray';
    fillingCtx2.fillRect(0, fillingCanvas2.height - fillHeight2, fillingCanvas2.width, fillHeight2);

    // Update the emptying canvas
    emptyingCtx2.fillStyle = 'white';
    emptyingCtx2.fillRect(0, 0, emptyingCanvas2.width, fillHeight2);

 
    // Increment salary (lixa)
    palkka += (palkkaIncrement * fillSpeed);
    document.getElementById("palkka").innerHTML = palkka.toFixed(2) + " mk";

    // Update fill percentage based on fillSpeed and update frequency
    fillPercentage2 += (fillSpeed / 60); // Smoother updates
    
    if (fillPercentage2 >= 100) {
      fill2 = true;
      tulosteet += 2500; // Add 2500 printed pages
      document.getElementById("kokonaistulosteet").innerHTML = tulosteet.toFixed(0);
      isDrawing = false;
      tila = "taynna";
      document.getElementById("tila").innerHTML = binittaynna;
      let tilaVari = document.getElementById("tila");
      tilaVari.style.color = "orange";
      tilavalo(tila);
    }

    // Schedule next frame (around 60 updates per second)
    setTimeout(updateCanvas2, animationInterval);
  }
}

function filling2(fillHeight2) {
  fillingCtx2.fillStyle = 'lightgray';
  fillingCtx2.fillRect(0, fillingCanvas2.height - fillHeight2, fillingCanvas2.width, fillHeight2);
}
// Start button event listener

var count = 0;
var sekunnitId; // Global variable to hold the interval ID for secons worked
document.getElementById('startButton').addEventListener('click', function () {

  if (tila === "taynna") {
    herja("Ei voi startata, binit pitäisi tyhjentää!", binittaynna, "red", "orange");
    tila = "taynna";
    tilavalo(tila);
  }

  if (fill1 === true && fill2 === true && tila === "stop") {
    herja("Ei voi startata, binit pitäisi tyhjentää!", binittaynna, "red", "orange");
    tila = "taynna";
    tilavalo(tila);
  }

  if (isDrawing === false && tila != "taynna") {
    tila = "kaynnissa";
    tilavalo(tila);
    isDrawing = true;


    document.getElementById("tila").innerHTML = "Printteri tulostaa nopeudella " + fillSpeed;
    var tilaVari = document.getElementById("tila");
    tilaVari.style.color = "green";

    if (fill1 === true) {
      //setTimeout(updateCanvas2, 1000);
      updateCanvas2();
    } else {
      //setTimeout(updateCanvas1, 1000);
      updateCanvas1();
    }
    var counterElement = document.getElementById('counter');
    //var count = 0;  // Start the counter at 0
    clearInterval(sekunnitId);
    sekunnitId = setInterval(function () {
      count++;  // Increment the counter
      counterElement.textContent = count;  // Update the display

    }, 1000);  // Set interval to 1 second

    console.log(fillPercentage1, fillPercentage2, fill1, fill2);
  }
});

//if isDrawing true/false tarkiste pausenapille
// Pause button event listener tupakki
document.getElementById('pauseButton').addEventListener('click', function () {
  if (palkka < 0.20 && isDrawing == true) {
    //alert("Ei sulla oo varaa ostaa tupakkia!")
    herja(herjaTupakki1, tyoTilaAktiivi, "red", "green");

  } else {
    if (isDrawing == true) {
      isDrawing = false;
      tupakkatauko += 1;
      palkka -= 0.10;
      document.getElementById("tila").innerHTML = herjaTupakki2;
      var tilaVari = document.getElementById("tila");
      tilaVari.style.color = "red";
      tila = "tupakki";
      tilavalo(tila);
    }
    if (fill1 === true && fill2 === true) {
      herja(herjaTupakki3, tyoTilaAktiivi, "red", "green");
    }
  }
});

// Pause button event listener ruoka
document.getElementById('lunchButton').addEventListener('click', function () {
  if (tulosteet < 20000 && isDrawing === true) {
    herja(herjaRuoka1, tyoTilaAktiivi, "red", "green"); // Message for "not enough prints for lunch break"
  } else if (ruokatauko >= 1 && isDrawing === true) {
    herja(herjaRuoka2, tyoTilaAktiivi, "red", "green"); // Message for "only one lunch break allowed per day"
  } else {
    if (isDrawing === true) {
      clearInterval(sekunnitId); // Stop the timer
      isDrawing = false;
      ruokatauko += 1;
      palkka -= 0.50;
      document.getElementById("tila").innerHTML = herjaRuoka3; // Display lunch message
      var tilaVari = document.getElementById("tila");
      tilaVari.style.color = "blue";
      tila = "ruoka"; // Update status to 'ruoka'
      tilavalo(tila);
      
      // Set timeout to clear the message
      setTimeout(function() {
        document.getElementById("tila").innerHTML = tyoTilaAktiivi;
        tilaVari.style.color = "green"; // Reset color to active work status
      }, 2000); // Change duration as needed
    }
  }
});

// Pause button event listener WC
document.getElementById('toiletButton').addEventListener('click', function () {

    if (isDrawing == true && vessatauko <= 2) {
      isDrawing = false;
      vessatauko += 1;
      document.getElementById("tila").innerHTML = "Vessassa, trallallaa...";
      var tilaVari = document.getElementById("tila");
      tilaVari.style.color = "brown";
      tila = "WC";
      tilavalo(tila);
    }

    if (isDrawing == true && vessatauko >= 3) {
      //alert("Tarviitko imodiumia?");
      isDrawing = false;
      vessatauko += 1;
      document.getElementById("tila").innerHTML = "Vessassa, trallallaa...";
      var tilaVari = document.getElementById("tila");
      tilaVari.style.color = "brown";
      tila = "WC";
      tilavalo(tila);
      herja(herjaWC2, tyoTilaAktiivi, "red", "green");
      console.log("vessatauko 2");
    }

    if (fill1 === true && fill2 === true) {
      herja(herjaWC3, tyoTilaAktiivi, "red", "green");
    }
 
});

let herjaTimeout; // Global variable for timeout

function herja(herja1, herja2, tilaVari1, tilaVari2) {
  let x = document.getElementById("tila");
  let tilaVari = document.getElementById("tila");

  // Clear any existing timeout to prevent overlaps
  if (herjaTimeout) {
    clearTimeout(herjaTimeout);
  }
  // Display the initial warning message
  x.innerHTML = herja1;
  tilaVari.style.color = tilaVari1;
console.log("herjatimeout " + herjaTimeout);
  // Set a new timeout to update the message after 1 second
  herjaTimeout = setTimeout(function () {
    if (tila === "WC") {
      x.innerHTML = herjaWC3;
      tilaVari.style.color = "brown";
    } else if (tila === "ruoka") {
      x.innerHTML = herjaRuoka3;
      tilaVari.style.color = "blue";
    } else if (tila === "tupakki") {
      x.innerHTML = herjaTupakki2;
      tilaVari.style.color = "red";
    } else {
      x.innerHTML = herja2;
      tilaVari.style.color = tilaVari2;
    }

    // Reset `herjaTimeout` after the timeout completes
    herjaTimeout = null;
  }, 1000); // Set to 1 second for the message display duration
}


/*
function herja(herja1, herja2, tilaVari1, tilaVari2) {
  if (tila === "taynna") {
    let x = document.getElementById("tila");
    x.innerHTML = "Binit täynnä, ei voi käynnistää!";
    x.style.color = "orange";
  }

  if (tila === "stop") {
    let x = document.getElementById("tila");
    x.innerHTML = "Binit täynnä, ei voi käynnistää!";
    x.style.color = "orange";
  }

  if (tila != "taynna") {
    document.getElementById("tila").innerHTML = herja1;
    var tilaVari = document.getElementById("tila");
    tilaVari.style.color = tilaVari1;
    let x = document.getElementById("tila");
    herjaTimeout = setTimeout(function () {
      if (tila === "WC") {
        x.innerHTML = herjaWC3;
        tilaVari.style.color = "brown";

      } else if (tila === "ruoka") {
        x.innerHTML = herjaRuoka3;
        tilaVari.style.color = "blue";

      }
      else if (tila === "tupakki") {
        x.innerHTML = herjaTupakki2;
        tilaVari.style.color = "red";
        console.log("vit", tila);

      }
      else {
        x.innerHTML = herja2;
        tilaVari.style.color = tilaVari2;

      }

    }, 2000);
    clearTimeout(herjaTimeout);
  } else {
    document.getElementById("tila").innerHTML = "Binit täynnä, tyhjennä!";
    var tilaVari = document.getElementById("tila");
    tilaVari.style.color = "red";
    console.log(tila);
  }
}
*/

//move button

document.getElementById('moveButton').addEventListener('click', function () {
  console.log(fill1, fill2);

  if ((fill1 === true) && (fill2 === true)) {
    isDrawing = false;
    fillingCtx1.clearRect(0, 0, fillingCanvas1.width, fillingCanvas1.height);
    fillingCtx1.fillStyle = "white";
    emptyingCtx1.clearRect(0, 0, emptyingCanvas1.width, emptyingCanvas1.height);
    emptyingCtx1.fillStyle = "lightgray";
    emptyingCtx1.fillRect(0, 0, emptyingCanvas1.width, emptyingCanvas1.height);
    fillingCtx2.clearRect(0, 0, fillingCanvas2.width, fillingCanvas2.height);
    fillingCtx2.fillStyle = "white";
    emptyingCtx2.clearRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);
    emptyingCtx2.fillStyle = "lightgray";
    emptyingCtx2.fillRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);

    //alert("siirto 5000 sivua");
    document.getElementById("tila").innerHTML = "Tyhjennetään binit ja täytetään paperilokerot!";
    let tilaVari = document.getElementById("tila");
    tilaVari.style.color = "orange";
    
    setTimeout(function () {
      document.getElementById("tila").innerHTML = uusiAlku;
      var tilaVari = document.getElementById("tila");
      tilaVari.style.color = "orange";
    }, 2000);
    //tulosteet = tulosteet + 5000;
    //document.getElementById("kokonaistulosteet").innerHTML = "tulostetut sivut: " + tulosteet;
    document.getElementById("palkka").innerHTML = palkka.toFixed(2) + " mk";
    console.log(tulosteet);
    fillFalse();
  } else {
    if (tila === "stop") {
      //do nothing
    } else {
      herja(herjaBinit2, tyoTilaAktiivi, "red", "green");
      //alert("Ei binit oo vielä täynnä, senkin jannu!")
    }
  }

});

function fillFalse() {
  tila = "kaynnissa";
  fill1 = false;
  fill2 = false;
  fillPercentage1 = 0;
  fillPercentage2 = 0;
  //document.querySelector('#startButton').click();
}

var intervalId; // Global variable to hold the interval ID

//tilavalo
function tilavalo(tila) {
  let status = "black";

  if (intervalId) {
    clearInterval(intervalId);
  }

  if (tila === "kaynnissa") {
    status = "green";
  } else if (tila === "WC" || tila === "ruoka" || tila === "tupakki") {
    status = "orange";
  } else if (tila === "taynna") {
    status = "red";
  } else if (tila === "stop") {
    status = "black";
  }

  intervalId = setInterval(function () {
    if (ball.style.backgroundColor === 'black') {
      ball.style.backgroundColor = status;
    } else {
      ball.style.backgroundColor = 'black';
    }
  }, 500); // Changes color every 500 milliseconds
};

document.getElementById('pysaytaTulostus').addEventListener('click', function () {
  //function lopetaPaiva() {
  //alert("lopetaPaiva");
  if (tila === "taynna" && fill1 != false && fill2 != false) {
    document.getElementById("tila").innerHTML = "Binit täynnä, tyhjennä ensin!";
    var tilaVari = document.getElementById("tila");
    tilaVari.style.color = "red";
  }

  else if (isDrawing == true || tila === "WC" || tila === "ruoka" || tila === "tupakki" || tila != "taynna") {
    clearInterval(sekunnitId);
    isDrawing = false;
    tila = "stop";
    let tilaVari = document.getElementById("tila");
    tilaVari.style.color = "black";
    tilavalo(tila);

    //if (tila === stop && fill1 === false && fill2 === false) {
    //  document.getElementById("tila").innerHTML = "Työnteko on jo lopetettu!";
    //} else {
      document.getElementById("tila").innerHTML = "Tulostin on pysätetty!";
    //}
    
  }
});

document.getElementById('lopetaPaiva').addEventListener('click', function () {
  //function lopetaPaiva() {
  //alert("lopetaPaiva");
  if (tila === "taynna" && fill1 != false && fill2 != false) {
    document.getElementById("tila").innerHTML = "Binit täynnä, tyhjennä ensin!";
    var tilaVari = document.getElementById("tila");
    tilaVari.style.color = "red";
  }

  else if (isDrawing == true || tila === "WC" || tila === "ruoka" || tila === "tupakki" || tila != "taynna") {
    clearInterval(sekunnitId);
    isDrawing = false;
    tila = "stop";

    tulosteet += fillPercentage1 * 25 + fillPercentage2 * 25;

    //animaatioprosentit -> 0
    fillPercentage1 = 0
    fillPercentage2 = 0

    //täytön boolen arvo -> false
    fill1 = false;
    fill2 = false;

    //canvasien nollaus
    fillingCtx1.clearRect(0, 0, fillingCanvas1.width, fillingCanvas1.height);
    fillingCtx1.fillStyle = "white";
    fillingCtx1.fillRect(0, 0, fillingCanvas1.width, fillingCanvas1.height);

    fillingCtx2.clearRect(0, 0, fillingCanvas2.width, fillingCanvas2.height);
    fillingCtx2.fillStyle = "white";
    fillingCtx2.fillRect(0, 0, fillingCanvas2.width, fillingCanvas2.height);

    emptyingCtx1.clearRect(0, 0, emptyingCanvas1.width, emptyingCanvas1.height);
    emptyingCtx1.fillStyle = "lightgray";
    emptyingCtx1.fillRect(0, 0, emptyingCanvas1.width, emptyingCanvas1.height);

    emptyingCtx2.clearRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);
    emptyingCtx2.fillStyle = "lightgray";
    emptyingCtx2.fillRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);

    //tietojen pävitys
    document.getElementById("kokonaistulosteet").innerHTML = tulosteet.toFixed(0);
    document.getElementById("tila").innerHTML = "Työnteko lopetettu!";
    let tilaVari = document.getElementById("tila");
    tilaVari.style.color = "black";
    tilavalo(tila);

    //window.addEventListener('beforeunload', function() {
      const muuttujat = {
        muuttuja1: tulosteet,
        muuttuja2: ruokatauko,
        muuttuja3: vessatauko,
        muuttuja4: tupakkatauko,
        muuttuja5: palkka,
        muuttuja6: count
        //muuttujax: { avain: 'arvo', numero: 456 }
    };
    tallennaMuuttujat(muuttujat);
  }
});

/*
  //tallenna prosessi manuaalisti
  document.getElementById('tallennaProsessi').addEventListener('click', function () {
    //window.addEventListener('beforeunload', function() {
    const muuttujat = {
        muuttuja1: tulosteet,
        muuttuja2: ruokatauko,
        muuttuja3: vessatauko,
        muuttuja4: tupakkatauko,
        muuttuja5: palkka,
        muuttuja6: count
        //muuttujax: { avain: 'arvo', numero: 456 }
    };
    tallennaMuuttujat(muuttujat);
  });*/