import React, { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../../lib/store';
import { formatTime } from '../../lib/utils';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    profile_image: string;
  };
}

interface ChatBoxProps {
  classId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for demonstration
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Welcome to the class chat! Feel free to ask any questions.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    sender: {
      id: 'instructor-1',
      name: 'Sarah Johnson',
      profile_image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
    }
  },
  {
    id: '2',
    content: 'Hi everyone! Looking forward to the class.',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    sender: {
      id: 'user-1',
      name: 'John Smith',
      profile_image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg'
    }
  }
];

export const ChatBox: React.FC<ChatBoxProps> = ({ classId, isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;
    
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      sender: {
        id: user.id,
        name: user.name,
        profile_image: user.profileImage || ''
      }
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };
  
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <Card className="w-full max-w-lg relative z-[60] bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Class Chat</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender.id === user?.id ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar
                    src={message.sender.profile_image}
                    name={message.sender.name}
                    size="sm"
                  />
                  <div
                    className={`flex flex-col max-w-[70%] ${
                      message.sender.id === user?.id ? 'items-end' : ''
                    }`}
                  >
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.sender.id === user?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {message.sender.name} • {formatTime(new Date(message.created_at))}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <Button
                type="submit"
                className="px-4"
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                <span>Send</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
