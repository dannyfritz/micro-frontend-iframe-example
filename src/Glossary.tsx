import { useMatch } from "react-router-dom";
import { Link } from "./MicroFrontend";

export function Glossary() {
  const matchTerm = useMatch("/glossary/:term");
  return (
    <div>
      <h1>Glossary of Terms</h1>
      <ul>
        <li>
          <DefinitionLink term="iframe" />
        </li>
        <li>
          <DefinitionLink term="mfe" />
        </li>
      </ul>
      {matchTerm?.params.term && (
        <Definition term={matchTerm?.params.term as Term} />
      )}
    </div>
  );
}

type Term = "mfe" | "iframe";
type TermDefinition = {
  name: string;
  definition: string;
};

const terms: Record<Term, TermDefinition> = {
  iframe: {
    name: "<iframe>",
    definition:
      "An <iframe> is a method of inserting a website into another. This method allows for strict sandboxing and limited communication.",
  },
  mfe: {
    name: "Micro Frontend",
    definition:
      "A way to break up a large front end into separate deployable units.",
  },
};

type DefinitionLinkProps = {
  term: Term;
};
function DefinitionLink({ term }: DefinitionLinkProps) {
  return <Link to={`/glossary/${term}`} text={terms[term].name} />;
}

type DefinitionProps = {
  term: Term;
};
function Definition({ term }: DefinitionProps) {
  return (
    <div>
      <h2>{terms[term].name}</h2>
      <p>{terms[term].definition}</p>
    </div>
  );
}
