import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography, IconButton } from "@mui/material";
// import backgroundImage from "../../assets/background.webp";
import backgroundImage from "../../assets/background.webp";
import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  ThumbUpIcon,
  ThumbUpOutlined,
  ThumbDownIcon,
  ThumbDownOutlined,
  CheckIcon,
} from "./Icons";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ChatArea = ({
  messages,
  handleFeedBack,
  session_id,
  setMessages,
  handleSendMessage,
}) => {
  const messagesEndRef = useRef(null);
  const prevMessageCountRef = useRef(messages.length);
  const [copiedId, setCopiedId] = useState(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCountRef.current = messages.length; // Update previous message count
  }, [messages]);

  // Handle feedback updates
  const updateFeedback = (id, feedback) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, feed_back: feedback } : msg
      )
    );
  };

  const sampleQuestion = [
    { id: 1, text: "Salut! Comment ça va aujourd'hui?" },
    { id: 2, text: "Quelle est la météo pour demain?" },
    { id: 3, text: "Peux-tu me donner des conseils de voyage pour Paris?" },
    { id: 4, text: "Quelles sont les dernières nouvelles en France?" },
    { id: 5, text: "Peux-tu m'expliquer la recette d'une quiche lorraine?" },
  ];

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 2,
        borderRadius: 2,
        "&::-webkit-scrollbar": { width: "12px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "12px",
          border: "3px solid #f1f1f1",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "var(--color-scrollbar-thumb)",
        },
      }}
    >
      {messages?.length > 0 ? (
        messages.map((msg) => {
          const { question, response, feed_back, loading, id } = msg;

          return (
            <Box
              key={id}
              sx={{
                display: "flex",
                flexDirection: "column",
                marginY: 1,
                alignItems: "flex-start",
              }}
            >
              {/* Question Container */}
              <Paper
                sx={{
                  padding: 1,
                  borderRadius: 2,
                  backgroundColor: "var(--color-background)",
                  color: "#000",
                  maxWidth: "70%",
                  alignSelf: "flex-end",
                  marginBottom: 0.5,
                }}
              >
                <Typography className="font12" variant="body1">
                  {question}
                </Typography>
              </Paper>

              {/* Response Container */}
              <Paper
                sx={{
                  alignSelf: "flex-start",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 2,
                    }}
                  >
                    <Typography style={{ fontSize: 10 }}>Loading...</Typography>
                  </Box>
                ) : (
                  <div
                    style={{
                      backgroundColor: "var(--color-sidebar-hover-bg)",
                      borderRadius: 8,
                      padding: 6,
                      fontSize: 12,
                    }}
                  >
                    <Markdown
                      rehypePlugins={[rehypeRaw, rehypeSanitize, remarkGfm]}
                    >
                      {response}
                    </Markdown>
                  </div>
                )}

                {/* Reaction Buttons */}
                {!loading && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <CopyToClipboard
                      text={response}
                      onCopy={() => {
                        setCopiedId(id);
                        setTimeout(() => {
                          setCopiedId(null);
                        }, 2000);
                      }}
                    >
                      <IconButton>
                        {copiedId === id ? (
                          <CheckIcon className="width-height13" />
                        ) : (
                          <CopyAllIcon className="width-height13" />
                        )}
                      </IconButton>
                    </CopyToClipboard>

                    <IconButton
                      onClick={() =>
                        handleFeedBack.mutate(
                          { id: id, feed_back: true, session_id },
                          {
                            onSuccess: () => updateFeedback(id, true),
                          }
                        )
                      }
                    >
                      {feed_back === true ? (
                        <ThumbUpIcon className="width-height13" />
                      ) : (
                        <ThumbUpOutlined className="width-height13" />
                      )}
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleFeedBack.mutate(
                          { id, feed_back: false, session_id },
                          {
                            onSuccess: () => updateFeedback(id, false),
                          }
                        )
                      }
                    >
                      {feed_back === false ? (
                        <ThumbDownIcon className="width-height13" />
                      ) : (
                        <ThumbDownOutlined className="width-height13" />
                      )}
                    </IconButton>
                  </Box>
                )}
              </Paper>
            </Box>
          );
        })
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            height: "100%",
            width: { xs: "80%", md: "50%", sm: "80%" },
            padding: 2,
          }}
        >
          {/* Sample Questions */}
          <Box
            sx={{
              borderRadius: 2,
              maxWidth: "80%",
              width: "100%", // Ensure it takes full width on smaller screens
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h2" style={{ color: "var(--color-text)" }}>
              French Chatbot
            </Typography>
            <Typography variant="body2">
              AI chat may display inaccurate information, so double-check its
              responses.
            </Typography>
            <div className="sample-question-list">
              {sampleQuestion.map((question) => (
                <div
                  key={question.id}
                  className="sample-question-item"
                  onClick={() => {
                    handleSendMessage(question.text); // Pass the text directly
                  }}
                >
                  <span className="sample-question-text">{question.text}</span>
                </div>
              ))}
            </div>
          </Box>
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatArea;
