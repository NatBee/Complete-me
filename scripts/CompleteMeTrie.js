import Node from './Node';

export default class Trie {
  constructor() {
    this.count = 0;
    this.root = new Node(null);
  }

  insert(word) {
    let stringArr = [...word];
    let currentNode = this.root;

    stringArr.forEach(letter => {
      if(!currentNode.children[letter]) {
        currentNode.children[letter] = new Node(letter);
      }
      currentNode = currentNode.children[letter];
    });   
 
    if(!currentNode.wordEnd) {
      this.count++;
    }

    currentNode.wordEnd = true;
    // console.log(JSON.stringify(this.root, null, '\t'));
  }

  suggest(word) {
    let newWord = word.toLowerCase().split('');
    let currentNode = this.root;

    newWord.forEach(letter => {
      if(currentNode && currentNode.children) {
        currentNode = currentNode.children[letter];
      }
    });

    if(!currentNode) {
      return null;
    } else {
      return this.findSuggestion(currentNode, word, []);
    }
  };

  findSuggestion(currentNode, word, suggestions) {
    // let suggestions = [];
    let childrenLetters = Object.keys(currentNode.children);
    
    childrenLetters.forEach(letter => {
      let letterNode = currentNode.children[letter];
      let newWord = word + letter;

      if(letterNode.wordEnd) {
        suggestions.push({word: newWord, frequency: letterNode.frequency});
      } else {
        this.findSuggestion(letterNode, newWord, suggestions);
      }
    })
    // return suggestions;
      return this.sort(suggestions);
  }

  sort(suggestions) {
    // console.log(suggestions)
    suggestions.sort((a, b)  => b.frequency - a.frequency);

    return suggestions.map(suggestion => suggestion.word)
  }

  populate(param) {
    param.forEach(word => {
      this.insert(word);
    })
  }

  select(word) {
    let currentNode = this.find(word);
    currentNode.frequency++;
  }

  find(word) {
    let stringArr = [...word];
    let currentNode = this.root;

    stringArr.forEach(letter => {
      currentNode = currentNode.children[letter];
    });  

    return currentNode;
  }

  delete(word) {
    let stringArr = [...word];
    let currentNode = this.root;

    stringArr.forEach(letter => {
      currentNode = currentNode.children[letter];
    });   
 
    if(!currentNode.wordEnd) {
      this.count--;
    }

    currentNode.wordEnd = null;
  }
    
}