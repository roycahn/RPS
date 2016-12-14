//game object
var game = 
  { 
    
    pushKey: {},  //used on page close or with game.pushKey.update()
    turn: "your",
    player:       
      {
      name:           "",
      playerNumber:   0, 
      wins:           0,
      losses:         0,
      ties:           0,
      weapon:         "", 
      chat:           ""
      },
  }; //game object

var weaponsArray = [];

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDMoxQN2kq62vw4nWO0aKt9cNFKoW-kDlo",
    authDomain: "rps2-db6d8.firebaseapp.com",
    databaseURL: "https://rps2-db6d8.firebaseio.com",
    storageBucket: "rps2-db6d8.appspot.com",
    messagingSenderId: "911305096470"
};
firebase.initializeApp(config);

// Create a variable to reference the database and branches.
var database = firebase.database();
var playersRef = database.ref();
var playersRefInternal = database.ref(".info");
  
$(".game-info").css("visibility","hidden");
$(".weapons").css("visibility","hidden");
   
  
//Get username from console and add to firebase
$("#start-btn").on("click", function() {
  game.player.name = $("#player-name").val().trim();
  console.log(game.player.name);
  
  //function to add a player to firebase
  if(game.player.playerNumber < 2){
    addPlayer();
    $("#player-name").val("");  
    $(".input-group").css("visibility","hidden");
    $(".game-info").css("visibility","visible");
    $("#name").html("Hi: " + game.player.name + " You are Player #: " + game.player.playerNumber + " it's "+ game.turn + " turn");
    $(".weapons").css("visibility","visible");
    }
    else {
      alert("Game Full");
    }
  
  

  return false;
}); //str-btn on click

//read weapon from screen buttons & update firebase
$(".weapons button").on("click", function() {
  console.log(this.id);
  game.player.weapon = this.id;

  //change the button color of chosen weapon
  $(this).css("background-color", "#f47121");

  //disable buttons once one is chosen
  $(".weapons button").prop("disabled", true);
 
  //find who won returns the player number ie 1 or 2 or Tie   
      var winner  = whoWon(weaponsArray);

      if (winner === "Tie") {
        alert("The game was a Tie")
      } else
      alert("Player: " + winner + " Won!");

 }); // .weapons on click



//add  player to firebase  via push method
function addPlayer(){

    playersRefInternal.on("value", function(snapshot) {
    
    if (snapshot.val().connected) {
      //push the player on to firebase return key to that player
      game.pushKey = initPlayer(playersRef);
      
      

      game.pushKey.onDisconnect().remove();
      }
    },
    function(errorObject) {
          console.log("The read failed: " + errorObject.code); 
    });

game.player.playerNumber = false;

playersRef.on("value", function(snapshot) {

  if (snapshot.numChildren() === 1){
    game.player.playerNumber = 1;

    //update firebase 
    game.pushKey.update({playerNumber: game.player.playerNumber});

    }else 
    if (snapshot.numChildren() === 2 && !game.player.playerNumber){
      game.player.playerNumber = 2;

      //update firebase 
      game.pushKey.update({playerNumber: game.player.playerNumber});
    }

  console.log(game.player.name+" is "+game.player.playerNumber);
  },

  

function(errorObject) {
  console.log("The read failed: " + errorObject.code); 
  });    
    
  
  playersRef.on("value", function(snapshot) {
  
    //Add Code here to get what each player played into memory
    
    var pkey = "" 
    var pval = snapshot.val();
    weaponsArray =[];
    Object.keys(pval).forEach(function (key) {
        pkey = pval[key];
        console.log("Player: " + pkey['playerNumber'] + "   Weapon: " + pkey['weapon']);
        weaponsArray.push(pkey['weapon']);
        

    });
    console.log(weaponsArray);

    
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
    });
//update firebase
  game.pushKey.update({weapon: game.player.weapon});
 
  

} //function addPlayer



function whoWon(tools){
  var choices = ["rock", "paper", "scissors"];
  var t1 = tools[0];
  var t2 = tools[1];
  t1 = choices.indexOf(t1);
    t2 = choices.indexOf(t2);
    if (t1 == t2) {
        return "Tie";
    }
    if (t1 == choices.length - 1 && t2 == 0) {
        return 2;
    }
    if (t2 == choices.length - 1 && t1 == 0) {
        return 1;
    }
    if (t1 > t2) {
        return 1;
    } else {
        return 2;
    }
}


// Initialize Firebase
function initPlayer(player){
 
  var pushKey = player.push({  
  name:           game.player.name,
  playerNumber:   0,
  wins:           0,
  losses:         0,
  ties:           0,
  weapon:         "",
  chat:           ""
  
  }); //fb push 
  return pushKey
} //function setFireBase

  
