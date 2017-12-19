import Node from './Node';

export default class Trie {
  constructor() {
    this.count = 0;
    this.root = new Node(null);
  }

  insert(word) {
    let currentNode = this.root;
    this.count++;
    let stringArr = [...word];

    for(let i = 0; i < stringArr.length; i++) {
      let data = stringArr[i];
      // need to loop
      let child = new Node(data);
      currentNode.children[data] = child;
      currentNode = currentNode.children[data];
    }   
    //need to add a check to see if word already exist 
    //and don't increment counter if it does 
    currentNode.wordEnd = true;
    console.log(JSON.stringify( this.root, null, '\t'));
  }
    
}