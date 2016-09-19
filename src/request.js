import * as fetch from "fetch-plus";

import _ from "lodash";
import config from "config";
import fetchJson from "fetch-plus-json";

function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
}

const request = fetch.createClient(config.corsRouter + config.api);

request.addMiddleware(fetchJson({fullResponse: true}));

request.addMiddleware((request) => {
  const c = config

  request.options.headers["Authorization"] =
    `Token token="$ss"`;
});

export default request;
