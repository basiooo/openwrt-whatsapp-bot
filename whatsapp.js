import { Boom } from '@hapi/boom'
import { createRequire } from 'module'
import { makeMessage } from './functions/utils.js'
import { checkMyIp, sidompul } from './functions/other.js'
import { firewallRules, initApp, networkInterfaceData, rebootDevice, shutDownDevice, sysInfo } from './functions/device.js'
import { openClashInfo, openClashProxies } from './functions/openclash.js'
import { libernetInfo } from './functions/libernet.js'
const require = createRequire(import.meta.url)
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@adiwajshing/baileys')

const commandHandler = async (message) => {
  let reply = ''
  if (message === '/my_ip') {
    reply = makeMessage(message, await checkMyIp())
  } else if (message.includes('/sidompul')) {
    // eslint-disable-next-line no-unused-vars
    const [command, number] = message.split(' ')
    const result = await sidompul(number)
    reply = makeMessage(message, result)
  } else if (message === '/sysinfo') {
    reply = makeMessage(message, await sysInfo())
  } else if (message === '/reboot') {
    reply = makeMessage(message, await rebootDevice())
  } else if (message === '/shutdown') {
    reply = makeMessage(message, await shutDownDevice())
  } else if (message === '/init_app') {
    reply = makeMessage(message, await initApp())
  } else if (message === '/firewall_rules') {
    reply = makeMessage(message, await firewallRules())
  } else if (message === '/interfaces') {
    reply = makeMessage(message, await networkInterfaceData())
  } else if (message === '/openclash_info') {
    reply = makeMessage(message, await openClashInfo())
  } else if (message === '/openclash_proxies') {
    reply = makeMessage(message, await openClashProxies())
  } else if (message === '/libernet_info') {
    reply = makeMessage(message, await libernetInfo())
  } else {
    reply = makeMessage(message, 'Command Not Found.!')
  }
  return reply
}

const whatsappService = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect.error).output.statusCode
      if (reason === DisconnectReason.badSession) {
        console.log(
          'Bad Session File, Please Delete baileys_auth_info and Scan Again'
        )
        sock.logout()
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log('Connection closed, reconnecting....')
        whatsappService()
      } else if (reason === DisconnectReason.connectionLost) {
        console.log('Connection Lost from Server, reconnecting...')
        whatsappService()
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          'Connection Replaced, Another New Session Opened, Please Close Current Session First'
        )
        sock.logout()
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(
          'Device Logged Out.'
        )
        sock.logout()
      } else if (reason === DisconnectReason.restartRequired) {
        console.log('Restart Required, Restarting...')
        whatsappService()
      } else if (reason === DisconnectReason.timedOut) {
        console.log('Connection TimedOut, Reconnecting...')
        whatsappService()
      } else {
        sock.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`)
      }
    } else if (connection === 'open') {
      console.log('opened connection')
    }
  })
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type === 'notify') {
      if (!messages[0].key.fromMe) {
        const senderMessage = messages[0].message.conversation.toLowerCase()
        const senderNumber = messages[0].key.remoteJid
        const reply = await commandHandler(senderMessage)
        await sock.sendMessage(
          senderNumber,
          { text: reply },
          { quoted: messages[0] }
        )
      }
    }
  })
}

export { whatsappService }
