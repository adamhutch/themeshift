import { Routes, Route } from "react-router";

type PlaceholderProps = {
  title: React.ReactNode;
  children?: React.ReactNode;
};

const Placeholder = ({ children, title }: PlaceholderProps) => (
  <div>
    <h1>{title}</h1>
    <p>{children}</p>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route index element={<Placeholder title="Home">Home page!</Placeholder>} />
    <Route
      path="/components"
      element={<Placeholder title="Components">Components here</Placeholder>}
    />
    <Route
      path="/plugin"
      element={<Placeholder title="Plugin">Plugin info here</Placeholder>}
    />
    <Route
      path="/tokens"
      element={<Placeholder title="Tokens">Tokens page here</Placeholder>}
    />
  </Routes>
);

export default AppRoutes;
