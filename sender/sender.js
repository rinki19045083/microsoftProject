const webSocket = new WebSocket("ws://127.0.0.1:5500")
webSocket.onmessage = (Event)=> {
    handlesignallingdata(JSON.parse(Event.data))
}
function handlesignallingdata(data)
{
    switch(data.type)
    { case "answer":
       peerconnection.setLocationDescription(data.answer)
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
    data.username=username
    webSocket.send(JSON.stringify(data));
    
}
function StartCall() {
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
               type: "store_candidate",
               candidate: e.candidate
           })
       })
       CreateAndSendOffer()

    }, (error)=>{
        console.log(error);
    })
    
}
 function CreateAndSendOffer()
 {
     peerconnection.CreateOffer((offer)=> {
         sendData({
             type: "store_offer",
             offer: offer
         })

    peerconnection.setLocationDescription(offer),(error)=>{
        console.log(error)
    }

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