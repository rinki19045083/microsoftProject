const webSocket = new WebSocket("ws://127.0.0.1:2000")

webSocket.onmessage = (event)=> {
    handleSignallingData(JSON.parse(event.data))
}
function handleSignallingData(data)
{
    switch(data.type)
    { case "answer":
       peerconnection.setRemoteDescription(data.answer)
       break
     case "candidate":
         peerconnection.addIceCandidate(data.candidate)

    }
}
let username
let peerconnection
function SendUserName() {

    username= document.getElementById("username-input").value
    sendData({
        type: "store_user"
    })
}
function sendData(data) {
    data.username = username
    webSocket.send(JSON.stringify(data));
    
}
let localStream

function StartCall() {
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
               type: "store_candidate",
               candidate: e.candidate
           })
       })


       CreateAndSendOffer()

    }, (error) => {
        console.log(error);
    })
    
}
 function CreateAndSendOffer()
 {
     peerconnection.createOffer((offer) => {
         sendData({
             type: "store_offer",
             offer: offer
         })

    peerconnection.setLocalDescription(offer) 
        }, (error) => {
        console.log(error)
    

     })
 }

 let isAudio = true
 function MuteAudio() {
     isAudio=!isAudio

     localStream.getAudioTracks()[0].enabled =isAudio
 }
 
 let isCamera =true
 function MuteVideo(){
     isCamera =!isCamera
     localStream.getVideoTracks()[0].enabled= isCamera
 }