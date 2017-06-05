import { h, Component } from 'preact';
import firebase from 'firebase';
import send from './send.png';

export default class Input extends Component {
  render() {
    return(
      <div className="app__input-container">
        <div className="app__input">
          <input placeholder="Type your message.."/>
          <button onClick={this.handleSubmit}>
            <img src={send} className="noselect" />
          </button>
        </div>
      </div>
    );
  }
}
