import { parseReturnToParam, safeReturnTo } from "./return-to";

describe("return-to", () => {
  it("accepts in-app paths and query strings", () => {
    expect(parseReturnToParam("/app/profile")).toBe("/app/profile");
    expect(parseReturnToParam("/shops/foo?ref=1")).toBe("/shops/foo?ref=1");
  });

  it("rejects login, protocol-relative, backslash, and encoded slashes", () => {
    expect(parseReturnToParam("/login")).toBeNull();
    expect(parseReturnToParam("/login%2Fevil")).toBeNull();
    expect(parseReturnToParam("//evil")).toBeNull();
    expect(parseReturnToParam("/app\\profile")).toBeNull();
    expect(safeReturnTo("/login%2Fevil")).toBe("/");
  });
});
