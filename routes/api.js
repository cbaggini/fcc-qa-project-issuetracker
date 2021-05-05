"use strict";

let issues = require("../data/issues.json");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      if (Object.keys(issues).includes(project)) {
        res.send(issues[project]);
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
