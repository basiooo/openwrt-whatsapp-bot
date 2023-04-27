import axios from 'axios'
import { processPhoneNumber } from './utils.js'

const SIDOMPUL_CHECK_QOUTA_URL = 'https://sidompul.cloudaccess.host/cek.php'
const CHECK_MY_IP_URL = 'http://ip-api.com/json/'

const checkMyIp = async () => {
  return await axios.get(CHECK_MY_IP_URL)
    .then(response => {
      let result = ''
      const data = response.data
      data.ip = data.query
      delete data.query
      delete data.status
      Object.entries(data).forEach(([key, value]) => { result += `➜ ${key} = ${value}\n` })
      return result
    })
    .catch(error => {
      console.log(`myIp(): ${error}`)
      return error
    })
}

const sidompul = async (number = '') => {
  const { success, phoneNumber } = processPhoneNumber(number)
  if (!success || phoneNumber === undefined) {
    return 'Nomor tidak valid.!\nContoh "/sidompul 08123456789" atau "/sidompul 628123456789"'
  }
  const API_URL = `${SIDOMPUL_CHECK_QOUTA_URL}?nomor=${phoneNumber}`
  return await axios.get(API_URL)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log(`sidompul(): ${error}`)
      return error
    })
}

export {
  checkMyIp,
  sidompul
}
