import { createHash, randomBytes, randomUUID } from 'crypto'
import { io } from 'socket.io-client'
import { HypervisorEvents, HypervisorScrapperState } from '../hypervisor/hypervisor.enum'

const socket = io('ws://localhost:4000/', { transports: ['websocket'], timeout: 600 })

console.log('Scrapper registration simulator', socket.io.opts)
socket.onAny((ev, payload) => console.log('Non handled event:', ev, 'value:', payload))
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

  // 1.1. Update state
  socket.emit(HypervisorEvents.STATE, {
    uuid,
    state: HypervisorScrapperState.REGISTRATION,
  })
})

// 2. Wait for visa
socket.once(HypervisorEvents.VISA, (visa) => {
  if (visa.accepted) {
    console.log('Visa accepted', visa.visaId)
    socket.emit(HypervisorEvents.STATE, HypervisorScrapperState.READY)

    // 3. Wait for commands
    socket.on(HypervisorEvents.COMMAND, (cmd) => {
      console.log('Dispatching:', cmd)
      switch (cmd) {
        case 'disconnect':
          socket.disconnect()
        default:
          console.warn("Can't recoginise cmd!")
      }
    })
  } else {
    console.log('Visa rejected')
  }
})
