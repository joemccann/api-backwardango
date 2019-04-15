# SYNOPSIS

🔮 REST-ful API to evaluate whether a cryptoasset is in backwardation or contango.

## REQUIREMENTS

1. A Google Cloud Account.
2. Billing Enabled.
3. API Access Enabled.
4. `gcloud` CLI installed and in your `$PATH`.
5. A preferred configuration created ( `gcloud init` ).

## USAGE

```sh
curl https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-backwardango?spot=.BXBT&futures=XBTM19&exchange=Bitmex
```

Or, if you prefer a `POST`:

```sh
curl https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-backwardango --data '{"spot": ".BXBT", "futures": "XBTM19", "exchange": "Bitmex"}' -H "Content-Type: application/json"
```

The expected response:

```js
{
  code: 1,
  date: 'Mon Apr 15 2019 11:16:00 GMT-0700 (Pacific Daylight Time)',
  delta: -23.5,
  futures: 5026.5,
  spot: 5050,
  state: 'backwardation',
  timestamp: 1555352160602
}
```

> NOTE: the `code` property has value `0` for contango and `1` for backwardation.

Or in the case there is a failure:

```js
{
  "err": "Exchange, XXX, not supported."
}
```

## API

```sh
curl https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-backwardango?spot=.BXBT&futures=XBTM19&exchange=Bitmex
```

## DEPLOY

First, fork or clone this repo, then:

```sh
npm i
```

You need to pass in your [environment variables either in a `.env.yaml` file or as command line arguements](https://cloud.google.com/functions/docs/env-var) for your exchange clients.  

For example, for Bitmex, you need the following in your `.env.yaml` file:

```yaml
BITMEX_API_KEY: XXX
BITMEX_API_SECRET: YYY
```

Run the following command in the root of this repository, assuming a `.env.yaml` file:

```sh
gcloud functions deploy api-backwardango --runtime nodejs10 --trigger-http --memory 128MB --env-vars-file .env.yaml
```

You should receive a YAML like response in your terminal including the URL for the Cloud Function.

## TESTS

```sh
npm i -D
BITMEX_API_KEY={YOUR-BITMEX-API-KEY} BITMEX_API_SECRET={YOUR-BITMEX-API-SECRET} npm test
```

## AUTHORS

- [Joe McCann](https://twitter.com/joemccann)

## LICENSE

MIT