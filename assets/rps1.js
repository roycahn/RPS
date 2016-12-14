//game object
var game = 
    {
      newGame: true,
      turn: 0,
      player: [
        {
        name:     "",
        wins:     0,
        losses:   0,
        ties:     0,
        choice:   "",
        chat:     ""
        },
        {
        name:     "",
        wins:     0,
        losses:   0,
        ties:     0,
        choice:   "",
        chat:     ""
        },
      ]
    }; //game object


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyALCgw0xxXs94-LXSD-_e5jsJi3VnjyCb0",
    authDomain: "rpsgame-1174f.firebaseapp.com",
    databaseURL: "https://rpsgame-1174f.firebaseio.com",
    storageBucket: "rpsgame-1174f.appspot.com",
    messagingSenderId: "1043095819837"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  

  // Initialize Firebase
  function initPlayer(player){

     database.ref("/playerData").push({
          name:     player.name,
          wins:     0,
          losses:   0,
          ties:     0,
          choice:   "",
          chat:     ""

      }); //fb set  

  } //function setFireBase

  $(document).ready(function(){
    //Store User Name
    $("#start-btn").on("click", function() {
     console.log("start-btn click");
    
    database.ref().on("value", function(snapshot) {
    if(!snapshot.child("/playerData").exists()){
      player = game.player[0];
      initPlayer(player);
    }
    else{ 
      var numPlayers = snapshot.child("/playerData").numChildren();
      console.log(numPlayers);
      if(numPlayers < 2){
        player = game.player[0];
        initPlayer(player);
     }
    }

 
  });
    if(game.newGame){
      game.player[0].name = $("#player-name").val().trim();
      game.newGame = false;      
      console.log("player 1: " + game.player[0].name);
      $("#player-name").val("");
      // player = game.player[0];
      // initPlayer(player);
      return false;
    }
    // if player 0 exists then this is player 2
    else{
      game.player[1].name = $("#player-name").val().trim();
      console.log("player 2: " + game.player[1].name);
      $("#player-name").val("");
      // player = game.player[1];
      // initPlayer(player);
      return false;
      }
    

    
    
 
  }); //str-btn on click

  return false;
}); //document ready


  
database.ref().on("value", function(snapshot) {
  }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
