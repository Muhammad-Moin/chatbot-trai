// project imports
import MainLayout from "../layout/MainLayout";
import {
  Chatbot,
  NotFound
} from "../utils/LazyLoadables";
import ChatHistory from "../views/components/ChatHistory";
import ProtectedRoute from "./ProtectedRoutes";

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: "/chat",
      // exact: true,
      element: <Chatbot />,
      children: [
        {
          path: "/c/:session_id",
          element: <ChatHistory />,
        },
      ],
    },
  ],
};

export default MainRoutes;
