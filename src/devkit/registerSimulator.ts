import { createHash, randomBytes, randomUUID } from 'crypto'
import { io } from 'socket.io-client'
import {
  HypervisorEvents,
  HypervisorScrapperState,
  HypervisorScrapperCommands,
} from '../hypervisor/hypervisor.enum'
import { EventEmitter } from 'events'

const socket = io('ws://localhost:4000/', { transports: ['websocket'], timeout: 600 })
const commands = new EventEmitter()

console.log('Scrapper registration simulator', socket.io.opts)

socket.on('disconnect', (reason) => {
  console.log('disconnected', reason)
})

socket.on('connect', () => {
  console.log('Connected!', socket.id, socket.io.engine.transport.name)

  const uuid = randomUUID()
  // 1. Request visa
  socket.emit(HypervisorEvents.PASSPORT, {
    friendlyName: 'simulator',
    uuid,
    presharedKey: createHash('sha1') // dev only
      .update(randomBytes(2 ** 8))
      .digest('hex'),
  })

  socket.on('visa-status', (e) => console.log('VS:', e))
})

// 2. Wait for visa
socket.once(HypervisorEvents.VISA, (visa) => {
  if (visa.accepted) {
    console.log('Visa accepted', visa.visaId)
    socket.emit(HypervisorEvents.STATE, HypervisorScrapperState.READY)

    // 3. Wait for commands
    socket.on(HypervisorEvents.COMMAND, (cmdExec) => {
      console.log('Dispatching:', cmdExec.command)
      commands.emit(cmdExec.command, cmdExec)
    })
  } else {
    console.log('Visa rejected')
  }
})

commands.on(HypervisorScrapperCommands.DISCONNECT, () => {
  socket.emit(HypervisorEvents.STATE, HypervisorScrapperState.DISCONNECTED)
  socket.disconnect()
})

commands.on(HypervisorScrapperCommands.EXIT, () => {
  socket.emit(HypervisorEvents.STATE, HypervisorScrapperState.DISCONNECTED)
  process.exit()
})

commands.on(HypervisorScrapperCommands.SCRAP, () => {
  socket.emit(HypervisorEvents.STATE, HypervisorScrapperState.WORKING)
  console.log('Much work...')
  setTimeout(() => {
    socket.emit(HypervisorEvents.STATE, HypervisorScrapperState.READY)
  }, 10000)
})
