import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import Message from './Message';
import Header from './Header';
import Modal from './Modal';
import Input from './Input';
import Spinner from './Spinner';
import moment from 'moment';
var firebase = require('firebase');
import ReactFireMixin from 'reactfire';

const config = require("./config.json");
firebase.initializeApp(config);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.initializeChat = this.initializeChat.bind(this);
    this.showSpinner = this.showSpinner.bind(this);
    this.offlineEvent = this.offlineEvent.bind(this);
     /*eslint new-parens: 0*/
    this.chatName = moment.utc(new Date).valueOf().toString().slice(0, 8);
    this.chatId = window.navigator.userAgent.replace(/\D+/g, '');
    this.state = {
      chats: [],
      chatId: this.chatId,
      chatName: this.chatName,
      chatUrl: "",
      otherUserId: null,
      status: "connecting..",
      showModal: false,
      showSpinner: false
    };
  }

  componentWillMount() {
    this.initializeChat();
    this.offlineEvent();
  }

  offlineEvent() {
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

  onReloadCloseChat() {
    window.onbeforeunload = () => {
      this.closeConnection();
    };
  }

  closeConnection() {
    const {chatUrl} = this.state;
    if (chatUrl) {
      this.firebaseDB = firebase.database().ref("chats");
      firebase.database().ref("chats/chat_" + chatUrl).remove();
      this.initializeChat();
    }
    localStorage.removeItem("chat");
  }

  initializeChat() {
    const {chatId} = this.state;
    this.onReloadCloseChat();
    this.setState({
      status: "connecting..",
      showSpinner: true,
      showModal: false
    });
    this.firebaseChatRef = firebase.database().ref("chats");
    this.firebaseQueueRef = firebase.database().ref("chats/chat_" + chatId + "/queue");
    this.addToQueue();
  }

  checkForOpenConnection() {
    const {chatId} = this.state;
    this.firebaseChatRef.on("value", (snapshot) => {
      var chats = snapshot.val();
      for (let snap in chats) {
        if (chats.hasOwnProperty(snap)) {
          for (let key in chats[snap]["queue"]) {
            if (chats[snap]["queue"].hasOwnProperty(key)) {
              var queue = chats[snap]["queue"][key];
              if (queue.id !== chatId) {
                var chatName = this.getChatHash(queue.id, chatId);
                if (snapshot.child(chatName).exists()) {
                  this.setState({
                    otherUserId: queue.id,
                    chatUrl: chatName,
                    status: "online",
                    showSpinner: false
                  });
                  this.checkForDisconnection();
                }
                else {
                  this.getChatHash(queue.id, chatId);
                  this.setState({
                    otherUserId: queue.id,
                    chatUrl: chatName,
                    status: "online",
                    showSpinner: false
                  });
                  this.checkForDisconnection();
                }
              }
            }
          }
        }
      }
    });
  }

  isUserIdPresent(oldChildArray) {
    const {chatId, otherUserId} = this.state;
    oldChildArray.shift();
    for (var i = 0; i < oldChildArray.length; i++) {
      if (oldChildArray[i] === chatId || oldChildArray[i] === otherUserId) {
        this.initializeChat();
        return false;
      }
    }
  }

  checkForDisconnection() {
    firebase.database().ref("chats").on('child_removed', (oldChildSnapshot) => {
      this.isUserIdPresent(oldChildSnapshot.key.split("_"));
    });
  }

  getChatHash(otherUserId, userId) {
    if (otherUserId > userId) {
      return otherUserId + "_" + userId;
    }
    else {
      return userId + "_" + otherUserId;
    }
  }

  showSpinner(show) {
    this.setState({
      showSpinner: show
    });
  }

  addToQueue() {
    const {chatId} = this.state;
    this.firebaseQueueRef.push({
      id: chatId,
      isQueued: true
    });

    this.firebaseQueueRef.on('child_added', (snapshot) => {
      this.storeChat();
    });
    this.checkForOpenConnection();
  }

  storeChat() {
    const {chatId, chatName} = this.state;
    var chatData = {
      "chatName": chatName,
      "chatId": chatId
    };
    localStorage.setItem("chat", JSON.stringify(chatData));
  }

  componentWillUnmount() {
    this.firebaseChatRef.off();
  }

  handleClose() {
    this.setState({
      showModal: true
    });
  }

  render() {
    const {chatUrl, otherUserId, status, showModal, showSpinner} = this.state;

    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Header
          status={status}
          closeCallback={this.handleClose}
        />

        <Modal
          chatUrl={chatUrl}
          otherUserId={otherUserId}
          showModal={showModal}
        />

        <Spinner showSpinner={showSpinner}/>

        <main className="mdl-layout__content">
          <div className="page-content">
            <Message
              chatUrl={chatUrl}
              otherUserId={otherUserId}
            />
          </div>
          <Input
            chatUrl={chatUrl}
            otherUserId={otherUserId}
          />
        </main>
      </div>
    );
  }
}

reactMixin(App.prototype, ReactFireMixin)
