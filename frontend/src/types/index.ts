export interface Tweet {
  id: string;
  text: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

export interface ApiError {
  message: string;
  status: number;
} 