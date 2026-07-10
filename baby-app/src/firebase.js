import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const app = initializeApp({
  apiKey: "AIzaSyDW8o_odngQSWuhoxTOVKLdA-ukgVv4m6E",
  authDomain: "msdm-mobile-invitation.firebaseapp.com",
  databaseURL: "https://msdm-mobile-invitation-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "msdm-mobile-invitation",
  storageBucket: "msdm-mobile-invitation.appspot.com",
  messagingSenderId: "440320271279",
  appId: "1:440320271279:web:485377ffbeb9d8ee68455a",
})

export const db = getDatabase(app)
