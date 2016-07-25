import React, { Component } from 'react';
import Message from './Message';

export default class App extends Component {
  render() {
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header is-casting-shadow">
          <div className="mdl-layout__header-row custom-header">
            <i className="material-icons noselect custom-icon-logo">&#xE0B7;</i>
            <span className="mdl-layout-title custom-title noselect">Anonymous</span>
            <span className="custom-status noselect">disconnected</span>
            <div className="mdl-layout-spacer"></div>
            <div className="mdl-textfield--align-right">
              <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="fixed-header-drawer-exp">
               <i className="material-icons noselect custom-icon-close">&#xE14C;</i>
             </label>
            </div>
          </div>
        </header>

        <main className="mdl-layout__content">
          <div className="page-content">
            <Message />
          </div>
          <div className="mdl-textfield mdl-js-textfield">
            <input type="text" placeholder="Type your message..." id="sendMsg"/>
            <i className="material-icons custom-icon-send">send</i>
          </div>
          <div className="message-container-overlay"></div>
        </main>
      </div>
    );
  }
}
