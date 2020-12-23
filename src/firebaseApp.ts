import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import 'firebase/performance'

const firebaseConfig = {
  apiKey: 'AIzaSyAUab2JSvJiA1TDQgc2EvJqZxhXoyL9yWM',
  authDomain: 'vices-26504.firebaseapp.com',
  projectId: 'vices-26504',
  storageBucket: 'vices-26504.appspot.com',
  messagingSenderId: '498029950481',
  appId: '1:498029950481:web:d90018cc838feb5c0563b0',
  measurementId: 'G-8CGR6LM1JV',
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()
const storageRef = storage.ref() // not sure if this should be done in the file where it's used

export { firebase, db, auth, storageRef }

// types
export interface TobaccoPurchase {
  date: firebase.firestore.Timestamp
  name: string
  amount: number
  description: null | string
  imageUrl: null | string
}
