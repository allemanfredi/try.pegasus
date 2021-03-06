async function connect() {
  if (window.iota) {
    const isConnected = await window.iota.connect()
    if (isConnected) {
      document.getElementById('pegasus-connected').classList.remove('hide')
    } else {
      document.getElementById('pegasus-connected').classList.add('hide')
    }
  }
}

async function getNodeInfo() {
  const nodeInfo = await window.iota.core.getNodeInfo()
  const jsonViewer = new JSONViewer()
  document.querySelector("#json-node-info").appendChild(jsonViewer.getContainer())
  jsonViewer.showJSON(nodeInfo)
}

async function send() {
  const address =  document.querySelector("#address-d").value
  const value =  document.querySelector("#amount-d").value
  const tag =  document.querySelector("#tag-d").value
  const message =  document.querySelector("#message-d").value

  const transfers = [{
    address,
    value: value, 
    tag: window.iota.converter.asciiToTrytes(tag),
    message: window.iota.converter.asciiToTrytes(message),
  }]


  //const res = await window.iota.transfer(transfers)
  const trytes = await window.iota.core.prepareTransfers(transfers)
  const bundle = await window.iota.core.sendTrytes(trytes, 3, 9)
  const jsonViewer = new JSONViewer()
  document.querySelector("#json-bundle").appendChild(jsonViewer.getContainer())
  jsonViewer.showJSON(bundle)
}

async function sendAndBroadcast() {
  const address =  document.querySelector("#address").value
  const value =  document.querySelector("#amount").value
  const tag =  document.querySelector("#tag").value
  const message =  document.querySelector("#message").value

  const transfers = [{
    address,
    value: value, 
    tag: window.iota.converter.asciiToTrytes(tag),
    message: window.iota.converter.asciiToTrytes(message),
  }]


  //const res = await window.iota.transfer(transfers)
  const bundle = await window.iota.transfer(transfers)
  const jsonViewer = new JSONViewer()
  document.querySelector("#json-bundle-d").appendChild(jsonViewer.getContainer())
  jsonViewer.showJSON(bundle)
}

window.addEventListener('load', e => {
  setTimeout(() => {

    if (window.iota) {

      if (window.iota.selectedAccount) {
        document.getElementById('selectedAccount').innerText = 
          window.iota.selectedAccount.slice(0, 25) + '...' + window.iota.selectedAccount.slice(-20)
        document.getElementById('pegasus-connected').classList.remove('hide')
      }
      
      document.getElementById('selectedProvider').innerText = window.iota.selectedProvider
      window.iota.on('providerChanged', provider => document.getElementById('selectedProvider').innerText = provider)
      
      window.iota.on('accountChanged', account => {
        document.getElementById('selectedAccount').innerText = account.slice(0, 25) + '...' + account.slice(-20)
      })
    } else {
      document.getElementById('pegasus-not-installed').classList.remove('hide')
      document.getElementById('connect').classList.add('hide')
    }
  }, 500)
})

function changeMamMode() {
  if (document.getElementById("mamMode").value === 'restricted') {
    document.getElementById('mam-sidekey').classList.remove('hide')
  } else {
    document.getElementById('mam-sidekey').classList.add('hide')
  }
}

async function createMamChannel() {
  // Initialise MAM State
  let mamState = await window.iota.mam.init()

  // secretKey will be stored encrypted with login psw (subscriber need to register both root and sidekey through the popup)
  if (document.getElementById("mamMode").value === 'restricted') {
    const secretKey = document.getElementById("mam-sidekey-value").value
    mamState = await window.iota.mam.changeMode(mamState, 'restricted', secretKey.padEnd(81, '9'))
  }

  if (document.getElementById("mamMode").value === 'private') {
    mamState = await window.iota.mam.changeMode(mamState, 'private', null)
  }

  const jsonViewer = new JSONViewer()
  document.querySelector("#json-create-mam-channel").appendChild(jsonViewer.getContainer())
  jsonViewer.showJSON(mamState)
}