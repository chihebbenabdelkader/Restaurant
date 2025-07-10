
const baseUrl = process.env.NODE_ENV === "production" 
? 'http://localhost:5001/api' 
: 'http://localhost:5001/api';

// const baseUrl = 'https://7f73-2c0f-f290-3080-9769-80d2-c665-23e9-547c.ngrok-free.app/api' 

export default baseUrl;