const Bitmex = require('bitmex')
const Num = require('bignumber.js')

const { env: {
  BITMEX_API_KEY: API_KEY,
  BITMEX_API_SECRET: API_SECRET
} } = process

const bitmex = new Bitmex({ API_KEY, API_SECRET })

const getPrice = async (args) => {
  const {
    asset,
    exchange
  } = args
  if (exchange === 'BITMEX') {
    const { err, data } = await bitmex.price(asset)
    if (err) return { err }
    return { data }
  }
  if (exchange === 'OKEX') {

  }
  if (exchange === 'DEREBIT') {

  } else return { err: `Exchange, ${exchange}, not supported.` }
}

exports['api-backwardango'] = async (req, res) => {
  const {
    body = {},
    query = {}
  } = req

  const spot = body.spot || query.spot || null
  const futures = body.futures || query.futures || null
  let exchange = body.exchange || query.exchange || null

  if (!spot) {
    return res.status(404)
      .send({ err: `A spot asset is required.` })
  }

  if (!futures) {
    return res.status(404)
      .send({ err: `A futures asset is required.` })
  }

  if (!exchange) {
    return res.status(404)
      .send({ err: `An exchange is required.` })
  }

  exchange = exchange.toUpperCase()

  let spotPrice = null
  let futuresPrice = null

  // Get the price of spot
  {
    const { err, data } = await getPrice({ asset: spot, exchange })
    if (err) return res.status(404).send({ err })
    spotPrice = data
  }

  // Get the price of the futures contract
  {
    const { err, data } = await getPrice({ asset: futures, exchange })
    if (err) return res.status(404).send({ err })
    futuresPrice = data
  }

  const state = futuresPrice > spotPrice ? 'contango' : 'backwardation'

  const delta = Num(futuresPrice).minus(Num(spotPrice)).toNumber()

  //
  // `code` is to be used for a faster lookup than a string comparison
  //
  const code = state === 'contango' ? 0 : 1

  const timestamp = Date.now()
  const date = Date(timestamp).toString()

  const data = {
    code,
    date,
    delta,
    futures,
    futuresPrice,
    spot,
    spotPrice,
    state,
    timestamp
  }

  return res.status(200).send({ data })
}
