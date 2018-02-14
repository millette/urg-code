'use strict'

// npm
const groupBy = require('lodash.groupby')
const mapValues = require('lodash.mapvalues')
// const minBy = require('lodash.minby')
const maxBy = require('lodash.maxby')
const flatten = require('lodash.flatten')
const lodashValues = require('lodash.values')

const data = require('./places-times-flat-tight-v4.json') // .slice(0, 5000)

// console.log(data.length)

const groupedPlace = groupBy(data, 'place')

// console.log(Object.keys(groupedPlace).length)

/*
const z = mapValues(groupedPlace, (v, k) => {
  // console.log(k, v)
  // pick min from v based on pat

  // const lo = minBy(v, 'pat')
  // console.log(k, lo)
  return minBy(v, 'pat')
})
*/

// const lows = mapValues(groupedPlace, (v) => minBy(v, 'pat'))
// const highs = mapValues(groupedPlace, (v) => maxBy(v, 'pat'))

// console.log('lows:', lows)
// console.log('highs:', highs)

// console.log(JSON.stringify(highs))

/*
const lows = flatten(lodashValues(mapValues(groupedPlace, (v, k) => {
  // console.log(k, v)
  // pick min from v based on pat

  // const lo = minBy(v, 'pat')
  // console.log(k, lo)

  const x = groupBy(v, (d) => {
    const dd = new Date(d.update)
    return [
      dd.getFullYear(),
      dd.getMonth(),
      dd.getDate()
    ].join('-')
  })

  return lodashValues(mapValues(x, (v2) => minBy(v2, 'pat')))
})))
*/

const highs = flatten(lodashValues(mapValues(groupedPlace, (v, k) => {
  const x = groupBy(v, (d) => {
    const dd = new Date(d.update)
    return [
      dd.getFullYear(),
      dd.getMonth() + 1,
      dd.getDate()
    ].join('-')
  })

  const yo = mapValues(x, (v2, k2) => {
    // console.log(k, k2) // , v2
    const m = maxBy(v2, 'pat')
    return m
  })
  // console.log(k, yo)
  // console.log(k, lodashValues(yo))
  // console.log(yo, lodashValues(yo))
  return lodashValues(yo)
  // console.log()
  // console.log()
})))

// console.log(JSON.stringify(lows))
console.log(JSON.stringify(highs))
