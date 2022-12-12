import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
}

const create = (personObject) => {
  const request = axios.post(baseUrl, personObject);
  return request.then(response => response.data);
}

const remove = (personId) => {
  const request = axios.delete(`${baseUrl}/${personId}`);
  return request.then(response => response.data);
}

const update = (personId, personObject) => {
  const request = axios.put(`${baseUrl}/${personId}`, personObject);
  return request.then(response => response.data);
}

const personsApi = { getAll, create, remove, update };

export default personsApi;