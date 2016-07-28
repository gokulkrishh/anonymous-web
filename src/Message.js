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
    const chatData = JSON.parse(localStorage.getItem("chat"));
    this.firebaseRef = firebase.database().ref("chat" + chatData.chatName + "/messages");
    this.bindAsArray(this.firebaseRef, "chats");
  }

  componentWillUnmount() {
    this.unbind("chats");
    this.firebaseRef.off();
  }

  render() {
    const chatMessages = this.state.chats.map((chat, index) => {
      const timeStamp = new Date(chat.timestamp).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
      return(
        <div key={index}>
          <p className={this.state.id === chat.id ? "user" : "self"} key={index}>
            <span className="msg">{chat.message}</span>
            <span className="timestamp">
              {timeStamp}
              <i className="material-icons">done</i>
            </span>
          </p>
        </div>
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
