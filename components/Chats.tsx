import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

interface ChatProps {
    selectChat: (id: number) => void;
    deleteChat: (id: number) => void;
}

interface Chat {
    createdAt: string,
    id: number
}

export default function Chats({ selectChat, deleteChat }: ChatProps) {
    const [chats, setChats] = useState<Chat[]>([]);

    // Client-side data fetching
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await fetch("http://localhost:4000/chats");
                const data = await res.json();
                setChats(data);
                console.log(data)
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        fetchChats();
    }, []);

    return (
        <div>
           <div className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-10rem)]">
           {chats.length > 0 ? (
                chats.map((chat) => (
                    <div key={chat.id} >
                        <p
                            className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]"
                            onClick={() => selectChat(chat.id)}
                        >
                            <span className="flex items-center flex-grow text-[1.15rem] dark:text-neutral-400/75 text-red-500 hover:text-dark ">
                            {
                                chat.createdAt
                            }
                            </span>
                            <button onClick={()=> deleteChat(chat.id)}><MdDelete /></button>
                        </p>
                    </div>
                ))
            ) : (
                <p>No chats available.</p>
            )}
           </div>
        </div>
    );
}
