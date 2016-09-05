import React, {Component} from 'react';
import logo from './logo.png';
import facebook from './facebook.svg';
import twitter from './twitter.svg';
import github from './github.svg';


export default class Intro extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.hideIntroCallback();
  }

  render() {
    const {show} = this.props;
    return(
      <div>
      {
      show && (<div className="intro__screen">
        <div className="intro__screen-close">
          <label onClick={this.handleClose}>
            <i className="material-icons noselect custom-icon-close">&#xE14C;</i>
          </label>
        </div>
        <div className="intro__screen-container">
          <div className="intro__screen-logo">
            <img alt="logo" src={logo} className="noselect"/>
            <h2 className="custom-title noselect">Anonymous</h2>
            <p className="noselect">Chat with strangers randomly.</p>
          </div>

          <div className="intro__screen-social">
            <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fanonymouschat.in" target="_blank" rel="noopener" aria-label="Share on Facebook">
              <img alt="facebook" src={facebook} />
            </a>
            <a href="https://twitter.com/intent/tweet?text=A%20react%20powered%20progressive%20web%20(chat)%20application%20https%3A%2F%2Fanonymouschat.in%20%23pwa%20%23reactjs%20via%20%40gokul_i" target="_blank" rel="noopener" aria-label="Share on Twitter">
              <img alt="twitter" src={twitter} />
            </a>
            <a href="https://github.com/gokulkrishh/anonymous-web" target="_blank" rel="noopener">
              <img className="github-logo" alt="github" src={github} />
            </a>
          </div>
        </div>

        <div className="intro__screen-footer">
          <p className="noselect">Built with <span>♥</span></p>
        </div>
      </div>)
      }
      </div>
    );
  }
};
