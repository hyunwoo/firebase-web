import { database } from '../app';
import FirestoreDocument from './document';
import FirestoreDocumentData from './documentData';
import uuid from 'uuid/v1';
import FirestoreCollectionQuery from './collectionQuery';

class FirestoreCollection<T extends FirestoreDocumentData> {
  public get reference() {
    return this.ref;
  }
  private ref: firebase.firestore.CollectionReference;

  constructor(location: string) {
    this.ref = database.collection(location);
  }

  public generate(source: T, childID?: string): FirestoreDocument<T> {
    const id = childID ? childID : uuid();
    return FirestoreDocument.generate(this, source, id);
  }
  public create(
    type: new (data?: any) => T,
    childID?: string
  ): FirestoreDocument<T> {
    let id: string = uuid();
    if (childID !== undefined) {
      id = childID;
    }
    return FirestoreDocument.create(this, type, id);
  }

  public load(
    type: new (data?: any) => T,
    childID: string
  ): Promise<FirestoreDocument<T>> {
    return new Promise((resolve, reject) => {
      this.ref
        .doc(childID)
        .get()
        .then((snapshot) => {
          resolve(FirestoreDocument.load(this, type, snapshot));
        })
        .catch((e) => reject(e));
    });
  }

  public exist(childID: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.ref
        .doc(childID)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((e) => reject(e));
    });
  }

  public createQuery(
    property: keyof T,
    operator: firebase.firestore.WhereFilterOp,
    value: any
  ): FirestoreCollectionQuery<T> {
    return new FirestoreCollectionQuery(
      this,
      property as string,
      operator,
      value
    );
  }

  public onChange(
    type: new () => T,
    listener: (
      object: FirestoreDocument<T>,
      state: firebase.firestore.DocumentChangeType
    ) => void
  ) {
    this.ref.onSnapshot((snapshot) => {
      snapshot
        .docChanges()
        .forEach((change: firebase.firestore.DocumentChange) => {
          const document = FirestoreDocument.load(this, type, change.doc);
          listener(document, change.type);
        });
    });
  }
  public clearOnChange() {
    this.ref.onSnapshot((snapshot) => {
      // Snapshot Listener 초기화
      // https://firebase.google.com/docs/firestore/query-data/listen?hl=ko
    });
  }

  public find() {
    // TODO
  }

  public delete() {
    // TODO
  }
}

// .then((snapshot) => {
//   resolve(FirestoreDocument.load(this, type, snapshot));
// })
export default FirestoreCollection;
