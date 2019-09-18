import EventEmitter from 'wolfy87-eventemitter'
import {
  isDuplicate,
  array2obj
} from './utils'
import { INSTANCE_MOUNT_WINDOW_KEY } from './constants'

export default class QiankunBridge {
  // logger 器
  static logger = console

  // 单例判断
  static hasInstance = () => (!!(window as any)[INSTANCE_MOUNT_WINDOW_KEY])

  // 事件锁
  static eventLock = true

  // 任务队列
  private eventQueue: { key: string, params: any[] }[] = new Array()

  // eventEmitter
  private eventEmitter = new EventEmitter()

  private handlerMap: any = {}

  public constructor() {
    if (!QiankunBridge.hasInstance()) {
      (window as any )[INSTANCE_MOUNT_WINDOW_KEY] = this
    } else {
      return (window as any )[INSTANCE_MOUNT_WINDOW_KEY]
    }
  }

  // 注册 handler 
  public registerHandlers(handlers: any) {
    const registeredHandlerKeys = Object.keys(this.handlerMap)
    Object.keys(handlers).forEach((key) => {
      const handler = handlers[key]
      if (isDuplicate(registeredHandlerKeys, key)) {
        QiankunBridge.logger.warn(`handler registed failed, because handler '${key}' was already registed`)
      } else {
        this.handlerMap = {
          ...this.handlerMap,
          [key]: {
            key,
            handler,
          },
        }
        QiankunBridge.logger.log(`handler '${key}' register succeed`)
      }
    })
    return true
  }

  // 移除 handler
   public removeHandlers(handlerKeys: string[]) {
      handlerKeys.forEach((key) => {
        delete this.handlerMap[key]
      })
      return true
    }

  // getHandler('aaabbb')  return function
  // 获取某个 handler
  public getHandler(key:string) {
    const target = this.handlerMap[key]
    const errMsg = `handler '${key}' not registed`
    if (!target) {
      QiankunBridge.logger.error(errMsg)
    }
    return (target && target.handler) || (() => { QiankunBridge.logger.error(errMsg) })
  }

  // 获取所有 handler
  public getAllHandlers(handlerKeys = []) {
    if (handlerKeys.length === 0) {
      return this.handlerMap
    }
    return array2obj(handlerKeys.map(key => this.getHandler(key)))
  }

  // 事件监听
  public addListener(key: string, listener: Function) {
    this.eventEmitter.addListener(key, listener)
  }

  // 移除事件
  public removeListener(key: string, listener: Function) {
    this.eventEmitter.removeListener(key, listener)
  }

  // 派发事件
  public emitEvent(key: string, ...params: any) {
    this.push2EventQueue(key, [...params])
    if (!QiankunBridge.eventLock) {
      this.execEventQueue()
    }
  }

  // 推送事件到事件队列
  private push2EventQueue(key: string, paramsArray: any[]) {
    this.eventQueue.push({ key, params: paramsArray })
  }

  // 执行事件队列
  private execEventQueue() {
    // 如果没有上锁
    if (!QiankunBridge.eventLock) {
      while (!QiankunBridge.eventLock && this.eventQueue.length > 0) {
        const event = this.eventQueue.shift()
        if (event) {
          const { params: paramsArray, key } = event
          const remainEventKeys = this.eventQueue.map(e => e.key)
          QiankunBridge.logger.log(`\n任务队列执行任务: ${key} \n队列中还剩: ${remainEventKeys.length > 0 ? remainEventKeys.join(', ') : '空'}\n`)
          // 执行任务
          this.eventEmitter.emitEvent(key, paramsArray)
        }
      }
    }
  }

  // 设置锁
  public setLock(v: boolean) {
    QiankunBridge.eventLock = v
    if (!QiankunBridge.eventLock) {
      this.execEventQueue()
    }
  }
}