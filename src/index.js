import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    limit,
    getDoc, updateDoc, setDoc, getDocs
} from 'firebase/firestore'
import{
  getAuth, 
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBgQ1RBRZWP4r9KIm75Maui0GTrXZGP7P8",
    authDomain: "fortress-b92fa.firebaseapp.com",
    projectId: "fortress-b92fa",
    storageBucket: "fortress-b92fa.appspot.com",
    messagingSenderId: "572750940589",
    appId: "1:572750940589:web:3a081051559f18e0837924"
  };

// init firebase app
initializeApp(firebaseConfig)


// init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'reports')

// queries
const q = query(colRef, orderBy('createdAt', 'desc'))
console.log(colRef)
// real time collection data

const unsubCol = onSnapshot(q, (snapshot) => {
  let reports = []
    snapshot.docs.forEach((doc) => {
      reports.push({ ...doc.data(), id: doc.id })
    })
    console.log(reports)
})


// adding docs
const addReportForm = document.querySelector('.add')
addReportForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    scamtype: addReportForm.scamtype.value,
    moreinfo: addReportForm.moreinfo.value,
    lowagerange: addReportForm.lowagerange.value,
    upagerange: addReportForm.upagerange.value,
    createdAt: serverTimestamp()
    
  })
  .then(() => {
    addReportForm.reset()
    //window.location.reload()
  })
  
})

// deleting docs
const deleteReportForm = document.querySelector('.delete')
deleteReportForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'reports', deleteReportForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteReportForm.reset()
      //window.location.reload()
    })

})

// get a single document
const docRef = doc(db, 'reports', 'RqS7NB0JChb1jTpydjjR')

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
})

// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'reports', updateForm.id.value)
  
  updateDoc(docRef, {
    scamtype: 'updated scamtype'
  })
  .then(() => {
    updateForm.reset()
    //window.location.reload()
  })

})

// displaying reports
let reportList = document.getElementById('reportlist')

let currentList = q

let nbrCalls = 0
const unsubList = onSnapshot(currentList, (querySnapshot) => {
  let reports = []
  nbrCalls++
  let num = 0
  
  if(nbrCalls >= 1){
    while(reportList.hasChildNodes()) {
      reportList.removeChild(reportList.firstChild)
    }
    querySnapshot.docs.forEach((doc) => {
    
    reports.push({ ...doc.data(), id: doc.id })
    
    

    let li = document.createElement('li')
    let scamtype = document.createElement('span')
    let moreinfo = document.createElement('span')
    let lowagerange = document.createElement('span')
    let upagerange = document.createElement('span')
    li.setAttribute('data-id', doc.id)
    scamtype.textContent = doc.data().scamtype
    moreinfo.textContent = doc.data().moreinfo
    lowagerange.textContent = doc.data().lowagerange
    upagerange.textContent = doc.data().upagerange

    li.appendChild(scamtype)
    li.appendChild(moreinfo)
    li.appendChild(lowagerange)
    li.appendChild(upagerange)

    
    reportList.append(li)
    
    num++
    
    
  })
  
  nbrCalls = 0
}
  
})

// query for particular scam
const r = query(colRef, where("scamtype", "==", "Crypto Scam"))
const byCryptoscam = document.querySelector('.scams')
byCryptoscam.addEventListener('click', () => {

  currentList = r


})



// let nbrCalls = 0
// const unsubList = onSnapshot(q, (querySnapshot) => {
//   let reports = []
//   nbrCalls++
//   if(nbrCalls > 1){querySnapshot.docs.forEach((doc) => {
//     reports.push({ ...doc.data(), id: doc.id })

//     let li = document.createElement('li')
//     let moreinfo = document.createElement('span')
//     let scamtype = document.createElement('span')
//     let agerange = document.createElement('span')
//     let country = document.createElement('span')
//     li.setAttribute('data-id', doc.id)
//     moreinfo.textContent = doc.data().moreinfo
//     scamtype.textContent = doc.data().scamtype
//     agerange.textContent = doc.data().agerange
//     country.textContent = doc.data().country

//     li.appendChild(moreinfo)
//     li.appendChild(scamtype)
//     li.appendChild(agerange)
//     li.appendChild(country)

    
//     reportList.append(li)
    
//   })
//   nbrCalls = 0
// }
  
// })

// signing user up
const signupform = document.querySelector('.signup')
signupform.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupform.email.value
  const password = signupform.password.value

  createUserWithEmailAndPassword(auth, email, password)
  .then((cred) => {
    //console.log('user created:',cred.user)
    signupform.reset()
  })
  .catch((err) => {
    console.log(err.message)
  })

})

// logging users in and out

const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {

    signOut(auth)
    .then(() => {
      //console.log('the user signed out')
    })
    .catch((err) => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
  .then((cred) => {
    //console.log('user logged in:', cred.user)
  })
  .catch((err) => {
    console.log(err.message)
  })
})

//subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed:', user)

})


//unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
    unsubList()
})