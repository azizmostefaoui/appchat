import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file) {
      if (file.size > maxSize) {
        alert("File size exceeds 5MB. Please upload a smaller image.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }

      setImg(file);
    }
  };

  const handleSend = async () => {
    if (loading) return; // Prevent multiple submissions

    setLoading(true);

    try {
      if (img) {
        const storageRef = ref(storage, uuid());

        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Optionally handle progress updates
          },
          (error) => {
            console.error("Upload failed:", error);
            alert("Failed to upload image. Please try again.");
            setLoading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
            setLoading(false);
          }
        );
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
        setLoading(false);
      }

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      setText("");
      setImg(null);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="Attach" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleFileChange}
        />
        <label htmlFor="file">
          <img src={Img} alt="Upload" />
        </label>
        <button
          className="button-29"
          onClick={handleSend}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Input;
