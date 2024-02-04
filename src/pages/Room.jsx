import React, { useState, useEffect } from "react";
import { databases } from "../Appwrite.config";
import conf from "../conf/conf";

const Room = () => {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        getMessages()
    }, [])

    const getMessages = async () => {
        const response = await databases.listDocuments(conf.appwriteDatabaseId,
            conf.appwriteCollectionId
        )
        console.log("Response: ", response);
        setMessages(response.documents)
    }
    return (
        <main className="container">

            <div className="room--container">
                <div>
                    {messages.map(message => (
                        <div key={message.$id} className="message--wrapper">

                            <div className="message--header">
                               <small className="message-timestamp">{message.$createdAt}</small>
                            </div>

                            <div className="message--body">
                                <span>{message.body}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </main>
    )
}

export default Room