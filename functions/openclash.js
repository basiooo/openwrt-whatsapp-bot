import axios from 'axios'
import { lanNetworkInfo } from './device.js'
import { execShellCommand, latencyColor } from './utils.js'
import { resolve } from 'path'

const openclashConfiguration = async () => {
  const { ip } = await lanNetworkInfo()
  let port = await execShellCommand('uci get openclash.config.cn_port')
  let secret = await execShellCommand('uci get openclash.config.dashboard_password')
  port = port.replace('\n', '')
  secret = secret.replace('\n', '')
  const baseUrl = `http://${ip}:${port}`
  return {
    ip,
    port,
    secret,
    baseUrl
  }
}

const openClashInfo = async () => {
  return await execShellCommand(resolve(process.cwd(), 'scripts/oc.sh')).catch(error => {
    return `error execute command : \n${error}`
  })
}

const openClashProxies = async () => {
  const { baseUrl: OPEN_CLASH_URL, secret: OPEN_CLASH_SECRET_KEY } = await openclashConfiguration()
  const TOKEN = `Bearer ${OPEN_CLASH_SECRET_KEY}`
  const API_URL = `${OPEN_CLASH_URL}/providers/proxies`
  return await axios.get(API_URL, { headers: { Authorization: TOKEN } })
    .then((response) => {
      let result = '⏺  Name  |  Type  |  Now  |  Ping  '
      Object.entries(response.data.providers.default.proxies).forEach(
        ([key, value]) => {
          result += `\n➜ ${value.name} | ${value.type} | ${value.now ?? '-'} | ${value.history[-0]?.delay ?? '-'} ms ${latencyColor(value.history[-0]?.delay)}`
        }
      )
      return result
    })
    .catch(error => {
      console.log(`openClashProxies(): ${error}`)
      return error
    })
}

export {
  openClashInfo,
  openClashProxies
}
