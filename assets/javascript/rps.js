//game object
var game = 
  { 
    
    pushKey: {},  //used on page close or with game.pushKey.update()
    turn: "Your",
    pflag:  false,
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
   
  

//read weapon from screen buttons & update firebase
$(".weapons button").on("click", function() {
  console.log(this.id);
  game.player.weapon = this.id;

  //update firebase with weapon
  game.pushKey.update({weapon: game.player.weapon});

  //change the button color of chosen weapon
  $(this).css("background-color", "#f47121");

  //disable buttons once one is chosen
  $(".weapons button").prop("disabled", true);
 
  //find whoWon returns the player number ie 1 or 2 or Tie   
      if(Boolean(weaponsArray[0] && weaponsArray[1])){
        var winner  = whoWon(weaponsArray);

        if (winner === "Tie") {
          $(".whowon").html("The Game was a TIE");
          console.log("The game was a Tie");
          game.player.ties ++;
          game.pushKey.update({ties: game.player.ties});
        } else
        
        if(game.player.playerNumber === winner ){
          $(".whowon").html("The Winner is Player # " +winner);
          console.log("Player: " + winner + " Won!");
          game.player.wins ++;
          game.pushKey.update({wins: game.player.wins});
        }
        else {
          $(".whowon").html("The Winner is Player # " +winner);
          console.log("Player: " + winner + " Lost!");
          game.player.losses ++;
          game.pushKey.update({losses: game.player.losses});

        }
      } //if both weapons selected


 }); // .weapons on click


//add  player to firebase  via push method
//function addPlayer(){

//Detect Connection, push player
playersRefInternal.on("value", function(snapshot) {
    
    if (snapshot.val().connected) {
      //function to push the player on to firebase return key to that player
      game.pushKey = initPlayer(playersRef);
      
      

      game.pushKey.onDisconnect().remove();
      }
    },
    function(errorObject) {
          console.log("The read failed: " + errorObject.code); 
    });

game.pflag = false;

playersRef.on("value", function(snapshot) {

  if (snapshot.numChildren() === 1){
    game.player.playerNumber = 1;
    game.pflag = true;

    //update firebase 
    game.pushKey.update({playerNumber: game.player.playerNumber});

    }else 
    if (snapshot.numChildren() === 2 && !game.pflag){
      game.player.playerNumber = 2;


    //update firebase 
    game.pushKey.update({playerNumber: game.player.playerNumber});
    }

  console.log(game.player.name+" is "+game.player.playerNumber +" Weapon is: " +game.player.weapon);

  var pkey = "" 
  var pval = snapshot.val();
  weaponsArray =[];
  
  //create an array with each player's weapon
  Object.keys(pval).forEach(function (key) {
    pkey = pval[key];
    game.player.weapon = pkey['weapon'];
    
    /*game.player.chat = pkey['chat'];
    game.player.losses = pkey['losses'];
    game.player.name = pkey['name'];
    game.player.playerNumber = pkey['playerNumber'];
    game.player.ties = pkey['ties'];
    game.player.wins = pkey['wins'];*/

    console.log("Player Name: " + pkey['name'] + " Player Number: " + pkey['playerNumber'] + "   Weapon: " + pkey['weapon']);
    weaponsArray.push(pkey['weapon']);
  }); // for each
console.log(weaponsArray);
  
  },

  

function(errorObject) {
  console.log("The read failed: " + errorObject.code); 
  });    
    

 
  

//} //function addPlayer




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
}// function whoWon


// Initialize Firebase
function initPlayer(player){
  
  //Get username from console and add to firebase
  $("#start-btn").on("click", function() {
    game.player.name = $("#player-name").val().trim();
    console.log(game.player.name);
    
    // update player 1 in firebase
    game.pushKey.update({name: game.player.name});
    
    
    //paint Player name div only after playerNumber is captured
    $("#player-name").val("");  
    $(".input-group").css("visibility","hidden");
    $(".game-info").css("visibility","visible");
    
    $("#name").html("Hi: " + game.player.name + "! You are Player #: " + game.player.playerNumber + " It's "+ game.turn + " Turn");
    $(".weapons").css("visibility","visible");
  return false;
  }); //str-btn on click


  var pushKey = player.push({  
        name:           game.player.name,
        playerNumber:   game.player.playerNumber,
        wins:           game.player.wins,
        losses:         game.player.losses,
        ties:           game.player.ties,
        weapon:         game.player.weapon,
        chat:           game.player.chat
  }); //fb push 
  
 return pushKey

} //function ititPLayer 

  
