import { Route, Routes as ReactRouterRoutes } from "react-router-dom";

/*
  Routes component: This component receives a pages object,
  generates route configurations, and renders the defined routes.
*/
const Routes = ({ pages, layouts }) => {
  // Generate the route configurations from the pages object.
  const wrappers = useLayouts(layouts);
  const routes = useRoutes(pages);

  console.log(wrappers);
  console.log(routes);

  // Create an array of Route components based on the route configurations.
  const routeComponents = routes.map(({ path, component: Component }) => (
    <Route key={path} path={path} element={<Component />} />
  ));

  // Find the NotFound component to render for unmatched routes.
  const NotFound =
    routes.find(({ path }) => path === "/notFound")?.component ||
    (() => <div>Not Found</div>); // Fallback to a simple Not Found component.

  return (
    <ReactRouterRoutes>
      {routeComponents} {/* Render the defined route components */}
      <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
    </ReactRouterRoutes>
  );
};

/*
  useRoutes function: Generates route configurations based on the provided pages object.
  It transforms the file paths into route paths and extracts the default components.
*/
const useRoutes = (pages) => {
  const routes = Object.keys(pages)
    .map((key) => {
      // Convert the file path to a route path.
      let path = key
        .replace("./app", "") // Remove the base directory.
        .replace(/\.(t|j)sx?$/, "") // Remove the file extension.
        .replace(/\/index$/i, "/") // Convert index files to root paths.
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase()) // Lowercase the first letter of the path.
        .replace(/\[\.\.\.(\w+?)\]/g, (_match, _) => `*`) // Convert catch-all params.
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`); // Convert dynamic params.

      // Remove trailing slashes from paths, except for the root path.
      if (path.endsWith("/") && path !== "/") {
        path = path.substring(0, path.length - 1);
      }

      // Warn if the page does not export a default React component.
      if (!pages[key].default) {
        console.warn(`${key} doesn't export a default React component`);
      }

      // Return the path and component for the route.
      return {
        path,
        component: pages[key].default,
      };
    })
    .filter((route) => Boolean(route.component)); // Ensure route has a valid component.

  return routes; // Return the generated route configurations.
};

const useLayouts = (layouts) => {
  const routes = Object.keys(layouts)
    .map((key) => {
      // Convert the file path to a route path.
      let path = key
        .replace("./app", "") // Remove the base directory.
        .replace(/\.(t|j)sx?$/, "") // Remove the file extension.
        .replace(/\/_layout$/i, "/") // Convert index files to root paths.
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase()) // Lowercase the first letter of the path.
        .replace(/\[\.\.\.(\w+?)\]/g, (_match, _) => `*`) // Convert catch-all params.
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => ``); // Convert dynamic params.

      // Remove trailing slashes from paths, except for the root path.
      if (path.endsWith("/") && path !== "/") {
        path = path.substring(0, path.length - 1);
      }

      // Warn if the page does not export a default React component.
      if (!layouts[key].default) {
        console.warn(`${key} doesn't export a default React component`);
      }

      // Return the path and component for the route.
      return {
        path,
        component: layouts[key].default,
      };
    })
    .filter((route) => Boolean(route.component)); // Ensure route has a valid component.

  return routes; // Return the generated route configurations.
};

export default Routes;
