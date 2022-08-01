import {
  BrowserRouter,
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ApplicationShell } from "./ApplicationShell";
import { Explainer } from "./Explainer";
import { Glossary } from "./Glossary";
import {
  IframeMicroFrontendPort,
  ReactMicroFrontendAdapter,
} from "./MicroFrontend";
import { Workflow } from "./Workflow";

/*
  The micro frontend and application shell wouldn't usually live inside the
  same render or codebase as the application shell.
  But, this allows for a single vite app for simpler demonstration purposes.

  It can be assumed that in any real micro frontend application, the
  application shell and the micro frontends will live in separate code repos.
*/
export function EntryPoint() {
  const isInIframe = window.top !== window;
  if (isInIframe) {
    return (
      <MemoryRouter initialEntries={[window.location.pathname]}>
        <RouteMicroFrontend />
      </MemoryRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <RouteApplicationShell />
      </BrowserRouter>
    );
  }
}

function RouteMicroFrontend() {
  return (
    <Routes>
      <Route
        path="/explainer/*"
        element={<ReactMicroFrontendAdapter element={<Explainer />} />}
      />
      <Route
        path="/glossary/*"
        element={<ReactMicroFrontendAdapter element={<Glossary />} />}
      />
      <Route
        path="/workflow/*"
        element={<ReactMicroFrontendAdapter element={<Workflow />} />}
      />
    </Routes>
  );
}

function RouteApplicationShell() {
  const location = useLocation();
  return (
    <Routes>
      <Route element={<ApplicationShell />}>
        <Route index element={null} />
        <Route
          path="/explainer/*"
          element={
            <IframeMicroFrontendPort
              basePath="/explainer"
              src={`${window.location.origin}${location.pathname}`}
            />
          }
        />
        <Route
          path="/glossary/*"
          element={
            <IframeMicroFrontendPort
              basePath="/glossary"
              src={`${window.location.origin}${location.pathname}`}
            />
          }
        />
        <Route
          path="/workflow/*"
          element={
            <IframeMicroFrontendPort
              basePath="/workflow"
              src={`${window.location.origin}${location.pathname}`}
            />
          }
        />
      </Route>
    </Routes>
  );
}
