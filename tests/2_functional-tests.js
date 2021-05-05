const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
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
        issue_title: "test1",
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
        assert.equal(res.text, '{ "error": "required field(s) missing" }');
        done();
      });
  });
  test("View issues on a project: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .set("content-type", "application/x-www-form-urlencoded")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(Array.isArray(eval(res.text)), true);
        assert.equal(eval(res.text).length, 2); // to comment?
        done();
      });
  });
  test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_text=test")
      .set("content-type", "application/x-www-form-urlencoded")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(Array.isArray(eval(res.text)), true);
        assert.equal(eval(res.text).length, 2); // to comment?
        done();
      });
  });
  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_text=test&issue_title=test1")
      .set("content-type", "application/x-www-form-urlencoded")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(Array.isArray(eval(res.text)), true);
        assert.equal(eval(res.text).length, 1); // to comment?
        done();
      });
  });
});

// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}
