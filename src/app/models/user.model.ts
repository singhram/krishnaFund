export interface User {
  userId: string;
  name: string;
  phoneNumber: string;
  // If id comes from MongoDB/NestJS as a string (UUID), change it to:
  // id: string; 
}