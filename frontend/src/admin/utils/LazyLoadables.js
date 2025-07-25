import Loadable from "../ui-component/Loadable";
import { lazy } from "react";



// Not Found
const NotFound = Loadable(lazy(() => import("../views/NotFound")));
const Chatbot = Loadable(lazy(() => import("../views/Chatbot")));

export { Chatbot, NotFound };
