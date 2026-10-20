import { describe, expect, it } from "vitest";
import {
  BF_XSRF_COOKIE,
  hasBfXsrfCookie,
  readCookieFromHeader,
} from "./logout";
import { resolveClientAuthMessage } from "./client-auth-message";

describe("readCookieFromHeader / hasBfXsrfCookie", () => {
  it("reads bf-xsrf-token from a cookie header", () => {
    expect(
      readCookieFromHeader(
        "locale=en; bf-xsrf-token=abc%20123; other=1",
        BF_XSRF_COOKIE,
      ),
    ).toBe("abc 123");
    expect(hasBfXsrfCookie("bf-xsrf-token=secret")).toBe(true);
  });

  it("returns false when XSRF cookie is missing or blank", () => {
    expect(hasBfXsrfCookie("locale=en")).toBe(false);
    expect(hasBfXsrfCookie("bf-xsrf-token=")).toBe(false);
    expect(hasBfXsrfCookie("bf-xsrf-token=%20")).toBe(false);
  });
});

describe("resolveClientAuthMessage", () => {
  it("uses EN by default and BN when locale cookie is bn", () => {
    expect(resolveClientAuthMessage("sessionExpiredSoft", "")).toContain(
      "Session expired",
    );
    expect(
      resolveClientAuthMessage("logoutMissingXsrf", "locale=bn"),
    ).toBeTruthy();
    expect(
      resolveClientAuthMessage("sessionExpiredSoft", "locale=bn"),
    ).not.toContain("Session expired");
  });
});
