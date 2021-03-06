$(document).ready(function () {
  var config = {
    apiKey: "AIzaSyCfxrNFR0IkXIzWEPrkJVR5UX0MGrqteL0",
    authDomain: "mikesproject-bd0c2.firebaseapp.com",
    databaseURL: "https://mikesproject-bd0c2.firebaseio.com",
    projectId: "mikesproject-bd0c2",
    storageBucket: "mikesproject-bd0c2.appspot.com",
    messagingSenderId: "911450662789"
  };
  //Firebase Authentication section
  firebase.initializeApp(config);
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('Currewnt User: ', firebase.auth().currentUser.displayName);
      localStorage.setItem('uid', firebase.auth().currentUser.uid)
      $('#current-username').text(firebase.auth().currentUser.displayName)
    } else {
      $('#current-username').text("please Login")
    }
  });

  function createAccount(email, password, userName) {
    firebase.auth().signOut();
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function () {
        return firebase
          .auth()
          .currentUser.updateProfile({ displayName: userName })
          .then(function () {
            return;
          });
      }).catch(err => {
        $('.register-err-msg').text(err.message).css('color', 'red');            
      })
  }

  // Event Handler for new User Registration
  $(".user-create").on("submit", function (event) {
    event.preventDefault();
    var userName = $(this)
      .children(".name")
      .val();
    var email = $(this)
      .children(".email")
      .val();
    var password = $(this)
      .children(".password")
      .val();

    var newUser = {
      name: userName,
      email: email,
      Authentication: "XXXXXXXXXXXXX"
    };

    createAccount(email, password, userName).then(function () {
      newUser.Authentication = firebase.auth().currentUser.uid;
      console.log("new user being added with name: " + newUser.name + " " + newUser.Authentication);
      $.ajax({
        method: "POST",
        url: "/api/users",
        data: newUser
      }).then(function (data) {
        console.log(data);
        location.reload();
      }).catch(err => {    
      })
    });
  });  

  // Event Handler for new User Login
  $(".user-login").on("submit", function (event) {
    event.preventDefault();
    var email = $(this)
      .children(".email")
      .val();
    var password = $(this)
      .children(".password")
      .val();

    firebase.auth().signOut();
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(user => {
      console.log('then user login', user);      
      location.reload();
    })
    .catch(function(error) {
      $('.login-err-msg').text(error.message).css('color', 'red');
    });
  });

  $('#logout-btn').on('click', (e) => {
    e.preventDefault();

    localStorage.removeItem('uid');
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
      location.reload();
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  });

  $("#host-button-enable").on("click", function () {
    const input = document.querySelector('#event-address');
    new google.maps.places.Autocomplete(input);
  });

  //create an event
  $(".party-create").on("submit", function (event) {
    event.preventDefault();

    var uid = firebase.auth().currentUser && firebase.auth().currentUser.uid;
    if (uid) {
      var addEvent = {
        eventHostAuthenticationId: firebase.auth().currentUser.uid,
        eventName: $("#event-name")
          .val()
          .trim(),
        eventAddress: $("#event-address")
          .val()
          .trim(),
        eventDate: $("#event-date")
          .val()
          .trim(),
        eventTime: $("#event-time")
          .val()
          .trim(),
        eventDiscription: $('#event-description')
          .val()
          .trim()
      };

      $.ajax({
        method: "POST",
        url: "/api/parties",
        data: addEvent
      }).then(function (data) {
        console.log('party created', data);
        location.reload();
      }).catch(err => console.log('err creating party', err))
    } else {
      console.log("please sign up or login");
    }
  });
});