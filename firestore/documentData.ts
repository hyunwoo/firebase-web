export default abstract class FirestoreDocumentData {
  // private __proxies__: { [property: string]: any } = {};
  constructor() {
    // for (const property in Object.keys(this)) {
    //   console.log('in prop', property);
    // }
  }
  public abstract toObject(): object;
  public abstract init(...arg: any[]): void;

  public assign(data: object) {
    Object.assign(this, data);
  }
}
