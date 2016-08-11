/**
 * Created by xiejinbin on 16-8-5.
 */
export class SimpleSet {

  xs: any[] = [];
  has(x: any) {
    return this.xs && this.xs.indexOf(x) >= 0;
  };
}
