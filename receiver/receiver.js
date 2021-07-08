
const webSocket = new WebSocket("ws://192.168.214.166:3000")
webSocket.onmessage = (Event)=> {
    handlesignallingdata(JSON.parse(Event.data))
}
function handlesignallingdata(data)
{
    switch(data.type)
    { case "offer":
       peerconnection.setLocationDescription(data.offer)
       createAndSendAnswer()
       break
     case "candidate":
         peerconnection.addIceCandidate(data.candidate)

    }
}

function createAndSendAnswer()
{
  peerconnection.createAnswer((answer)=> {
      peerconnection.setLocationDescription(answer)
      sendData({
          type: "send_answer",
          answer: "answer"
      },(error)=>{
          console.log(error)
      })
  })
}
let peerconnection

function sendData(data) {
    data.username=username
    webSocket.send(JSON.stringify(data));
    
}
let peerconnection
let localStream
let username
function JoinCall() {
    username =  document.getElementById("username-input").value
    document.getElementById("Video-Call-div").style.display="inline"
    navigator.getUserMedia({
        video:
         {
            frameRate:24,
            aspectRatio:1.333333,
        },
        audio:true,
    },(stream)=>{
        localStream=stream
        document.getElementById("Local-Video").srcObject = localStream
        let Configuration = {
            iceserver: [ 
                {
                "url": ["stun4.l.google.com:19302","stun.ekiga.net","stun.voipbuster.com","stun.voipbuster.com"]
                }
            ]

        }

       peerconnection= new RTCPeerConnection(Configuration)
       peerconnection.addStream(localStream)
       peerconnection.onaddstreme = (e) => {

        document.getElementById("Remote-Video").srcObject=e.stream

       }

       peerconnection.onicecandidate= ((e)=> {
           if(e.candidate==null)
           return 
           sendData({
               type: "send_candidate",
               candidate: e.candidate
           })
       })
        
       sendData({
           type: "send_candidate",
           candidate: e.candidate
       })

    }, (error)=>{
        console.log(error);
    })
    
}
 
 let IsAudio = true
 function MuteAudio(IsAudio) {
     IsAudio=!IsAudio

     localStream.getAudioTracks()[0].enabled =IsAudio
 }
 let IsCamera =true
 function MuteVideo(IsCamera){
     IsCamera =!IsCamera
     localStream.getVideoTracks()[0].enabled= IsCamera
 }