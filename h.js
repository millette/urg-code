'use strict'

const data = require('./horaire.json')

console.log('numPages:', data.numPages)
console.log('currentPages:', data.currentPages)

const places = []

const fv2 = (v) => places.push({
  place: v[0],
  civ: v[1],
  pat: v[2],
  x24: v[3],
  x48: v[4]
})

const fv1 = (v) => v.tables.slice(2).forEach(fv2)

data.pageTables.forEach(fv1)

console.log(places)
