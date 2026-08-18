import {
  parseOidcErrorParam,
  shouldAutoRedirectToOidcLogin,
} from "./oidc-error";

describe("oidc-error", () => {
  it("does not auto-redirect when oidc_error is present", () => {
    expect(shouldAutoRedirectToOidcLogin("provision_failed")).toBe(false);
    expect(shouldAutoRedirectToOidcLogin("access_denied")).toBe(false);
    expect(shouldAutoRedirectToOidcLogin("not-a-real-code")).toBe(false);
  });

  it("auto-redirects when oidc_error is absent", () => {
    expect(shouldAutoRedirectToOidcLogin(undefined)).toBe(true);
    expect(shouldAutoRedirectToOidcLogin("")).toBe(true);
    expect(shouldAutoRedirectToOidcLogin(null)).toBe(true);
  });

  it("maps unknown codes to failed and keeps known codes", () => {
    expect(parseOidcErrorParam("provision_failed")).toBe("provision_failed");
    expect(parseOidcErrorParam("server_error")).toBe("failed");
  });
});
