import NetworkRequest from "../utils/NetworkRequest";
import APIConstants from "../utils/APIConstants";

//  For Documents
export const createDocument = async(body) =>
  await NetworkRequest.post(APIConstants.documents, body).then((res) => res.data);
// export const fetchDocuments = (page, pageSize) => api.get(`${API_URL}/documents?limit=${pageSize}&offset=${(page-1 ) * pageSize}`).then(res => res.data);

export const fetchDocuments = async(page) =>
  await NetworkRequest.get(`${APIConstants.documents}?page=${page}`).then(
    (res) => res.data
  );

export const deleteDocumentById = async(documentId) =>
  await NetworkRequest.delete(`${APIConstants.documents}/${documentId}`).then(
    (res) => res.data
  );

// For Key
export const updateConfigurationKey = (body) =>
  NetworkRequest.put(`${APIConstants.keyConfig}/${body.id}`, body).then(
    (res) => res.data
  );

export const fetchConfigurationsKeys = async () => {
  const response = await NetworkRequest.get(APIConstants.keyConfig);
  return response.data;
};
