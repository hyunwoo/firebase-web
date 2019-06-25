import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/performance';

import config from '@/firebaseConfig';

let app: firebase.app.App | null = null;
if (app === null) {
  app = firebase.initializeApp(config);
}

const perf = app.performance();
const database = app.firestore();
const storage = app.storage();
const auth: firebase.auth.Auth = app.auth();

export default app;
export { database, storage, auth, perf };
