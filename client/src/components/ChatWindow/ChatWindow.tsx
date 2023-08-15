import React, {useEffect, useRef} from 'react';
import { db } from '../../config/firebase.config';
import { addDoc, collection, serverTimestamp, FieldValue,
    onSnapshot, query, where, orderBy, limitToLast } from 'firebase/firestore';
import DebouncedInput from './DebouncedInput';
import { addressShortener } from '../../utils/addressShortener';

import { useAccount } from 'wagmi';

interface Message {
    text: string;
    createdAt: FieldValue;
    room: string;
    user: string;
}

interface ChatInputBoxProps {
    sendANewMessage: (message: Message) => void;
    room: string;
}

export const ChatInputBox = ({ sendANewMessage, room }: ChatInputBoxProps) => {
    const [newMessage, setNewMessage] = React.useState("");
    const { address } = useAccount();
    /**
     * Send message handler
     * Should empty text field after sent
     */
    // const doSendMessage = async () => {
    //     if (newMessage && newMessage.length > 0) {
    //         const newMessagePayload: Message = {
    //             text: newMessage,
    //             createdAt: serverTimestamp(),
    //             room: room,
    //             user: address??"anon-user88",
    //         };
    //         await sendANewMessage(newMessagePayload);
    //         setNewMessage("");
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newMessage && newMessage.length > 0) {
            const newMessagePayload: Message = {
                text: newMessage,
                createdAt: serverTimestamp(),
                room: room,
                user: address??"anon-user88",
            };
            await sendANewMessage(newMessagePayload);
            setNewMessage("");
        }
    }

    return (
        <form className="flex-grow w-full
            flex flex-row p-1 items-center
            border-prime2 border rounded-md
            overflow-hidden
            mt-1"
            onSubmit={handleSubmit}
            >
                <DebouncedInput
                    value={newMessage ?? ""}
                    debounce={100}
                    onChange={(value) => setNewMessage(String(value))}
                />
                <button
                    type="submit"
                    //onClick={() => doSendMessage()}
                    disabled={!newMessage || newMessage.length === 0}
                    className="px-3 py-2 text-xs font-medium 
                    text-center text-white 
                    ml-2 mr-1
                    bg-prime1 rounded-lg 
                    hover:bg-prime2 
                    focus:ring-4 focus:outline-none focus:ring-palered/70 disabled:opacity-50"
                >
                    Send
                </button>
        </form>
    );
}

// interface ChatContentProps {
//     messages: Message[];
// }

const ChatWindow = ({room, msgLimit }: {room: string, msgLimit: number}) => {

    const { address } = useAccount();
    const messageRef = collection(db, "messages");
    const chatBoxRef = useRef<HTMLDivElement>(null);

    /** State to control new messages */
    const [chatMessages, setChatMessages] = React.useState<Message[]>([]);

    useEffect(() => {
        try {
            const queryMessages = msgLimit>0 ? query(messageRef, 
                where("room", "==", room),
                orderBy("createdAt", "desc"),
                limitToLast(msgLimit)
                )
                :
                query(messageRef,
                    where("room", "==", room),
                    orderBy("createdAt", "desc")
                )
                ;
            const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
                let messages:Message[] = [];
                snapshot.forEach((doc) => {
                messages.push({...doc.data()} as Message);
                });
                setChatMessages(messages);
                
            });

            return () => unsuscribe();

        } catch (error) {
            console.log(error)
            setChatMessages([...chatMessages, {
                text: "error in chat backend",
                createdAt: serverTimestamp(),
                room: room,
                user: "error",
            }])
        }
    }, [])
    
    const sendANewMessage = async (message: Message) => {
        //setChatMessages((prevMessages) => [...prevMessages, message]);
        if (message.text === "") return;
        await addDoc(messageRef, message);
    };

    useEffect(() => {
        if(chatBoxRef.current){
            chatBoxRef.current.scrollTop = 0;
        }
    }, [chatMessages, chatBoxRef])

    return (
        <div className="h-full w-full
        bg-black/20
        flex flex-col
        py-2 px-2
        border border-prime2 rounded-b-lg
        "
        >

            {/* message window */}
            <div className="
                    py-1 px-2
                    h-4/5 max-h-4/5 bg-black/20 
                    overflow-y-auto
                    flex flex-col-reverse justify-start
                    "
                    ref={chatBoxRef}
                    >
                    {chatMessages.map((message: Message, index: number) => (
                    <div
                        key={index}
                        className={`my-0 py-0 flex flex-row w-full ${
                        message.user == address??"anon-user88" ? "justify-end" : "justify-start"
                        }`}
                    >   

                        {/* user address */}
                        <div className={`
                        text-xs sm:text-sm md:text-base
                        ${message.user == address??"anon-user88" ? 
                        "order-2 text-prime2" : "order-1 text-lightbeige"}`}>
                            {`[${addressShortener(message.user)}]`}
                        </div>

                        {/* text content */}
                        <div
                        className={`px-2 w-fit flex flex-row text-white 
                        whitespace-normal break-words text-xs sm:text-sm md:text-base
                        ${
                            message.user == address??"anon-user88" ? "order-1 mr-2" : "order-2 ml-2"
                        }`}
                        >
                        {message.text}
                        </div>
                    </div>
                    ))}
                </div>

            {/* message input */}
            <ChatInputBox sendANewMessage={sendANewMessage} room={room}/>

        </div>
    )
}

export default ChatWindow