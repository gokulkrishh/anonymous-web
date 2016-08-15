import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import moment from 'moment';
import firebase from 'firebase';
import ReactFireMixin from 'reactfire';

export default class Message extends Component {
  constructor(props) {
    super(props);
    /*eslint new-parens: 0*/
    this.chatName = moment.utc(new Date).valueOf().toString().slice(0, 8);
    this.chatId = window.navigator.userAgent.replace(/\D+/g, '');
    this.state = {
      chatId: this.chatId,
      chatName: this.chatName,
      chats: [],
      otherUserID: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.otherUserID && nextProps.chatURL) {
      this.firebaseRef = firebase.database().ref("chats/" + nextProps.chatURL + "/messages");
      if (typeof this.firebaseRefs["chats"] === 'undefined') {
        this.bindAsArray(this.firebaseRef, "chats");
      }
      this.setState({
        otherUserID: nextProps.otherUserID
      });
    }
  }

  componentWillUnmount() {
    this.unbind("chats");
    this.firebaseRef.off();
  }

  render() {
    const {chats} = this.state;
    const statusIcon = "done";
    const chatMessages = chats.map((chat, index) => {
      let timeStamp = moment(chat.timestamp).format('LT');
      return(
        <div key={index}>
          <p className={this.state.chatId === chat.id ? "user" : "self"} key={index}>
            <span className="msg">
              {chat.message}
              <span className="timestamp">
                {timeStamp}
                <i className={"material-icons"}>{statusIcon}</i>
              </span>
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
