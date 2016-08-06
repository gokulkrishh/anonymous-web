import React, { Component } from 'react';

export default class AppDrawer extends Component {
  render() {
    return (
      <div className="mdl-layout__drawer">
        <span className="mdl-layout-title">Anonymous Chat</span>
        <nav className="mdl-navigation">
          <a className="mdl-navigation__link" href="https://github.com/gokulkrishh/anonymous-web">
            <i className="material-icons">info_outline</i>
            <span>Source</span>
          </a>
          <a className="mdl-navigation__link" href="https://github.com/gokulkrishh/anonymous-web/issues/new">
            <i className="material-icons">bug_report</i>
            <span>Bug report</span>
          </a>
        </nav>
      </div>
    );
  }
};
