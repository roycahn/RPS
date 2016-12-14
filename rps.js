
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCld0zFBstm3qtZ5knff-aSaeEVpaiMPAo",
    authDomain: "test-66dbf.firebaseapp.com",
    databaseURL: "https://test-66dbf.firebaseio.com",
    storageBucket: "test-66dbf.appspot.com",
    messagingSenderId: "171076085428"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //Store User Name
  $("#start-btn").on("click", function() {

      // Get player name
      var name = $("#player-name").val().trim();
      

      // Change what is saved in firebase
      database.ref().set({
        name: name,
        wins: age,
        phon\: phone
      });