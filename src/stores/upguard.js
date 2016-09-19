import request from "../request";
import config from "config";
import {observable, asMap} from "mobx";
import Data from "./data";
import View from "./view";

class Upguard {
  constructor() {
    this.state = observable(asMap({
      loading: true,
      nodes: [],
      selected: [],
    }));

    // Node ids => scan ids
    this.nodeMap = {}
  }

  async fetchData(node) {
    const req = await request.get(
      `nodes/${node}/last_node_scan_details?with_data=true`
    );

    this.nodeMap[node] = req.body.id;

    // Pass it along to our data layer
    Data.setInfoNode(node, req.body.data);
  }

  async getNodes() {
      try {
        this.state.set("loading", true)
        const req = await request.get("nodes");
        this.state.set("nodes", req.body);
        this.state.set("loading", false);
      } catch (err) {
        console.warn(err);
      }

      const promises = []
      for (const node of this.state.get("nodes")) {
        // Spawn async requests for all info as the user selects which nodes
        // to diff
        promises.push(this.fetchData(node.id))
      }

      // Fetch all of the data and start diffing
      Promise.all(promises)
        .then( async () => await Data.diffAll() );
  }

}

export default new Upguard()
