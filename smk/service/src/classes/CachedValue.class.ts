export class CachedValue<T> {
  constructor(method: () => Promise<T[]>) {
    this.updateMethod = method;
    this.getValue();
  }
  value: T[];
  time: Date;
  updateMethod: () => Promise<T[]>;

  async getValue() {
    this.value = await this.updateMethod();
    this.time = new Date();
  }

  get() {
    if (new Date().getTime() - this.time.getTime() > 3600000) {
      this.getValue();
    }
    return this.value;
  }
}
