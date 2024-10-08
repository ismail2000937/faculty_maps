import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { themeColors } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const checkEmailVerification = () => {
      const user = auth.currentUser;
      if (user) {
        setIsEmailVerified(user.emailVerified);
      }
    };

    checkEmailVerification();
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (email && password) {
      if (!isValidEmail(email)) {
        Alert.alert('Please enter a valid email address');
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await sendEmailVerification(user); // Envoyer l'e-mail de vérification
        Alert.alert('Sign up successful!', 'Please check your email for verification.');
      } catch (error) {
        Alert.alert('Error: ', error.message);
      }
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        if (user.emailVerified) {
          navigation.navigate('HomeScreen');
        } else {
          Alert.alert('Please verify your email before signing in.');
        }
      }
    } catch (error) {
      Alert.alert('Error: ', error.message);
    }
  };

  useEffect(() => {
    // Rediriger l'utilisateur vers l'écran Home si son email est vérifié
    if (isEmailVerified) {
      navigation.navigate('HomeScreen');
    }
  }, [isEmailVerified]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeftIcon size={20} color="black" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/signup.webp')}
              style={styles.logo}
            />
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(value) => setEmail(value)}
            placeholder="exemple@ucd.ac.ma"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={(value) => setPassword(value)}
            placeholder="Enter Password"
          />
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signinButton}
            onPress={handleSignIn}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.orText}>Or</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../assets/icons/google.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../assets/icons/facebook.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    width: 250,
    height: 200,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'white',
    padding: 20,
    marginTop: 20,
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
  signupButton: {
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
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#777',
    fontWeight: 'bold',
  },
  loginLinkText: {
    fontWeight: 'bold',
    color: '#4285F4',
  },
  googleButton: {
    backgroundColor: themeColors.google,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default SignUpScreen;
