import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    // دالة لجلب المحادثات عند حدوث أي تغيير في قاعدة البيانات
    const getChats = () => {
      if (currentUser?.uid) {
        const unsub = onSnapshot(
          doc(db, "userChats", currentUser.uid),
          (doc) => {
            setChats(doc.data() || {});
          },
          (error) => {
            console.error("Error fetching chats: ", error);
          }
        );

        return () => {
          unsub();
        };
      }
    };

    getChats();
  }, [currentUser?.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} alt="User" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text || "No messages yet"}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
