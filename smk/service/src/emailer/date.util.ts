export class DateUtil {
  constructor(dateSting: string | Date) {
    this.date = new Date(dateSting);
  }
  date = new Date();
  getDate() {
    const monthDay = this.date.getDate();
    return monthDay > 9 ? monthDay : '0' + monthDay;
  }
  getMonth() {
    const month = this.date.getMonth() + 1;
    return month > 9 ? month : '0' + month;
  }
  getYear() {
    return this.date.getFullYear();
  }
  getHours(hourDiff = 0) {
    const hours = this.date.getHours() + hourDiff;
    return hours > 9 ? hours : '0' + hours;
  }
  getMinutes() {
    const minutes = this.date.getMinutes();
    return minutes > 9 ? minutes : '0' + minutes;
  }
  getFormatedDate() {
    return `${this.getDate()}.${this.getMonth()}.${this.getYear()}`;
  }

  getFormatedDateTime(hourDiff = 0) {
    return `${this.getDate()}.${this.getMonth()}.${this.getYear()} ${this.getHours(
      hourDiff,
    )}:${this.getMinutes()}`;
  }
}
