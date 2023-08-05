import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import "./App.css";
import {Protected,Navbar} from "./components"
import { Signin,Signup,Home,Profile,Explore,Error } from  "./pages"

const Layout = () => {
  return (
    <div className="md:w-8/12 mx-auto">
      <Navbar />
      <Outlet></Outlet>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Protected><Home /></Protected>,
      },
      {
        path: "/profile/:id",
        element: <Protected><Profile /></Protected>,
      },
      {
        path: "/explore",
        element: <Protected><Explore /></Protected>,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
