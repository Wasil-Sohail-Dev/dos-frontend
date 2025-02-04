import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaArrowUpLong } from "react-icons/fa6";
import { IoIosAttach } from "react-icons/io";
import { sendMessage } from "../../store/chat/services";
import PreviewChart from "../../component/Layout/Dashboard/PreviewChart";

const TypingAnimation = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollToBottom = useRef(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        // Scroll after each character is added
        scrollToBottom.current?.();
      }, 4);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayedText}</span>;
};

const ChatWithAi = () => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);
    setIsTyping(true);
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    try {
      await dispatch(sendMessage({
        message: userMessage,
        onSuccess: (data) => {
          setMessages(prev => [...prev, { type: 'ai', content: data }]);
          setIsTyping(false);
        },
        onError: (error) => {
          console.error("Chat error:", error);
          setMessages(prev => [...prev, { 
            type: 'ai', 
            content: "Sorry, I'm having trouble processing your request right now. Please try again later." 
          }]);
          setIsTyping(false);
        }
      })).unwrap();
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col overflow-hidden h-screen px-4 sm:px-6 lg:px-20 py-4"
      style={{ height: "calc(100vh - 150px)" }}
    >
      {messages.length === 0 ? (
        <PreviewChart message={message} setMessage={setMessage} handleSubmit={handleSubmit} isLoading={isLoading} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 sm:gap-4 mb-4 sm:mb-6 ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.type === "ai" && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-[#33363F] flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium">AI</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-[20px] px-3 sm:px-4 py-2 ${
                      msg.type === "user"
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="font-normal text-sm sm:text-base leading-[22px] sm:leading-[25px]">
                      {msg.type === 'ai' ? (
                        <TypingAnimation 
                          text={msg.content} 
                          ref={(el) => el && (el.scrollToBottom = scrollToBottom)}
                        />
                      ) : msg.content}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-[#33363F] flex-shrink-0">
                    <span className="text-xs sm:text-sm font-medium">AI</span>
                  </div>
                  <div className="max-w-[85%] sm:max-w-[70%] rounded-[20px] px-3 sm:px-4 py-2 bg-gray-100">
                    <p className="font-normal text-sm sm:text-base leading-[22px] sm:leading-[25px]">
                      <span className="inline-flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                      </span>
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <div className="mx-auto w-full">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a Message"
                  className="w-full p-3 sm:p-4 pr-20 sm:pr-24 rounded-[10px] border border-[#33363F] focus:outline-none focus:border-blue-500 text-sm sm:text-base font-normal"
                  disabled={isLoading}
                />
                <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex gap-1 sm:gap-2 items-center">
                  <button
                    type="submit"
                    className={`bg-blue-500 text-white p-1.5 sm:p-2 rounded-lg ${
                      isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    } transition-colors`}
                    disabled={isLoading}
                  >
                    <FaArrowUpLong className="text-lg sm:text-xl" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWithAi;
