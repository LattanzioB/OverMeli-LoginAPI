const SmeeClient = require('smee-client')

const smee = new SmeeClient({
  source: 'https://smee.io/jVaIf1zSYa2izu0',
  target: 'http://localhost:8000',
  logger: console
})

const events = smee.start()

// Stop forwarding events
events.close()