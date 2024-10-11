import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { GEMINI_API_KEY } from '@env';

interface Message {
  id: string;
  text: string;

  imageUrl?: string;
  sender: true | false ; // senderフィールドでユーザーかAIを区別

  
}

const TextAreaExample = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputContainerHeight,setConttainerHeight] = useState(520)
  // AIかどうか判定する定数。あとで処理を変えるかも
  const [AIChatFlg,setAichatFlg] = useState(false);
  const textareaFocus = async() =>{
    setConttainerHeight(200)
  }
  const textareaBlur = async() =>{
    setConttainerHeight(520)
  }
  const handleSend = async () => {
    if (text.trim() === '') {
      Alert.alert('入力が空です。メッセージを入力してください。');
      return;
    }
  


    const newMessage: Message = {
      id: Math.random().toString(),
      text,
      sender:true
    };

    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    setAichatFlg(false)

    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: text,
              }],
            }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: Math.random().toString(),
        text: data.candidates[0]?.content?.parts[0]?.text || '応答がありませんでした。',
        // 画像
        imageUrl: data.candidates[0]?.content?.parts[1]?.imageUrl || '',
        sender:false
      };
      setMessages((prevMessages) => [botMessage, ...prevMessages]);

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('エラーが発生しました', '再度お試しください。');
    } finally {
      setLoading(false);
      setAichatFlg(true)
      setText('');
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
      // const isUserMessage = item.sender === 'user';  // sender フィールドで分岐（例: 'user' か 'ai'）

    <View style={[styles.messageItem]}>
      {/* ここでuserかAIを分岐？ */}
      <Text style={[styles.messageText,item.sender === true ? styles.userMessage: styles.aiMessage,]}numberOfLines={0}  // ここに追加
      // !以下を確認する
      >{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
      // 順番に処理する。
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        //!以下でテキストボックスの上が調節される。

        style={[styles.messageList,{paddingBottom:inputContainerHeight}]}
        inverted={true}
        // nestedScrollEnabled={true}
        contentContainerStyle={styles.listContentContainer}

      />
      <View style={styles.inputContainer}>
        <TextInput
        // テキストの枠
          style={[styles.textArea,{ paddingBottom: 120 }]}
          placeholder="ここに入力してください..."
          multiline={true}
          onChangeText={setText}
          value={text}
          onFocus={textareaFocus}
          onBlur={textareaBlur}
        />
        <Button title="送信" onPress={handleSend} disabled={loading} />
      </View>
      {loading && <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  inputContainer: {
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
    padding:20,
    
    borderTopWidth: 1,
    borderTopColor: '#ccc',
   
  },
  textArea: {
    // height: 100,
    flexShrink: 1, // テキストが横に溢れないように
    borderColor: 'gray',
    flexWrap: 'wrap',
    flexDirection: 'row', // 縦に配置
    alignItems: 'center', 
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    // marginBottom: 10,
    textAlignVertical: 'top',
    flexGrow: 0, 
    width: '100%', // 幅を100%に設定
    // maxWidth: '100%', // 幅を100%に設定
    // !
    color:'black'
  },
  messageList: {
    flex: 1,
    flexGrow: 0, 
    width: '100%', // 幅を100%に設定
  },
  listContentContainer: {
    paddingBottom: 100, // InputContainerの高さ + 余白
  },
  messageItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 5,
    flexGrow: 0, 
    width: '100%', // 幅を100%に設定
    color:'black'
  },
  messageText: {
    flexShrink: 1, // テキストが横に溢れないように
    flexWrap: 'wrap',
    flexGrow:0,
     color:'black'

    // height:100
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  // ユーザースタイルを設定する。
  // 右寄り
  // 色は青。
  userMessage: {
    backgroundColor: '#e1ffc7', // ユーザーのメッセージ背景色
    alignSelf: 'flex-end', // ユーザーのメッセージを右側に配置
  },
  aiMessage: {
    backgroundColor: '#f0f0f0', // AIのメッセージ背景色
    alignSelf: 'flex-start', // AIのメッセージを左側に配置
  },
});

export default TextAreaExample;
