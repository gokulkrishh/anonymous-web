import { h, Component } from "preact";
import database from "firebase/database";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import timeago from "timeago.js";
import read from "./read.png";

export default class Messages extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      chats: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.otherUserId && nextProps.chatURL) {
      this.firebaseRef = database().ref(`chats/${nextProps.chatURL}/messages`);
      if (typeof this.firebaseRefs["chats"] === "undefined") {
        this.bindAsArray(this.firebaseRef, "chats");
      }
    }
  }

  render() {
    const {chats} = this.state;
    const {userId} = this.props;
    const chatMessages = chats.map((chat, index) => {
      console.log(chat.timestamp)
      return(
        <div key={index}>
          <p className={userId === chat.id ? "user" : "self"} key={index}>
            <span className="msg">
              {chat.message}
              <span className="timestamp">
                {timeago().format(chat.timestamp)}
                <img src={read} alt="read"/>
              </span>
            </span>
          </p>
        </div>
      );
    });
    return(
      <div className="message__container">
        {chatMessages}
      </div>
    );
  }
}

reactMixin(Messages.prototype, reactFire);
