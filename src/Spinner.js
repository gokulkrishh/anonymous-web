import React, { Component } from 'react';

export default class Spinner extends Component {
  static defaultProps = {
    showSpinner: false
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {showSpinner} = this.props;
    return (
      <div>
        {
          showSpinner && (
            <div className="spinner-container">
              <div className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
            </div>
          )
        }
      </div>
    );
  }
};
