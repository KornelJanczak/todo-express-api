/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("loginByGoogleApi", () => {
  cy.log("Logging in to Google");
  cy.request({
    method: "POST",
    url: "https://www.googleapis.com/oauth2/v4/token",
    body: {
      // access_token:
      //   "ya29.a0AcM612xbK-xQNxmi8tx-2p7vRa0TR6Ep-PBjQr_1NLVGIN2UzRBAtJtjzxiL2w0yh-_1UFRiqnAkZwMQcZT6xMFXd5oNK4OPB1Mbw6GSz5XYv4o6yd6OKC3VQzQ0cvJ8zlR_QZwtaEXib76o1Wf6jy5t_mwpj20OnN3PaCgYKAV0SARESFQHGX2MiNDZoDdSMOQdfWpAwhmDgpw0171",
      // id_token:
      //   "eyJhbGciOiJSUzI1NiIsImtpZCI6ImUyNmQ5MTdiMWZlOGRlMTMzODJhYTdjYzlhMWQ2ZTkzMjYyZjMzZTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQyNTc2NDI4MDI5NjYyOTY5MzUiLCJlbWFpbCI6Imtvcm5lbGphbmN6YWsxMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InZ4a0o0UXA3Xy03NjZoVVcwczBoUHciLCJpYXQiOjE3MjI3ODgyNDQsImV4cCI6MTcyMjc5MTg0NH0.SowEcFS3tx30FaTgBVnAwGmXVt-JbFxbTlQFQhbypPedLveeHBQ7vRs_CGqDZek46HHvpKZ_JTicSjn-kDWu--2gtCNTm5qQS24CWYovKXEiPS9fvlx9wpyL1KfKScx6HSZeAorJQZhtgHbgLUbYvaOH2Noa9PcPZ0RZcQlT1QUmnVah2gsw6hVr9CvLuLZt5qt8rUPdh6PHmoIA2Gzv59ErERDrGHMbEVGJZU80jiiyC8A3YLoHPlEX2M0h9AYBklHCmcO-ZUyTh0W-i0hHYXXn5COWLklg2-MkEvUjsfXOxr2qF4Wcb92CYjgtpXj8zP7_41ueFB2-ZdnG81betA",
      grant_type: "refresh_token",
      client_id: Cypress.env("googleClientId"),
      client_secret: Cypress.env("googleClientSecret"),
      refresh_token: Cypress.env("googleRefreshToken"),
      scope:
        "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/cloud-platform",
    },
    // form: true,
  }).then(({ body }) => {
    const { access_token, id_token } = body;

    cy.request({
      method: "GET",
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(({ body }) => {
      cy.log(body);
      const userItem = {
        token: id_token,
        user: {
          googleId: body.sub,
          email: body.email,
          givenName: body.given_name,
          familyName: body.family_name,
          imageUrl: body.picture,
        },
      };

      window.localStorage.setItem("googleCypress", JSON.stringify(userItem));
      cy.visit("/");
    });
  });
});
