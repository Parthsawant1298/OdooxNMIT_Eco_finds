// test-razorpay.js - Quick test for Razorpay credentials
const Razorpay = require('razorpay');

const rzp = new Razorpay({
  key_id: 'rzp_test_UxqYOmFPQNuX6f',
  key_secret: 'fYwYyVWDtf0zM6e9D8LSC9jQ'
});

async function testRazorpay() {
  try {
    const order = await rzp.orders.create({
      amount: 100, // ₹1 in paise
      currency: 'INR',
      receipt: 'test_receipt_123'
    });
    console.log('✅ Razorpay test successful:', order);
  } catch (error) {
    console.error('❌ Razorpay test failed:', error);
  }
}

testRazorpay();
