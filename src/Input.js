import React, { Component } from 'react';
import firebase from 'firebase';
import moment from 'moment';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.scrollToEnd = this.scrollToEnd.bind(this);
    this.firebaseRef = null;
    this.addUserToChat = null;
    this.defaultInterval = 250;
    this.timeoutRef = null;
    /*eslint new-parens: 0*/
    this.chatId = window.navigator.userAgent.replace(/\D+/g, '');
    this.state = {
      chatId: this.chatId,
      otherUserId: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.otherUserId && nextProps.chatUrl) {
      this.firebaseRef = firebase.database().ref("chats/chat_" + nextProps.chatUrl + "/messages");
    }
  }

  handleSubmit(event) {
    const {status} = this.props;
    var userInput = document.querySelector("input");
    userInput.focus();

    if (!userInput.value.replace(/^\s+|\s+$/g, "") || !this.firebaseRef) {
      return false;
    }

    var msgStatus = (status === "online") ? "online" : "schedule";

    this.firebaseRef.push({
      id: this.state.chatId,
      message: userInput.value,
      timestamp: moment.utc(new Date).valueOf(),
      status: msgStatus
    });

    userInput.value = "";
    this.scrollToEnd();
  }

  scrollToEnd() {
    var target = document.querySelector('.page-content');
    var scrollHeight = target.scrollHeight + 300;
    if (target && target.scrollTo) {
      target.scrollTo(0, scrollHeight);
    }
  }

  handleKeyPress(event) {
    clearTimeout(this.timeoutRef);

    const {chatId, chatUrl} = this.props;

    this.addUserToChat = firebase.database().ref("chats/chat_" + chatUrl + "/" + chatId);

    if (event.key === 'Enter') {
      this.addUserToChat.update({
        typing: false
      });
      this.handleSubmit();
    }
    else {
      this.addUserToChat.update({
        typing: true
      });
    }
  }

  handleKeyUp() {
    clearTimeout(this.timeoutRef);
    this.timeoutRef = setTimeout(() => {
      this.addUserToChat.update({
        typing: false
      });
    }, this.defaultInterval);
  }

  componentWillUnmount() {
    this.addUserToChat.off();
    this.firebaseRef.off();
  }

  render() {
    return(
      <div>
        <div className="message-container-overlay top"></div>
        <div className="mdl-textfield mdl-js-textfield">
          <input type="text" placeholder="Type your message.." onKeyDown={this.handleKeyPress} onKeyUp={this.handleKeyUp}/>
          <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick={this.handleSubmit}>
            <i className="material-icons">send</i>
          </button>
        </div>
        <div className="message-container-overlay"></div>
      </div>
    );
  }
}
