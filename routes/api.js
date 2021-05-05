"use strict";

let issues = require("../data/issues.json");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      let search = req.query;
      if (Object.keys(issues).includes(project)) {
        let issue = issues[project];
        let searchKeys = Object.keys(search);
        if (searchKeys.length > 0) {
          for (let searchTerm of searchKeys) {
            issue = issue.filter((el) =>
              el[searchTerm].includes(search[searchTerm])
            );
          }
        }
        res.send(issue);
      } else {
        res.status(404).json({ error: "project not found" });
      }
    })

    .post(function (req, res) {
      let project = req.params.project;
      res.send(project);
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
