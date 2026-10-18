import AsyncStorage from '@react-native-async-storage/async-storage';
import usersData from '../data/users.json';
import { hashPassword, publicUser } from './password';

const USERS_KEY = '@scana_users';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export async function loadUsers() {
  try {
    const storedUsers = await AsyncStorage.getItem(USERS_KEY);
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(usersData));
    return usersData;
  } catch (error) {
    console.error('Error loading users:', error);
    return usersData;
  }
}

export async function saveUsers(users) {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

export async function addUser(userData) {
  const users = await loadUsers();
  const email = normalizeEmail(userData.email);
  const newUser = {
    id: Date.now().toString(),
    name: userData.name || (email ? email.split('@')[0] : 'Scana'),
    email,
    password: await hashPassword(userData.password),
    provider: userData.provider || 'email',
    providerId: userData.providerId || null,
    createdAt: new Date().toISOString(),
  };

  await saveUsers([...users, newUser]);
  return publicUser(newUser);
}

export async function authenticateUser(email, password) {
  const users = await loadUsers();
  const normalized = normalizeEmail(email);
  const index = users.findIndex((user) => normalizeEmail(user.email) === normalized);
  if (index < 0) return null;

  const user = users[index];
  const hashed = await hashPassword(password);
  const match = user.password === hashed || user.password === password;
  if (!match) return null;

  if (user.password === password) {
    users[index] = { ...user, password: hashed };
    await saveUsers(users);
  }

  return publicUser(users[index]);
}

export async function checkEmailExists(email) {
  const users = await loadUsers();
  const normalized = normalizeEmail(email);
  return users.some((user) => normalizeEmail(user.email) === normalized);
}

export async function findUserByProvider(provider, providerId) {
  const users = await loadUsers();
  const user = users.find((item) => {
    if (item.provider !== provider) return false;
    if (providerId) return item.providerId === providerId;
    return true;
  });
  return publicUser(user);
}

export async function upsertProviderUser(profile) {
  const provider = profile?.provider;
  const providerId = profile?.providerId ? String(profile.providerId) : '';
  const email = normalizeEmail(profile?.email);
  const name = profile?.name || (email ? email.split('@')[0] : provider);

  if (!provider || !providerId) {
    const error = new Error('invalid_social_profile');
    error.code = 'login_failed';
    throw error;
  }

  const users = await loadUsers();
  const byProvider = users.findIndex(
    (item) => item.provider === provider && String(item.providerId || '') === providerId
  );
  if (byProvider >= 0) {
    const updated = {
      ...users[byProvider],
      name: name || users[byProvider].name,
      email: email || users[byProvider].email,
    };
    users[byProvider] = updated;
    await saveUsers(users);
    return publicUser(updated);
  }

  if (email) {
    const byEmail = users.findIndex((item) => normalizeEmail(item.email) === email);
    if (byEmail >= 0) {
      const updated = {
        ...users[byEmail],
        name: name || users[byEmail].name,
        provider,
        providerId,
      };
      users[byEmail] = updated;
      await saveUsers(users);
      return publicUser(updated);
    }
  }

  return addUser({
    name,
    email: email || `${provider}.${providerId}@scana.local`,
    password: `${provider}-${providerId}-${Date.now()}`,
    provider,
    providerId,
  });
}

export async function updateUserPassword(email, newPassword) {
  const users = await loadUsers();
  const normalized = normalizeEmail(email);
  const index = users.findIndex((user) => normalizeEmail(user.email) === normalized);
  if (index < 0) return false;

  users[index] = {
    ...users[index],
    password: await hashPassword(newPassword),
  };
  await saveUsers(users);
  return true;
}

export function useUsers() {
  return {
    loadUsers,
    saveUsers,
    addUser,
    checkEmailExists,
    authenticateUser,
    findUserByProvider,
    upsertProviderUser,
    updateUserPassword,
  };
}
