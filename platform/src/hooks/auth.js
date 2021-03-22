import { useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue-demi";
import { tryOnUnmounted } from "@vueuse/shared";

import firebase from "firebase/app";
import "firebase/auth";

const user = ref();
const ready = ref(false);

export default function useAuth() {
  const router = useRouter();

  const verifier = ref({
    verifier: undefined,
    confirm: undefined,
    ready: false,
  });

  function createVerifier(id) {
    verifier.value.verifier = new firebase.auth.RecaptchaVerifier(id, {
      size: "invisible",
      callback: () => {
        verifier.value.ready = true;
      },
    });

    return verifier;
  }

  function sendCode(number) {
    return firebase
      .auth()
      .signInWithPhoneNumber(number, verifier.value.verifier)
      .then((result) => {
        verifier.value.confirm = result;
      });
  }

  function confirmCode(code) {
    return verifier.value.confirm.confirm(code).then(async (result) => {
      if (result.user) {
        result.user.token = await result.user.getIdToken();
        user.value = result.user;
      }

      return user;
    });
  }

  function logout() {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        user.value = undefined;
      });
  }

  onMounted(() => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        apiKey: "AIzaSyC6027fdlkSs8FNuZMJp9_2eKJaRw5WhXU",
        authDomain: "mit-oersted.firebaseapp.com",
        projectId: "mit-oersted",
        storageBucket: "mit-oersted.appspot.com",
        messagingSenderId: "130966417605",
        appId: "1:130966417605:web:33911dba91726af21540ac",
      });

      firebase.auth();
    }

    const unsubscribe = firebase.auth().onAuthStateChanged(async (state) => {
      if (state) {
        state.token = await state.getIdToken();
        user.value = state;
      }
      ready.value = true;
    });

    tryOnUnmounted(() => {
      unsubscribe();
    });
  });

  return {
    ready,
    user,
    createVerifier,
    sendCode,
    confirmCode,
    logout,
  };
}

export function onAuthorized(callback) {
  watch([ready, user], () => {
    callback(user);
  });
}
