import _ from "lodash";
import kCombs from "../lib/k-comb";
import View from "./view";
import {autobind} from "core-decorators"

class Data {
  constructor() {
    this.nodeInfo = {};
    this.diffed = {};
    this.packed = {};
  }

  getCombinations(arr) {
    return kCombs(arr);
  }

  setInfoNode(id, node) {
    this.nodeInfo[id] = node;
  }

  packRoot(data) {
    const size = [
      View.getDiameter() - View.getMargin(),
      View.getDiameter() - View.getMargin()
    ];

    const pack = d3.layout.pack()
      .padding(2)
      .size(size)
      .value((d) => d.size );

    const root = {id: "root", name: "", children: data};

    return pack(root);
  }

  setD3(...combination) {
    let data = this.diffed[combination];
    let inverted = false;
    if (data == null) {
      const iComb = combination.reverse();
      inverted = true;
      // Try for the inverse
      data = this.diffed[iComb];
    }

    // calculations have yet to be run
    if (data == null) {
      return null;
    }

    const root = {id: "root", name: "", children: data};

    // set the requested combination as the root node
    View.setRoot(root, this.packed[combination], inverted);

    // delete this.nodeInfo;
    // delete this.packed;
    // delete this.diffed;
  }

  setDiffStats(combination, diffs) {
    const stats = {
      edits: 0,
      additions: 0,
      deletions: 0,
    };

    for (const diff of diffs) {
      switch (diff.kind) {
        case "E":
          stats.edits += 1;
          break;
        case "N":
          stats.additions += 1;
          break;
        default:
          stats.deletions += 1;
      }
    }

    View.setStats(combination, stats);
  }

  // TODO: Priority. if a user selects a node before its loaded,
  // set it to priority diff to speed up load times..
  // Chances of it happening are slim, but it could happen w/ancient hardware
  @autobind
  async diffAll() {
    const ids = _.map(this.nodeInfo, (v, k) => k);

    // List of possible a => b diffs
    let possibleDiffs = this.getCombinations(ids);

    for (const combination of possibleDiffs) {
      const [lID, rID] = combination;

      await this.diff(this.nodeInfo[lID], this.nodeInfo[rID], lID, rID);
    }
  }

  getInlineJS() {
    var js = document.querySelector('[type="javascript/worker"]').textContent;
    var blob = new Blob([js], {"type": "text\/plain"});
    return URL.createObjectURL(blob);
  }


  async diff(lhs, rhs, lnodeID, rNodeid) {

    // Everything and it's mother has a multi-core processor now, lets use em.
    var ww = new Worker(this.getInlineJS());

    const handle = (msg) => {
      if (msg.data.type === "stats") {
        // Grab and set our diff stats for the node selection menu
        return this.setDiffStats(
          [lnodeID, rNodeid],
          msg.data.value
        );
      }

      const modeled = msg.data.value;
      const packed = this.packRoot(modeled)
      this.packed[[lnodeID, rNodeid]] = packed;

      // Store the model by its diffed id combination
      this.diffed[[lnodeID, rNodeid]] = modeled;
      console.log(`Finished modeling combination ${[lnodeID, rNodeid]}`)
    }

    ww.onmessage = handle;

    // Spawn our diff web worker
    ww.postMessage({
      url: document.location.protocol + '//' + document.location.host,
      c: [lhs, rhs],
      cIDs: [lnodeID, rNodeid],
      browser: {
        diameter: View.getDiameter(),
        margin: View.getMargin(),
      }
    });
  }
}



export default new Data();
