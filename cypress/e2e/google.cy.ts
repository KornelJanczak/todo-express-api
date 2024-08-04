/// <reference types="cypress" />
describe("Oauth feature apis", () => {
  let access_token = "";
  let userId = "";

  beforeEach("generate token", () => {
    //to get the token id(access token)\

    cy.loginByGoogleApi();
  });
  it("Get todos", () => {
    cy.request({
      method: "POST",
      url: "/api/todos",
      headers: {
        Authorization: "Bearer " + access_token,
        // Cookie: "",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response));
      expect(response.status).to.equal(200);
    });
  });

  // it("Put the Toilet Seat Down Test", () => {
  //   cy.request({
  //     method: "POST",
  //     url: "/api/" + userId + "/toiletseat-down",
  //     headers: {
  //       Authorization: "Bearer " + access_token,
  //     },
  //   }).then((response) => {
  //     cy.log(JSON.stringify(response));
  //     expect(response.status).to.equal(200);
  //   });
  // });

  // it("Chicekn Feed Test", () => {
  //   cy.request({
  //     method: "POST",
  //     url: "/api/" + userId + "/chickens-feed",
  //     headers: {
  //       Authorization: "Bearer " + access_token,
  //     },
  //   }).then((response) => {
  //     cy.log(JSON.stringify(response));
  //     expect(response.status).to.equal(200);
  //   });
  // });
});
