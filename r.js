'uses strict'

// core
const { promisify } = require('util')
const fs = require('fs')
const readdir = promisify(fs.readdir.bind(fs))

// npm
// const groupBy = require('lodash.groupby')
const flatten = require('lodash.flatten')

readdir('jsons9/')
  .then((xx) => xx.map((x) => {
    const d1 = require('./jsons9/' + x)
    return d1.places.map((x) => {
      return {
        place: x.place,
        civ: parseInt(x.civ, 10),
        pat: parseInt(x.pat, 10),
        x24: parseInt(x.x24, 10),
        x48: parseInt(x.x48, 10),
        update: d1.update
      }
    })
  }))
  .then(flatten)
  .then((xx) => console.log(JSON.stringify(xx)))
  .catch(console.error)
