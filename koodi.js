
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
var tulostusSkalaari = 25;
// Set fill speed (1% per second)
var fillSpeed = 1;

//tilamuuttujat
const herjaWC1 = "Ei vielä voi olla hätä!";
const herjaWC2 = "Tarviitko sakset?";
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
const tyoTilaAktiivi = "Painetaan duunia tyrät rytkyen!";
const binitTaynna = "Binit on täynnä, tartteis poistaa tulosteet!"
const tilaVari1 = "black";
const tilaVari2 = "black";

//boolen arvo tilalle
var tila = null;




// Function to update canvases
function updateCanvas1() {
  if (isDrawing && fillPercentage1 <= 100) {
    // Clear canvases

    //printterin tilan vahvistus
    if (tila === null) {
    document.getElementById("tila").innerHTML = "Painetaan duunia tyrät rytkyen!";
    var tilaVari = document.getElementById("tila");
    tilaVari.style.color = "green";
    }
    fillingCtx1.clearRect(0, 0, fillingCanvas1.width, fillingCanvas1.height);
    fillingCtx1.fillStyle = "white";
    fillingCtx1.fillRect(0, 0, fillingCanvas1.width, fillingCanvas1.height);

    emptyingCtx1.clearRect(0, 0, emptyingCanvas1.width, emptyingCanvas1.height);
    emptyingCtx1.fillStyle = "lightgray";
    emptyingCtx1.fillRect(0, 0, emptyingCanvas1.width, emptyingCanvas1.height);

    emptyingCtx2.fillStyle = "lightgray";
    emptyingCtx2.fillRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);

    //palkkalaskuri
    palkka = palkka + 0.01;
    document.getElementById("palkka").innerHTML = palkka.toFixed(2) + " mk";

    // Calculate fill height for first set of canvases
    var fillHeight1 = (fillingCanvas1.height / 100) * fillPercentage1;

    // Fill and empty first set of canvases

    //fillingCtx1.fillStyle = 'lightgray';
    //fillingCtx1.fillRect(0, fillingCanvas1.height - fillHeight1, fillingCanvas1.width, fillHeight1);
    setTimeout(filling1(fillHeight1), 1800);

    emptyingCtx1.fillStyle = 'white';
    emptyingCtx1.fillRect(0, 0, emptyingCanvas1.width, fillHeight1);

    // Update fill percentage
    fillPercentage1 += fillSpeed;
    console.log(fillPercentage1, fillSpeed);

    if (fillPercentage1 >= 101) {
      fill1 = true;
      //updateCanvas2()
      setTimeout(updateCanvas2, 3000);
    }
    // Schedule next frame
    setTimeout(updateCanvas1, 1000); // 1000ms = 1 second
  }
}

function filling1(fillHeight1) {
  fillingCtx1.fillStyle = 'lightgray';
  fillingCtx1.fillRect(0, fillingCanvas1.height - fillHeight1, fillingCanvas1.width, fillHeight1);

  if (fillHeight1 > 0 && fillHeight1 < 101) {
    //tulostinlaskuri
    tulosteet += tulostusSkalaari;
    document.getElementById("kokonaistulosteet").innerHTML = tulosteet;
  }
}

function updateCanvas2() {
  //let fillSpeed = 10;
  console.log(fillPercentage2, fillSpeed);
  if (isDrawing && fillPercentage2 <= 100) {
    // Clear canvases

    fillingCtx2.clearRect(0, 0, fillingCanvas2.width, fillingCanvas2.height);
    fillingCtx2.fillStyle = "white";
    fillingCtx2.fillRect(0, 0, fillingCanvas2.width, fillingCanvas2.height);
    emptyingCtx2.clearRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);
    emptyingCtx2.fillStyle = "lightgray";
    emptyingCtx2.fillRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);
    //palkkalaskuri
    palkka = palkka + 0.01;
    document.getElementById("palkka").innerHTML = palkka.toFixed(2) + " mk";

    var fillHeight2 = (fillingCanvas2.height / 100) * fillPercentage2;

    //fillingCtx2.fillStyle = 'lightgray';
    //fillingCtx2.fillRect(0, fillingCanvas2.height - fillHeight2, fillingCanvas2.width, fillHeight2);

    setTimeout(filling2(fillHeight2), 1000);
    emptyingCtx2.fillStyle = 'white';
    emptyingCtx2.fillRect(0, 0, emptyingCanvas2.width, fillHeight2);

    // Update fill percentage
    fillPercentage2 += fillSpeed;

    if (fillPercentage2 >= 101) {
      fill2 = true;
      isDrawing = false;
      tila = "Taynna";
      document.getElementById("tila").innerHTML = binitTaynna;
      var tilaVari = document.getElementById("tila");
      tilaVari.style.color = "orange";
    }
    // Schedule next frame
    setTimeout(updateCanvas2, 1800); // 1000ms = 1 second
  }
}

function filling2(fillHeight2) {
  fillingCtx2.fillStyle = 'lightgray';
  fillingCtx2.fillRect(0, fillingCanvas2.height - fillHeight2, fillingCanvas2.width, fillHeight2);

  if (fillHeight2 > 0 && fillHeight2 < 101) {
    //tulostinlaskuri
    tulosteet += tulostusSkalaari;
    document.getElementById("kokonaistulosteet").innerHTML = tulosteet;
  }
}
// Start button event listener

document.getElementById('startButton').addEventListener('click', function () {
  if (isDrawing === false) {
    tila = null;
    console.log(tila);
    isDrawing = true;
    document.getElementById("tila").innerHTML = "Painetaan duunia tyrät rytkyen!";
    var tilaVari = document.getElementById("tila");
    tilaVari.style.color = "green";
    if (fill1 === true) {
      //setTimeout(updateCanvas2, 1000);
      updateCanvas2();
    } else {
      //setTimeout(updateCanvas1, 1000);
      updateCanvas1();
    }
    /*if (fill1 === false) {
        updateCanvas1();
    }*/
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


      //} else {
      //    isDrawing = true;
      //    document.querySelector('#startButton').click();
    }

    if (fill1 === true && fill2 === true) {
      //alert("Ei taukoja nyt laiskuri, kone käyntiin!")
      herja(herjaTupakki3, tyoTilaAktiivi, "red", "green");
    }
  }
});

// Pause button event listener ruoka
document.getElementById('lunchButton').addEventListener('click', function () {
  if (tulosteet < 20000 && isDrawing == true) {
    herja(herjaRuoka1, tyoTilaAktiivi, "red", "green");
    /*document.getElementById("tila").innerHTML = "Ei vielä voi olla nälkä!";
    var tilaVari = document.getElementById("tila");
    tilaVari.style.color = "red";
    let x = document.getElementById("tila");
    setTimeout(function () {
      x.innerHTML = "Painetaan duunia tyrät rytkyen!";
      tilaVari.style.color = "green";
    }, 2000);*/
    //alert("Ei vielä voi olla nälkä!")
  } else if (ruokatauko >= 1 && isDrawing == true) {
    herja(herjaRuoka2, tyoTilaAktiivi, "red", "green");
    /*document.getElementById("tila").innerHTML = "Yksi ruokatauko päivässä!";
    var tilaVari = document.getElementById("tila");
    tilaVari.style.color = "red";
    let x = document.getElementById("tila");
    setTimeout(function () {
      x.innerHTML = "Painetaan duunia tyrät rytkyen!";
      tilaVari.style.color = "green";
    }, 2000);*/

    //alert("Yksi ruokatauko päivässä!")
  } else {

    if (isDrawing == true) {
      isDrawing = false;
      ruokatauko += 1;
      palkka -= 0.50;
      document.getElementById("tila").innerHTML = herjaRuoka3;

      var tilaVari = document.getElementById("tila");
      tilaVari.style.color = "blue";
      tila = "ruoka";
      //} else {
      //    isDrawing = true;
      //    document.querySelector('#startButton').click();
    }

    if (fill1 === true && fill2 === true && ruokatauko < 1) {
      //alert("Nyt ei syödä läski, kone käyntiin!")
      herja(herjaRuoka4, tyoTilaAktiivi, "red", "green");
      /*document.getElementById("tila").innerHTML = "Nyt ei syödä läski, kone käyntiin!";
      var tilaVari = document.getElementById("tila");
      tilaVari.style.color = "red";
      let x = document.getElementById("tila");
      setTimeout(function(){
        x.innerHTML = "Painetaan duunia tyrät rytkyen!";
        tilaVari.style.color = "green";
      }, 2000);*/
    }
  }
});

// Pause button event listener WC
document.getElementById('toiletButton').addEventListener('click', function () {
  if (fill1 === false && fill2 === false && isDrawing == true) {
    //alert("Ei vielä voi olla hätä!")
    herja(herjaWC1, tyoTilaAktiivi, "red", "green");
    /*document.getElementById("tila").innerHTML = "Ei vielä voi olla hätä!";
      var tilaVari = document.getElementById("tila");
      tilaVari.style.color = "red";
      let x = document.getElementById("tila");
      setTimeout(function(){
        x.innerHTML = "Painetaan duunia tyrät rytkyen!";
        tilaVari.style.color = "green";
      }, 2000);*/
  } else {

    if (isDrawing == true && vessatauko <= 2) {
      isDrawing = false;
      vessatauko += 1;
      document.getElementById("tila").innerHTML = "Vessassa, trallallaa...";
      var tilaVari = document.getElementById("tila");
      tilaVari.style.color = "brown";
      tila = "WC";
    }

    if (vessatauko >= 3) {
      //alert("Tarviitko sakset?");
      herja(herjaWC2, tyoTilaAktiivi, "red", "green");
      /*document.getElementById("tila").innerHTML = herjaWC2 ;
      var tilaVari = document.getElementById("tila");
      tilaVari.style.color = "red";
      let x = document.getElementById("tila");
      setTimeout(function(){
        x.innerHTML = tyoTilaAktiivi;
        tilaVari.style.color = "green";
      }, 2000);*/

      //console.log(vessatauko);

      //} else {
      //    isDrawing = true;
      //    document.querySelector('#startButton').click();
    }

    if (fill1 === true && fill2 === true) {
      herja(herjaWC3, tyoTilaAktiivi, "red", "green");
      //alert("Nyt ei ehdi vessaan, kone käyntiin!")
    }
  }
});

function herja(herja1, herja2, tilaVari1, tilaVari2) {
  if (tila != "Taynna") {
  document.getElementById("tila").innerHTML = herja1;
  var tilaVari = document.getElementById("tila");
  tilaVari.style.color = tilaVari1;
  let x = document.getElementById("tila");
  setTimeout(function () {
    if (tila === "WC") {
      x.innerHTML = herjaWC3;
      tilaVari.style.color = "brown";

    } else if (tila === "ruoka") {
      x.innerHTML = herjaRuoka3;
      tilaVari.style.color = "blue";

    } else if (tila === "tupakki") {
      x.innerHTML = herjaTupakki2;
      tilaVari.style.color = "red";
      console.log("vit", tila);

    }
    else {
      x.innerHTML = herja2;
      tilaVari.style.color = tilaVari2;

    }

  }, 2000);
} else {
  document.getElementById("tila").innerHTML = "Binit täynnä, tyhjennä!";
  var tilaVari = document.getElementById("tila");
  tilaVari.style.color = "red";
  console.log(tila);
}}


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
    var tilaVari = document.getElementById("tila");
    tilaVari.style.color = "orange";
    setTimeout(function(){
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
    herja(herjaBinit2, tyoTilaAktiivi, "red", "green");
    //alert("Ei binit oo vielä täynnä, senkin jannu!")
  }
});

function fillFalse() {
  tila = null;
  fill1 = false;
  fill2 = false;
  fillPercentage1 = 0;
  fillPercentage2 = 0;
  //document.querySelector('#startButton').click();
}