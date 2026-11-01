import { API_URL } from '../api';

// One place that talks to the syllabus part of the backend.
async function request(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Check your connection and that the backend is running.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* the reply had no body */
  }

  if (res.status === 401) {
    // The login has expired: clear it and go back to the login page
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.assign('/login');
    throw new Error('Your session has expired. Please log in again.');
  }
  if (!res.ok) throw new Error((data && data.message) || 'Something went wrong.');
  return data;
}

// selection = { category, deptId, sem, schemeId }
export const listSyllabi = (selection) =>
  request(`/syllabi?${new URLSearchParams({ ...selection, sem: String(selection.sem) })}`);

export const createSyllabus = (selection, course) =>
  request('/syllabi', { method: 'POST', body: { ...selection, course } });

export const getSyllabus = (id) => request(`/syllabi/${id}`);

export const updateSyllabus = (id, course) =>
  request(`/syllabi/${id}`, { method: 'PUT', body: { course } });

export const deleteSyllabus = (id) => request(`/syllabi/${id}`, { method: 'DELETE' });
