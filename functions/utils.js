import { exec } from 'child_process'

const execShellCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(`execShellCommand(): ${error}`)
        reject(stderr)
      }
      resolve(stdout)
    })
  })
}

const secondToHourAndMinute = (seconds) => {
  const totalMinutes = Math.floor(seconds / 60)
  const second = seconds % 60
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  return { hour, minute, second }
}

const removeHTMLTags = (str) => {
  if ((str === null) || (str === '')) { return false } else { str = str.toString() }
  return str.replace(/(<([^>]+)>)/ig, '')
}

const latencyColor = (delay) => {
  if (delay === 0) {
    return '⬛️'
  } else if (delay <= 150) {
    return '🟩'
  } else if (delay <= 300) {
    return '🟨'
  } else if (delay <= 350) {
    return '🟧'
  } else if (delay > 350) {
    return '🟥'
  } else {
    return '  '
  }
}

const processPhoneNumber = (number) => {
  const result = {
    success: false,
    phoneNumber: number
  }
  if (number.startsWith('0')) {
    const phoneNumber = `62${number.slice(1)}`
    result.success = true
    result.phoneNumber = phoneNumber
  } else if (number.startsWith('62')) {
    result.success = true
  }
  return result
}

const makeMessage = (command, body) => {
  const message = `Command " _${command}_ " Result:\n==================================\n${body}\n==================================`
  return {
    text: message
  }
}

const listCommandMessage = () => {
  const templateButtons = [
    { index: 1, quickReplyButton: { displayText: '/my_ip' } },
    { index: 2, quickReplyButton: { displayText: '/dns_leak' } },
    { index: 3, quickReplyButton: { displayText: '/sidompul' } },
    { index: 4, quickReplyButton: { displayText: '/sysinfo' } },
    { index: 5, quickReplyButton: { displayText: '/init_app' } },
    { index: 6, quickReplyButton: { displayText: '/reboot' } },
    { index: 7, quickReplyButton: { displayText: '/shutdown' } },
    { index: 8, quickReplyButton: { displayText: '/firewall_rules' } },
    { index: 9, quickReplyButton: { displayText: '/interfaces' } },
    { index: 10, quickReplyButton: { displayText: '/openclash_info' } },
    { index: 11, quickReplyButton: { displayText: '/openclash_proxies' } },
    { index: 12, quickReplyButton: { displayText: '/libernet_info' } }
  ]

  const templateMessage = {
    text: 'Daftar Perintah :',
    templateButtons
  }
  return templateMessage
}
export {
  execShellCommand,
  secondToHourAndMinute,
  removeHTMLTags,
  latencyColor,
  processPhoneNumber,
  makeMessage,
  listCommandMessage
}
