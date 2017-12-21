import { expect } from 'chai';
import Node from '../scripts/Node'
import Trie from '../scripts/CompleteMeTrie'
import fs from 'fs';


describe('Radix Trie', () => { 
  let node;
  let trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it('should start with zero elements', () => {
    expect(trie.count).to.eq(0);
  })

  it('should have a root value of null', () => {
    expect(trie.root.data).to.eq(null);
  })

  it('should be able to add a node to the tree', () => {
    trie.insert('hi');
    expect(trie.root.children.h.data).to.eq('h');
  })

  it('should insert the letters of a word into the trie in order', () => {
    trie.insert("hi");
    expect(trie.root.children.hasOwnProperty('h')).to.eq(true);
    expect(trie.root.children.h.children.hasOwnProperty('i')).to.eq(true);
  })

  it('should be able to count how many words have been inserted', () => {
    trie.insert("pizza");
    expect(trie.count).to.eq(1);
  
    trie.insert('hi');
    expect(trie.count).to.eq(2);

    trie.insert('apple');
    expect(trie.count).to.eq(3);
  })

  it('should change wordEnd to equal true after last letter of word', () => {
    trie.insert('hi');
    expect(trie.root.children.h.children.i.wordEnd).to.eq(true);
  })

  it('should not create duplicate nodes when inserting duplicate words', () => {
    trie.insert('hello');
    trie.insert('bye');
    trie.insert('hello');

    expect(Object.keys(trie.root.children.h.children)).to.deep.eq(['e']);
  })

  it('should share a parent node for words that start with same letter', () => {
    trie.insert('hello');
    trie.insert('hi');

    expect(Object.keys(trie.root.children.h.children)).to.deep.eq(['e', 'i']);
  })

  it('should not count duplicate words in the word count', () => {
    trie.insert('hi');
    trie.insert('bye');
    trie.insert('hi');

    expect(trie.count).to.eq(2);
  }) 
})

describe('suggest', () => { 
  let node;
  let trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it('should return null if there is no word that matches the suggestion', () => {
    trie.insert('friend');
    let suggestion = trie.suggest('barbarella');

    expect(suggestion).to.eq(null);
  })

  it('should take in a string and return an array', () => {
    trie.insert('pizza');
    expect(trie.suggest('piz')).to.be.array;
  });

  it('should return all of the words that start with the suggested phrase', () => {
    trie.insert('pizza');
    trie.insert('pizzeria');
    let suggestion = trie.suggest('piz');

    expect(suggestion).to.deep.eq(['pizza', 'pizzeria']);
   })

  it('should return all of the words that start with the suggested letter', () => {
    trie.insert('ape');
    trie.insert('apple');
    trie.insert('attention');
    let suggestion = trie.suggest('a');

    expect(suggestion).to.deep.eq(['ape', 'apple', 'attention']);
  })
})

describe('dictionary', () => { 
  let node;
  let trie;
  let text;
  let dictionary;

  beforeEach(() => {
    text = "/usr/share/dict/words"
    dictionary = fs.readFileSync(text).toString().trim().split('\n')
    trie = new Trie();
  });

  it('should populate the trie with all of the words in the dictionary', () => {
    trie.populate(dictionary)
    let suggestion = trie.suggest("piz")
    
    expect(trie.count).to.eq(235886);
  })

  it('should return all of the words that start with a suggested phrase', () => {
    trie.populate(dictionary)
    let suggestion = trie.suggest("piz")
    
    expect(suggestion).to.deep.eq(["pize", "pizza", "pizzeria", "pizzicato", "pizzle"]);
  })
})

describe('select', () => { 
  let node;
  let trie;

  beforeEach(() => {
    trie = new Trie();

    trie.insert('wet');
    trie.insert('well');
    trie.insert('wear');
    
    trie.select('well');
    trie.select('wet');
    trie.select('wet');
    trie.select('wear');
    trie.select('wear');
    trie.select('wear');
  });

  it('should have a default frequency of 0', () => {
    expect(trie.root.frequency).to.equal(0);
  })

  it('should keep track of popular words', () => {
    expect(trie.root.children.w.children.e.children.t.frequency).to.equal(2);
    expect(trie.root.children.w.children.e.children.l.children.l.frequency).to.equal(1);
    expect(trie.root.children.w.children.e.children.a.children.r.frequency).to.equal(3);
    expect(trie.suggest('w')).to.deep.equal(['wear','wet', 'well']);
  })

  it('should return an array sorted by highest frequency words', () => {
    expect(trie.suggest('w')).to.deep.equal(['wear','wet', 'well']);
  })
})

describe('delete', () => { 
  let node;
  let trie;
  let text;
  let dictionary;

  beforeEach(() => {
    text = "/usr/share/dict/words"
    dictionary = fs.readFileSync(text).toString().trim().split('\n')
    trie = new Trie();
    trie.populate(dictionary)
  });

  it('should delete words', () => {
    trie.suggest("piz")
    expect(trie.suggest("piz")).to.deep.eq(["pize", "pizza", "pizzeria", "pizzicato", "pizzle"]);

    trie.delete("pizzle");
    trie.suggest("piz");
    expect(trie.suggest("piz")).to.deep.eq(["pize", "pizza", "pizzeria", "pizzicato"]);
  })

})
