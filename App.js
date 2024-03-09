import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, SafeAreaView, ScrollView } from 'react-native';
import { firestore,collection,addDoc,serverTimestamp,MESSAGES } from './firebase/Config';
import { useEffect, useState } from 'react';
import { QuerySnapshot, onSnapshot, orderBy, query } from 'firebase/firestore';
import { convertFirebaseTimeStampToJS } from './helpers/Function';

export default function App() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const save = async() => {
    const docRef = await addDoc(collection(firestore, MESSAGES), {
      text: newMessage,
      created: serverTimestamp()
    }).catch (error => console.log(error))

    setNewMessage('')
    console.log('Message saved.')
  }

  useEffect(() => {
    const q = query(collection(firestore,MESSAGES),orderBy('created','desc'))
    
    const unsubscribe = onSnapshot(q,(querySnapshot) => {
      const tempMessages =[]

      querySnapshot.forEach((doc) => {
        const messageObject = {
          id: doc.id,
          text: doc.date().text,
          created: convertFirebaseTimeStampToJS(doc.data().created)
        }

        tempMessages.push(messageObject)
      })
      setMessages(tempMessages)
    })
    return() => {
      unsubscribe()
    }
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {
          messages.map((message) =>(
            <View style={styles.message} key={message.id}>
              <Text style={styles.messageInfo}>{message.created}</Text>
              <Text>{message.text}</Text>
            </View>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10
  },
  messageInfo: {
    fontSize: 12
  }
});
