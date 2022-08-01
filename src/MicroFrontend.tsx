import { css } from "@emotion/css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/*
  DONE: Produce MFE Event
  DONE: Resize height
  DONE: Deep Linking
  DONE: Handle History
  NOTE: https://www.aleksandrhovhannisyan.com/blog/react-iframes-back-navigation-bug/#bug-iframes-interrupt-back-navigation-in-the-browser
  DONE: Produce AppShell Event
  DONE: Handle Deep History
  TODO: Handle Auth
  TODO: Emit Loading Events
*/

type MicroFrontendMessage =
  | {
      type: "EVENT_FRAME_RESIZE";
      payload: {
        height: number;
        width: number;
      };
    }
  | {
      type: "EVENT_URL_CHANGE";
      payload: {
        path: string;
      };
    }
  | {
      type: "COMMAND_UPDATE_URL";
      payload: {
        path: string;
      };
    };

function emitMessageToAppShell(message: MicroFrontendMessage): void {
  window.top?.postMessage(message);
}
function emitMessageToMicroFrontend(
  iframe: HTMLIFrameElement,
  message: MicroFrontendMessage
): void {
  iframe.contentWindow?.postMessage(message);
}

type IframeMicroFrontendPortProps = {
  basePath: string;
  src: string;
};
export function IframeMicroFrontendPort({
  basePath,
  src,
}: IframeMicroFrontendPortProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(200);
  const [staticSrc, setStaticSrc] = useState(src);
  console.log(1, new URL(src).pathname);
  if (!new URL(staticSrc).pathname.startsWith(basePath)) {
    setStaticSrc(src);
  } else if (iframeRef.current) {
    emitMessageToMicroFrontend(iframeRef.current, {
      type: "COMMAND_UPDATE_URL",
      payload: {
        path: new URL(src).pathname,
      },
    });
  }
  // Listen for Messages from Micro Frontend
  const navigate = useNavigate();
  useEffect(() => {
    const handler = (event: { data: MicroFrontendMessage }) => {
      switch (event.data.type) {
        case "EVENT_FRAME_RESIZE":
          setHeight(event.data.payload.height);
          break;
        case "EVENT_URL_CHANGE":
          navigate(event.data.payload.path);
          break;
        case "COMMAND_UPDATE_URL":
          break;
        default: {
          const noValue: never = event.data;
        }
      }
    };
    window.addEventListener("message", handler);
    return () => {
      window?.removeEventListener("message", handler);
    };
  }, []);
  return (
    <div
      className={css`
        width: 100%;
        iframe {
          width: 100%;
          height: ${height}px;
        }
      `}
    >
      <iframe ref={iframeRef} key={basePath} src={staticSrc} />
    </div>
  );
}

type ReactMicroFrontendAdapterProps = {
  element: React.ReactNode;
};
export function ReactMicroFrontendAdapter({
  element,
}: ReactMicroFrontendAdapterProps) {
  // Listen for Messages from App Shell
  const navigate = useNavigate();
  useEffect(() => {
    const handler = (event: { data: MicroFrontendMessage }) => {
      switch (event.data.type) {
        case "COMMAND_UPDATE_URL":
          navigate(event.data.payload.path);
          break;
        case "EVENT_FRAME_RESIZE":
        case "EVENT_URL_CHANGE":
          break;
        default: {
          const noValue: never = event.data;
        }
      }
    };
    window.addEventListener("message", handler);
    return () => {
      window?.removeEventListener("message", handler);
    };
  }, []);
  // Observe content size changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        emitMessageToAppShell({
          type: "EVENT_FRAME_RESIZE",
          payload: {
            height: entry.contentBoxSize[0].blockSize,
            width: entry.contentBoxSize[0].inlineSize,
          },
        });
      }
    });
    resizeObserver.observe(document.documentElement);
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div>
      <div>path: {window.location.pathname}</div>
      {element}
    </div>
  );
}

type LinkProps = {
  text: string;
  to: string;
};
export function Link({ to, text }: LinkProps) {
  const navigate = useNavigate();
  return (
    <a
      href="#"
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
        emitMessageToAppShell({
          type: "EVENT_URL_CHANGE",
          payload: {
            path: to,
          },
        });
      }}
    >
      {text}
    </a>
  );
}
