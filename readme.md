# @byted-cg/qiankun-bridge
## Introduction
Provides an easy way to communicate between 'Master' and 'Slave' applications in Micro Frontends scene

[ChangeLog](/changelog.md)

## How to use
### Install
npm
```
npm install @byted-cg/qiankun-bridge -S
```

yarn
```
yarn add @byted-cg/qiankun-bridge
```

### Usage
```
import { qiankunBridge } from '@byted-cg/qiankun-bridge'

// register handler
qiankunBridge.registerHandlers({
  foo: (a, b) => `foo: ${a}${b}`,
  sum: (a, b) => a + b,
})

// get handler
const foo = qiankunBridge.getHandler('foo')
foo(1, 2) // return 'foo: 12'

const sum = qiankunBridge.getHanlder('sum')
sum(1, 2) // return 3

// remove handler
qiankunBridge.removeHandlers(['foo', 'sum'])


// addListener
const eventFooFunction = (a, b) => console.log(a, b)
qiankunBridge.addListener('EVENT_FOO', eventFooFunction)

// emitEvent
qiankunBridge.emitEvent('EVENT_FOO', 1, 2) // log stdout: 1, 2

// removeListener
qiankunBridge.removeListener('EVENT_FOO', eventFooFunction)
```


## API
### Instance Method
| name | params | return | remark |
| -- | -- | -- | -- |
| registerHandlers | object { [string]: Function } | -- | register handlers, and keep key unique |
| removeHandlers | string[] | -- | remove handlers with keys array |
| getHandler | string | Function | get handler with key |
| getAllHandlers | string[] | { [string]: { key: string, handler: Function } } | get all registered handlers |
| addListener | (key: string, listener: Function) | -- | add event listener |
| removeListener | (key: string, listener: Function) | -- | remove event listener |
| emitEvent | (key: string, ...params) | -- | emit event |
| setLock | boolean | -- | set event lock status |

### Static Variable
| name | default | remark |
| -- | -- | -- |
| logger | console | the logger |
| eventLock | true | Blocks events when this lock is opened, but you dont need to use or rewrite this variable directly |

## Events Lock
> what's this ?

这个锁是为了解决「 Master emit event 后, Slave 在此时此刻并没有 mount 完成」在这种情况下事件可能会丢失. 为了解决这个问题, 加入事件锁与事件队列.

关锁后所有事件会 push 进队列, 开锁后按序补推

> Why is this paragrphy written in Chinese

Because...