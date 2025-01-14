import React,{useState,useEffect} from 'react';
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
import queryString from 'query-string';
import io from 'socket.io-client';
let socket=io.connect('http://localhost:5000');
// let socket;
//location comes from react router and it gives us a prop called location
const Chat=({location})=> {
    const [name,setName]=useState('');
    const [room,setRoom]=useState('');
    const [message,setMessage]=useState('');
    const [messages,setMessages]=useState([]);
    const [users, setUsers] = useState('');
    const ENDPOINT = 'https://discuss-chat-app.vercel.app/';
    useEffect(()=> {

        const {name,room}=queryString.parse(location.search);
        socket=io(ENDPOINT);
       setName(name);
       setRoom(room);
       socket.emit('join' , {name,room},(error)=> {
     if(error) {
        alert(error);
     }
       });
    },[ENDPOINT,location.search]);
    //for handling messages:
    useEffect(() => {
        socket.on('message', message => {
          setMessages(messages => [ ...messages, message ]);
        });
        
        socket.on("roomData", ({ users }) => {
          setUsers(users);
        });
    }, []);
        const sendMessage=(event)=> {
            event.preventDefault();
            if(message) {
                socket.emit('sendMessage',message,()=> setMessage(''));
            }
        }
        console.log(message,messages);
    return (
       <div className="outerContainer">
        <div className="container">
            <InfoBar room={room}/>
            <Messages messages={messages} name={name}/>
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
        </div>
        <TextContainer users={users}/>
       </div>
    )
}
export default Chat;
