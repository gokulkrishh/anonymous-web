import React, { Component } from "react";
import reactMixin from "react-mixin";
import Message from "./Message";
import Header from "./Header";
import Modal from "./Modal";
import Input from "./Input";
import Spinner from "./Spinner";
import moment from "moment";
var firebase = require("firebase");
import ReactFireMixin from "reactfire";

const config = require("./config.json");
firebase.initializeApp(config);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.closeChat = this.closeChat.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.initializeChat = this.initializeChat.bind(this);
    this.showSpinner = this.showSpinner.bind(this);
    this.offlineEvent = this.offlineEvent.bind(this);
    this.firebaseChatRef = null;
    this.addChat = null;
    /*eslint new-parens: 0*/
    this.chatName = moment.utc(new Date).valueOf().toString().slice(0, 8);
    this.chatId = window.navigator.userAgent.replace(/\D+/g, "");
    this.state = {
      chats: [],
      chatId: this.chatId,
      chatName: this.chatName,
      chatUrl: "",
      otherUserId: null,
      showModal: false,
      showSpinner: true
    };
  }

  componentWillMount() {
    this.offlineEvent();
    this.onReloadCloseChat();
    this.initializeChat();
  }

  offlineEvent() {
    window.addEventListener("offline", () => {
      this.setState({
        status: "no internet"
      });
    });

    window.addEventListener("online", () => {
      if (this.state.chatUrl) {
        this.setState({
          status: "online"
        });
      }
      else {
        this.setState({
          status: "connected"
        });
      }
    });
  }

  onReloadCloseChat() {
    window.onbeforebind = () => {
      this.removeConnection();
    };
  }

  initializeChat() {
    const {chatId} = this.state;
    this.setState({
      status: "connecting..",
      showModal: false,
      showSpinner: true
    });
    this.firebaseChatRef = firebase.database().ref("chats");
    this.firebaseQueueRef = firebase.database().ref("chats/chat_" + chatId + "/queue");
    this.addToQueue();
  }

  closeConnection() {
    this.removeConnection();
    this.initializeChat();
  }

  removeConnection() {
    const {chatUrl, chatId} = this.state;
    firebase.database().ref("chats/chat_" + chatId).remove();
    localStorage.removeItem("chat");
    if (chatUrl) {
      firebase.database().ref("chats/chat_" + chatUrl).remove();
    }
  }

  getQueue(queue, queueKey) {
    return (queue[queueKey[0]] && queue[queueKey[0]].isQueued);
  }

  removeQueue() {
    const {chatId} = this.state;
    this.firebaseQueueRef.update({
      id: chatId,
      isQueued: false
    });
  }

  addChatConnection(chatUrl) {
    this.addChat = firebase.database().ref("chats/chat_" + chatUrl);
    this.addChat.update({
      connection: true
    });
    this.listenToTyping();
  }

  checkForOpenConnection() {
    const {chatId} = this.state;
    const myChatId = "chat_" + chatId;
    this.firebaseChatRef.on("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.key !== myChatId && !this.state.chatUrl) {
          var queue = childSnapshot.val().queue;
          if (queue && queue.isQueued) {
            var otherUserId = queue.id;
            var chatUrl = this.getChatHash(otherUserId, chatId);
            if (!snapshot.child(chatUrl).exists()) {
              this.removeQueue();
              this.addChatConnection(chatUrl);
              this.setState({
                otherUserId: otherUserId,
                chatUrl: chatUrl,
                status: "online",
                showSpinner: false
              });
              this.checkForDisconnection(chatUrl);
            }
          }
        }
      });
    });
  }

  checkForDisconnection() {
    const {chatUrl} = this.state;
    firebase.database().ref("chats").on("child_removed", (oldChildSnapshot) => {
      if ("chat_" + chatUrl === oldChildSnapshot.key) {
        this.closeConnection();
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
    const {chatId} = this.state;
    this.firebaseQueueRef.update({
      id: chatId,
      isQueued: true
    });

    this.firebaseQueueRef.on("child_added", (snapshot) => {
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
    this.removeConnection();
    this.firebaseChatRef.off();
  }

  hideModal() {
    this.setState({
      showModal: false
    });
  }

  closeChat() {
    this.setState({
      showModal: true
    });
  }

  listenToTyping() {
    const {chatUrl, otherUserId} = this.state;
    firebase.database().ref(`chats/chat_${chatUrl}/${otherUserId}`).on("value", (snapshot) => {
      var snapshotData = snapshot.val();
      if (snapshotData && snapshotData.typing) {
        this.setState({
          status: 'typing...'
        });
      }
      else {
        this.setState({
          status: 'online'
        });
      }
    });
  }

  render() {
    const {chatUrl, chatId, otherUserId, status, showModal, showSpinner, spinnerText} = this.state;
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Header
          status={status}
          closeCallback={this.closeChat}
        />

        <Modal
          chatUrl={chatUrl}
          otherUserId={otherUserId}
          showModal={showModal}
          hideModal={this.hideModal}
        />

        <Spinner showSpinner={showSpinner} spinnerText={spinnerText}/>

        <main className="mdl-layout__content">
          <div className="page-content">
            <Message
              chatUrl={chatUrl}
              otherUserId={otherUserId}
            />
          </div>
          <Input
            chatId={chatId}
            chatUrl={chatUrl}
            otherUserId={otherUserId}
            status={status}
          />
        </main>
      </div>
    );
  }
}

reactMixin(App.prototype, ReactFireMixin)
