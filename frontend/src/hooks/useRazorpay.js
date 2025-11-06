import { useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const useRazorpay = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiateMentorshipPayment = useCallback(async (mentorData, studentData) => {
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }

      // Create order
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/mentorship/create-order`,
        {
          mentorId: mentorData.id,
          mentorName: mentorData.name,
          amount: mentorData.sessionPrice,
          studentId: studentData.id,
        }
      );

      const { order, key } = orderResponse.data;

      // Razorpay options
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Nextute Mentorship',
        description: `Book session with ${mentorData.name}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_BACKEND_BASE_URL}/api/mentorship/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                mentorId: mentorData.id,
                mentorName: mentorData.name,
                studentId: studentData.id,
                amount: mentorData.sessionPrice,
              }
            );

            if (verifyResponse.data.success) {
              toast.success('Booking confirmed! Check your email for details.');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: studentData.name,
          email: studentData.email,
          contact: studentData.phone || '',
        },
        theme: {
          color: '#2D7B67',
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
    }
  }, []);

  return { initiateMentorshipPayment };
};

export default useRazorpay;
