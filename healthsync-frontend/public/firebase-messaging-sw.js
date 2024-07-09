importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAFQab7LytnQNqCs61M-OTkRuSiBgo_A74",
  authDomain: "jsontofirebase-6ddbd.firebaseapp.com",
  databaseURL: "https://jsontofirebase-6ddbd-default-rtdb.firebaseio.com",
  projectId: "jsontofirebase-6ddbd",
  storageBucket: "jsontofirebase-6ddbd.appspot.com",
  messagingSenderId: "231116578149",
  appId: "1:231116578149:web:172e4b8b4197ff5464558c",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  alert(payload.notification.title);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
