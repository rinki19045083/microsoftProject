
const webSocket = new WebSocket("ws://127.0.0.1:2000")

webSocket.onmessage = (event)=> {
    handleSignallingData(JSON.parse(event.data))
}
function  handleSignallingData(data)
{
    switch(data.type)
    { case "offer":
       peerconnection.setRemoteDescription(data.offer)
       createAndSendAnswer()
       break
     case "candidate":
         peerconnection.addIceCandidate(data.candidate)

    }
}

function createAndSendAnswer()
{
  peerconnection.createAnswer((answer)=> {
      peerconnection.setLocalDescription(answer)
      sendData({
          type: "send_answer",
          answer: "answer"
        })
      }, error=>{
          console.log(error)
      })
    
}


function sendData(data) {
    data.username=username
    webSocket.send(JSON.stringify(data))
    
}
let peerconnection
let localStream
let username
function joinCall() {
    username =  document.getElementById("username-input").value
    document.getElementById("Video-Call-div").style.display="inline"
    navigator.getUserMedia({
        video:true,
        audio:true
    }, (stream) => {
        localStream = stream
        document.getElementById("Local-Video").srcObject = localStream
        
        let Configuration = {
            iceServers: [ 
                {
                "urls": ["stun:stun3.l.google.com:19302",
                "stun:stun.stunprotocol.org"]
                }
            ]

        }

       peerconnection= new RTCPeerConnection(Configuration)
       peerconnection.addStream(localStream)
       peerconnection.onaddstream = (e) => {

        document.getElementById("Remote-Video").srcObject=e.stream

       }

       peerconnection.onicecandidate= ((e)=> {
           if(e.candidate == null)
           return 

           sendData({
               type: "send_candidate",
               candidate: e.candidate
           })
       })
        
       sendData({
           type: "join_call"
          
       })

    }, (error) => {
        console.log(error)
    })
    
}
 
 let isAudio = true
 function Muteaudio() {
     isAudio = !isAudio
     localStream.getAudioTracks()[0].enabled =isAudio
 }
 let isCamera =true
 function MuteVideo() {
     isCamera =!isCamera
     localStream.getVideoTracks()[0].enabled= isCamera
 }