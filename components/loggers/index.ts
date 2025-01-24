import axios from 'axios'

const send = async function (level: string, logEvent: any) {
  try {
    const response = await axios.post('/api/slack', {
      message: `${level}: ${JSON.stringify(logEvent)}`,
    })
  } catch (error) {
    console.error('Failed to send log to Slack:', error)
  }
}

const logError = function (...args: any[]) {
  const message = args
    .map(arg => {
      if (typeof arg === 'object') {
        if (arg instanceof Error) {
          return `Error: ${arg.message}\nStack Trace: ${arg.stack}`
        } else {
          return JSON.stringify(arg, null, 2)
        }
      } else {
        return arg
      }
    })
    .join(' ')

  send('ERROR', message).catch(err =>
    console.error('Failed to send error to Slack:', err),
  )
}

export default { send, logError }
