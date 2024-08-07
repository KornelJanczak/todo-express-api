/// <reference types="cypress" />
describe("Todo API features", () => {
  let access_token = "";
  let userId = "";

  beforeEach("generate token", () => {
    cy.loginByGoogleApi().then(() => {
      const tokenObject = JSON.parse(
        window.localStorage.getItem("googleCypress") || "{}"
      );
      access_token = tokenObject.token || "";
      cy.wrap(access_token).as("accessToken");
    });
    access_token = window.localStorage.getItem("googleCypress") || "";
    console.log(access_token, "access token");

    cy.log("Hello");
  });
  it("Get todos", () => {
    cy.request({
      method: "GET",
      url: "/api/todo",
      headers: {
        Cookie: Cypress.env("sessionSecret"),
      },
    }).then((response) => {
      cy.log(JSON.stringify(response));
      expect(response.status).to.equal(200);
    });
  });

  it("Get todo", () => {
    cy.request({
      method: "GET",
      url: "/api/todo/e6ce2d76-9138-4264-83f9-cc85f06a8743",
      headers: {
        Cookie: Cypress.env("sessionSecret"),
      },
    }).then((response) => {
      cy.log(JSON.stringify(response));
      expect(response.status).to.equal(200);
      expect(response.body.todo.id).to.equal(
        "e6ce2d76-9138-4264-83f9-cc85f06a8743"
      );
    });
  });

  it("Get todo (not found)", () => {
    cy.request({
      method: "GET",
      url: "/api/todo/fake-id",
      headers: {
        Cookie: Cypress.env("sessionSecret"),
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(JSON.stringify(response));
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal("Todo not found!");
      expect(response.body.statusCode).to.equal(404);
    });
  });

  it("Create todo", () => {
    cy.request({
      method: "POST",
      url: "/api/todo",
      headers: {
        Cookie: Cypress.env("sessionSecret"),
      },
      body: {
        content: "Test todo",
        priority: "high",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response));
      expect(response.status).to.equal(200);
      expect(response.body.result).to.have.property("id");
      expect(response.body.result).to.have.property("content");
      expect(response.body.result).to.have.property("priority");
      expect(response.body.result).to.have.property("user_id");
    });
  });

  it("Create todo (bad credentials)", () => {
    cy.request({
      method: "POST",
      url: "/api/todo",
      headers: {
        Cookie: Cypress.env("sessionSecret"),
      },
      body: {
        content: "Test todo",
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(JSON.stringify(response));
      expect(response.status).to.equal(400);
      expect(response.body.statusCode).to.equal(400);
    });
  });

  it("Update todo", () => {
    cy.request({
      method: "PATCH",
      url: "/api/todo/d3a12af1-d6bf-4da2-bee7-57583d433e22",
      headers: {
        Cookie: Cypress.env("sessionSecret"),
      },
      body: {
        content: "Test todo",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response));
      expect(response.status).to.equal(200);
      expect(response.body.result).to.have.property("id");
      expect(response.body.result).to.have.property("content");
      expect(response.body.result).to.have.property("priority");
      expect(response.body.result).to.have.property("user_id");
    });
  });

  it("Update todo (Not found)", () => {
    cy.request({
      method: "PATCH",
      url: "/api/todo/",
      headers: {
        Cookie: Cypress.env("sessionSecret"),
      },
      body: {
        content: "Test todo",
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(JSON.stringify(response));
      expect(response.status).to.equal(404);
    });
  });
});
