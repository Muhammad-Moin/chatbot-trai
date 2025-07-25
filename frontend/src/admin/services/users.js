import NetworkRequest from "../utils/NetworkRequest";
import APIConstants from "../utils/APIConstants";

// For Users
export const fetchAllUsers = async (page) => {
  const response = await NetworkRequest.get(
    `${APIConstants.allUsers}?page=${page}`
  );

  return response.data;
};
