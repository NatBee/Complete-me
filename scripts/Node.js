export default class Node {
  constructor (data) {
    this.data = data;
    this.children = {};
    this.wordEnd = null;
    this.frequency = 0;
  }
}