import api from '../plugins/axios';

export const fetchResource = async resource => {
  const response = await api.get(`/${resource}`);
  return response.data;
};

export const createResource = async (resource, payload) => {
  const response = await api.post(`/${resource}`, payload);
  return response.data;
};

export const updateResource = async (resource, id, payload) => {
  const response = await api.put(`/${resource}/${id}`, payload);
  return response.data;
};

export const deleteResource = async (resource, id) => {
  const response = await api.delete(`/${resource}/${id}`);
  return response.data;
};
