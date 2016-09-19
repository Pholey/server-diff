import React from "react"
import D3 from "./d3";
import View from "../stores/view";
import Upguard from "../stores/upguard";
import {observer} from "mobx-react";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import CircularProgress from 'material-ui/CircularProgress';
import {AppBar} from "material-ui";
import {autobind} from "core-decorators";

@observer
export default class Site extends React.Component {
  state = {
    dWidth: View.getBrowserWidth() - View.getDiameter(),
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  async componentWillMount() {
    // Populate our nodes for selection
    await Upguard.getNodes();
  }

  render() {
    const style = {
      width: View.state.get("d3Loaded") ? (this.state.dWidth + "px") : "100%",
    }

    const doneLoading = !Upguard.state.get("loading");

    let loaderCn = "quote-loader an-visible";
    if (doneLoading) {
      loaderCn = "quote-loader an-hidden";
    }

    return (
      <div className="site">
        {View.state.get("ready") && <D3 />}
        <div className="site-wrapper" style={style}>
          {this.props.children}
        </div>
        <div className={loaderCn}>
          <div className="copy">
            <span className="quote">"The best preparation for tomorrow is doing your best today."</span>
            <span className="author"> - H. Jackson Brown, Jr.</span>
          </div>
          <CircularProgress size={2} />
        </div>
      </div>
    );
  }
}
