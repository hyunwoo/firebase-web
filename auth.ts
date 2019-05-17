import { auth as firebaseAuth } from './app';
import * as firebase from 'firebase/app';

export enum SignInMethod {
  Google,
  GitHub,
  Twitter
}

export type AuthChangeListener = (user: firebase.User | null) => void;
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
  addChangeListener(
    name: string,
    listener: AuthChangeListener,
    directCallback?: boolean
  ) {
    console.log('add auth changed', name);
    console.log('has signed user', firebaseAuth.currentUser);
    listeners[name] = listener;
    if (
      firebaseAuth.currentUser !== null &&
      (directCallback === undefined || directCallback)
    ) {
      listener(firebaseAuth.currentUser);
      console.log('user activate');
    }
  },
  deleteChangeListener(name: string) {
    if (listeners[name] === undefined) {
      return;
    }
    delete listeners[name];
  },
  signOut(): Promise<void> {
    console.log('lib, signout');
    return new Promise((reslove, reject) => {
      firebaseAuth
        .signOut()
        .then(() => reslove())
        .catch((e) => reject(e));
    });
  }
};

firebaseAuth.onAuthStateChanged((u) => {
  console.log('raw, on auth state changed', u);
  const listenerKeys = Object.keys(listeners);
  listenerKeys.forEach((key) => listeners[key](u));
});
export default auth;
