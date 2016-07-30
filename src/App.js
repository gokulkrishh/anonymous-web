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
import _ from 'lodash';

const config = require("./config.json");
firebase.initializeApp(config);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.initializeChat = this.initializeChat.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.showSpinner = this.showSpinner.bind(this);
    this.state = {
      chats: [],
      chatId: window.navigator.userAgent.replace(/\D+/g, ''),
      chatName: moment.utc(new Date).valueOf().toString().slice(0, 8),
      chatUrl: "",
      otherUserId: null,
      status: "connecting..",
      showModal: false,
      showSpinner: false
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
      this.initializeChat();
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
    const {chatId, chatUrl, otherUserId} = this.state;
    this.firebaseDB = firebase.database().ref("chats");
    this.firebaseDB.child("chat_" + chatId).remove();
    if (chatUrl) {
      this.firebaseDB.child("chat_" + chatUrl).remove();
    }
    if (otherUserId) {
      this.firebaseDB.child("chat_" + otherUserId).remove();
    }
    localStorage.removeItem("chat");
  }

  initializeChat() {
    const {chatId, chatName} = this.state;
    this.onReloadCloseChat();
    this.showSpinner(true);
    this.updateStatus("connecting..");
    this.firebaseChatRef = firebase.database().ref("chats");
    this.firebaseQueueRef = firebase.database().ref("chats/chat_" + chatId + "/queue");
    this.addToQueue();
  }

  checkForOpenConnection() {
    const {chatId, chatName} = this.state;
    this.firebaseChatRef.on("value", (snapshot) => {
      var chats = snapshot.val();
      for (let snap in chats) {
        for (let key in chats[snap]["queue"]) {
          var queue = chats[snap]["queue"][key];
          if (queue.id !== chatId) {
            var chatName = this.getChatHash(queue.id, chatId);
            if (snapshot.child(chatName).exists()) {
              this.setState({
                otherUserId: queue.id,
                chatUrl: chatName,
                status: "online"
              });
            }
            else {
              this.getChatHash(queue.id, chatId);
              this.setState({
                otherUserId: queue.id,
                chatUrl: chatName,
                status: "online"
              });
            }
            this.showSpinner(false);
          }
        }
      }
    });
  }

  checkForDisconnection() {
    const {chatId, otherUserId, status} = this.state;
    var deletedChatName, deletedUserId, deletedOtherUserId;

    this.firebaseChatRef = firebase.database().ref("chats");
    this.firebaseChatRef.on('child_removed', (oldChildSnapshot) => {
      let oldChildArray = oldChildSnapshot.key.split("_");
      if (oldChildArray.length > 1) {
        [deletedChatName, deletedUserId, deletedOtherUserId] = oldChildArray;
      }

      console.log("status -->", status);

      if (status === "online") {
        if (deletedUserId === otherUserId || deletedUserId === chatId) {
          console.log("true 1");
          this.closeConnection();
        }
        else if (deletedOtherUserId === otherUserId || deletedOtherUserId === chatId) {
          console.log("true 2");
          this.closeConnection();
        }
      }
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
    const {chats, chatId, chatName} = this.state;
    this.firebaseQueueRef.push({
      id: chatId,
      isQueued: true
    });

    this.firebaseQueueRef.on('child_added', (snapshot) => {
      this.storeChat();
      this.setState({
        status: "connecting.."
      });
    });

    this.checkForOpenConnection();
    // this.checkForDisconnection();
  }

  updateStatus(status) {
    this.setState({
      showModal: false,
      status: status
    });

    if (status === "disconnected") {
      setTimeout(() => {
        this.showSpinner(true);
        this.initializeChat();
      }, 1000);
    }

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
          updateStatusCallback={this.updateStatus}
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
