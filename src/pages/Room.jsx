import React, { useState, useEffect } from "react";
import client, { databases } from "../Appwrite.config";
import conf from "../conf/conf";
import { ID, Query, Role, Permission } from "appwrite";
import { Trash2 } from "react-feather"
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

const Room = () => {

    const { user } = useAuth()

    const [messages, setMessages] = useState([])
    const [messageBody, setMessageBody] = useState('')

    useEffect(() => {
        getMessages();


        const unsubscribe = client.subscribe(`databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionId}.documents`, response => {
            // Callback will be executed on changes for documents A and all files.
            // console.log("Real time: ",response);

            if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                console.log("Message is Created");
                setMessages(prevState => [response.payload, ...prevState])

            }
            if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
                console.log("Message was deleted!!");
                setMessages(prevSate => prevSate.filter(message => message.$id !== response.payload.$id))
            }
        });

        return () => {
            unsubscribe()
        }

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            user_id: user.$id,
            username: user.name,
            body: messageBody
        }

        let permissions = [
            Permission.write(Role.user(user.$id))

        ]

        let response = await databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            ID.unique(),
            payload,
            permissions
        )
        console.log("created", response);

        // setMessages(prevState => [response, ...prevState])

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
        // setMessages(prevSate => messages.filter(message => message.$id !== message_id))
    }
    return (
        <main className="container">
            <Header />
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

                                <p>
                                    {message?.username ? (
                                        <span>{message.username}</span>
                                    ) : (
                                        <span>Anonymous User</span>
                                    )}
                                    <small className="message-timestamp">{new Date(message.$createdAt).toLocaleString()}</small>
                                </p>

                                {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (

                                    <Trash2
                                        className="delete--btn"
                                        onClick={() => { deleteMessage(message.$id) }}
                                    />
                                )}
                                 {/* <Trash2
                                        className="delete--btn"
                                        onClick={() => { deleteMessage(message.$id) }}
                                    /> */}


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