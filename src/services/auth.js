const USERS_URL = 'https://fakestoreapi.com/users';

export async function fetchUsers() {
  const response = await fetch(USERS_URL);
  if (!response.ok) {
    throw new Error('Could not load users. Please try again.');
  }
  return response.json();
}

export async function loginWithCredentials(username, password) {
  const normalizedUsername = username.trim();
  const users = await fetchUsers();
  const match = users.find(
    (user) => user.username === normalizedUsername && user.password === password,
  );

  if (!match) {
    throw new Error('Invalid username or password.');
  }

  return match;
}
