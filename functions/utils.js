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
  return message
}

export {
  execShellCommand,
  secondToHourAndMinute,
  removeHTMLTags,
  latencyColor,
  processPhoneNumber,
  makeMessage
}
