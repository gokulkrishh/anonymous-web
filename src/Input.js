import React, { Component } from 'react';

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.scrollToEnd = this.scrollToEnd.bind(this);
    this.state = {
      id: window.navigator.userAgent.replace(/\D+/g, '')
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref("chats");
  }

  handleSubmit(event) {
    var userInput = document.querySelector("input");

    if (!userInput.value.replace(/^\s+|\s+$/g, "")) return false;

    this.firebaseRef.push({
      id: this.state.id,
      message: userInput.value,
      timestamp: Date.now()
    });

    userInput.value = "";
    this.scrollToEnd();
  }

  scrollToEnd() {
    var target = document.querySelector('.page-content');
    var scrollHeight = target.scrollHeight;
    target.scrollTo(0, scrollHeight);
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
        <div className="mdl-textfield mdl-js-textfield">
          <input type="text" placeholder="Say hi to stranger.." onKeyPress={this.handleKeyPress}/>
          <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick={this.handleSubmit}>
            <i className="material-icons">send</i>
          </button>
        </div>
        <div className="message-container-overlay"></div>
      </div>
    );
  }
}
