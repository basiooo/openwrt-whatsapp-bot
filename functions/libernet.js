import axios from 'axios'
import { lanNetworkInfo } from './device.js'
import { removeHTMLTags } from './utils.js'

const libernetConfigurations = async () => {
  const { ip } = await lanNetworkInfo()
  const baseUrl = `http://${ip}/libernet`
  return {
    baseUrl
  }
}

const LibernetConnectionText = (status) => {
  switch (status) {
    case 0:
      return 'ready'
    case 1:
      return 'connecting'
    case 2:
      return 'connected'
    case 3:
      return 'stopping'
  }
}

const libernetTunnelConfigurations = async () => {
  const { baseUrl: LIBERNET_URL } = await libernetConfigurations()
  const LIBERNET_API_URL = `${LIBERNET_URL}/api.php`
  const CONFIG_TYPE = {
    OpenVPN: 'get_openvpn_configs',
    SSH: 'get_ssh_configs',
    SSH_SSL: 'get_sshl_configs',
    SSH_WS_CDN: 'get_sshwscdn_configs',
    Shadowshocks: 'get_shadowsocks_configs',
    Trojan: 'get_trojan_configs',
    V2Ray: 'get_v2ray_configs'
  }
  const configs = {}
  for (const [key, value] of Object.entries(CONFIG_TYPE)) {
    await axios.post(LIBERNET_API_URL, {
      action: value
    }).then((res) => {
      configs[key] = res.data.data
    })
  }
  return configs
}

const libernetInfo = async () => {
  const { baseUrl: LIBERNET_URL } = await libernetConfigurations()
  const LIBERNET_API_URL = `${LIBERNET_URL}/api.php`
  let configMessage = '➜ Configs:'
  const configs = await libernetTunnelConfigurations()
  Object.entries(configs).forEach(([key, value]) => {
    configMessage += `
    • ${key}:
    - ${value}`
  })
  console.log(LIBERNET_API_URL)
  return await axios.post(LIBERNET_API_URL, {
    action: 'get_dashboard_info'
  }).then((res) => {
    const data = res.data.data
    const logs = removeHTMLTags(data.log)
    const status = LibernetConnectionText(data.status)
    const result = `
  ➜ Status: ${status}
  ${configMessage}
  ➜ Logs:
  ${logs}
  `
    return result
  })
    .catch(error => {
      console.log(`libernetInfo(): ${error}`)
      return error
    })
}

export {
  libernetInfo
}
