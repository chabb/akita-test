
export interface User {
  id: number;
  name: string;
  email: string;
  latitude: string;
  longitude: string;
  state?: 'a' | 'b' | 'c';
}

export interface UserProgressEvent {
  id: number;
  progress: number;
}
