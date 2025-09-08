// Test script to set up a user in localStorage for testing
// Run this in browser console: localStorage.setItem('user', JSON.stringify({id: 'user123', name: 'Test User', email: 'test@example.com'}));

const testUser = {
  id: 'user123',
  name: 'Test User',
  email: 'test@example.com'
};

localStorage.setItem('user', JSON.stringify(testUser));
console.log('Test user set up in localStorage:', testUser);