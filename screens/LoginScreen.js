import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert, StyleSheet } from 'react-native';
import { themeColors } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        Alert.alert('Error: ', error.message);
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password Reset Email Sent', 'Check your email inbox for instructions.');
    } catch (error) {
      Alert.alert('Error', `Failed to send password reset email. ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeftIcon size={20} color="black" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/app_login.webp')} style={styles.logo} />
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="email"
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="password"
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.orText}>Or</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('../assets/icons/google.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('../assets/icons/facebook.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.signUpLink}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLinkText}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
  },
  safeArea: {
    flex: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  backButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 10,
    height: 40
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'white',
    padding: 20,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    color: '#333',
    marginLeft: 20,
  },
  input: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginBottom: 10,
  },
  forgotPassword: {
    flex: 0,
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: '#333',
    marginBottom: 5,
  },
  loginButton: {
    padding: 20,
    backgroundColor: '#4285F4',
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 20,
    marginVertical: 10,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    padding: 20,
    backgroundColor: '#EEE',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  signUpLink: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#777',
    fontWeight: 'bold',
  },
  signUpLinkText: {
    fontWeight: 'bold',
    color: '#4285F4',
  },
});