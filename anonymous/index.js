import './style';
import { h } from 'preact';
import Home from './components/home';
import config from './config';
import firebase from 'firebase/app';
firebase.initializeApp(config.test);

export default () => (
	<div id="root">
    <Home />
	</div>
);
