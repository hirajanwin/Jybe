
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyD5urxo4Ol6p7uA-wZbV6Cr4tBqmz9ye9Q",
    authDomain: "jybe-c4974.firebaseapp.com",
    projectId: "jybe-c4974",
    storageBucket: "jybe-c4974.appspot.com",
    messagingSenderId: "1020855075768",
    appId: "1:1020855075768:web:d8c7542cf1e05d7773854d",
    measurementId: "G-2DBER4XYW9"
    };
    // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        document.getElementById('signIn').style.display = 'none';
        document.getElementById('mainJybe').style.display = 'block';
        return false;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,

    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

  ui.start('#firebaseui-auth-container', uiConfig);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.getElementById('signIn').style.display = 'none';
      document.getElementById('mainJybe').style.display = 'block';
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var user = firebase.auth().currentUser;
      var uid = user.uid
      var db = firebase.firestore();
  
      var docRef = db.collection("users").doc(uid);
  
      docRef.get().then(function(doc) {
          if (doc.exists) {
              console.log("Document data:", doc.data());
              firebase.firestore().collection("users").doc(uid)
              .onSnapshot((doc) => {
                  console.log("Current data: ", doc.data());
                  showJybes(doc.data());
              });
  
          } else {
              db.collection("users").doc(uid).set({
                "jybes": [],
              })
              .then(function() {
                  console.log("Document successfully written!");
              })
              .catch(function(error) {
                  console.error("Error writing document: ", error);
              })
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

      
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  document.getElementById("createJybe").addEventListener("click", getInputData);

  function getInputData() {
    var jybeText = document.getElementById("jybeInput").value;
    writeUserData(jybeText);
    document.getElementById("jybeInput").value = "";
  }

// Write a Jybe to the databse
function writeUserData(jybeText) {
    var user = firebase.auth().currentUser;
    var userId = user.uid;
    var db = firebase.firestore()
    var jybeRef = db.collection("users").doc(userId);
    if (user) {
        date = Date.now();
        betterDate = new Date().toLocaleString();
        var jybeObject = {
            "jybeText": jybeText,
            "jybeType": "textObject",
            "Time": betterDate,
        }
        jybeRef.update({
            jybes: firebase.firestore.FieldValue.arrayUnion(jybeObject)
        }, { merge: true });
    } else {
    // No user is signed in.
    }
  }



  // Show Our Jybes
  function showJybes(jybeObject) {
    document.getElementById("jybes").innerHTML = "";
    jybeArray = jybeObject.jybes;
    for (let i = jybeArray.length - 1; i >= 0; i--) {
      var jybe = jybeArray[i];
      document.getElementById("jybes").innerHTML += jybe.Time + " || " + jybe.jybeText + "<br></br>";
      
    }
  }