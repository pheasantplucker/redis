const { success, failure } = require('@pheasantplucker/failables')
const Redis = require('ioredis')

let redisClient

async function createClient(opts) {
  try {
    const client = new Redis(opts)
    redisClient = client
    return success(client)
  } catch (e) {
    return failure(e.toString())
  }
}

async function get(key) {
  try {
    const getResult = await redisClient.get(key)
    return success(getResult)
  } catch (e) {
    return failure(e.toString())
  }
}

async function set(key, val, ...args) {
  try {
    const setResult = await redisClient.set(key, val, ...args)
    return success(setResult)
  } catch (e) {
    return failure(e.toString())
  }
}

async function exists(key, ...args) {
  try {
    const existsResult = await redisClient.exists(key, ...args)
    return success(existsResult)
  } catch (e) {
    return failure(e.toString())
  }
}

async function remove(key, ...args) {
  try {
    const delResult = await redisClient.del(key, ...args)
    return success(delResult)
  } catch (e) {
    return failure(e.toString())
  }
}

async function disconnect() {
  try {
    await redisClient.disconnect()
    return success(true)
  } catch (e) {
    return failure(e.toString())
  }
}

async function hashSet(key, field, val, ...args) {
  try {
    const setResult = await redisClient.hset(key, field, val, ...args)
    return success(setResult)
  } catch (e) {
    return failure(e.toString())
  }
}

async function hashGet(key, field) {
  try {
    const getResult = await redisClient.hget(key, field)
    return success(getResult)
  } catch (e) {
    return failure(e.toString())
  }
}

async function hashGetAll(key) {
  try {
    const getResult = await redisClient.hgetall(key)
    return success(getResult)
  } catch (e) {
    return failure(e.toString())
  }
}

async function hashRemove(key, field) {
  try {
    const delResult = await redisClient.hdel(key, field)
    return success(delResult)
  } catch (e) {
    return failure(e.toString())
  }
}

async function hashExists(key, ...args) {
  try {
    const existsResult = await redisClient.hexists(key, ...args)
    return success(existsResult)
  } catch (e) {
    return failure(e.toString())
  }
}

function test() {
  return success()
}

module.exports = {
  test,
  createClient,
  set,
  get,
  exists,
  remove,
  disconnect,
  hashSet,
  hashGet,
  hashGetAll,
  hashRemove,
  hashExists,
}
