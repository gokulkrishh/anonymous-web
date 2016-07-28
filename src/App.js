import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import Message from './Message';
import Header from './Header';
import Modal from './Modal';
import Input from './Input';

const config = require("./config.json");
firebase.initializeApp(config);

export default class App extends Component {
  constructor() {
    super();
    this.handleClose = this.handleClose.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.initializeChat = this.initializeChat.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.state = {
      chats: [],
      chatName: window.navigator.userAgent.replace(/\D+/g, ''),
      status: "connecting..",
      showModal: false
    };
  }

  componentWillMount() {
    this.initializeChat();
    window.addEventListener("offline", () => {
      this.setState({
        status: "disconnected"
      });
    });
    window.addEventListener("online", () => {
      this.setState({
        status: "connected"
      });
    });
  }

  initializeChat() {
    const {chatName} = this.state;
    this.updateStatus("connecting..");
    this.firebaseRef = firebase.database().ref("chat" + chatName + "/messages");
    this.firebaseQueueRef = firebase.database().ref("chat" + chatName + "/queue/" + chatName);
    this.addToQueue();
  }

  addToQueue() {
    const {chatName} = this.state;
    this.firebaseQueueRef.push({
      isQueued: true
    });

    this.firebaseQueueRef.on('child_added', (snapshot) => {
      this.storeChat();
      this.setState({
        status: "connected"
      });
    });
  }

  updateStatus(status) {
    this.setState({
      showModal: false,
      status: status
    });

    if (status === "disconnected") {
      setTimeout(() => {
        this.initializeChat();
      }, 1000);
    }

  }

  storeChat() {
    const {chatName, id} = this.state;
    var chatData = {
      "chatName": chatName,
      "id": id
    };
    localStorage.setItem("chat", JSON.stringify(chatData));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  handleClose() {
    this.setState({
      showModal: true
    });
  }

  render() {
    const {status, showModal} = this.state;
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Header
          status={status}
          closeCallback={this.handleClose}
        />

        <Modal
          showModal={showModal}
          updateStatusCallback={this.updateStatus}
        />

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
