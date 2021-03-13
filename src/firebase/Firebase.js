import * as firebase from 'firebase';
import "firebase/storage";

const settings = {timestampsInSnapshots: true};

const config = {
  apiKey: "AIzaSyABVAUtnlhfU-5FEBqNfcVcz5a80evc5Dk",
  authDomain: "lernopus.firebaseapp.com",
  databaseURL: "https://lernopus.firebaseio.com",
  projectId: "lernopus",
  storageBucket: "lernopus.appspot.com",
  messagingSenderId: "118366303004",
  appId: "1:118366303004:web:ff0caa21e206d50ab0c0d9",
  measurementId: "G-X0FZMR22WY"
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
