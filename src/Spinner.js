import React, { Component } from 'react';

export default class Spinner extends Component {
  static defaultProps = {
    showSpinner: false,
    spinnerText: "Looking for anonymous..."
  }

  render() {
    const {showSpinner, spinnerText} = this.props;
    return (
      <div className={showSpinner ? "spinner__container" : "spinner__container none"}>
        <p className="noselect">{spinnerText}</p>
      </div>
    );
  }
};
