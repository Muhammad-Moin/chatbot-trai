import NetworkRequest from "../../utils/NetworkRequest";
import APIConstants from "../../utils/APIConstants";

//  ----------------Sessions----------------
export const createSession = async (body) =>
  await NetworkRequest.post(`${APIConstants.chatSession}/`, body).then(
    (res) => res.data
  );

export const fetchSessions = async () =>
  await NetworkRequest.get(APIConstants.chatSession).then((res) => res.data);

export const deleteSessionById = async (id) =>
  await NetworkRequest.delete(`${APIConstants.chatSession}/${id}`).then(
    (res) => res.data
  );

//  ----------------ChatHistory----------------
export const fetchChatHistoryById = async (session_id) =>
  await NetworkRequest.get(`${APIConstants.chatHistory}/${session_id}`).then(
    (res) => res.data
  );

export const createChathistory = async (session_id, input) =>
  await NetworkRequest.post(`${APIConstants.chatHistory}/${session_id}/`, {
    question: input,
  }).then((res) => res.data);

export const updateFeedbackChatHistoryById = async (
  id,
  feed_back,
  session_id
) =>
  await NetworkRequest.put(`${APIConstants.chatHistoryDetail}/${id}/`, {
    feed_back: feed_back,
    session: session_id,
  }).then((res) => res.data);
