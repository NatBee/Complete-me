import { expect } from 'chai';
import Node from '../scripts/Node'
import Trie from '../scripts/CompleteMeTrie'


describe('Complete Me', () => { 
  let node;
  let completion;

  beforeEach(() => {
    completion = new Trie();
  });

  it('should start with zero elements', () => {
    expect(completion.count).to.eq(0);
  })

  it('should have a root value of null'), () => {
    expect(completion.root).to.eq(null);
  }

  it('should insert the letters of a word into the trie in order', () => {
    completion.insert("hi");
    expect(Object.keys(completion.root.children)[0]).to.eq('h');
    expect(Object.keys(completion.root.children.h.children)[0]).to.eq('i');
  })

  it('should be able to count how many words have been inserted', () => {
    completion.insert("pizza");
    expect(completion.count).to.eq(1);
  
    completion.insert('hi');
    expect(completion.count).to.eq(2);

    completion.insert('apple');
    expect(completion.count).to.eq(3);
  })

  it('should change wordEnd to equal true after last letter of word', () => {
    completion.insert('hi');
    expect(completion.root.children.h.children.i.wordEnd).to.eq(true);
  })

   it('should not create duplicate nodes when inserting duplicate words', () => {
    completion.insert('hello');
    completion.insert('bye');
    completion.insert('hi');
    console.log(completion.root);
    console.log(completion.count);
  })

   it('should share a parent node for words that start with same letter', () => {
    completion.insert('hello');
    completion.insert('hi');

    expect(Object.keys(completion.root.children.h.children)).to.eq(['e', 'i']);

   })

   it('should share parent node for words that start with the same letter', () => {

   })

   it('should not count duplicate words in the word count', () => {

   }) 

   it('should return words that start with the suggested phrase', () => {
    // completion.insert('pizza');
    // completion.suggest('piz');
    // expect('pizza').to.equal()
   })

//    completion.suggest("piz")
// => ["pizza"]

// completion.insert("pizzeria")

// completion.suggest("piz")
// => ["pizza", "pizzeria"]

// completion.suggest('a')
// => ["apple"]

})
