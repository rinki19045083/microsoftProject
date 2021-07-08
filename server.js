
const Socket = require("websocket").server
const http= require("http")

const server = http.createServer((req,res)=> {})

server.listen(3000, () =>{
    console.log("Listening on port 2000...")
})

const webSocket = new Socket({httpServer: server})

//array to store data of sender to send reciever when they join the call
let user= []


webSocket.on('request',(req)=>{
    const connection = req.accept()

    connection.on('message', (mes)=>{

        const data = JSON.parse(message.utf8Data)
        const user =findUser(username)

        switch(data.type)
        {
            case "store_user":
                if(user!=null)
                {
                return 
                }
                const newuser={
                    conn: connection,
                    username: data.username
                }
                user.push(newuser)
                console.log(username)
                break
            case "store_offer" :
                if(user==null)
                return
                user.offer=data.offer 
                break
            case "store_candidate": 
                 if(user==null)
                 return
                 if(user.candidate==null)
                user.candidate= []
                user.candidate.push=data.candidate
                break
            case "send_answer":
                if(user==null)
                return
                sendData({
                    type: "answer",
                    answer: data.answer
                },user.conn)
                break
            case "send_candidate":
                if(user==null)
                return
                sendData({
                    type: "candidate",
                    candidate: data.candidate
                },user.conn)
                break
            case "join_call":
                if(user==null)
                return
                sendData({
                    type: "offer",
                    offer: data.offer
                },connection)

                user.candidate.forEach(candidate => {
                    sendData({
                        type: "candidate",
                        candidate: user.candidate
                    },connection)

                })
                break

        }
    })
    //to delete the username from user array after closing connect
    connection.on('close',(reason,description)=> {
        user.forEach(user=>{
            if(user.conn=connection)
            {
            user.splice(user.indexOf(user),1)
            return
            }
        })
    })

})

function sendData(data,conn) {
    conn.send(JSON.stringify(data))
    
}
function findUser(username) {
    for(let i=0;i<user.length;i++)
    if(user[i]==username)
    return user[i]
    
} 