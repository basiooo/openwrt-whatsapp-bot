import { Boom } from '@hapi/boom'
import fs from 'fs'
import { createRequire } from 'module'
import { listCommandMessage, makeMessage } from './functions/utils.js'
import { checkDnsLeak, checkMyIp, sidompul } from './functions/other.js'
import { firewallRules, initApp, networkInterfaceData, rebootDevice, shutDownDevice, sysInfo } from './functions/device.js'
import { openClashInfo, openClashProxies } from './functions/openclash.js'
import { libernetInfo } from './functions/libernet.js'
const require = createRequire(import.meta.url)
const logger = require('pino')()
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys')

const SESSION_DIR = 'baileys_auth'

const commandHandler = async (message) => {
  let reply = ''
  if (message === '/my_ip') {
    reply = makeMessage(message, await checkMyIp())
  } else if (message.includes('/sidompul')) {
    // eslint-disable-next-line no-unused-vars
    const [command, number] = message.split(' ')
    const result = await sidompul(number)
    reply = makeMessage(message, result)
  } else if (message.includes('/sidompul')) {
    // eslint-disable-next-line no-unused-vars
    const [command, number] = message.split(' ')
    if (number === undefined) {
      reply = 'Nomer tidak boleh kosong.! \nContoh "/sidompul 08123456789" atau "/sidompul 628123456789"'
    } else {
      reply = await sidompul(number)
    }
    reply = makeMessage(message, reply)
  } else if (message === '/my_ip') {
    reply = makeMessage(message, await checkMyIp())
  } else if (message === '/dns_leak') {
    reply = makeMessage(message, await checkDnsLeak())
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
  } else if (message === '/ping') {
    reply = makeMessage(message, 'Pong..!')
  } else if (message === '/menu') {
    reply = listCommandMessage()
  } else {
    reply = makeMessage(message, 'Command Not Found.!')
  }
  return reply
}

const whatsappService = async () => {
  // logger.level = 'info'
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR)
  const whatsAppSocket = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger
  })
  whatsAppSocket.ev.on('creds.update', saveCreds)
  whatsAppSocket.ev.on('connection.update', async (update) => {
    // console.log(update);
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect.error).output.statusCode
      if (reason === DisconnectReason.badSession) {
        logger.info('Bad Session, Please Scan QR again...')
        await fs.promises.rm(`${process.cwd()}/${SESSION_DIR}`, { maxRetries: 5, retryDelay: 2000, recursive: true, force: true })
        whatsAppSocket.logout()
      } else if (reason === DisconnectReason.connectionClosed) {
        logger.info('Connection closed, reconecting...')
        whatsappService()
      } else if (reason === DisconnectReason.connectionLost) {
        logger.info('Connection Lost, reconnecting...')
        whatsappService()
      } else if (reason === DisconnectReason.connectionReplaced) {
        logger.info('Connection Replaced, Please Scan QR again...')
        await fs.promises.rm(`${process.cwd()}/${SESSION_DIR}`, { maxRetries: 5, retryDelay: 2000, recursive: true, force: true })
        whatsAppSocket.logout()
      } else if (reason === DisconnectReason.loggedOut) {
        logger.info('Device Logged Out, Please Scan QR again...')
        await fs.promises.rm(`${process.cwd()}/${SESSION_DIR}`, { maxRetries: 5, retryDelay: 2000, recursive: true, force: true })
        whatsAppSocket.logout()
      } else if (reason === DisconnectReason.restartRequired) {
        logger.info('Restart Required, Restarting...')
        whatsappService()
      } else if (reason === DisconnectReason.timedOut) {
        logger.info('Connection TimedOut, Reconnecting...')
        whatsappService()
      } else {
        whatsAppSocket.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`)
      }
    }
  })
  whatsAppSocket.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type === 'notify') {
      if (!messages[0].key.fromMe) {
        let senderMessage = ''
        if (messages[0].message?.conversation) {
          senderMessage = messages[0].message.conversation.toLowerCase()
        } else if (messages[0].message?.templateButtonReplyMessage) {
          senderMessage = messages[0].message.templateButtonReplyMessage.selectedDisplayText
        }
        const senderNumber = messages[0].key.remoteJid
        const reply = await commandHandler(senderMessage)
        await whatsAppSocket.sendMessage(
          senderNumber,
          reply
        )
      }
    }
  })
}

export { whatsappService }
