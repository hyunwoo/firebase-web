import FirestoreCollection from './collection';
import FirestoreDocumentData from './documentData';
import { debounce } from 'lodash';

class FirestoreDocument<T extends FirestoreDocumentData> {
  public get id() {
    return this._id;
  }
  public get data() {
    return this._data;
  }

  public static generate<T extends FirestoreDocumentData>(
    collection: FirestoreCollection<T>,
    source: T,
    id: string
  ): FirestoreDocument<T> {
    const doc = new FirestoreDocument<T>();
    doc.collection = collection;
    doc._id = id;
    doc._document = collection.reference.doc(id);
    doc._data = source;
    return doc;
  }
  public static create<T extends FirestoreDocumentData>(
    collection: FirestoreCollection<T>,
    type: new (data?: any) => T,
    id: string
  ): FirestoreDocument<T> {
    const doc = new FirestoreDocument<T>();
    doc.collection = collection;
    doc._id = id;
    doc._document = collection.reference.doc(id);
    doc._data = new type();
    // doc._data.init();
    return doc;
  }
  public static load<T extends FirestoreDocumentData>(
    collection: FirestoreCollection<T>,
    type: new () => T,
    snapshot: firebase.firestore.DocumentSnapshot
  ): FirestoreDocument<T> {
    const doc = new FirestoreDocument<T>();
    const data = snapshot.data();

    doc._id = snapshot.id;
    doc._document = collection.reference.doc(snapshot.id);
    doc.collection = collection;
    doc._snapshot = snapshot;
    doc._data = new type();

    if (data !== undefined) {
      doc._data.assign(data);
    } else {
      throw new Error(
        `Data Not Exist ${collection.reference.id}/${snapshot.id}`
      );
    }
    return doc;
  }

  // @ts-ignore static 생성자에서 생성됨
  private collection: FirestoreCollection;
  // @ts-ignore static 생성자에서 생성됨
  private _document: firebase.firestore.DocumentReference;
  // @ts-ignore static 생성자에서 생성됨
  private _id: string;
  // @ts-ignore static 생성자에서 생성됨
  private _data: T;
  // @ts-ignore
  private _snapshot: firebase.firestore.DocumentSnapshot | null = null;
  private constructor();
  private constructor(
    id: string,
    document: firebase.firestore.DocumentReference,
    data: T
  );
  private constructor(
    id?: string,
    document?: firebase.firestore.DocumentReference,
    data?: T
  ) {
    if (id !== undefined && document !== undefined && data !== undefined) {
      this._id = id;
      this._document = document;
      this._data = data;
    }
  }

  public saveSync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._document
        .set(this._data.toObject())
        .then(() => resolve())
        .catch(e => reject(e));
    });
  }
  public save(wait?: number): void {
    // TODO Require Modify. 중복콜 발생 가능성이 있음.
    debounce(() => this.saveSync(), 300)();
  }
  public set(data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      this._document
        .set(data)
        .then(() => resolve())
        .catch(e => reject(e));
    });
  }
  // public update(key: string, val: any): void {
  //   this.__data[key] = val;
  // }
  public update(data: { [P in keyof T]?: T[P] }): Promise<void> {
    return new Promise((resolve, reject) => {
      this._document
        .update(data)
        .then(documentShapshot => resolve())
        .catch(e => reject(e));
    });
  }
  public get(): Promise<T> {
    return new Promise((reslove, reject) => {
      this._document
        .get()
        .then(documentSnapshot => reslove(documentSnapshot.data() as T))
        .catch(e => reject(e));
    });
  }
  public get snapshot(): Promise<firebase.firestore.DocumentSnapshot> {
    return new Promise((resolve, reject) => {
      this._document
        .get()
        .then(documentSnapshot => resolve(documentSnapshot))
        .catch(e => reject(e));
    });
  }
  public delete(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._document
        .delete()
        .then(() => resolve())
        .catch(e => reject(e));
    });
  }
  // public initData(...arg: any[]) {
  //   this._data.init(...arg);
  // }
}

export default FirestoreDocument;
