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
    this.userID = window.navigator.userAgent.replace(/\D+/g, '');
    this.state = {
      userID: this.userID,
      otherUserID: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.otherUserID && nextProps.chatURL) {
      this.firebaseRef = firebase.database().ref("chats/" + nextProps.chatURL + "/messages");
    }
  }

  handleSubmit(event) {
    var userInput = document.querySelector("input");
    userInput.focus();

    if (!userInput.value.replace(/^\s+|\s+$/g, "") || !this.firebaseRef) {
      return false;
    }

    this.firebaseRef.push({
      id: this.state.userID,
      message: userInput.value,
      timestamp: moment.utc(new Date).valueOf()
    });

    userInput.value = "";
    setTimeout(() => {
      this.scrollToEnd();
    }, 0);
  }

  scrollToEnd() {
    var target = document.querySelector('.message-container');
    var lastElement = target.children[target.childElementCount - 1];
    if (lastElement) {
      lastElement.scrollIntoView();
    }
  }

  handleKeyPress(event) {
    clearTimeout(this.timeoutRef);

    const {userID, chatURL} = this.props;

    this.addUserToChat = firebase.database().ref("chats/" + chatURL + "/" + userID);

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

  render() {
    return(
      <div>
        <div className="message-container-overlay top"></div>
        <div className="user-input-container">
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
