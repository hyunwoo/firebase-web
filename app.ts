import firebase from 'firebase';
import config from './config.json';

let app: firebase.app.App | null = null;
if (app === null) {
  app = firebase.initializeApp(config);
}

const database = app.firestore();
database.settings({ timestampsInSnapshots: true });
const storage = app.storage();
const auth: firebase.auth.Auth = app.auth();

export default app;
export { database, storage, auth };
