import Elysia, { t } from "elysia";

let unpaired:any = null



export const webSocketController = new Elysia({
  name: "webSockets",
  prefix: "/chat",
})
  .ws("/", {
    body: t.Object({
      content: t.String(),
    }),
    open: (ws) => {
     
      
      if(!unpaired){
        unpaired = ws
      }
      else{
        let room:string = `${ws.id},${unpaired.id}`
        ws.send({status:"paired",room:room})
        unpaired.send({status:"paired",room:room})
        ws.subscribe(room)
        unpaired.subscribe(room)
        unpaired =null
      }
     
    },
    message: async (ws, message) => {
      
      
      let msg:any = JSON.parse(message.content)
      if(msg.name && msg.room){
        ws.publish(msg.room,{name:msg.name})
      }
       if(msg.disconnect=="true" && msg.room){
        ws.unsubscribe(msg.room)
      }
      if(msg.message && msg.room){
        ws.publish(msg.room,{message:msg.message})

      }
      if(msg.image && msg.room){
        ws.publish(msg.room,{image:msg.image})

      }
      
    
    
     
    },
    close: (ws) => {
      
      
    },
  });