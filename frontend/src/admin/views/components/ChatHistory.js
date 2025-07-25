import React, { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { SendIcon } from "./Icons";
import ChatArea from "./ChatArea";
import Spinner from "./Spinner";

const ChatHistory = ({
  fetchChatHistoryMutation,
  session_id,
  messages,
  setMessages,
  handleFeedBack,
  onSend,
  historyContainer,
}) => {
  const [input, setInput] = useState("");
  const [lastId, setLastId] = useState(null);

  // Fetch the chat history when session_id changes
  useEffect(() => {
    if (lastId !== session_id) {
      fetchChatHistoryMutation.mutate(session_id);
      setLastId(session_id);
    }
    if (session_id === "0") {
      setMessages([]);
    }
  }, [session_id, lastId]);

  const handleSendMessage = (input) => {
    // Add a new message with loading state
    setMessages((prev) => [
      ...prev,
      { question: input, response: "", loading: true },
    ]);

    // Trigger the mutation with both session_id and input
    onSend.mutate({ session_id, input });
    setInput("");
  };

  // Handle "Enter" key press to send a message
  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleSendMessage(input);
  };

  return (
    <div className={historyContainer}>
      {/* Input Field */}
      <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="outlined"
        fullWidth
        placeholder="Type your message..."
        className="send-input-question"
        sx={{ boxSizing: "none" }} // Fix: Use double curly braces
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SendIcon
                className="send-box"
                onClick={() => handleSendMessage(input)}
              />
            </InputAdornment>
          ),
        }}
      />
      <Spinner mutationFunc={fetchChatHistoryMutation} spinnerSize={35} />
      <ChatArea
        messages={messages}
        handleFeedBack={handleFeedBack}
        session_id={session_id}
        setMessages={setMessages}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatHistory;
