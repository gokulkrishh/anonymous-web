import React, { Component } from 'react';
import firebase from 'firebase';
import moment from 'moment';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.scrollToEnd = this.scrollToEnd.bind(this);
    this.firebaseRef = null;
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
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  render() {
    return(
      <div>
        <div className="message-container-overlay top"></div>
        <div className="mdl-textfield mdl-js-textfield">
          <input type="text" placeholder="Type your message.." onKeyPress={this.handleKeyPress} autoFocus="true"/>
          <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick={this.handleSubmit}>
            <i className="material-icons">send</i>
          </button>
        </div>
        <div className="message-container-overlay"></div>
      </div>
    );
  }
}
