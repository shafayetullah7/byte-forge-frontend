export * from "./session";
export * from "./logout";
export * from "./login-redirect";
export * from "./guards";
export * from "./return-to";
export * from "./middleware-auth";

/** @deprecated Use getOidcLoginUrl */
export { getOidcLoginUrl as buildLoginHref } from "./login-redirect";
/** @deprecated Use getOidcLoginUrlFromLocation */
export { getOidcLoginUrlFromLocation as buildLoginHrefFromLocation } from "./login-redirect";
