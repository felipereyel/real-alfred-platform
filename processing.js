const { isEmpty } = require('lodash');
const { DOWNLOAD_PREFIX, PSA_TAG, SEASON_KEYS, EPISODE_KEYS } = require("./constants");

function createURL(name) {
    return DOWNLOAD_PREFIX + name.replace(PSA_TAG, '').replace('.', '-').toLowerCase();
}

function filter(names, key, allowEmpty=false) {
    let filtered = names.filter(e => e.search(key) !== -1);
    return filtered.length === 0 && !allowEmpty ? names : filtered;
}

function group(names, quality, source) {
    return SEASON_KEYS.reduce(
        (sacc, s) => {
            const seas = EPISODE_KEYS.reduce(
                (eacc, e) => {
                    const eps = filter(filter(filter(names, s+e, true), quality), source);
                    if (isEmpty(eps)){
                        return eacc;
                    } else {
                        return {
                            ...eacc,
                            [e]: createURL(eps[0])
                        }
                    }
                }, 
                {}
            );
            if (isEmpty(seas)) {
                return sacc;
            } else {
                return {
                    ...sacc, 
                    [s]: seas
                }
            }
        },
        {}
    )
}

exports.group = group;