"use strict";

const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let issues = JSON.parse(fs.readFileSync("./data/issues.json"));
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
      const requiredFields = ["issue_title", "issue_text", "created_by"];
      const allowedFields = [
        "issue_title",
        "issue_text",
        "created_by",
        "assigned_to",
        "status_text",
      ];
      let issues = JSON.parse(fs.readFileSync("./data/issues.json"));
      let project = req.params.project;
      let sentIssue = req.body;
      if (
        Object.keys(issues).includes(project) &&
        requiredFields.every((val) => Object.keys(sentIssue).includes(val))
      ) {
        let newIssue = {
          issue_title: sentIssue.issue_title,
          issue_text: sentIssue.issue_text,
          created_by: sentIssue.created_by,
          assigned_to: sentIssue.assigned_to || "",
          status_text: sentIssue.status_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true,
          _id: uuidv4(),
        };
        issues[project] = issues[project].concat(newIssue);
        console.log(issues);
        fs.writeFileSync("./data/issues.json", JSON.stringify(issues, null, 2));
        res.status(200).json(newIssue);
      } else if (Object.keys(issues).includes(project)) {
        res.status(400).json({ error: "required field(s) missing" });
      } else {
        res.status(404).json({ error: "project not found" });
      }
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
