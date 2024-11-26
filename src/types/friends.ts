export interface FriendRequestSender {
  id: number;
  name: string;
  nik: string;
  avatarPath?: string;
}

export interface FriendRequest {
  id: number;
  sender: FriendRequestSender;
  message: string;
  createdAt: string;
}

export interface Friend {
  id: number;
  name: string;
  nik: string;
  avatarPath?: string;
}
