import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  data: {
    partyCode: string;
    username: string;
  };
}
