import { Link, useLocation, Outlet } from "react-router-dom";

export function ApplicationShell() {
  const location = useLocation();
  return (
    <div>
      <h1>Example Micro Frontend with &lt;iframe&gt;</h1>
      <h2>Application Shell</h2>
      <div>path: {location.pathname}</div>
      <nav>
        <ul>
          <li>
            <Link to="/explainer">Explainer</Link>
          </li>
          <li>
            <Link to="/glossary">Glossary</Link>
          </li>
          <li>
            <Link to="/workflow">Workflow</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
