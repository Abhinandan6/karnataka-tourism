const API_URL = 'http://localhost:5000/api';

export const getItems = async () => {
  const res = await fetch(`${API_URL}/items`);
  return res.json();
};

export const addItem = async (name) => {
  const res = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return res.json();
};
