import { appendResponseHeader, type HTTPEvent } from "vinxi/http";

type SsrRequestEvent = {
  nativeEvent: {
    node: {
      res: {
        headersSent: boolean;
        writableEnded: boolean;
      };
    };
  };
};

function getSetCookies(response: Response): string[] {
  const headersAny = response.headers as Headers & {
    getSetCookie?: () => string[];
  };
  return (
    headersAny.getSetCookie?.() ||
    response.headers.get("set-cookie")?.split(", ") ||
    []
  );
}

/** Forward API Set-Cookie headers onto the SolidStart SSR response. */
export async function propagateSetCookies(
  event: unknown,
  response: Response,
): Promise<void> {
  const setCookies = getSetCookies(response);
  if (setCookies.length === 0) return;

  const ssrEvent = event as SsrRequestEvent;
  const isResponseFinished =
    ssrEvent.nativeEvent.node.res.headersSent ||
    ssrEvent.nativeEvent.node.res.writableEnded;

  if (isResponseFinished) return;

  for (const cookie of setCookies) {
    appendResponseHeader(
      ssrEvent.nativeEvent as HTTPEvent,
      "Set-Cookie",
      cookie,
    );
  }
}
