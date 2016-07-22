import React, { Component } from 'react';

export default class App extends Component {
  render() {
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header is-casting-shadow">
          <div className="mdl-layout__header-row custom-header">
            <span className="mdl-layout-title custom-title noselect">Anonymous</span>
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
            <div className="mdl-textfield mdl-js-textfield">
              <input className="mdl-textfield__input" type="text" id="msg" />
              <label className="mdl-textfield__label" htmlFor="msg">Type your message...</label>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
