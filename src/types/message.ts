export interface Message {
  id: string;
  communityId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'ANNOUNCEMENT' | 'NOTICE' | 'ALERT' | 'GENERAL';
  createdAt: string;
  readBy: string[]; // User IDs
}

export interface CreateMessageDTO {
  communityId: string;
  content: string;
  type: Message['type'];
}
