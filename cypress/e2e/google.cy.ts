/// <reference types="cypress" />
describe("Oauth feature apis", () => {
  let access_token = "";
  let userId = "";

  beforeEach("generate token", () => {
    //to get the token id(access token)\

    cy.loginByGoogleApi().then(() => {
      // cy.wrap(window.localStorage.getItem("googleCypress")).as("accessToken");
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
    cy.get("@accessToken").then((accessToken) => {
      cy.request({
        method: "GET",
        url: "/api/todo",
        headers: {
          //@ts-ignore
          Authorization: `Bearer ${accessToken}`,
          Cookie:
            "session.sig=HNNNL0A41LhS-QJOTbX8-RFv9iw; session=eyJwYXNzcG9ydCI6eyJ1c2VyIjp7ImlkIjoiMTA0MjU3NjQyODAyOTY2Mjk2OTM1IiwiZW1haWwiOiJrb3JuZWxqYW5jemFrMTBAZ21haWwuY29tIn19fQ==;",
        },
      }).then((response) => {
        cy.log(JSON.stringify(response));
        expect(response.status).to.equal(200);
      });
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
