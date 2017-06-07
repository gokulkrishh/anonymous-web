import { h, Component } from 'preact';
import {database} from 'firebase';
import reactMixin from 'react-mixin';
import reactFire from "reactfire";

export default class Messages extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      chats: []
    }
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
      return(
        <div key={index}>
          <p className={userId === chat.id ? "user" : "self"} key={index}>
            <span className="msg">
              {chat.message}
              <span className="timestamp">
                {chat.timestamp}
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
