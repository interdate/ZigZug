// Initialize Firebase - https://firebase.google.com/docs/web/setup
var config = {
  apiKey: "AIzaSyCBUju5_RuU3lVgo_iFrTLXU8nmTNfav1o",
  authDomain: "zigzug-9830a.firebaseapp.com",
  projectId: "zigzug-9830a",
  storageBucket: "zigzug-9830a.appspot.com",
  messagingSenderId: "561402157531",
  appId: "1:561402157531:web:1e473c67c510e6b8f6effe",
  measurementId: "G-41V4ERT7QK"
};
firebase.initializeApp(config);

var messaging = firebase.messaging();

messaging.usePublicVapidKey("BC_5Id5wKDXaZM9-T9tb5Pho96_b19T-RhKisqrnTac8vV2c0HtIXNXkQWva12JrJXfsErI02hbj2SkWWaNj6bQ");

messaging.requestPermission()
    .then(function() {
        return messaging.getToken();
    })
    .then(function(token) {
        // send rest call to add to database
        console.log(token);
        // $.ajax('https://zigzug-e4308.firebaseio.com/pushtokens/'+token+'.json', {
        //     method: 'PUT',
        //     data: 'true',
        //     error: function(err) {
        //     }
        // });
    })
    .catch(function(err) {
        console.log('Permission denied');
    });
