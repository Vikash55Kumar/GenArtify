import React, { useContext, useState } from 'react';
import { Check, Currency } from 'lucide-react';
import { toast } from 'react-toastify';
import SpinnerLoader from '../utility/SpinnerLoader';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { razorpayPayment, verifyPayment } from '../action/userAction';
import { AuthContext } from '../utility/AuthContext';

const plans = [
  {
    name: 'Basic',
    price: '$9',
    description: 'Perfect for hobbyists and beginners',
    features: [
      '50 images per month',
      'Standard resolution',
      'Basic editing tools',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For professionals and small teams',
    features: [
      '200 images per month',
      'HD resolution',
      'Advanced editing tools',
      'Priority support',
      'Commercial usage rights',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    description: 'For large teams and organizations',
    features: [
      'Unlimited images',
      '4K resolution',
      'Custom API access',
      'Dedicated support',
      'Commercial usage rights',
      'Custom model training',
    ],
  },
];

export function Pricing() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const {user} = useContext(AuthContext);

  const initPay = (order) => {
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: 'Credits Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        // console.log(response.razorpay_order_id)
        // setLoading(true);
    
        // try {
        //     const response = await dispatch(verifyPayment({razorpay_order_id:response.razorpay_order_id}));
        //     console.log("Final response", response);
            
        //     if (response.success) {
        //         toast.success("Credit added successfully");
        //         loadCredit();
        //         navigate("/");
        //         setLoading(false); 
        //     } 
        // } catch (error) {
        //     toast.error('Credit added failed!');
        //     setLoading(false); // Hide spinner after error
        // }

        try {
            const result = await dispatch(verifyPayment(response.razorpay_order_id));
            console.log("Final API Response:", result);
    
            if (result.success) {
                toast.success(result.message || "Credit added");
                navigate("/");
                setLoading(false);
            } else {
              toast.success(result.message || "Credit addition failed!");
              setLoading(false);
            }
        } catch (error) {
            toast.error("Credit addition failed!");
            setLoading(false);
        }      
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()

  }
  const handleRazerpayment = async (planId) => {
    if(!user) {
      navigate("/login")
      return
    }
    setLoading(true);

    // console.log("Initiating Razorpay payment for:", planId);

    try {
        const response = await dispatch(razorpayPayment({planId}));
        console.log("paymentData", response);
        
        if (response.success === true) {
            toast.success(response.message || "Payment successfully");
            initPay(response.order)
            setLoading(false); 
        } else {
          toast.error(response.message || "Payment failed!");
          setLoading(false);
            
        }
    } catch (error) {
        toast.error('Payment failed!');
        setLoading(false); // Hide spinner after error
    }
  };

  return (
    <div className="bg-gray-50 py-12">
    {loading ? <SpinnerLoader /> 
      :
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="mt-4 text-xl text-gray-600">
            Select the perfect plan for your creative needs
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                plan.popular ? 'border-2 border-purple-500 relative' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                  <span className="inline-flex rounded-full bg-purple-600 px-4 py-1 text-sm font-semibold text-white">
                    Popular
                  </span>
                </div>
              )}
              
              <div className="p-6 bg-white rounded-t-lg">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <button 
                  onClick={() => handleRazerpayment(plan.name)}
                  className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-semibold ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  Get Started
                </button>
              </div>

              <div className="p-6 bg-gray-50 rounded-b-lg space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="ml-3 text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    }
    </div>
  );
}
