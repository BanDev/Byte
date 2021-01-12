module.exports = class Core{

    // Speaks the truth
    hello(channel){
        channel.send("Hello")
    }

    // Sends a pic of BALLMER 
    ballmer(channel){
        channel.send("Get ballmer'd", {files: ["https://miro.medium.com/max/4408/1*KvhM-ArA5RkpYLi7L_Qtdw.jpeg"]})
    }
    
    // Sends a video of BALLMER saying developer * ∞
    developers(channel){
        channel.send("https://www.youtube.com/watch?v=KMU0tzLwhbE")
    }

    // Deletes 1000 messages
    delete(message, params){
        var limits = params[1]
        if(limits >= 0){
            if (message.member.roles.cache.find(r => r.name === "delete")) {
                async function clear() {
                    message.delete()
                    const fetched = await message.channel.messages.fetch({limit: limits})
                    message.channel.bulkDelete(fetched)
                }
                clear()
                message.channel.send("Deleted " + limits + " message(s)")
            }else{
                message.channel.send("Invalid use, make sure you have the `delete` role before deleting messages.")
            }
        }else{
            message.channel.send("Invalid command, please use: ```?del n``` Where n is the ammount of messages to delete.")
        }
    }

    // Scary simon
    simon(channel){
        channel.send("Simon", {files: ["https://jackisa.ninja/Screenshot_20190729-023116.jpg"]})
    }
}
