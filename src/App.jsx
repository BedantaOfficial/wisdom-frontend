import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { getAuthToken } from "./helpers/token";

/*
  App component: The main entry point of the application.
  It sets up the Router and imports the page components dynamically
  based on the file structure of the project.
*/
function App() {
  // Import page components dynamically using Vite's glob functionality.
  // This allows for easy routing based on the file structure.
  const pages = import.meta.glob(
    "./app/**/!(*.test|_layout).[jt]sx", // Excludes test files and _layout files
    {
      eager: true, // Load modules eagerly (import them immediately)
    }
  );

  const layouts = import.meta.glob(
    "./app/**/_layout.[jt]sx", // Match all .jsx/.tsx files, excluding test files
    {
      eager: true, // Load modules eagerly (import them immediately)
    }
  );
  // console.log(pages);
  // console.log(layouts);
  return (
    <>
      {/* Wrap the Routes component with BrowserRouter for routing functionality */}
      <BrowserRouter>
        <Routes pages={pages} layouts={layouts} />
        {/* Pass the dynamically imported pages to the Routes component */}
      </BrowserRouter>
    </>
  );
}

export default App;
