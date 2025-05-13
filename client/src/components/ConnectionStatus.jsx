import { useSocket } from '../context/SocketContext';
import '../assets/connectionStatus.css';

const ConnectionStatus = () => {
  const { isConnected } = useSocket();

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      {isConnected ? 'Live' : 'Offline'}
    </div>
  );
};

export default ConnectionStatus;