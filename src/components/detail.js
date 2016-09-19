import _ from "lodash";
import React from "react";
import {
  AppBar,
  Subheader, List,
  ListItem, Divider,
  Avatar, Paper
} from "material-ui";

import Infinite from "react-infinite";
import FileFolder from "material-ui/svg-icons/file/folder";
import PlusOne from "material-ui/svg-icons/social/plus-one";
import CompareArrows from "material-ui/svg-icons/action/compare-arrows";
import ModeEdit from "material-ui/svg-icons/editor/mode-edit";
import memoize from "memoize-decorator";
import Delete from "material-ui/svg-icons/action/delete";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import FontAwesome from "react-fontawesome";
import View from "../stores/view";
import Data from "../stores/data";
import Upguard from "../stores/upguard";
import {autobind} from "core-decorators";
import {observer} from "mobx-react";
import CircularProgress from 'material-ui/CircularProgress';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

function Title({a, b}) {
  return (
    <div className="title-container">
      <div className="name">
        <div className="bubble a">A</div>
        <span>{a}</span>
      </div>
      <FontAwesome name="fa-clock"/>
      <div className="name">
        <span>{b}</span>
        <div className="bubble b">B</div>
      </div>
    </div>
  )
}

function Menu({aID, bID, disabled, onClick = (x => x)}) {
  return (
    <Toolbar>
      <ToolbarGroup firstChild={true}/>
      <ToolbarGroup>
      <ToolbarSeparator />
      <RaisedButton disabled={disabled} onClick={onClick.bind(null, [aID, bID])} label="Diff" primary={true} />
      </ToolbarGroup>
    </Toolbar>
  )
}



function Category(props) {
  const zoom = async () => {
    props.onClick ? props.onClick(props) : null
  }

  return (
    <ListItem
      onClick={zoom}
      leftAvatar={<Avatar icon={<FileFolder />}/>}
      primaryText={_.capitalize(props.name)}
    />
  )
}

function N(props) {
  const diff = props.description.rhs;

  let icon = <PlusOne />;
  let color = "#00E528";
  if (props.inverted) {
    icon = <Delete />
    color = "#FF1300";
  }

  const av = <Avatar style={{backgroundColor: color}} icon={icon}/>
  const descs = _.map(diff, (v, k) => {
    return (
      <ListItem
        key={k}
        leftAvatar={av}
        primaryText={k}
        secondaryText={v}
      />
    )
  });

  return(
    <List>
      {descs}
    </List>
  )
}

function A(props) {
  let {lhs, rhs, kind} = props.description.item;

  if (props.inverted) {
    const t = lhs;
    rhs = lhs;
    lhs = t;
  }

  let message;
  let icon = <ModeEdit />;
  const av = <Avatar style={{backgroundColor: "#FFAE00"}} icon={icon}/>
  switch (kind) {
    case "D":
      message = `${lhs} was removed from ${props.name}`
      break;
    case "N":
      message = `${lhs || rhs} was added to ${props.name}`
    default:
      message = null
  }

  return(
    <ListItem
      leftAvatar={av}
      primaryText={props.name}
      secondaryText={message}
    />
  )
}


function D(props) {
  let diff = props.description.lhs;
  let icon = <Delete />
  let color = "#FF1300";
  let message = "Removed from B"
  if (props.inverted) {
    icon = <PlusOne />
    color = "#00E528"
    message = "Added to B"
  }

  const av = <Avatar style={{backgroundColor: color}} icon={icon}/>
  const descs = _.map(diff, (v, k) => {
    if (_.isObject(v)) {
      v = message;
    }

    return (
      <ListItem
        key={k}
        leftAvatar={av}
        primaryText={k}
        secondaryText={v}
      />
    )
  });

  return(
    <List>
      {descs}
    </List>
  )
}

function E(props) {
  let diff1 = props.description.lhs;
  let diff2 = props.description.rhs;

  if (props.inverted) {
    const t = diff1;
    diff1 = diff2;
    diff2 = t;
  }

  const text = `${diff2} was changed to ${diff1}`
  const av = <Avatar style={{backgroundColor: "#FFAE00"}} icon={<ModeEdit />}/>

  return(
    <List>
      <ListItem
        leftAvatar={av}
        primaryText={props.name}
        secondaryText={text}
      />
    </List>
  )
}


function U(props) {
  return(
    <List>
    </List>
  )
}


@observer
class Diff extends React.Component {
  determineDisplay(prop) {
    const i = View.inverted
    switch (prop.kind) {
      case "N":
        return <N inverted={i} {...prop} />
        break;
      case "D":
        return <D inverted={i} {...prop} />
        break;
      case "E":
        return <E inverted={i} {...prop} />
      case "A":
        return <A inverted={i} {...prop} />
      default:
        return <div></div>
    }
  }

  render() {
    const diff = this.determineDisplay(this.props);

    return (
      <div className="diff-container">
        {diff}
      </div>
    );
  }
}

function Server(props) {
  return (
    <ListItem
      primaryText={props.name}
      onClick={props.onClick.bind(null, props)}
    />
  )
}

@observer
class OverView extends React.Component {
  @autobind
  handleClickForDiff(combination) {
    this.props.onDiff(combination)
  }

  render() {
    const aID = this.props.a ? this.props.a.id : null;
    const bID = this.props.b ? this.props.b.id : null;
    const aDepth = this.props.a ? 3 : 1;
    const bDepth = this.props.b ? 3 : 1;
    const diffable = aDepth === 3 && bDepth === 3;
    const vi = View

    let vStats = diffable ?
        vi.state.get("stats").get(aID + "," + bID)
      : {};

    if (vStats == null) {
      // Get the inverse stats
      vStats = vi.state.get("stats").get(bID + "," + aID) || {}

      if (vStats != null) {
        // Clone + unpack our object as to not mistakenly fire observers
        vStats = {...vStats};

        // We found the inverse calculation, invert the stats
        const {additions, deletions} = vStats;

        vStats.additions = deletions;
        vStats.deletions = additions;
      }
    }



    // If we have selected our nodes before we are done processing the data,
    // vStats will still be null
    const stats = vStats || {};
    const hasStats = vStats["additions"] != null;
    return (
      <div className="overview">
        <div className="icons">
          <div className="cont l">
            <Paper circle zDepth={aDepth} className="lhs">A</Paper>
            <div className="name">{this.props.a ? this.props.a.name : ""}</div>
          </div>
          <CompareArrows className="compare-icon" />
          <div className="cont">
            <Paper circle zDepth={bDepth} className="rhs">B</Paper>
            <div className="name">{this.props.b ? this.props.b.name : ""}</div>
          </div>
        </div>
        <Menu
          disabled={!diffable || !hasStats}
          aID={aID}
          bID={bID}
          onClick={this.handleClickForDiff}
        />
        <Subheader>Overview</Subheader>
        {hasStats &&
          <div>
            <ListItem
              primaryText={"Items removed on B: " + stats.deletions}
            />
            <ListItem
              primaryText={"Items added on B: " + stats.additions}
            />
            <ListItem
            >
              <span>Items changed on B: </span>
              <span>{stats.edits}</span>
            </ListItem>
          </div>
        }
        {!hasStats && bID != null &&
          <div className="loader stats">
            <CircularProgress size={1} />
          </div>
        }
      </div>
    )
  }
}

@observer
class ListNode extends React.Component {

  constructor() {
    super();
    this.state = {
      A: null,
      B: null,
      loading: false,
    }
  }

  @autobind
  handleClickForNode(node) {
    const ret = {};
    if (this.state.A) {
      this.state.B == null ? ret["B"] = node : null;
    } else {
      ret["A"] = node
    }

    View.selected.merge(ret);

    this.setState(ret);
  }

  @autobind
  clearSelection() {
    this.setState({A: null, B: null});
  }

  @autobind
  onDiff(combination) {
    this.setState({loading: true})

    setTimeout(x => {
      View.state.set("loading", true);
      Data.setD3(...combination)
    }, 200)
  }

  render() {
    const A = this.state.A || {}
    const B = this.state.B || {}

    if (this.props.nodes.peek == null) return <div />

    // Only show unselected nodes
    const nodes = _.filter(
      this.props.nodes.peek(),
      x => x.id != A.id && x.id != B.id
    );


    let serverList = _.map(
      nodes,
      (x, i) => <Server key={i} onClick={this.handleClickForNode} {...x} />
    );
    if (this.state.loading) {
      return (
        <div>
          <AppBar
            title=""
            iconStyleLeft={{display: "none"}}
          />
          <div className="loader">
          <CircularProgress size={2} />
          </div>
        </div>
      )
    }

    return (
      <div>
        <AppBar
          title="Available Servers"
          iconStyleLeft={{display: "none"}}
        />
        <div className={"content " + this.props.className}>
          <div className="serv">
          <Subheader>Select two of the available nodes below to diff</Subheader>
            {serverList}
            <OverView onDiff={this.onDiff} a={this.state.A} b={this.state.B}/>
          </div>
        </div>
      </div>
    )
  }
}

@observer
class Details extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.fileList = _.memoize(this.fileList, (x, y) => y);
    this.state = {
      loading: true,
    };
  }

  handleNav(props) {
    View.state.set("loading", true);
    const that = this
    setTimeout(() => {
      const nextNode = View.getPackedNode(props.id);
      View.zoom(nextNode)
      View.setPageId(props.id);
      View.state.set("loading", false);
    }, 250);
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  loading() {
    const aTitle = View.selected.get("A").name;
    const bTitle = View.selected.get("B").name;

    return (
      <div className="details">
        <AppBar
          title={<Title a={_.capitalize(aTitle)} b={_.capitalize(bTitle)}/>}
          iconStyleLeft={{display: "none"}}
        />
        <div className="loader nav">
          <CircularProgress size={2} />
        </div>
      </div>

    )
  }

  nodeList(nodes, cn) {
    return <ListNode className={cn} nodes={nodes} />
  }

  fileList(children, id) {
    const c = children || [];
    return _.map(c, (x, i) => <Category key={i} {...x} onClick={this.handleNav}/>)
  }

  render() {
    const props = View.getPageProps();
    const items = this.fileList(props.children, props.id);
    const cn = items.length === 0 ? "" : " list";

    // Grab our node info
    const n = Upguard.state.get("nodes");
    const ready = View.state.get("ready");
    const loading = View.state.get("loading") && ready;
    if (loading) return this.loading()
    if (!ready) return this.nodeList(n, cn);

    const aTitle = View.selected.get("A").name
    const bTitle = View.selected.get("B").name
    return (
      <div className="details">
        <AppBar
          title={<Title a={_.capitalize(aTitle)} b={_.capitalize(bTitle)}/>}
          iconStyleLeft={{display: "none"}}
        />
        {!loading &&
          <div className={"content" + cn}>
            <Subheader>{props.name}</Subheader>
            {items}
        </div>
      }

      {loading &&
        <CircularProgress size={1}/>
      }
        <Diff {...props} />
      </div>
    );
  }
}

export default Details
