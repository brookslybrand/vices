import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(config)
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
