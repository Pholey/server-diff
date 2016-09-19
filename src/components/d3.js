import _ from "lodash"
import React from "react"
import View from "../stores/view";

function determineClass(d) {
  const inverted = View.inverted;
  const iCn = inverted ? " inverted " : "";

  let cn = "node node--root"
  if (d.parent) {
    if (d.children) {
      cn = "node"
    } else {
      cn = "node--leaf "
    }
  }

  // Assign the proper class based on its diff
  cn += ((d.kind != null) ? " " + (d.kind) : " U") + iCn;

  return cn;
}

export default class D3 extends React.Component {
  state = {
    diameter: View.getDiameter(),
    dWidth: View.getDetailWidth(),
  }

  constructor() {
    super()
    this.handleClickForZoom = this.handleClickForZoom.bind(this);
  }

  handleClickForZoom(d) {
    if (focus === d) return;

    // Zoom to the clicked circle
    View.zoom(d);

    // Update the model with the correct information
    View.setPageId(d.id);
    d3.event.stopPropagation();
  }

  // Just no.
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    // Working with D3 can be a hassel due to the paralell life cycles
    // of itself and react
    var diameter = this.state.diameter;

    var color = d3.scale.linear()
        .domain([-1, 5])
        .range(["rgb(255, 255, 255)", "rgb(0, 0, 0)"])
        .interpolate(d3.interpolateRgb);

    var pack = d3.layout.pack()
        .padding(2)
        .size([diameter - View.getMargin(), diameter - View.getMargin()])
        .value(function(d) { return d.size; })

    var svg = d3.select("#d3").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var focus = View.root,
        nodes = View.graphPack;

    View.setCircle(
      svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", determineClass)
        .style("fill", function(d) { return d.children ? color(d.depth) : null; })
        .on("click", (d) => this.handleClickForZoom(d))
    );

    var text = svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) { return d.parent === View.root ? 1 : 0; })
        .style("display", function(d) { return d.parent === View.root ? "inline" : "none"; })
        .text(function(d) { return d.name; });

    View.setNode(svg.selectAll("circle,text"));

    d3.select("#d3")
        .style("background", color(-1))
        .on("click", () => this.handleClickForZoom(View.rootPacked));

    // TODO: zoomToRoot
    View.zoomTo([View.rootPacked.x, View.rootPacked.y, View.rootPacked.r * 2 + View.getMargin()]);

    View.state.set("d3Loaded", true);
    View.state.set("loading", false);

    const g = this.refs.d3.children[0].children[0]
    g.classList.add("loaded")


    }

  render() {
    return (
      <div id="d3" ref="d3"/>
    );
  }
}
