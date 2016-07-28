import React, { Component } from 'react';
import reactMixin from 'react-mixin';

export default class Message extends Component {
  constructor() {
    super()
    this.state = {
      id: window.navigator.userAgent.replace(/\D+/g, '')
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref("chats");
    this.bindAsArray(this.firebaseRef, "chats");
  }

  componentWillUnmount() {
    this.unbind("chats");
    this.firebaseRef.off();
  }

  render() {
    const chatMessages = this.state.chats.map((chat, index) => {
      return(
        <p className={this.state.id === chat.id ? "user" : "self"} key={index}>{chat.message}</p>
      );
    });
    return(
      <div className="message-container">
        {chatMessages}
      </div>
    );
  }
}

reactMixin(Message.prototype, ReactFireMixin);
