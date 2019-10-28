# Orbs Notary web gateway

This app provides a bridge between Notary contract running on Orbs blockchain and other services that want to take advantage of [Orbs Notary Library](https://github.com/orbs-network/notary-lib).

## Settings

All configuration happens via environment variables:

* `API_ENDPOINT` - HTTP endpoint of Orbs virtual chain, defaults to `http://localhost:8080`
* `VCHAIN` - Orbs virtual chain id, defaults to `42`

## API

For full reference please consult the [end to end tests](./test/e2e.test.js).

### POST `/api/register`

Takes a binary file as parameter. Returns JSON that contains Orbs transaction id, file hash, and other attributes.

#### Example request

`curl -XPOST -H 'Content-Type: application/octet-stream' --data-binary @README.md http://localhost:3000/api/register`

#### Example response

```json
{
  "status": "OK",
  "response": {
    "txId": "0x009F2aCEF4cCd1152c272f165593A4196c2AcFE8e068Ff29AB55878BcD92C134B00F94B7C3166d74",
    "hash": "3bf644bcb1b3dd4e40dac1317a5f98fa9923c6c8c7213f9e2cc66a2ef367e48d",
    "timestamp": 1572263096750010400,
    "signer": "0x74f90Ae2F37f000e287A2975D006D4f8B8364F65",
    "metadata": "",
    "secret": "",
    "status": "Registered"
  }
}
```

### POST `/api/verify`

Takes string `hash` parameter (hex representation of sha256 hash of the file). Return JSON that contains file hash, verification status, and other attributes.

#### Example request

`curl -XPOST --data hash=fbfa6e1b640256c0dc279574f450a86d83ba8ce8c807f64eebf307b45ecc5f87 http://localhost:3000/api/verify`

#### Example response

```json
{
  "status": "OK",
  "response": {
    "hash": "fbfa6e1b640256c0dc279574f450a86d83ba8ce8c807f64eebf307b45ecc5f87",
    "timestamp": 1572263165866750200,
    "signer": "0x74f90Ae2F37f000e287A2975D006D4f8B8364F65",
    "metadata": "",
    "verified": true,
    "secret": "",
    "status": "Registered"
  }
}
```

## Testing

```bash
# start gamma-server

gamma-cli start-local -env experimental

# deploy the contract

node setup.js

# run tests

npm test
```
