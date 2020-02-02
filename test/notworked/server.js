const net = require('net')
const stream = require('stream')
const CHAR = 'G'
class Readable extends stream.Readable {
  constructor() {
    super()
  }
  pump(hz) {
    this.t1 = setInterval(() => {
      this.push(Buffer.from([(97 + Math.round((Math.random() * 26)))]))
    }, hz)
    this.t2 = setInterval(() => {
      this.push(Buffer.from(CHAR))
    }, hz * 10)
  }
  unpump() {
    clearInterval(this.t1)
    clearInterval(this.t2)
  }
  _read(size) {}
}

var r = new Readable()
r.pump(100)


const s = net.createServer((f) => {
setTimeout(() => {
   // unlock this as needed.
   // f.destroy()
}, 2000)
f.on('error', (r) => {
  console.log('error!')
  r.unpipe(f)
})
f.on('end', (v) => {
  console.log('end!')
  r.unpipe(f)
})
f.on('close', (h) => {
  console.log('close!')
  r.unpipe(f)
})
r.pipe(f)
})
s.listen(3001, () => {
  var c = net.createConnection(3001)
  setTimeout(() => {
    c.destroy()
  }, 1000)
  c.on('data', (d) => {
      console.log(d.toString())
  })
})