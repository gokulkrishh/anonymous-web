import { h, Component } from 'preact';

export default class Spinner extends Component {
  static defaultProps = {
    showSpinner: false,
    spinnerText: "Looking for user..."
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
