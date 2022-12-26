
async function signUp(e) {
  e.preventDefault();
  const email = document.querySelector('#signupEmail');
  const password = document.querySelector('#signupPassword');
  // console.log(email.value,password.value);
  try {
    const result = await firebase.auth().createUserWithEmailAndPassword(email.value, password.value);

    await result.user.updateProfile({
      displayName: "User"
    })

    createUserCollection(result.user)

    await result.user.sendEmailVerification()

    console.log(result);

    alert(`welcome ${result.user.email}`);
    window.location = "http://localhost:5500/public/studenthome.html"
  }

  catch (err) {
    console.log(err);
    alert(err.message);
  }

  email.value = "";
  password.value = "";
}

async function login(e) {
  e.preventDefault();
  const email = document.querySelector('#loginEmail');
  const password = document.querySelector('#loginPassword');
  // console.log(email.value,password.value);
  try {
    const result = await firebase.auth().signInWithEmailAndPassword(email.value, password.value);
    console.log(result);
    alert(`welcome ${result.user.email}`);
    window.location = "http://localhost:5500/public/studenthome.html"
  } catch (err) {
    console.log(err);
    alert(err.message);
  }

  email.value = "";
  password.value = "";
}

function logOut() {
  firebase.auth().signOut()
  document.querySelector('#proimg').src="./assets/student.png";
  window.location = "http://localhost:5500/public/login.html"

}

const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
    // getUserInfo(user.uid)
    getUserInfoRealTime(user.uid)
    // window.location = "http://localhost:5500/public/studenthome.html"
  } else {
    console.log("signed out user");
    alert("Sign out success")
    // window.location = "http://localhost:5500/public/login.html"
    // getUserInfo(null)
    getUserInfoRealTime(null)
  }
});

async function loginWithGoogle() {
  try {
    var provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider)
    console.log(result);
    window.location = "http://localhost:5500/public/studenthome.html"
  }
  catch (err) {
    console.log(err);
  }
}