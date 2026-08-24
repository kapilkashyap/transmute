/**
 * Converts a generated instance (or nested graph of instances) back into a plain JSON object.
 */

import type { GetterFn, GetterFnArray, MetaInfo } from '../types';
import { capitalize, getTypeOfObject, hasGetter, hasObjectMetaInfo, normalize } from '../utils';

export const convertToJSON = function (o: unknown, metaInfo: MetaInfo) {
    let jsonObject = {};
    if (metaInfo.primitiveKeys != null && metaInfo.primitiveKeys.length > 0) {
        metaInfo.primitiveKeys.split(',').forEach((key) => {
            const getter = `get${capitalize(normalize(key))}`;
            if (hasGetter(o, getter)) {
                jsonObject = {
                    ...jsonObject,
                    [key]: (o[getter] as GetterFn)()
                };
            }
        });
    }
    if (metaInfo.objectKeys != null && metaInfo.objectKeys.length > 0) {
        metaInfo.objectKeys.split(',').forEach((key) => {
            const getter = `get${capitalize(normalize(key))}`;
            if (hasGetter(o, getter)) {
                const getterValue = (o[getter] as GetterFn)();
                if (hasObjectMetaInfo(getterValue)) {
                    jsonObject = {
                        ...jsonObject,
                        [key]: convertToJSON(getterValue, getterValue.getMetaInfo())
                    };
                }
            }
        });
    }
    if (metaInfo.arrayKeys != null && metaInfo.arrayKeys.length > 0) {
        metaInfo.arrayKeys.split(',').forEach((key) => {
            const getter = `get${capitalize(normalize(key))}`;
            if (hasGetter(o, getter)) {
                // this is array of values, like getContacts
                const getterValues = (o[getter] as GetterFnArray)();
                const mapped = getterValues.map((value: unknown) => {
                    const typeOfValue = getTypeOfObject(value);
                    if (typeOfValue === 'array') {
                        return [];
                    }
                    if (typeOfValue === 'object' && hasObjectMetaInfo(value)) {
                        return convertToJSON(value, value.getMetaInfo());
                    }
                    return value;
                });
                jsonObject = {
                    ...jsonObject,
                    [key]: mapped
                };
            }
        });
    }
    return jsonObject;
};
