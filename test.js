const test = require('tape')
const { 'api-backwardango': backwardango } = require('.')

//
// Create a mock request and response method
//

function status (code) {
  this.statusCode = code
  return this
}

function send (obj) {
  const body = { ...this, ...obj }
  return body
}

const res = {
  status,
  send
}

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('pass - get values', async t => {
  const req = {
    body: {
      spot: '.BXBT',
      futures: 'XBTM19',
      exchange: 'Bitmex'
    }
  }
  const { err, data, statusCode } = await backwardango(req, res)
  t.ok(!err)
  t.ok(data)
  t.equals(statusCode, 200)
  const keys = Object.keys(data)
  t.deepEquals(keys,
    [ 'code', 'date', 'delta', 'exchange', 'futures',
      'futuresPrice', 'spot', 'spotPrice', 'state', 'timestamp' ])
  t.end()
})

test('pass - get values', async t => {
  const req = {
    body: {
      spot: '.BXBT',
      futures: 'XBTU19',
      exchange: 'Bitmex'
    }
  }
  const { err, data, statusCode } = await backwardango(req, res)
  t.ok(!err)
  t.ok(data)
  t.equals(statusCode, 200)
  const keys = Object.keys(data)
  t.deepEquals(keys,
    [ 'code', 'date', 'delta', 'exchange', 'futures',
      'futuresPrice', 'spot', 'spotPrice', 'state', 'timestamp' ])
  t.end()
})

test('pass - get values of XBT futs', async t => {
  const FUTS = ['XBTM19', 'XBTU19']

  for (const fut of FUTS) {
    const req = {
      body: {
        spot: '.BXBT',
        futures: fut,
        exchange: 'Bitmex'
      }
    }
    const { err, data, statusCode } = await backwardango(req, res)
    t.ok(!err)
    t.ok(data)
    t.equals(statusCode, 200)
  }

  t.end()
})

test('fail - invalid instruments', async t => {
  const req = {
    body: {
      spot: 'XXX',
      futures: 'YYY',
      exchange: 'Bitmex'
    }
  }

  const { err, data, statusCode } = await backwardango(req, res)
  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, `No results for XXX.`)
  t.end()
})
