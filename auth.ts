import { auth as firebaseAuth } from './app';
import * as firebase from 'firebase/app';

export enum SignInMethod {
  Google,
  GitHub,
  Twitter
}

export type AuthChangeListener = (user: firebase.User | null) => void;
const beforeListeners: { [field: string]: AuthChangeListener } = {};
const listeners: { [field: string]: AuthChangeListener } = {};

const auth = {
  signIn(method: SignInMethod) {
    let provider: firebase.auth.AuthProvider;
    switch (method) {
      case SignInMethod.GitHub:
        provider = new firebase.auth.GithubAuthProvider();
        break;
      case SignInMethod.Twitter:
        // TODO 앱 생성 해야함.
        provider = new firebase.auth.TwitterAuthProvider();
        break;
      case SignInMethod.Google:
      default:
        provider = new firebase.auth.GoogleAuthProvider();
        break;
    }
    firebaseAuth.signInWithRedirect(provider);
  },
  addChangeBeforeListener(
    name: string,
    listener: AuthChangeListener,
    immediate?: boolean
  ) {
    beforeListeners[name] = listener;
    if (
      firebaseAuth.currentUser !== null &&
      (immediate === undefined || immediate)
    ) {
      listener(firebaseAuth.currentUser);
    }
  },
  addChangeListener(
    name: string,
    listener: AuthChangeListener,
    immediate?: boolean
  ) {
    listeners[name] = listener;
    if (
      firebaseAuth.currentUser !== null &&
      (immediate === undefined || immediate)
    ) {
      listener(firebaseAuth.currentUser);
    }
  },
  deleteChangeListener(name: string) {
    if (listeners[name] === undefined) {
      return;
    }
    delete listeners[name];
  },
  signOut(): Promise<void> {
    return new Promise((reslove, reject) => {
      firebaseAuth
        .signOut()
        .then(() => reslove())
        .catch(e => reject(e));
    });
  }
};

firebaseAuth.onAuthStateChanged(u => {
  const beforeListenerKeys = Object.keys(beforeListeners);
  beforeListenerKeys.forEach(key => listeners[key](u));

  const listenerKeys = Object.keys(listeners);
  listenerKeys.forEach(key => listeners[key](u));
});
export default auth;
