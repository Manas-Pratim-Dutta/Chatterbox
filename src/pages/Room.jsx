import React, { useState, useEffect } from "react";
import { databases } from "../Appwrite.config";
import conf from "../conf/conf";
import { ID, Query } from "appwrite";
import { Trash2 } from "react-feather"

const Room = () => {
    const [messages, setMessages] = useState([])
    const [messageBody, setMessageBody] = useState('')

    useEffect(() => {
        getMessages()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            body: messageBody
        }

        let response = await databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            ID.unique(),
            payload,
        )
        console.log("created", response);

        setMessages(prevSate => [response, ...messages])

        setMessageBody("")
    }

    const getMessages = async () => {
        const response = await databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            [
                Query.orderDesc('$createdAt'), // sorting in dec so that new message shoes on top.
                Query.limit(20)
            ]
        )
        console.log("Response: ", response);
        setMessages(response.documents)
    }

    const deleteMessage = async (message_id) => {
        databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, message_id);
        setMessages(prevSate => messages.filter(message => message.$id !== message_id))
    }
    return (
        <main className="container">

            <div className="room--container">


                <form onSubmit={handleSubmit} id="message--form">
                    <div>
                        <textarea
                            required
                            maxLength="1000"
                            placeholder="Write a message"
                            onChange={(e) => { setMessageBody(e.target.value) }}
                            value={messageBody}
                        ></textarea>
                    </div>

                    <div className="send-btn--wrapper">
                        <input className="btn btn--secondary" type="Submit" value="send" />
                    </div>

                </form>


                <div>
                    {messages.map(message => (
                        <div key={message.$id} className="message--wrapper">

                            <div className="message--header">
                                <small className="message-timestamp">{new Date(message.$createdAt).toLocaleString()}</small>

                                <Trash2
                                    className="delete--btn"
                                    onClick={() => { deleteMessage(message.$id) }}
                                />


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