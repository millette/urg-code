'use strict'

// core
const { promisify } = require('util')
const fs = require('fs')
// const { basename } = require('path')
const readdir = promisify(fs.readdir.bind(fs))
const writeFile = promisify(fs.writeFile.bind(fs))

// npm
const PDFJS = require('pdfjs-dist')
const pte = require('pdf-table-extractor')
// const pMap = require('p-map')
// const pAll = require('p-all')

// const START = parseInt(process.argv[2] || 0, 10) * 100

// PDFJS.workerSrc = 'pdfjs-dist/build/pdf.worker.js'
// PDFJS.cMapUrl = 'pdfjs-dist/cmaps/';
// PDFJS.cMapPacked = true;

// const fn666 = '/home/millette/urg/Rap_Quotid_SituatUrgence.pdf.1794'
// const fn666 = '/home/millette/urg/Rap_horaire_SituatUrgence.pdf.1792'

const monthsFr = {
  janvier: 0,
  février: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  août: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  décembre: 11
}

const extractDate = (fn) => PDFJS.getDocument(fn)
  .then((pdf) => Promise.all([pdf, pdf.getPage(1)]))
  .then(([pdf, page]) => Promise.all([pdf, page.getTextContent()]))
  .then(([pdf, cnt]) => {
    const [ day, monthFr, year, a, hour, h, min ] = cnt.items[0].str.split(':')[1].trim().split(' ')
    pdf.destroy()
    if ((a !== 'à') || (h !== 'h')) { throw new Error('Couldn not parse date and time.') }
    const d = new Date(year, monthsFr[monthFr], day, hour, min)
    if (!d) { throw new Error('Couldn not parse date and time.') }
    console.log(new Date(), fn)
    return d.toISOString()
  })

const parsePlaces = (result) => {
  const places = []
  const fv2 = (v) => places.push({
    place: v[0],
    civ: v[1],
    pat: v[2],
    x24: v[3],
    x48: v[4]
  })

  result.pageTables.forEach((v) => v.tables.slice(2).forEach(fv2))
  return places
}

const extractHourly = (fn) => new Promise((resolve, reject) => pte(fn, resolve, reject))
  .then(parsePlaces)

const extractWaits = (fn) => Promise.all([
  extractHourly(fn),
  extractDate(fn)
])
  .then((x) => ({
    places: x[0],
    update: x[1]
  }))

const root = '/home/millette/urg/'
const outputs = '/home/millette/urg-code/jsons11/'

/*
const writeWaitsJSON = (fn) => extractWaits(fn)
  .then((x) => writeFile(outputs + basename(fn) + '.json', JSON.stringify(x)))
  .then(() => fn)
*/

const writeWaitsJSON2 = (fn) => extractWaits(fn)
  .then((x) => writeFile(outputs + 'horaire-' + Date.parse(x.update) + '.json', JSON.stringify(x)))
  .then(() => fn)

/*
 * So, all these variations leak memory
 * ramping up to 4 GiB used for 700 items
 * when things should be happening in serially.
*/

readdir(root)
/*
  .then((x) => pMap(
    x
      .filter((z) => !z.indexOf('Rap_horaire_SituatUrgence.pdf'))
      .slice(START, START + 100)
      .map((z) => root + z),
    writeWaitsJSON2,
    { concurrency: 1 }
  ))
*/

  .then(async (x) => {
    const y = x.filter((z) => !z.indexOf('Rap_horaire_SituatUrgence.pdf'))
    let r
    for (r = 0; r < y.length; ++r) { await writeWaitsJSON2(root + y[r]) }
    return y
  })

/*
  .then((x) => pAll(
    x
      .filter((z) => !z.indexOf('Rap_horaire_SituatUrgence.pdf'))
      .map((z) => root + z)
      .map((z) => writeWaitsJSON2.bind(null, z)),
    { concurrency: 1 }
  ))
*/
  .then((x) => console.log('DONE', x.length))
  .catch(console.error)
