import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AddBoxIcon, MenuIcon } from "../components/Icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  fetchSessions,
  fetchChatHistoryById,
  updateFeedbackChatHistoryById,
  deleteSessionById,
  createChathistory,
  createSession,
} from "../Services/chat";
import SettingsMenu from "../components/SettingsMenu";
import ChatSession from "../components/ChatSession";
import ChatHistory from "../components/ChatHistory";
import "./style.css";
import { showFaliureToast, showSuccessToast } from "../../utils/AppToast";
import AppUtilities from "../../utils/AppUtilities";


import Loader from "../../ui-component/Loader";

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const { session_id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (!session_id) {
      setMessages([]);
      navigate("/c/0");
    }
  }, [session_id, navigate]);

  // Fetch Sessions data
  const { data: menuItems, isLoading: loadingSessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    staleTime: 1000,
  });

  // Handle Delete Session
  const deleteSessionMutation = useMutation({
    mutationFn: deleteSessionById,
    onSuccess: () => {
      showSuccessToast("Session Deleted Successfully");
      navigate("/c/0");
      queryClient.invalidateQueries(["sessions"]);
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.error || "Error deleting session";
      showFaliureToast(errorMessage);
    },
  });

  // Fetch ChatHistory data when id changes
  const fetchChatHistoryMutation = useMutation({
    mutationFn: () => {
      // Check if session_id is non-zero before making the API call
      if (session_id !== String(0)) {
        return fetchChatHistoryById(session_id);
      } else {
        return [];
      }
    },
    onSuccess: (data) => {
      setMessages(data);
    },
    onError: (err) => console.error("Error fetching chat history:", err),
  });

  // Handle Create Chat History inside the Session
  const createOnSendMutation = useMutation({
    mutationFn: async ({ input }) => {
      let currentSessionId = session_id;

      if (currentSessionId === "0") {
        const newSession = await createSession({
          session_name: input,
        });
        currentSessionId = newSession.id; // Use the newly created session ID
        navigate(`/c/${currentSessionId}`);
        queryClient.invalidateQueries(["sessions"]);
      }

      // Create chat history with the valid session ID
      return createChathistory(currentSessionId, input);
    },
    onSuccess: (data, variables) => {
      // Update messages state with the response
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.question === variables.input
            ? { ...msg, id: data.id, response: data.response, loading: false }
            : msg
        )
      );
    },
  });

  // Update Feedback mutation
  const handleFeedBack = useMutation({
    mutationFn: ({ id, feed_back }) => {
      const existingMessage = messages.find((msg) => msg.id === id);

      // Check if feedback is the same as the existing one
      if (existingMessage && existingMessage.feed_back === feed_back) {
        return Promise.resolve(existingMessage); // Return existing message as a resolved promise
      }

      // Call the API if feedback is different
      return updateFeedbackChatHistoryById(id, feed_back, session_id);
    },
    onSuccess: (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
        )
      );
    },
    onError: (err) => console.error("Error updating feedback:", err),
  });

  // Adjust sidebar visibility based on screen width
  const handleResize = useCallback(
    AppUtilities.debounce(() => {
      setIsOpen(window.innerWidth >= 768);
    }, 200),
    []
  );

  // Effect hook to handle screen resize events
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // Memoized class name for main content
  const mainContentClass = useMemo(
    () => `main-content ${isOpen ? "shifted" : ""}`,
    [isOpen]
  );

  // Memoized class name for Chat History Container
  const historyContainer = useMemo(
    () => `history-container ${isOpen ? "shifted" : ""}`,
    [isOpen]
  );

  // Loading and error handling
  if (loadingSessions) return <Loader />; // Show loader if loading sessions

  return (
    <div className="layout">
      <div className="header">
        <div className="icon-settings" style={{ display: "flex", gap: 10 }}>
          <MenuIcon onClick={toggleSidebar} className="menu-icon" />
        </div>
        <div className="icon-settings" style={{ position: "relative" }}>
          <SettingsMenu />
        </div>
      </div>

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <MenuIcon onClick={toggleSidebar} className="menu-icon" />
          {isOpen && (
            <AddBoxIcon
              onClick={() => navigate("c/0")}
              className="chat-icon visible"
            />
          )}
        </div>
        {isOpen && (
          <ChatSession
            session_id={session_id}
            menuItems={menuItems}
            onDelete={deleteSessionMutation}
          />
        )}
      </div>

      <div className={mainContentClass}>
        <ChatHistory
          historyContainer={historyContainer}
          onSend={createOnSendMutation}
          fetchChatHistoryMutation={fetchChatHistoryMutation}
          session_id={session_id}
          messages={messages}
          setMessages={setMessages}
          handleFeedBack={handleFeedBack}
        />
      </div>
    </div>
  );
};

export default AIChatBot;
