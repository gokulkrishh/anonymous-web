import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import moment from 'moment';
import firebase from 'firebase';
import ReactFireMixin from 'reactfire';

export default class Message extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chatId: window.navigator.userAgent.replace(/\D+/g, ''),
      chatName: moment.utc(new Date).valueOf().toString().slice(0, 8),
      chats: [],
      otherUserId: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const {chats} = this.state;
    if (nextProps.otherUserId && nextProps.chatUrl) {
      this.firebaseRef = firebase.database().ref("chats/chat_" + nextProps.chatUrl + "/messages");
      if (typeof this.firebaseRefs["chats"] === 'undefined') {
        this.bindAsArray(this.firebaseRef, "chats");
      }
      this.setState({
        otherUserId: nextProps.otherUserId
      });
    }
  }

  componentWillUnmount() {
    this.unbind("chats");
    this.firebaseRef.off();
  }

  render() {
    const {chats} = this.state;
    const chatMessages = chats.map((chat, index) => {
      const timeStamp = moment(chat.timestamp).format('LT');
      return(
        <div key={index}>
          <p className={this.state.chatId === chat.id ? "user" : "self"} key={index}>
            <span className="msg">{chat.message}</span>
            <span className="timestamp">
              {timeStamp}
              <i className="material-icons">done_all</i>
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
