
const baseUrl = process.env.NODE_ENV === "production" 
? 'http://localhost:5001/api' 
: 'http://localhost:5001/api';

export default baseUrl;