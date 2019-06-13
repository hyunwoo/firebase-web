import FirestoreDocumentData from './documentData';
import FirestoreCollection from './collection';
import FirestoreDocument from './document';

export default class FirestoreCollectionQuery<T extends FirestoreDocumentData> {
  private collection: FirestoreCollection<T>;
  private queryReference: firebase.firestore.Query;
  constructor(
    collection: FirestoreCollection<T>,
    property: string,
    operator: firebase.firestore.WhereFilterOp,
    value: any
  ) {
    this.collection = collection;
    this.queryReference = this.collection.reference.where(
      property,
      operator,
      value
    );
  }
  public query(
    property: keyof T,
    operator: firebase.firestore.WhereFilterOp,
    value: any
  ): FirestoreCollectionQuery<T> {
    this.queryReference = this.queryReference.where(
      property as string,
      operator,
      value
    );
    return this;
  }

  public startAt(
    snapshot: firebase.firestore.DocumentSnapshot
  ): FirestoreCollectionQuery<T> {
    this.queryReference.startAt(snapshot);
    return this;
  }
  public startAfter(
    snapshot: firebase.firestore.DocumentSnapshot
  ): FirestoreCollectionQuery<T> {
    this.queryReference = this.queryReference.startAfter(snapshot);
    return this;
  }
  public startAtOrdered(...arg: any[]): FirestoreCollectionQuery<T> {
    this.queryReference = this.queryReference.startAt(...arg);
    return this;
  }
  public startAfterOrdered(...arg: any[]): FirestoreCollectionQuery<T> {
    this.queryReference = this.queryReference.startAt(...arg);
    return this;
  }

  public endAt(
    snapshot: firebase.firestore.DocumentSnapshot
  ): FirestoreCollectionQuery<T> {
    this.queryReference = this.queryReference.endAt(snapshot);
    return this;
  }
  public endBefore(
    snapshot: firebase.firestore.DocumentSnapshot
  ): FirestoreCollectionQuery<T> {
    this.queryReference = this.queryReference.endBefore(snapshot);
    return this;
  }

  public endAtOrdered(...arg: any[]): FirestoreCollectionQuery<T> {
    this.queryReference = this.queryReference.endAt(...arg);
    return this;
  }
  public endBeforeOrdered(...arg: any[]): FirestoreCollectionQuery<T> {
    this.queryReference = this.queryReference.endBefore(...arg);
    return this;
  }

  public limit(count: number): FirestoreCollectionQuery<T> {
    this.queryReference = this.queryReference.limit(count);
    return this;
  }
  public orderBy(
    property: keyof T,
    directionStr?: firebase.firestore.OrderByDirection
  ): FirestoreCollectionQuery<T> {
    this.queryReference = this.queryReference.orderBy(
      property as string,
      directionStr
    );
    return this;
  }
  public onChange(
    type: new () => T,
    listener: (
      object: FirestoreDocument<T>,
      state: firebase.firestore.DocumentChangeType
    ) => void
  ) {
    return this.queryReference.onSnapshot(snapshot => {
      snapshot
        .docChanges()
        .forEach((change: firebase.firestore.DocumentChange) => {
          const document = FirestoreDocument.load(
            this.collection,
            type,
            change.doc
          );
          listener(document, change.type);
        });
    });
  }
  public clearOnChange() {
    this.queryReference.onSnapshot(snapshot => {
      // Snapshot Listener 초기화
      // https://firebase.google.com/docs/firestore/query-data/listen?hl=ko
    })();
  }

  public exec(type: new () => T): Promise<Array<FirestoreDocument<T>>> {
    return new Promise((reslove, reject) => {
      this.queryReference
        .get()
        .then(querySnapShot => {
          const docs = querySnapShot.docs.map(documentSnapshot => {
            return FirestoreDocument.load(
              this.collection,
              type,
              documentSnapshot
            );
          });
          reslove(docs);
        })
        .catch(e => reject(e));
    });
  }
}
