import { ObjectType } from '../types/common';

export class URLSearchParam {
  // convert obj to url params
  public static objToUrlParams(obj: ObjectType) {
    const toUrlParams = (obj: ObjectType, prefix = '') => {
      // create url params
      let urlParams = '';

      // loop through obj
      for (const key in obj) {
        let val = obj[key];

        if (val == null) continue;
        if (val == undefined) continue;
        if (val == '') continue;

        // if val is an object then call toUrlParams
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

      // remove last &
      urlParams = urlParams.slice(0, -1);

      // return url params
      return urlParams;
    };

    // encodeURI
    return encodeURI(toUrlParams(obj));
  }
  // convert url params to obj
  public static urlParamsToObj(urlParams: string) {
    // decodeURI
    urlParams = decodeURI(urlParams);

    const toObj = (urlParams: string) => {
      const obj: ObjectType = {};

      const urlParamsArr = urlParams.split('&');

      const subUrlParamsObj: ObjectType = {};

      // loop through urlParams
      for (let i = 0; i < urlParamsArr.length; i++) {
        const item = urlParamsArr[i];

        // get key and value
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

        // if keys length is 1 then set obj[key] to val
        if (keys.length == 1) {
          // check if obj contains key
          if (obj.hasOwnProperty(key)) {
            // if obj[key] is an array then push val
            if (obj[key] instanceof Array) {
              obj[key].push(val);
            } else {
              // create array and push val
              obj[key] = [obj[key], val];
            }
          } else {
            obj[key] = val;
          }
        }
        // if keys length is 2 then set obj[keys[0]][keys[1]] to val
        else if (keys.length > 1) {
          const key0 = keys[0];

          // check if subUrlParamsObj contains keys[0]
          if (!subUrlParamsObj[key0]) {
            subUrlParamsObj[key0] = [];
          }

          // remove keys[0] from keys
          keys.shift();
          // join keys with -
          key = keys.join('-');

          const param = key + '=' + val;

          // add param to subUrlParamsObj[keys[0]]
          subUrlParamsObj[key0].push(param);
        }
      }

      // loop through subUrlParamsObj
      for (const key in subUrlParamsObj) {
        // join subUrlParamsObj[key] with &
        const val = subUrlParamsObj[key].join('&');

        // set obj[key] to val
        obj[key] = toObj(val);
      }

      // return obj
      return obj;
    };

    return URLSearchParam.checkIfObjShouldBeArrayAndConvert(toObj(urlParams));
  }

  // check if object should be converted to array, if its keys are numbers
  public static checkIfObjShouldBeArrayAndConvert(obj: ObjectType) {
    // if obj is an array
    if (obj instanceof Array) {
      // loop through obj
      obj.forEach((item, i) => {
        // check if item is an object
        if (item instanceof Object) {
          // convert item to array
          obj[i] = URLSearchParam.checkIfObjShouldBeArrayAndConvert(item);
        }
      });

      // return obj
      return obj;
    }

    // check if all keys are numbers
    let canConvertToArray = true;
    for (const key in obj) {
      // get value
      const val = obj[key];

      // check if value is an object or Array
      if (val instanceof Object || val instanceof Array) {
        obj[key] = URLSearchParam.checkIfObjShouldBeArrayAndConvert(val);
      }

      if (isNaN(+key)) {
        canConvertToArray = false;
      }
    }

    // order obj by keys
    const orderedObj = {};
    Object.keys(obj)
      .sort()
      .forEach(function (key) {
        orderedObj[key] = obj[key];
      });

    // check if the first key is 0
    const firstVal = +Object.keys(orderedObj)[0] as number;

    if (firstVal != 0) {
      canConvertToArray = false;
    }

    // check if the keys step is 1
    const keys = Object.keys(orderedObj);
    // loop through keys
    for (let i = 0; i < keys.length - 1; i++) {
      // get key
      const key: number = +keys[i];
      // get next key
      const nextKey: number = +keys[i + 1];
      // get key step
      const keyStep = nextKey - key;
      // check if key step is 1
      if (keyStep != 1) {
        canConvertToArray = false;
        break;
      }
    }

    // if all keys are numbers then convert obj to array
    if (canConvertToArray) {
      const arr = [];
      for (const key in orderedObj) {
        arr.push(orderedObj[key]);
      }
      return arr;
    }

    // return obj
    return obj;
  }

  // add params to url
  public static addParamsToUrl(params: string, url = window.location.href) {
    // check if url has params
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

  // extract params from url
  public static extractParamsFromUrl(url = window.location.href) {
    return URLSearchParam.urlParamsToObj(url.split('?')[1]);
  }
}
