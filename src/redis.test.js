const { assertSuccess, payload } = require(`@pheasantplucker/failables`)
const assert = require('assert')
const equal = assert.deepEqual
const uuid = require('uuid')

const {
  test,
  createClient,
  disconnect,
  set,
  exists,
  get,
  remove,
  hashSet,
  hashGet,
  hashGetAll,
  hashRemove,
  hashExists,
} = require('./redis.js')

const { REDIS_HOST } = process.env
const opts = { host: REDIS_HOST }

describe(`redis.js()`, () => {
  const key1 = 'testKey'
  const val1 = 'testVal'

  const hashKey1 = 'testHash_' + uuid.v4()
  const field1 = 'testField'

  describe(`test()`, () => {
    it(`should return success`, () => {
      const result = test()
      assertSuccess(result)
    })
  })

  describe(`createClient()`, () => {
    it(`should return a client obj`, async () => {
      const result = await createClient(opts)
      assertSuccess(result)
    })
  })

  describe(`set()`, () => {
    it(`should set a value in redis`, async () => {
      const result = await set(key1, val1)
      assertSuccess(result)
      const response = payload(result)
      equal(response, 'OK')
    })
  })

  describe(`get()`, () => {
    it(`should get a value from rEdis`, async () => {
      const result = await get(key1)
      assertSuccess(result)
      const response = payload(result)
      equal(response, val1)
    })
  })

  describe(`exists()`, () => {
    it(`should check if a key exists`, async () => {
      const result = await exists(key1)
      assertSuccess(result)
      const response = payload(result)
      equal(response, 1)
    })
  })

  describe(`remove()`, () => {
    it(`should remove the key/val`, async () => {
      const key2 = 'testKey2'
      const val2 = 'testVal2'
      const write = await set(key2, val2)
      assertSuccess(write)
      const result = await remove(key2)
      assertSuccess(result)
      const r2 = await exists(key2)
      assertSuccess(r2)
      const existsPay = payload(r2)
      equal(existsPay, 0)
    })
  })

  describe(`hashSet()`, () => {
    it(`should set a value in redis`, async () => {
      const result = await hashSet(hashKey1, field1, val1)
      assertSuccess(result)
      const response = payload(result)
      equal(response, 1)
    })
  })

  describe(`hashGet()`, () => {
    it(`should get a value from rEdis`, async () => {
      const result = await hashGet(hashKey1, field1)
      assertSuccess(result)
      const response = payload(result)
      equal(response, val1)
    })
  })

  describe(`hashGetAll()`, () => {
    it(`should get a value from rEdis`, async () => {
      const key3 = 'testKey3'
      const field3 = 'testField3'
      const val3 = 'testVal3'
      const write = await hashSet(key3, field3, val3)
      const field4 = 'testField4'
      const val4 = 'testVal4'
      const write2 = await hashSet(key3, field4, val4)
      assertSuccess(write)
      assertSuccess(write2)
      const result = await hashGetAll(key3)
      assertSuccess(result)
      const response = payload(result)
      equal(response[field3], val3)
      equal(response[field4], val4)
      const r1 = await hashRemove(key3, field3)
      assertSuccess(r1)
      const r2 = await hashRemove(key3, field4)
      assertSuccess(r2)
    })
  })

  describe(`hashRemove()`, () => {
    it(`should remove the hash key/val`, async () => {
      const key2 = 'testKey2'
      const field2 = 'testField2'
      const val2 = 'testVal2'
      const write = await hashSet(key2, field2, val2)
      assertSuccess(write)
      const result = await hashRemove(key2, field2)
      assertSuccess(result)
      const r2 = await hashExists(key2, field2)
      assertSuccess(r2)
      const existsPay = payload(r2)
      equal(existsPay, 0)
    })
  })

  describe(`CLEANINGUP`, () => {
    it('should delete all keys/hashes it made', async () => {
      const r1 = await remove(key1)
      assertSuccess(r1)
      const result = await hashRemove(hashKey1, field1)
      assertSuccess(result)
    })
  })

  describe(`disconnect()`, () => {
    it(`should disconnect the client`, async () => {
      const result = await disconnect()
      assertSuccess(result)
      const disconnectPay = payload(result)
      equal(disconnectPay, true)
    })
  })
})
