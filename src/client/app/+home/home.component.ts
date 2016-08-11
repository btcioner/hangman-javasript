import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';

import { HangManService } from '../shared/index';
import {Start, Action} from '../shared/hangman/hangman.model';
import {PublicFunction} from '../shared/common/util';
import {SimpleSet} from '../shared/common/simpleSet';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class HomeComponent implements OnInit {

  sessionId: string;
  letters: any;
  possibleWords: string[] = [];
  vowel: any;
  lastLetter: string = '';
  allPossibleWordsHash: any;
  allPossibleWords: string[] = [];
  wordsFrequencyFun: any;
  lettersByWordFrequencyFun: any;
  incorrectlyGuessedWords: SimpleSet;
  guessedSoFar: any[] = [];
  wlByLength: Array<any>;
  totalWordCount: number = 0;
  wrongGuessCountOfCurrentWord: number;
  correctlyGuessedLetters: SimpleSet;
  incorrectlyGuessedLetters: SimpleSet;
  isDone: boolean = false;
  showResult: string = '*****';
  constructor(private hangManService: HangManService,
              private publicFunction: PublicFunction) {
    this.wrongGuessCountOfCurrentWord = 0;
  }

  /**
   * play the game automatically
   */
  ngOnInit() {
    let vm = this;
    this.letters = ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's'];
    this.wrongGuessCountOfCurrentWord = 0;
    this.getAllPossibleWords();
    this.getSessionId();
    setInterval(() => vm.run(), 1000);
  }

  getSessionId() {
    let start= <Start>{};
    start.action = 'startGame';
    start.playerId = 'wzxiejinbin@gmail.com';
    this.hangManService.startGame(start).subscribe(
      res => {
        this.sessionId = res.sessionId;
            let action= <Action>{};
              action.sessionId = this.sessionId;
              action.action = 'nextWord';
      this.hangManService.giveMeAWord(action).subscribe(
        res => {
          this.GuessingStrategy(this.wlByLength[res.data.word.length - 1]);
          this.correctlyGuessedLetters = new SimpleSet();
          this.incorrectlyGuessedLetters = new SimpleSet();
          this.incorrectlyGuessedWords = new SimpleSet();
          this.nextGuess(this.correctlyGuessedLetters ,this.incorrectlyGuessedLetters);
        },
        error => {
          console.error(error);
        });
      },
      error => {
        console.error(error);
      }
    );
  }

  run() {
    let vm = this;
    let action= <Action>{};
    action.sessionId = this.sessionId;
    if(vm.totalWordCount <= 80) {
      if(this.isDone || this.wrongGuessCountOfCurrentWord === 10) {
        vm.isDone = false;
        action.action = 'nextWord';
        this.hangManService.giveMeAWord(action).subscribe(
          res => {
            this.GuessingStrategy(this.wlByLength[res.data.word.length - 1]);
            this.correctlyGuessedLetters = new SimpleSet();
            this.incorrectlyGuessedLetters = new SimpleSet();
            this.nextGuess(this.correctlyGuessedLetters ,this.incorrectlyGuessedLetters);
          },
          error => {
            vm.totalWordCount = 81;
            console.error(error);
          }
        );
      } else {
        this.nextGuess(this.correctlyGuessedLetters,this.incorrectlyGuessedLetters);
      }
    }
  }

  getResult() {
    let action= <Action>{};
    action.sessionId = this.sessionId;
    action.action = 'getResult';
    this.hangManService.getResult(action).subscribe(
      res => {
        if(res.data.totalWordCount === 80 && res.data.score >= 1000) {
          alert('score:' + res.data.score);
        } else {
          if(res.data.totalWordCount === 80 && res.data.correctWordCount === 10) {
            window.location.reload();
          }
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  getAllPossibleWords() {
    this.hangManService.getWords().subscribe(
      res => {
        this.allPossibleWords = res;
        let xs = this.allPossibleWords.sort(function (a, b) { return a.length - b.length;});
        this.wlByLength = this.publicFunction.groupBy(xs, (x: any) => {return x.length;})
          .filter(function (s) { return s.length > 0; });
      },
      error => {
        console.error(error);
      }
    );
  }

  nextGuess(correctlyGuessedLetters: any, incorrectlyGuessedLetters: any) {
    var me = this;
    me.buildWords(correctlyGuessedLetters,
      incorrectlyGuessedLetters,
      me.getGuessedSoFar());
    var nl = me.nextLetter();
    if (nl) {
      me.lastLetter = nl;
      let action = <Action>{};
      action.action = 'guessWord';
      action.sessionId = this.sessionId;
      if (me.publicFunction.countInstances(me.showResult, '*') === 1) {
        if (me.possibleWords.length > 0
          && (this.numWrongGuessesRemaining() >= me.possibleWords.length
          || this.numWrongGuessesMade() >= 3)) {
          let nextWord = me.nextWord();
          console.log('=================me.nextWord()============' + nextWord);
          let showResultArray = me.showResult.split('*');
          showResultArray.forEach((item:string, index:number) => {
              if (item !== '' && nextWord.indexOf(item.toLocaleLowerCase()) === index) {
                let nls = me.publicFunction.arrayDiff(nextWord.split(''), me.showResult.toLocaleLowerCase().split(''));
                if (nls.length === 1) {
                  this.hangManService.makeAGuess(action, nls[0]).subscribe(
                    res => {
                      me.totalWordCount = res.data.totalWordCount;
                      // 根据返回结果，将猜错和猜对的归类
                      if (res.data.wrongGuessCountOfCurrentWord > me.wrongGuessCountOfCurrentWord) {
                        me.incorrectlyGuessedLetters.xs.push(nl);
                        me.nextWord();
                      } else {
                        me.correctlyGuessedLetters.xs.push(nl);
                        me.showResult = res.data.word;
                        if (res.data.word.indexOf('*') === -1) {
                          console.log(res.data.word);
                          me.isDone = true;
                        }
                      }
                      me.wrongGuessCountOfCurrentWord = res.data.wrongGuessCountOfCurrentWord;
                      console.log(res.data);
                      me.getResult();
                    }, error => {
                      console.error(error);
                    }
                  );
                }
              }
            }
          );
        } else {
          this.hangManService.makeAGuess(action, nl).subscribe(
            res => {
              me.totalWordCount = res.data.totalWordCount;
              // 根据返回结果，将猜错和猜对的归类
              if (res.data.wrongGuessCountOfCurrentWord > me.wrongGuessCountOfCurrentWord) {
                me.incorrectlyGuessedLetters.xs.push(nl);
              } else {
                me.correctlyGuessedLetters.xs.push(nl);
                me.showResult = res.data.word;
                if (res.data.word.indexOf('*') === -1) {
                  console.log(res.data.word);
                  me.isDone = true;
                }
              }
              me.wrongGuessCountOfCurrentWord = res.data.wrongGuessCountOfCurrentWord;
              console.log(res.data);
              me.getResult();
            }, error => {
              console.error(error);
            }
          );
        }
      } else {
        this.hangManService.makeAGuess(action, nl).subscribe(
          res => {
            me.totalWordCount = res.data.totalWordCount;
            // 根据返回结果，将猜错和猜对的归类
            if (res.data.wrongGuessCountOfCurrentWord > me.wrongGuessCountOfCurrentWord) {
              me.incorrectlyGuessedLetters.xs.push(nl);
            } else {
              me.correctlyGuessedLetters.xs.push(nl);
              me.showResult = res.data.word;
              if (res.data.word.indexOf('*') === -1) {
                console.log(res.data.word);
                me.isDone = true;
              }
            }
            me.wrongGuessCountOfCurrentWord = res.data.wrongGuessCountOfCurrentWord;
            console.log(res.data);
            me.getResult();
          }, error => {
            console.error(error);
          }
        );
      }
    }
  };

  nextLetter() {
    var letter = this.letters.shift();
    return letter;
  };

  nextWord() {
    return this.possibleWords.shift();
  };

  filterByGuessSoFar(gsf: any) {
    var me = this;
    gsf = new RegExp(gsf.toLowerCase());
    return me.possibleWords.filter((x: any) => { return x.match(gsf); });
  };

  buildWords(correctlyGuessedLetters: any, incorrectlyGuessedLetters: any, gsf: any) {

    // include all words that contains the correct guessed letter.
    if(correctlyGuessedLetters.has(this.lastLetter)) {
      if(this.possibleWords && this.possibleWords.length > 0) {
        this.possibleWords = this.publicFunction.union(this.possibleWords, this.allPossibleWordsHash[this.lastLetter]);
      } else {
        this.possibleWords = this.allPossibleWordsHash[this.lastLetter];
      }
    }
    // exclude all words that contains the incorrect guessed letter.
    if(incorrectlyGuessedLetters.has(this.lastLetter)) {
      this.possibleWords = this.publicFunction.arrayDiff(this.possibleWords,this.allPossibleWordsHash[this.lastLetter]);
    }

    // include all words that match pattern of guessed so far.
    if(this.possibleWords && this.possibleWords.length > 0) {
      // turn out filter by reg improve performance at certain percentage.
      if(correctlyGuessedLetters.length > 0 || incorrectlyGuessedLetters.length > 0) {
        // TODO: could be more precisely cause both list can be non-empty
        if(incorrectlyGuessedLetters.length > 0) {
          gsf = gsf.replace(/-/g, '[^' + incorrectlyGuessedLetters.xs.join('') + ']');
        } else {
          gsf = gsf.replace(/-/g, '.');
        }
        this.possibleWords = this.filterByGuessSoFar(gsf);
      }
      // rebuild all possible words hash and letters by frequency.
      this.allPossibleWordsHash = this.publicFunction.wordsFrequencyFun(this.possibleWords);
      this.letters = this.publicFunction.lettersByWordFrequencyFun(this.allPossibleWordsHash);

      this.letters = this.publicFunction.arrayDiff(this.letters,correctlyGuessedLetters.xs);
      this.letters = this.publicFunction.arrayDiff(this.letters,incorrectlyGuessedLetters.xs);
    }

  };

  GuessingStrategy(allPossibleWords: any) {
    this.allPossibleWordsHash = this.publicFunction.wordsFrequencyFun(allPossibleWords);
    this.letters = this.publicFunction.lettersByWordFrequencyFun(this.allPossibleWordsHash);

  }

  numWrongGuessesRemaining() {
    return 10 - this.numWrongGuessesMade();
  };

  numWrongGuessesMade() {
    return this.incorrectlyGuessedLetters.xs.length + this.incorrectlyGuessedWords.xs.length;
  };

  getGuessedSoFar() {
    return this.guessedSoFar.join('');
  };

}
