import _ from "lodash";
import {observable, asMap, extendObservable} from "mobx";

const bHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
const bWidth = Math.max(
  document.documentElement.clientWidth,
  window.innerWidth || 0
);

let DIAMETER = Math.min(bHeight, bWidth)
let DETAIL_WIDTH = bWidth - DIAMETER;
let NODE = null;
let CIRCLE = null;
let MARGIN = 20;
let CURRENT_VIEW = null;

class View {
  // datum.id;
  // datum.depth;
  // datum.kind;
  // datum.name;
  // datum.parent;
  // datum.children;
  // datum.description;


  constructor() {
    this.datum = observable(asMap({}));
    this.packed = {};
    this.root = {};
    this.rootPacked = {};
    this.graphPack = [];
    this.inverted = false, // Should we display the inverted calculations?
    this.isLoading = observable(false);
    this.diffedStats = observable(asMap({}));
    this.state = observable(asMap({
      ready: false,
      d3Loaded: false,
      stats: asMap({}),
      loading: true,
    }))
    this.spawned = false;
    this.selected = observable(asMap({
      a: {},
      b: {},
    }));
  }

  setCircle(v) {
    CIRCLE = v;
  }

  getMargin() {
    return MARGIN;
  }

  getDetailWidth() {
    return DETAIL_WIDTH;
  }

  getDiameter() {
    return DIAMETER;
  }

  getBrowserWidth() {
    const bWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );

    return bWidth;
  }

  setRoot(data, packed, inverted = false) {
    const root = {id: "root", name: "", children: data}
    this.root = root;
    this.graphPack = packed;

    this.setPacked(packed);
    console.log("set packed")
    this.inverted = inverted;
    this.state.set("ready", true);
  }

  setStats(combination, stats) {
    this.state.get("stats").set(combination.toString(), stats)
  }

  getStats(lID, rID) {
    if (!lID) return;
    if (!rID) return;
    return this.state.get("stats");
  }

  getCircle() {
    return CIRCLE;
  }

  setNode(v) {
    NODE = v;
  }

  getPackedNode(id) {
    if (id == null) {
      return this.rootPacked;
    }

    return this.packed[id];
  }

  setPacked(packed) {

    // Re-set root with d3's information
    this.rootPacked = packed[0];
    this.setPageId("root");
    for (const pack of packed) {
      if (pack.id != null) this.packed[pack.id] = pack;
    }
  }

  zoomTo(v) {

    var k = DIAMETER / v[2]; CURRENT_VIEW = v;
    NODE.attr(
      "transform",
      (d) => "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"
    );

    CIRCLE.attr("r", (d) => d.r * k);
  }

  zoom(d) {
    var focus = d;
    var transition = d3.transition()
        .duration(325)
        .tween("zoom", (d) => {
          var i = d3.interpolateZoom(
            CURRENT_VIEW,
            [focus.x, focus.y, focus.r * 2 + MARGIN]
          );
          return (t) =>  this.zoomTo(i(t));
        });


    // transition.selectAll("text")
    //     .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
    //     .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
    //     .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
    //     .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }


  setPageId(datumId) {
     this.datum.set("id", datumId)
  }

  getPageProps(id) {
    return this.getPackedNode(this.datum.get("id")) || {};
  }

}

export default new View();
