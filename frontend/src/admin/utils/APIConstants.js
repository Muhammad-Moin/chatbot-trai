const APIConstants = {
  // import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  baseUrl:
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000/api/v1"
      : import.meta.env.VITE_API_URL_PRODUCTION,
  keyConfig: "key-config",
  documents: "documents",
  allUsers: "users-all",
  chatSession: "chat-sessions",
  chatHistory: "chat-history",
  chatHistoryDetail: "chat-history-detail",
};

export default APIConstants;

export const REGION = import.meta.env.VITE_REGION_NAME,
  AWS_ACCESS_KEY = import.meta.env.VITE_AWS_ACCESS_KEY,
  AWS_SECRET_KEY = import.meta.env.VITE_AWS_SECRET_KEY,
  AWS_BUCKET = import.meta.env.VITE_AWS_BUCKET,
  S3Path = `https://${AWS_BUCKET}.s3.${REGION}.amazonaws.com/`,
  JWT_SECRET_KEY = import.meta.env.VITE_JWT_SECRET_KEY;
