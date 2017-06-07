import './style';
import { h } from 'preact';
import Home from './components/home';
import firebase from 'firebase/app';

const testEnv = {
  "apiKey": "AIzaSyB3X0VnbRACigiD1G1VcO0F8GFImzFIzdc",
  "authDomain": "test-anonymous-bcba0.firebaseapp.com",
  "databaseURL": "https://test-anonymous-bcba0.firebaseio.com",
  "projectId": "test-anonymous-bcba0",
  "storageBucket": ""
};

firebase.initializeApp(testEnv);

export default () => (
	<div id="root">
    <Home />
	</div>
);
