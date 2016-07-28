import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import Message from './Message';
import Header from './Header';
import Input from './Input';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDmTL4vKfTVOVD6Nd5Ye7fEmDtxY9eeDio",
  authDomain: "anonymous-chat-26137.firebaseapp.com",
  databaseURL: "https://anonymous-chat-26137.firebaseio.com",
  storageBucket: "anonymous-chat-26137.appspot.com",
};

firebase.initializeApp(config);

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      chats: [],
      status: "connecting..",
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref("child_added").on('value', function(snapshot) {
      this.setState({
        status: "connected"
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  render() {
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Header status={this.state.status}/>
        <main className="mdl-layout__content">
          <div className="page-content">
            <Message />
          </div>
          <Input />
        </main>
      </div>
    );
  }
}

reactMixin(App.prototype, ReactFireMixin)
