/* eslint-disable no-undef */
global.window = {}

const { default: QiankunBridge } = require('./../dist/src/index')
const { qiankunBridge } = require('./../dist/src/index')

qiankunBridge.setLock(false)

test('RegisterHandlers', () => {
  qiankunBridge.registerHandlers({
    sum: (a, b) => a + b,
    toString: a => String(a),
  })
  expect(qiankunBridge.getHandler('sum')(1, 2)).toBe(3)
  expect(qiankunBridge.getHandler('toString')(222)).toBe('222')
})

test('RemoveHandlers', () => {
  qiankunBridge.removeHandlers(['sum'])
  expect(qiankunBridge.getHandler('sum')(1, 2)).toBe(undefined)
  expect(qiankunBridge.getHandler('toString')(222)).toBe('222')
  qiankunBridge.removeHandlers(['toString'])
  expect(qiankunBridge.getHandler('toString')(222)).toBe(undefined)
})

test('Singleton', () => {
  expect(QiankunBridge.hasInstance()).toBe(true)
})

test('Events', () => {
  let tempV = 0
  qiankunBridge.addListener('TESTING_SUM', (c) => { tempV += c })
  qiankunBridge.addListener('TESTING_SUM', (c) => { tempV += c })
  qiankunBridge.addListener('TESTING_SUM', (c) => { tempV += c })

  qiankunBridge.emitEvent('TESTING_SUM', 1)
  expect(tempV).toBe(3)
})

test('Events Lock', async () => {
  let tempV = 0
  // on
  qiankunBridge.addListener('TESTING_LOCK', (c) => { tempV += c })
  qiankunBridge.addListener('TESTING_LOCK', (c) => { tempV += c })

  // 关锁
  qiankunBridge.setLock(true)
  qiankunBridge.emitEvent('TESTING_LOCK', 1)

  // 此处应该被阻塞
  expect(tempV).toBe(0)

  jest.setTimeout(100)

  // 开锁
  qiankunBridge.setLock(false)
  expect(tempV).toBe(2)

  // 事件阻塞顺序测试
  qiankunBridge.setLock(true)
  let order1
  let order2
  qiankunBridge.addListener('TEST_ORDER1', (a) => {
    order1 = a
    qiankunBridge.setLock(true)
  })
  qiankunBridge.addListener('TEST_ORDER2', (a) => {
    order2 = a
    qiankunBridge.setLock(true)
  })
  // 事件派发 先 ORDER1 再 ORDER2
  qiankunBridge.emitEvent('TEST_ORDER1', 1)
  qiankunBridge.emitEvent('TEST_ORDER2', 2)

  // 由于此时有锁, 此处应该是 undefined
  expect(order1).toBe(undefined)
  expect(order2).toBe(undefined)

  // 100ms 后 开锁
  jest.setTimeout(100)
  qiankunBridge.setLock(false)

  // ORDER1 此时应该是 1
  expect(order1).toBe(1)

  // ORDER1 会上锁，所以 ORDER2 应该是 undefine
  expect(order2).toBe(undefined)

  // 100ms 后开锁
  jest.setTimeout(100)
  qiankunBridge.setLock(false)
  // 此时 ORDER2 应该是 2
  expect(order2).toBe(2)
})
