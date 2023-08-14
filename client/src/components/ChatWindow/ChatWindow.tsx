import React from 'react';
import DebouncedInput from './DebouncedInput';

interface Message {
    text: string;
    sentBy: string;
    sentAt: Date;
    isChatOwner?: boolean;
}

interface ChatInputBoxProps {
    sendANewMessage: (message: Message) => void;
}

export const ChatInputBox = ({ sendANewMessage }: ChatInputBoxProps) => {
    const [newMessage, setNewMessage] = React.useState("");
    
        /**
         * Send message handler
         * Should empty text field after sent
         */
        const doSendMessage = () => {
            if (newMessage && newMessage.length > 0) {
                const newMessagePayload: Message = {
                sentAt: new Date(),
                sentBy: "walletAddress",
                isChatOwner: true,
                text: newMessage
                };
                sendANewMessage(newMessagePayload);
                setNewMessage("");
            }
        };
    
        return (
            <div className="flex-grow w-full
                flex flex-row p-1 items-center
                border-prime2 border rounded-md
                overflow-hidden
                mt-1">
                    <DebouncedInput
                        value={newMessage ?? ""}
                        debounce={100}
                        onChange={(value) => setNewMessage(String(value))}
                    />
                    <button
                        type="button"
                        disabled={!newMessage || newMessage.length === 0}
                        className="px-3 py-2 text-xs font-medium 
                        text-center text-white 
                        ml-2 mr-1
                        bg-prime1 rounded-lg 
                        hover:bg-prime2 
                        focus:ring-4 focus:outline-none focus:ring-palered/70 disabled:opacity-50"
                        onClick={() => doSendMessage()}
                    >
                        Send
                    </button>
            </div>
        );
}

interface ChatContentProps {
    messages: Message[];
}

export const ChatContent = ({ messages }: ChatContentProps) => {
    return (
        <div className="
            py-1 px-2
            h-4/5 max-h-4/5 bg-black/20 
            overflow-y-scroll
            overflow-auto
            ">
            {messages.map((message: Message, index: number) => (
            <div
                key={index}
                className={`py-2 flex flex-row w-full ${
                message.isChatOwner ? "justify-end" : "justify-start"
                }`}
            >
                <div className={`${message.isChatOwner ? "order-2" : "order-1"}`}>
                    {`[${message.sentBy}]`}
                </div>

                <div
                className={`px-2 w-fit flex flex-row bg-palered rounded-lg text-white ${
                    message.isChatOwner ? "order-1 mr-2" : "order-2 ml-2"
                }`}
                >
                <span className="text-xs text-gray-200">
                    {new Date(message.sentAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit"
                    })}
                </span>
                    <span className="text-md">{message.text}</span>
                </div>
            </div>
            ))}
        </div>
    );
};

const ChatWindow = () => {
    /** State to control new messages */
    const [chatMessages, setChatMessages] = React.useState<Message[]>([]);
    //const [chatMessages, setChatMessages] = React.useState<Message[]>(data);

    return (
        <div className="h-full w-full
        bg-black/20
        flex flex-col
        py-2 px-2
        "
        >

            {/* message window */}
            <ChatContent messages={chatMessages}/>

            {/* message input */}
            <ChatInputBox sendANewMessage={()=>{}}/>

        </div>
    )
}

export default ChatWindow