/**
 * Created by ralap on 16-8-4.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Start, Action } from './hangman.model';


@Injectable()
export class HangManService {
  restUrl: string = 'https://strikingly-hangman.herokuapp.com/game/on';
  constructor(private http: Http) {}

  /**
   * allPossibleWords
   * @returns {Observable<R>}
     */
  getWords() {
    return this.http.get('/assets/data.json')
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }


  /**
   * 开始游戏
   * @param start
   * @returns {Observable<R>}
     */
  startGame(start: Start) {
    return this.http.post(this.restUrl, {playerId: start.playerId, action: start.action})
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  /**
   * 获取单词
   * @param action
   * @returns {Observable<R>}
     */
  giveMeAWord(action: Action) {
    return this.http.post(this.restUrl, {sessionId: action.sessionId, action: action.action})
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  /**
   * 猜词
   * @param action
   * @param guess
   * @returns {Observable<R>}
     */
  makeAGuess(action: Action, guess: string) {
    return this.http.post(this.restUrl, {
      sessionId: action.sessionId,
      action: action.action,
      guess: guess
    }).map((res:Response) => res.json())
      .catch(this.handleError);
  }

  /**
   * 获取结果
   * @param action
   * @returns {Observable<R>}
     */
  getResult(action: Action) {
    return this.http.post(this.restUrl, {sessionId: action.sessionId, action: action.action})
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  /**
   * 提交成绩
   * @param action
   * @returns {Observable<R>}
     */
  submitResult(action: Action) {
    return this.http.post(this.restUrl, {sessionId: action.sessionId, action: action.action})
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
