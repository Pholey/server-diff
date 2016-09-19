const _ = require("lodash")

// NOTE: Adjust this for additional projects
const portOffset = 0

module.exports = _.extend({
  name: "Foobar",

  api: "https://app.upguard.com/api/v2",
  corsRouter: "http://localhost:3000/",

  ports: {
    server: 8000 + portOffset,
    webpack: 7000 + portOffset,
    connect: 8500 + portOffset,
    livereload: 32000 + portOffset,
  },
})
