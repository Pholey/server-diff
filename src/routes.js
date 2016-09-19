import React from "react"
import {Route, IndexRoute} from "react-router"
import Site from "./components/site"
import Home from "./pages/home";
import request from "./request"

export default (flux) => {
  return (
    <Route component={Site} path="/">
      <IndexRoute component={Home} />
      <Route path="/home" component={Home}/>
    </Route>
  );
}
