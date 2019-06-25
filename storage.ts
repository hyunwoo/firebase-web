import { storage } from './app';

class Storage {
  private ref: firebase.storage.Reference;
  constructor(location: string) {
    this.ref = storage.ref(location);
  }
  public async uploadString(data: string, meta?: firebase.storage.UploadMetadata): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.ref
        .putString(data, undefined, meta)
        .then(() => resolve())
        .catch(reject);
    });
  }
  public async upload(data: File | Blob): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.ref
        .put(data)
        .then(() => resolve())
        .catch(reject);
    });
  }
  public delete(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.ref
        .delete()
        .then(() => resolve())
        .catch(reject);
    });
  }
  public getDownloadURL(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.ref
        .getDownloadURL()
        .then(url => resolve(url))
        .catch(reject);
    });
  }
}

export default Storage;
