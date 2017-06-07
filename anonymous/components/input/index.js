import { h, Component } from 'preact';
import {database} from 'firebase';
import autoBind from "react-autobind";
import send from './send.png';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.firebaseDB = database();
    this.currentChat = null;
    this.timeoutRef = null;
    this.userInput = null;
    this.chatMessageRef = null;
    autoBind(this);
  }

  componentDidMount() {
    this.userInput = document.querySelector("input");
  }

  componentWillReceiveProps(nextProps) {
    const {chatURL, userId} = this.props;
    if (nextProps.chatURL !== chatURL) {
      this.chatMessageRef = this.firebaseDB.ref(`chats/${nextProps.chatURL}/messages`);
    }
  }

  clearTimeOut() {
    clearTimeout(this.timeoutRef);
  }

  handleKeyPress() {
    this.clearTimeOut();
    const {chatURL, userId} = this.props;
    this.currentChat = this.firebaseDB.ref(`chats/${chatURL}/${userId}`);
    if (event.keyCode === 13) {
      this.currentChat.update({
        typing: false
      }, () => {
        this.sendMsg();
      });
    }
    else {
      this.currentChat.update({
        typing: true
      });
    }
  }

  handleKeyUp() {
    this.clearTimeOut();
    this.timeoutRef = setTimeout(() => {
      this.currentChat.update({
        typing: false
      });
    }, 300);
  }

  sendMsg() {
    console.log(this.userInput.value);
    if (!this.userInput.value.replace(/^\s+|\s+$/g, "") || !this.chatMessageRef) {
      return false;
    }
    this.chatMessageRef.push({
      id: this.props.userId,
      message: this.userInput.value,
      timestamp: new Date()
    });
    this.userInput.value = "";
  }

  render() {
    return(
      <div className="app__input-container">
        <div className="app__input">
          <input placeholder="Type your message.." onKeyDown={this.handleKeyPress} onKeyUp={this.handleKeyUp}/>
          <button onClick={this.sendMsg}>
            <img src={send} alt="Send Message"/>
          </button>
        </div>
      </div>
    );
  }
}
