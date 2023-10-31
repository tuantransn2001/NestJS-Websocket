import { ObjectType } from '../common/types/common';

export class URLSearchParam {
  public static objToUrlParams(obj: ObjectType) {
    const toUrlParams = (obj: ObjectType, prefix = '') => {
      let urlParams = '';

      for (const key in obj) {
        let val = obj[key];

        if (val == null) continue;
        if (val == undefined) continue;
        if (val == '') continue;

        if (val instanceof Array) {
          // convert val from Array to object
          const valToObj: ObjectType = {};
          val.forEach((v, i) => {
            valToObj[i] = v;
          });

          val = valToObj;
        }

        const newPrefix = prefix + key;

        if (val instanceof Object) {
          urlParams += toUrlParams(val, newPrefix + '-');
        } else {
          urlParams += newPrefix + '=' + val;
        }

        urlParams += '&';
      }

      urlParams = urlParams.slice(0, -1);

      return urlParams;
    };

    return encodeURI(toUrlParams(obj));
  }

  public static urlParamsToObj(urlParams: string) {
    urlParams = decodeURI(urlParams);

    const toObj = (urlParams: string) => {
      const obj: ObjectType = {};

      const urlParamsArr = urlParams.split('&');

      const subUrlParamsObj: ObjectType = {};

      for (let i = 0; i < urlParamsArr.length; i++) {
        const item = urlParamsArr[i];

        let key: string = item.split('=')[0];
        let val: string | boolean | number = item.split('=')[1] ?? null;
        const keys: string[] = key.split('-');

        if (val == 'null') {
          val = null;
        } else if (val == 'undefined') {
          val = undefined;
        } else if (val == 'true') {
          val = true;
        } else if (val == 'false') {
          val = false;
        } else if (val == 'NaN') {
          val = NaN;
        } else if (val == 'Infinity') {
          val = Infinity;
        }

        if (keys.length == 1) {
          if (obj.hasOwnProperty(key)) {
            if (obj[key] instanceof Array) {
              obj[key].push(val);
            } else {
              obj[key] = [obj[key], val];
            }
          } else {
            obj[key] = val;
          }
        } else if (keys.length > 1) {
          const key0 = keys[0];

          if (!subUrlParamsObj[key0]) {
            subUrlParamsObj[key0] = [];
          }

          keys.shift();

          key = keys.join('-');

          const param = key + '=' + val;

          subUrlParamsObj[key0].push(param);
        }
      }

      for (const key in subUrlParamsObj) {
        const val = subUrlParamsObj[key].join('&');

        obj[key] = toObj(val);
      }

      return obj;
    };

    return URLSearchParam.checkIfObjShouldBeArrayAndConvert(toObj(urlParams));
  }

  public static checkIfObjShouldBeArrayAndConvert(obj: ObjectType) {
    if (obj instanceof Array) {
      obj.forEach((item, i) => {
        if (item instanceof Object) {
          obj[i] = URLSearchParam.checkIfObjShouldBeArrayAndConvert(item);
        }
      });

      return obj;
    }

    let canConvertToArray = true;
    for (const key in obj) {
      const val = obj[key];

      if (val instanceof Object || val instanceof Array) {
        obj[key] = URLSearchParam.checkIfObjShouldBeArrayAndConvert(val);
      }

      if (isNaN(+key)) {
        canConvertToArray = false;
      }
    }

    const orderedObj = {};
    Object.keys(obj)
      .sort()
      .forEach(function (key) {
        orderedObj[key] = obj[key];
      });

    const firstVal = +Object.keys(orderedObj)[0] as number;

    if (firstVal != 0) {
      canConvertToArray = false;
    }

    const keys = Object.keys(orderedObj);
    keys;
    for (let i = 0; i < keys.length - 1; i++) {
      const key: number = +keys[i];
      key;
      const nextKey: number = +keys[i + 1];

      const keyStep = nextKey - key;

      if (keyStep != 1) {
        canConvertToArray = false;
        break;
      }
    }

    if (canConvertToArray) {
      const arr = [];
      for (const key in orderedObj) {
        arr.push(orderedObj[key]);
      }
      return arr;
    }

    return obj;
  }

  public static addParamsToUrl(params: string, url = window.location.href) {
    if (url.indexOf('?') == -1) {
      url += '?';
    } else {
      url += '&';
    }

    return url + params ?? '';
  }

  public static addObjToUrl(obj: ObjectType, url = window.location.href) {
    return URLSearchParam.addParamsToUrl(
      URLSearchParam.objToUrlParams(obj),
      url,
    );
  }

  public static extractParamsFromUrl(url = window.location.href) {
    return URLSearchParam.urlParamsToObj(url.split('?')[1]);
  }
}
