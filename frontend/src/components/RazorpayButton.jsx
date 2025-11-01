import axios from 'axios';
import { useState } from 'react';

const RazorpayButton = ({ plan, billingCycle, userType }) => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handlePayment = async () => {
    const amount = plan.price[billingCycle];
    if (amount === 0) {
      alert('This is a free plan. No payment required.');
      return;
    }

    await loadRazorpayScript();

    const options = {
      key: 'rzp_live_RDdtqHgENYTAKE', // Replace with your Razorpay Key ID
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'Nextute',
      description: `Payment for ${plan.name} - ${billingCycle}`,
      image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.nextute.com%2F&psig=AOvVaw1Iz1i74iPzJzqP15osH5Rk&ust=1757111056543000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMC4vfeSwI8DFQAAAAAdAAAAABAE', // Replace with your logo URL
      handler: function (response) {
        // Create payment details object
        const paymentInfo = {
          paymentId: response.razorpay_payment_id,
          planName: plan.name,
          planType: billingCycle,
          amount: amount,
          currency: 'INR',
          date: new Date().toLocaleString(),
          userType: userType
        };
        
        setPaymentDetails(paymentInfo);
        setShowInvoice(true);
        
        // Send invoice to user's email
        sendInvoiceEmail(paymentInfo);
        
        // Update user subscription in the backend
        updateUserSubscription(paymentInfo);
      },
      prefill: {
        name: '', // Replace with user's name
        email: '', // Replace with user's email
        contact: '', // Replace with user's contact number
      },
      notes: {
        plan_id: plan.plan_id || plan.id, // Use the Razorpay plan_id if available, otherwise use the internal id
        billing_cycle: billingCycle,
        user_type: userType,
      },
      theme: {
        color: '#2D7A67',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const sendInvoiceEmail = async (paymentInfo) => {
    try {
      // Replace with your actual API endpoint
      await axios.post('/api/payments/send-invoice', {
        ...paymentInfo,
        email: paymentInfo.email || 'user@example.com' // Use the email from payment or user context
      });
      console.log('Invoice email sent successfully');
    } catch (error) {
      console.error('Error sending invoice email:', error);
    }
  };

  const updateUserSubscription = async (paymentInfo) => {
    try {
      // Replace with your actual API endpoint
      await axios.post('/api/user/subscription', {
        planId: plan.id,
        planName: plan.name,
        billingCycle: billingCycle,
        paymentId: paymentInfo.paymentId,
        amount: paymentInfo.amount
      });
      console.log('User subscription updated successfully');
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const closeInvoice = () => {
    setShowInvoice(false);
  };

  return (
    <>
      <button
        onClick={handlePayment}
        className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${plan.buttonStyle} text-white shadow-lg hover:shadow-xl`}
      >
        {plan.buttonText}
      </button>

      {/* Invoice Modal */}
      {showInvoice && paymentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Payment Receipt</h2>
              <button 
                onClick={closeInvoice}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium">{paymentDetails.paymentId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{paymentDetails.planName} ({paymentDetails.planType})</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">₹{paymentDetails.amount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{paymentDetails.date}</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-green-600 mb-4">Payment successful! A copy of this receipt has been sent to your email.</p>
              <button 
                onClick={closeInvoice}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RazorpayButton;
