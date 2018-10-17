var msgPort
var httpVerCheck='on'

const msgHandler = event => {
  switch (event.data.msg) {
    case 'init':
     msgPort = event.ports[0]
     msgPort.postMessage({'msg':'httpVer reporting init - ok','httpVerCheck':httpVerCheck})
     break

    case 'on':
     if (httpVerCheck==='on') {
       msgPort.postMessage({'msg':'httpVer reporting was already on, ignoring command.'})
       break
     }
     httpVerCheck='on'
     msgPort.postMessage({'msg':'httpVer reporting is on('+httpVerCheck+')'})
     break

    case 'off':
     httpVerCheck='off'
     msgPort.postMessage({'msg':'httpVer reporting is off('+httpVerCheck+')'})
     break

    default:
  }
}

this.addEventListener('message', msgHandler)

self.addEventListener('fetch', ev => {
  if ((typeof msgPort !== 'undefined')&&(httpVerCheck==='on')) {
    msgPort.postMessage({'msg':'httpVer', 'httpVer':(typeof ev.request.statusText==='undefined')?'HTTP/2':'HTTP/1.0 / HTTP/1.1', 'httpTransport':'TCP'})
  } else {
//    console.error('%c[SW log] From \'fetch\' event listener: msgPort is undefined!','color:orange;')
  }
})
