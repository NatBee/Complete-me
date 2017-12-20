import { expect } from 'chai';
import Node from '../scripts/Node'
import Trie from '../scripts/CompleteMeTrie'
import fs from 'fs';


describe('Complete Me', () => { 
  let node;
  let completion;
  let text;
  let dictionary;

  beforeEach(() => {
    text = "/usr/share/dict/words"
    dictionary = fs.readFileSync(text).toString().trim().split('\n')
    completion = new Trie();
  });

//Insert

  it('should start with zero elements', () => {
    expect(completion.count).to.eq(0);
  })

  it('should have a root value of null'), () => {
    expect(completion.root).to.eq(null);
  }

  it('should insert the letters of a word into the trie in order', () => {
    completion.insert("hi");
    expect(completion.root.children.hasOwnProperty('h')).to.eq(true);
    expect(completion.root.children.h.children.hasOwnProperty('i')).to.eq(true);
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
  })

  it('should share a parent node for words that start with same letter', () => {
    completion.insert('hello');
    completion.insert('hi');

    expect(Object.keys(completion.root.children.h.children)).to.deep.eq(['e', 'i']);
  })

  it('should not count duplicate words in the word count', () => {
    completion.insert('hi');
    completion.insert('bye');
    completion.insert('hi');

    expect(completion.count).to.eq(2);
  }) 


//Suggest
  it('should return null if there is no word that matches the suggestion', () => {
    completion.insert('friend');
    let suggestion = completion.suggest('barbarella');

    expect(suggestion).to.eq(null);
  })

  it('should take in a string and return an array', () => {
    completion.insert('pizza');
    expect(completion.suggest('piz')).to.be.array;
  });

  it('should return all of the words that start with the suggested phrase', () => {
    completion.insert('pizza');
    completion.insert('pizzeria');
    let suggestion = completion.suggest('piz');

    expect(suggestion).to.deep.eq(['pizza', 'pizzeria']);
   })

  it('should return all of the words that start with the suggested letter', () => {
    completion.insert('ape');
    completion.insert('apple');
    completion.insert('attention');
    let suggestion = completion.suggest('a');

    expect(suggestion).to.deep.eq(['ape', 'apple', 'attention']);
  })


  //dictionary

  it('should populate the trie with all of the words in the dictionary', () => {
    completion.populate(dictionary)
    let suggestion = completion.suggest("piz")
    
    expect(completion.count).to.eq(235886);
    expect(suggestion).to.deep.eq(["pize", "pizza", "pizzeria", "pizzicato", "pizzle"]);
  })


  //select

  it('should keep track of popular words', () => {
    expect(completion.root.frequency).to.equal(0);
    completion.insert('wet');
    completion.insert('well');
    completion.insert('wear');
    
    completion.select('well');
    completion.select('wet');
    completion.select('wet');
    completion.select('wear');
    completion.select('wear');
    completion.select('wear');

    expect(completion.root.children.w.children.e.children.t.frequency).to.equal(2);
    expect(completion.root.children.w.children.e.children.l.children.l.frequency).to.equal(1);
    expect(completion.root.children.w.children.e.children.a.children.r.frequency).to.equal(3);
    expect(completion.suggest('w')).to.deep.equal(['wear','wet', 'well']);
  })

  //delete

  it('should delete words', () => {
    completion.populate(dictionary)
    completion.suggest("piz")
    expect(completion.suggest("piz")).to.deep.eq(["pize", "pizza", "pizzeria", "pizzicato", "pizzle"]);

    completion.delete("pizzle");
    completion.suggest("piz");
    expect(completion.suggest("piz")).to.deep.eq(["pize", "pizza", "pizzeria", "pizzicato"]);
  })

})
