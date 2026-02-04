export interface User {
  id: string;
  discordUserId: string;
  username: string;
  avatar: string;
  linkedAt: string;
  accountStatus: string;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  parent_id?: string;
  position: number;
  // Category name will be resolved from parent
  categoryName?: string;
}

export interface DiscordMessage {
  id: string;
  channel_id: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  attachments?: DiscordAttachment[];
  embeds?: DiscordEmbed[];
  timestamp: string;
  edited_timestamp?: string;
}

export interface DiscordAttachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url?: string;
  width?: number;
  height?: number;
  content_type?: string;
  original_content_type?: string;
}

export interface DiscordEmbed {
  type?: string;
  url?: string;
  title?: string;
  description?: string;
}

export interface AuthResponse {
  sessionId: string;
}
