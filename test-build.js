// Simple test to check if the build issue is resolved
console.log("Build test - checking NextAuth imports...");

// Test if we can import the auth function
try {
  const { auth } = require('./src/app/api/auth/[...nextauth]/route.js');
  console.log("✅ NextAuth auth function imported successfully");
} catch (error) {
  console.error("❌ Error importing auth function:", error.message);
}

console.log("Build test completed");


