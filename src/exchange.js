import crypto from 'crypto'
import basex from 'base-x'

const base36 = basex('0123456789abcdefghijklmnopqrstuvwxyz')
const connections = {}

const genCallback = content => {
  return {
    statusCode: 200, 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Credentials': 'true'
    },
    body: content
  }
}

exports.handler = (event, context, callback) => {
  if (event.httpMethod === 'POST') {
    let result
    while (true) {
      const rnd_buf = crypto.randomBytes(3)
      const key = base36.encode(rnd_buf)
      if (key in connections)
        continue

      connections[key] = event.body
      result = key
      break
    }

    callback(null, genCallback(result))

  } else {
    
    const params = event.queryStringParameters
    if (params.wid && connections[params.wid]) {
      const conn_info = connections[params.wid]
      delete connections[params.wid]

      callback(null, genCallback(conn_info))
    } else {
      callback(null, genCallback(''))
    }
  }

}