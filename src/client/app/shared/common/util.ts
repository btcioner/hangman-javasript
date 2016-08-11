/**
 * Created by xiejinbin on 16-8-5.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class PublicFunction {

  /**
   * groupBy :: [a] -> fun -> [[a]]
   * @param xs is Array
   * @param fn is Function
   */
  groupBy(xs: any, fn: any) {
    let identity: any;
    let result: any = {};
    if (!fn) {
      fn = identity;
    }
    xs.forEach( (obj: any) => {
      let key: any = fn(obj);
      if (!result.hasOwnProperty(key)) {
        result[key] = [];
      }
      result[key].push(obj);
    });
    return this.getObjectValues(result);
  }

  /**
   * list difference.
   * (xs ++ ys) `arrayDiff` xs == ys
   * @pre xs.length >= 0
   * @pre ys.length >= 0
   */
  arrayDiff(xs: any, ys: any) {
    xs = xs || [];
    ys = ys || [];
    return xs.filter(
       (x: any) => {
        return ys.indexOf(x) === -1;
      });
  }

  union (xs: any, ys: any) {
    return xs.filter((x: any) => {
      return ys.indexOf(x) >= 0;
    });
  }



  wordsFrequencyFun (words: any) {
    let result: any = {};
    let englishAlp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    englishAlp.forEach( (x: any) => {
      result[x] = [];
    });
    words.forEach( (w: any) => {
      if(w[0] !== '') {
        var word = w.toUpperCase();
        englishAlp.forEach( (x: any) => {
          if (word.indexOf(x) >= 0) {
            result[x].push(w);
          }
        });
      }
    });
    return result;
  }

  lettersByWordFrequencyFun(wordsObj: any) {
    let result: any[] = [];
    for (var key in wordsObj) {
      result.push([key, wordsObj[key].length]);
    }
    return result.sort(
      function (x, y) {
        return y[1] - x[1];
      }
    )
      .map(
        function (x){
          return x[0];
        });
  }

   getObjectValues (object: any) {
    let values: any[] = [],
      property: any;
    for (property in object) {
      if (object.hasOwnProperty(property)) {
        values.push(object[property]);
      }
    }
    return values;
  }

  countInstances(mainStr: string, subStr: string) {
    let count = 0;
    let offset = 0;
    do
    {
      offset = mainStr.indexOf(subStr, offset);
      if (offset != -1) {
        count++;
        offset += subStr.length;
      }
    } while (offset != -1);
    return count;
  }
}
