import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';  // IMessageをインポート
const ChatGPTLikeUI = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);  // IMessage型で定義

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'こんにちは！何かお手伝いできることはありますか？',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatBot',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    setTimeout(() => {
      const botMessage: IMessage = {
        _id: Math.random().toString(),
        text: 'お返事ありがとうございます！',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatBot',
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [botMessage])
      );
    }, 1000);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,  // ユーザーID
        name: 'User',
      }}
    />
  );
};

export default ChatGPTLikeUI;
