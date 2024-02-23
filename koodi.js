
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
  var fillPercentage1 = 0;
  var fillPercentage2 = 0;
  var isDrawing = false;
  var fill1 = false;
  var fill2 = false;
  var tulosteet = 0;
  var vika = false;
  var ruokatauko = 0
  var vessatauko = 0;
  var tupakkatauko = 0;
  var palkka = 0;
  var lastFrameTime = 0;
  var animationSpeed = 0.1; // Adjust this value to control the animation speed
  // Set fill speed (10% per second)
  var fillSpeed = 1;

  // Function to update canvases
  function updateCanvas1() {
    if (isDrawing && fillPercentage1 <= 100) {
      // Clear canvases
      
      fillingCtx1.clearRect(0, 0, fillingCanvas1.width, fillingCanvas1.height);
      fillingCtx1.fillStyle = "white";
      fillingCtx1.fillRect(0, 0, fillingCanvas1.width, fillingCanvas1.height);

      emptyingCtx1.clearRect(0, 0, emptyingCanvas1.width, emptyingCanvas1.height);
      emptyingCtx1.fillStyle = "lightgray";
      emptyingCtx1.fillRect(0, 0, emptyingCanvas1.width, emptyingCanvas1.height);

      emptyingCtx2.fillStyle = "lightgray";
      emptyingCtx2.fillRect(0, 0, emptyingCanvas2.width, emptyingCanvas2.height);

      palkka = palkka + 0.01;
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
        palkka = palkka + 0.01;

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
      }
      // Schedule next frame
      setTimeout(updateCanvas2, 1800); // 1000ms = 1 second
    }
  }

  function filling2(fillHeight2) {
    fillingCtx2.fillStyle = 'lightgray';
    fillingCtx2.fillRect(0, fillingCanvas2.height - fillHeight2, fillingCanvas2.width, fillHeight2);
  }
  // Start button event listener
  document.getElementById('startButton').addEventListener('click', function() {
    if (isDrawing === false) {
    isDrawing = true;
    document.getElementById("tila").innerHTML = "Painetaan duunia tyrät rytkyen!";
    var tilaVari = document.getElementById("tila");
            tilaVari.style.color = "green";
    if (fill1 === true) {
      //setTimeout(updateCanvas2, 1000);
        updateCanvas2();
    } else  {
      //setTimeout(updateCanvas1, 1000);
        updateCanvas1();
    }
    /*if (fill1 === false) {
        updateCanvas1();
    }*/
    
    console.log(fillPercentage1, fillPercentage2, fill1, fill2);
}
  });


  // Pause button event listener
  document.getElementById('pauseButton').addEventListener('click', function() {
    if (palkka < 0.20) {
        alert("Ei sulla oo varaa ostaa tupakkia!")
    } else {
        if (isDrawing == true) {
            isDrawing = false;
            tupakkatauko += 1;
            palkka -= 0.10;
            document.getElementById("tila").innerHTML = "Tuu tuu tupakilla, röyhyää körssi!";
            var tilaVari = document.getElementById("tila");
            tilaVari.style.color = "red";
            
            
            //} else {
        //    isDrawing = true;
        //    document.querySelector('#startButton').click();
        }

        if (fill1 === true && fill2 === true) {
            alert("Ei taukoja nyt laiskuri, kone käyntiin!")
        }}
  });

  // Pause button event listener
  document.getElementById('lunchButton').addEventListener('click', function() {
    if (tulosteet < 20000) {
        alert("Ei vielä voi olla nälkä!")
    } else if (ruokatauko >= 1) {
        alert("Yksi ruokatauko päivässä!")
    } else {
    
    if (isDrawing == true) {
        isDrawing = false;
        ruokatauko += 1;
        palkka -= 0.50;
        document.getElementById("tila").innerHTML = "Om nom nom... Röyh!";
        
        var tilaVari = document.getElementById("tila");
            tilaVari.style.color = "blue";
    //} else {
    //    isDrawing = true;
    //    document.querySelector('#startButton').click();
    }

    if (fill1 === true && fill2 === true && ruokatauko < 1) {
        alert("Nyt ei syödä läski, kone käyntiin!")
    }
}
});

// Pause button event listener
document.getElementById('toiletButton').addEventListener('click', function() {
    if (fill1 === false && fill2 === false) {
alert("Ei vielä voi olla hätä!")
    } else {
    
    if (isDrawing == true) {
        isDrawing = false;
        vessatauko += 1;
        document.getElementById("tila").innerHTML = "Vessassa, trallallaa...";
        var tilaVari = document.getElementById("tila");
            tilaVari.style.color = "brown";
    }
    
    if (vessatauko > 2) {
        alert("Tarviitko sakset?");
        console.log(vessatauko);
        
    //} else {
    //    isDrawing = true;
    //    document.querySelector('#startButton').click();
    }

    if (fill1 === true && fill2 === true) {
        alert("Nyt ei ehdi vessaan, kone käyntiin!")
    }}
});


//move button

  document.getElementById('moveButton').addEventListener('click', function() {
    console.log(fill1, fill2);

    if ((fill1 === true)  && (fill2 === true)) {
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
      tulosteet = tulosteet + 5000;
      document.getElementById("kokonaistulosteet").innerHTML = "tulostetut sivut: " + tulosteet;
      document.getElementById("palkka").innerHTML = "tienattua rahaa:  " + palkka.toFixed(2) + " mk";
    console.log(tulosteet);
    fillFalse();
    } else {
        alert("Ei binit oo vielä täynnä, senkin jannu!")
    }
});

function fillFalse() {
    fill1 = false;
    fill2 = false;
    fillPercentage1 = 0;
    fillPercentage2 = 0;
    //document.querySelector('#startButton').click();
}