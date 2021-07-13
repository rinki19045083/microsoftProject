
const Socket = require("websocket").server
const http= require("http")

const server = http.createServer((req,res)=> {})

server.listen(2000, () =>{
    console.log("Listening on port 2000...")
})

const webSocket = new Socket({httpServer: server})

//array to store data of sender to send reciever when they join the call
let users= []


webSocket.on('request', (req) => {
    const connection = req.accept()

    connection.on('message', (mes) => {

        const data = JSON.parse(mes.utf8Data)
        const user =findUser(data.username)

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
                users.push(newuser)
                console.log(newuser.username)
                break
            case "store_offer" :
                if(user==null)
                return
                user.offer=data.offer 
                break
            case "store_candidate": 
                 if(user==null)
               {  return}
              if(user.candidate==null)
                user.candidate= []
                user.candidate.push(data.candidate)
                break
            case "send_answer":
                if(user == null){
                return
                }
                sendData({
                    type: "answer",
                    answer: data.answer
                },user.conn)
                break
            case "send_candidate":
                if(user == null)
                return
                sendData({
                    type: "candidate",
                    candidate: data.candidate
                },user.conn)
                break
            case "join_call":
                if(user == null)
                return
                sendData({
                    type: "offer",
                    offer: data.offer
                },connection)

                user.candidates.forEach(candidate => {
                    sendData({
                        type: "candidate",
                        candidate: candidate
                    }, connection)

                })
                break

        }
    })
    //to delete the username from user array after closing connect
    
    connection.on('close',(reason,description)=> {
        users.forEach(user => {
            if(user.conn==connection)
            {
            users.splice(users.indexOf(user),1)
            return
            }
        })
    })

})

function sendData(data, conn) {
    conn.send(JSON.stringify(data))
    
}
function findUser(username) {
    for(let i=0;i<users.length;i++){
    if(users[i].username == username)
    return users[i]
    }
} 