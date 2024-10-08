import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, TextInput, Alert, SafeAreaView, FlatList } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';

import { Ionicons } from '@expo/vector-icons';

const DetailsScreen = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const commentsCollectionRef = collection(db, 'comments');
      const querySnapshot = await getDocs(commentsCollectionRef);
      const commentsData = [];
      querySnapshot.forEach(doc => {
        commentsData.push({ id: doc.id, ...doc.data() });
      });
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error fetching comments. Please try again later.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleEmailPress = () => {
    const email = 'Tarik.I482@ucd.ac.ma';
    Linking.openURL(`mailto:${email}`);
  };

  const handleSubmitComment = async () => {
    try {
      if (comment.trim() === '') {
        Alert.alert('Please enter a comment');
        return;
      }

      const commentData = {
        userId: auth.currentUser.uid,
        comment,
        userEmail: auth.currentUser.email,
        timestamp: new Date().toISOString(),
      };

      const commentsCollectionRef = collection(db, 'comments');
      await addDoc(commentsCollectionRef, commentData);

      Alert.alert('Comment submitted successfully');
      setComment('');
    
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error submitting comment. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Administration Contact</Text>
        <Text>Doyen: Abdellah Boudraa</Text>
        <Text>Secretary: Amina Benmokhtar</Text>
        <Text>Contact: Tarik.I482@ucd.ac.ma</Text>
        <TouchableOpacity style={styles.button} onPress={handleEmailPress}>
          <Text style={styles.buttonText}>Contact Administration</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Add Comment</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your comment"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmitComment}>
          <Text style={styles.buttonText}>Submit Comment</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.commentContainer}>
            <Text>Comment : {item.comment}</Text>
            <Text style={styles.commentUserId}>User : {item.userEmail.split('@')[0]}</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.commentSection}>
            <Text style={styles.title}>Comments</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#064868',
    padding: 10,
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentSection: {
    flex: 1,
  },
  commentContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentUserId: {
    marginTop: 5,
    color: 'gray',
  },
});

export default DetailsScreen;
