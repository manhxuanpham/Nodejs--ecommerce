'use strict'
const _ = require('lodash');
const getInfoData = ({fileds = [],object = {} } ) => {
    return  _.pick(object , fileds);
}

// [a,b] => {a,1}

const getSelectData = (select =[]) => {
    return Object.fromEntries(select.map(el=>[el,1]))
}
const unGetSelectData = (select =[]) => {
    return Object.fromEntries(select.map(el=>[el,0]))
}
const removeUndefinedObject = obj => {
    Object.keys(obj).forEach( k=> {
        if(ojb[k]==null || obj[k] == undefined) {
            delete obj[k]
        }
    })
    return obj
}
const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach(i => {
        if (typeof obj[i] === 'object' && !Array.isArray(obj[i])) {
            const response = updateNestedObjectParser(obj[i])
            Object.keys(obj[i]).forEach(j => {
                final[`${i}.${j}`] = response[j]
            })
        } else {
            final[i] = obj[i]
        }
    })

    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser
}