import { useState } from 'react';

const Test = () => {
  const [message, setMessage] = useState('');

  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/test');
      const data = await response.json();
      setMessage(JSON.stringify(data));
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Backend Connection</h1>
      <button 
        onClick={testBackend}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Test Connection
      </button>
      <p className="mt-4">Result: {message}</p>
    </div>
  );
};

export default Test;



