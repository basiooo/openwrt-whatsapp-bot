import { execShellCommand, secondToHourAndMinute } from './utils.js'
import { resolve } from 'path'

const lanNetworkInfo = async () => {
  let ip = await execShellCommand('uci get network.lan.ipaddr')
  ip = ip.replace('\n', '')
  return {
    ip
  }
}

const networkInterfaceList = async () => {
  let interfaceList = await execShellCommand('ubus list network.interface.*')
  interfaceList = interfaceList.split('\n')
  return interfaceList.filter(elm => elm)
}

const networkInterfaceStatus = async () => {
  const data = []
  const intefaceList = await networkInterfaceList()
  for (const interfaceName of intefaceList) {
    let status = await execShellCommand(`ubus call ${interfaceName} status`)
    status = JSON.parse(status)
    status.name = interfaceName
    data.push(status)
  }
  return data
}

const rebootDevice = async () => {
  const result = await execShellCommand('reboot now').then(res => {
    return 'Rebooting device...'
  }).catch(error => {
    console.log('rebootDevice(): ', error)
    return `error execute command : \n${error}`
  })
  return result
}

const shutDownDevice = async () => {
  const result = await execShellCommand('poweroff now').then(res => {
    return 'shutting down device...'
  }).catch(error => {
    console.log('shutDownDevice(): ', error)
    return `error execute command : \n${error}`
  })
  return result
}

const sysInfo = async () => {
  const result = await execShellCommand(resolve(process.cwd(), 'scripts/sysinfo.sh')).catch(error => {
    console.log('sysInfo(): ', error)
    return `error execute command : \n${error}`
  })
  return result
}

const initApp = async () => {
  const result = await execShellCommand(resolve(process.cwd(), 'scripts/init_app.sh'))
  return result
}

const firewallRules = async () => {
  const result = await execShellCommand(resolve(process.cwd(), 'scripts/firewallrules.sh')).catch(error => {
    console.log('firewallRules(): ', error)
    return `error execute command : \n${error}`
  })
  return result
}

const networkInterfaceData = async () => {
  const interfaceStatus = await networkInterfaceStatus()
  let message = ''
  interfaceStatus.forEach(value => {
    const interfaceName = value.name.split('.')
    const name = interfaceName[2]
    let ipV4 = 'none'
    let uptime = 0
    if (value['ipv4-address']) {
      ipV4 = `${value['ipv4-address'][0].address}/${value['ipv4-address'][0].mask}`
    }
    if (value.uptime) {
      const { hour, minute, second } = secondToHourAndMinute(value.uptime)
      uptime = `${hour}h ${minute}m ${second}s`
    }
    const result = `
  ➜ Name: ${name}
  • Active: ${value.up}
  • Device: ${value.device}
  • Protocol: ${value.proto}
  • Ipv4 Address: ${ipV4}
  • Uptime: ${uptime}\n`
    message += result
  })
  return message
}

export {
  lanNetworkInfo,
  rebootDevice,
  shutDownDevice,
  sysInfo,
  initApp,
  firewallRules,
  networkInterfaceData
}
