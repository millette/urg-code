'use strict'

// npm
const pdfjs = require('pdfjs-dist')

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

const doit = (fn) => pdfjs.getDocument(fn)
  .then((pdf) => pdf.getPage(1))
  .then((page) => page.getTextContent())
  .then((cnt) => {
    const [ day, monthFr, year, a, hour, h, min ] = cnt.items[0].str.split(':')[1].trim().split(' ')
    if ((a !== 'à') || (h !== 'h')) { throw new Error('Couldn not parse date and time.') }
    const d = new Date(year, monthsFr[monthFr], day, hour, min)
    if (!d) { throw new Error('Couldn not parse date and time.') }
    return [fn, d.toISOString()]
  })

const root = '/home/millette/urg/Rap_Quotid_SituatUrgence.pdf.'
// const fn = '/home/millette/urg/Rap_Quotid_SituatUrgence.pdf.1794'

const those = []
let r = 0
const start = 1780
for (r = 0; r < 15; ++r) {
  those.push(root + (start + r))
}

Promise.all(those.map(doit))
// doit(fn)
  .then(console.log)
  .catch((e) => console.error('BAD', e))
