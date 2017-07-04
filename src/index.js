import React from 'react';
import ReactDOM from 'react-dom';

import firebase from 'firebase';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCP5-PhH1xFncVWW7RhbJmoI8_xOLBkk5U",
    authDomain: "pseudogram-88cc2.firebaseapp.com",
    databaseURL: "https://pseudogram-88cc2.firebaseio.com",
    projectId: "pseudogram-88cc2",
    storageBucket: "pseudogram-88cc2.appspot.com",
    messagingSenderId: "99027593022"
};

firebase.initializeApp(config);


ReactDOM.render(
	<App />, 
	document.getElementById('root')
);
registerServiceWorker();
