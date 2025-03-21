import React, { useState, useEffect, useCallback } from 'react';
import {useFocusEffect} from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { deleteRequest, getRequest, postRequest } from '@/scripts/utils';

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<{ id: string; title: string; description: string; completed: boolean }[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const logout = () => {
    AsyncStorage.removeItem('token').then(() => {
      router.replace('../login');
    });
  };

  const handleAddTask = async () => {
    if (title.trim() && description.trim()) {
      const newTask = { id: '0', title, description, completed: false };
      const response = await postRequest('/tasks', newTask);
      setTasks([...tasks, response]);
      setTitle('');
      setDescription('');
    }
  };

  const handleCompleteTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    deleteRequest(`/tasks/${id}`);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);

    fetchAllTasks().then(() => {
      setIsRefreshing(false);
    });
  };

  const navigateToDetails = (id: string, title: string, description: string) => {
    router.push({ pathname: '/details', params: { id, title, description } });
  };

  const fetchAllTasks = async () => {
    const tasks = await getRequest('/tasks');
    if (tasks.error) return logout();
    setTasks(tasks);
  }

  useFocusEffect(useCallback(() => {
    fetchAllTasks();
  }, []));

  useEffect(() => {
    AsyncStorage.getItem('token', (err, result) => {
      if (!result) {
        logout();
      }
      fetchAllTasks();
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'flex-end' }}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.addButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>Task Manager</Text>

      {/* Input fields for title and description */}
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => handleCompleteTask(item.id)} style={{ flex: 2 }}>
              <Text style={[styles.taskText, item.completed && styles.completedTask]}>
                {item.title}
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', columnGap: 10 }}>
              <TouchableOpacity onPress={() => navigateToDetails(item.id, item.title, item.description)}>
                <IconSymbol size={28} name="info.circle" color={'blue'} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <IconSymbol size={28} name="trash.fill" color={'red'} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh} // Trigger refresh when pulled
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskText: {
    fontSize: 16,
    maxWidth: '60%',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#A9A9A9',
  },
  deleteButton: {
    color: 'red',
    fontSize: 14,
  },
  editButton: {
    color: 'blue',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    alignItems: 'center',
    width: '45%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});