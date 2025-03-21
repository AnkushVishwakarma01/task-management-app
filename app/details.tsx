import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { putRequest } from '@/scripts/utils';

const Details = () => {
  const { id, title, description } = useLocalSearchParams();
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const router = useRouter();

  const update = () => {
    if (editedTitle === title && editedDescription === description) return;
    putRequest(`/tasks/${id}`, { title: editedTitle, description: editedDescription });
    router.replace('../(tabs)');
  };

  useEffect(() => {
    setEditedTitle(Array.isArray(title) ? title.join(', ') : title || '');
    setEditedDescription(Array.isArray(description) ? description.join(', ') : description || '');
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Task Details</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Title:</Text>
        <Text style={styles.value}>{editedTitle || 'No Title Provided'}</Text>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.value, styles.input]}
          value={editedDescription}
          onChangeText={(text) => setEditedDescription(text)}
          onEndEditing={update}
          placeholder="Enter description"
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={update}>
          <Text style={styles.addButtonText}>Save</Text>
        </TouchableOpacity>
        {/* <Text style={styles.value}>{description || 'No Description Provided'}</Text> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    color: '#555',
    height: 500,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Details;