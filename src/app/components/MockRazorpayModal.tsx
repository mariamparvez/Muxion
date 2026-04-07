import { X, CreditCard, Lock } from "lucide-react";
import { useState } from "react";

interface MockRazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string, orderId: string) => void;
  amount: number;
  courseName: string;
}

export function MockRazorpayModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  amount,
  courseName 
}: MockRazorpayModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 15)}`;
      const mockOrderId = `order_${Math.random().toString(36).substring(2, 15)}`;
      
      setIsProcessing(false);
      onSuccess(mockPaymentId, mockOrderId);
      onClose();
      
      // Reset form
      setCardNumber("");
      setCardName("");
      setExpiryDate("");
      setCvv("");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">R</span>
            </div>
            <span className="font-semibold">Razorpay Checkout</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Amount Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">{courseName}</p>
            <p className="text-3xl">${(amount / 100).toFixed(2)}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                    setCardNumber(formatted);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={19}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2 text-gray-700">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 2) {
                      setExpiryDate(val);
                    } else {
                      setExpiryDate(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={3}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-green-800">Secure payment powered by Razorpay</span>
            </div>
            
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-semibold"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay $${(amount / 100).toFixed(2)}`
              )}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            🎯 Demo Mode: Use any card details to simulate payment
          </p>
        </div>
      </div>
    </div>
  );
}
