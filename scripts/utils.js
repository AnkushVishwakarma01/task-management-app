import AsyncStorage from "@react-native-async-storage/async-storage";

const ENDPOINT = 'https://task-management-server-five-navy.vercel.app/api';
async function getRequest(url) {
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(ENDPOINT+url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    // if (!response.ok) {
    //   throw new Error(`GET request failed with status: ${response.status}`);
    // }
    return await response.json();
  } catch (error) {
    console.error('Error in GET request:', error);
    throw error;
  }
}

async function postRequest(url, data) {
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(ENDPOINT+url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error in POST request:', error);
    throw error;
  }
}

async function putRequest(url, data) {
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(ENDPOINT+url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error in POST request:', error);
    throw error;
  }
}

async function deleteRequest(url) {
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(ENDPOINT+url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error in POST request:', error);
    throw error;
  }
}

export { getRequest, postRequest, putRequest, deleteRequest };