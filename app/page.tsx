"use client"
import "./globals.css";
import Header from "../components/Header";
import PromptForm from "../components/Form";
import Chats from "../components/Chats";
import { useEffect, useState } from "react";

interface Message {
  id: number;
  content: string;
  sender: string;
  chatId: number;
}

export default function Home() {
  const [chatId, setChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // create new chat
  const createChat = async () => {
    let response = await fetch("http://localhost:4000/chats", { method: "POST" });
    const res = await response.json();
    setChatId(res.chat.id);
    setMessages(res.messages);
    console.log("Chat created", res.chat.id);
    alert("Chat created");
  };

  // select a chat
  const selectChat = async (id: number) => {
    console.log("Chat selected:", id);
    const response = await fetch(`http://localhost:4000/chats/${id}/messages`);
    const messages: Message[] = await response.json();
    console.log("Fetched messages:", messages);
    setChatId(id);
    setMessages(messages);
  };

  // delete chat
  const deleteChat = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/chats/${id}`, {
        method: "DELETE",
      });
      if (id === chatId) {
        setChatId(null);
        setMessages([]);
      }
      alert(`Chat ${id} deleted`);
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat");
    }
  };


    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch("http://localhost:4000/chats");
        const data = await response.json();
        if (data.length > 0) {
          const chat = data[0];
          setChatId(chat.id);
          const messagesResponse = await fetch(`http://localhost:4000/chats/${chat.id}/messages`);
          const initialMessages = await messagesResponse.json();
          setMessages(initialMessages);
        }
      };
      fetchData();
    }, []);

  return (
    <>
      <main className="h-[100vh] w-[100vw] flex">
          <aside className="h-[100vh] flex flex-col bg-gray-200 w-[20vw] border-r-2 border-black">
            <div className="flex shrink-0 px-8 items-center justify-between h-[96px]">
              <h1 className="text-center text-black ml-10">AI Chatbot</h1>
            </div>
            <button onClick={createChat} className="text-black ml-2">Create new chat</button>
            <div className="relative pl-3 my-5 overflow-y-scroll">
            <div className="flex flex-col w-full font-medium">
              <Chats selectChat={selectChat} deleteChat={deleteChat} />
            </div>
          </div>
          </aside>
          <section className="w-[80vw] h-[100vh] bg-red-700">
              <header className="bg-gray-200 h-[10vh]">
                <Header />
              </header>
            
              <div className="h-[70vh] bg-[#f0f1f1] py-10 px-10 overflow-y-auto scrollbar-hide">
                {messages.length === 0 ? (
                  <div className="w-full flex justify-center items-center mt-[10rem]">
                    <p className="text-black">Hi, Let's chat &#128400;</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={`w-full flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-[2rem]`}>
                      <div className={`rounded-xl p-4 max-w-[70%] ${message.sender === 'user' ? 'bg-[#d5d5d6]' : 'bg-[#d6d6d6]'}`}>
                        <p className="text-black">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>


              <div className="h-[20vh] bg-gray-200 p-[1rem]">
                <PromptForm chatId={chatId} setMessages={setMessages} />
              </div>
          </section>
      </main>
    </>
  )
}