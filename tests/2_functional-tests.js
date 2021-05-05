const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  const fs = require("fs");
  test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        issue_title: "test",
        issue_text: "test",
        created_by: "test",
        assigned_to: "test",
        status_text: "test",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.include(res.text, "issue_title");
        done();
      });
  });
  test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        issue_title: "another title",
        issue_text: "test",
        created_by: "test",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.include(res.text, "issue_title");
        done();
      });
  });
  test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        issue_title: "test",
        created_by: "test",
      })
      .end(function (err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"required field(s) missing"}');
        done();
      });
  });
  test("View issues on a project: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(Array.isArray(eval(res.text)), true);
        //assert.equal(eval(res.text).length, 2); // to comment?
        done();
      });
  });
  test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_text=test")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(Array.isArray(eval(res.text)), true);
        //assert.equal(eval(res.text).length, 2); // to comment?
        done();
      });
  });
  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_text=test&issue_title=test")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(Array.isArray(eval(res.text)), true);
        //assert.equal(eval(res.text).length, 1); // to comment?
        done();
      });
  });
  test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
    let issues = JSON.parse(fs.readFileSync("./data/issues.json"));
    let id = issues.apitest[0]._id;
    chai
      .request(server)
      .put("/api/issues/apitest?issue_text=test&issue_title=test")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        _id: id,
        issue_text: "single update",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text.includes("successfully updated"), true);
        done();
      });
  });
  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
    let issues = JSON.parse(fs.readFileSync("./data/issues.json"));
    let id = issues.apitest[0]._id;
    chai
      .request(server)
      .put("/api/issues/apitest?issue_text=test&issue_title=test")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        _id: id,
        issue_title: "multiple update",
        created_by: "multiple update",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text.includes("successfully updated"), true);
        done();
      });
  });
  test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest?issue_text=test&issue_title=test")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        issue_title: "missing id",
        created_by: "missing id",
      })
      .end(function (err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.text.includes("missing _id"), true);
        done();
      });
  });
  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
    let issues = JSON.parse(fs.readFileSync("./data/issues.json"));
    let id = issues.apitest[0]._id;
    chai
      .request(server)
      .put("/api/issues/apitest?issue_text=test&issue_title=test")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        _id: id,
      })
      .end(function (err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.text.includes("no update field(s) sent"), true);
        done();
      });
  });
  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest?issue_text=test&issue_title=test")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        _id: "568XXXXX9-4319-bc89-ad089aab1da2",
        issue_title: "wrong id",
        created_by: "wrong id",
      })
      .end(function (err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.text.includes("could not update"), true);
        done();
      });
  });
});

// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}
