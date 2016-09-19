import React from "react"
import {render} from "react-dom"
import {Router} from "react-router"
import history from "./history"
import routes from "./routes"

import Loader from "./stores/upguard"

global.regeneratorRuntime = require("regenerator-runtime/runtime")

function main() {

  // Render the application
  render(
    <Router
      history={history}
      routes={routes()}
    />,
  document.getElementById("root"))

}

main()
