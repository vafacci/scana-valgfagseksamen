import AsyncStorage from '@react-native-async-storage/async-storage';
import usersData from '../data/users.json';

const USERS_KEY = '@scana_users';

export function useUsers() {
  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_KEY);
      if (storedUsers) {
        return JSON.parse(storedUsers);
      } else {
        // Initialize with default users from JSON file
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(usersData));
        return usersData;
      }
    } catch (error) {
      console.error('Error loading users:', error);
      return usersData; // Fallback to default users
    }
  };

  const saveUsers = async (users) => {
    try {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  const addUser = async (userData) => {
    try {
      const users = await loadUsers();
      const newUser = {
        id: Date.now().toString(),
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString(),
      };
      
      const updatedUsers = [...users, newUser];
      await saveUsers(updatedUsers);
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const findUser = async (email, password) => {
    try {
      const users = await loadUsers();
      return users.find(user => user.email === email && user.password === password);
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const users = await loadUsers();
      return users.some(user => user.email === email);
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  return {
    loadUsers,
    saveUsers,
    addUser,
    findUser,
    checkEmailExists,
  };
}
