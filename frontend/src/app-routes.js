import { lazy } from "react";
import Loadable from "./admin/ui-component/Loadable";
import ChatHistory from "./admin/views/components/ChatHistory";

/* ***Layouts**** */
const Admin = Loadable(lazy(() => import("./admin")));


const Router = [
  {
    path: "/admin/*",
    element: <Admin />, // Removed JSX syntax here
  },

];

export default Router;
