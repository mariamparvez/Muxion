import { X, CreditCard, Lock } from "lucide-react";
import { courseData } from "../data/courseData";
import { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl">Unlock Full Course</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Full Course Access</span>
              <span className="text-2xl">${courseData.price}</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ All {courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons unlocked</li>
              <li>✓ Lifetime access</li>
              <li>✓ Download resources</li>
              <li>✓ Certificate of completion</li>
            </ul>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={19}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Cardholder Name</label>
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
                <label className="block text-sm mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={3}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Lock className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
            
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : `Pay $${courseData.price}`}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            This is a demo payment form. No actual charges will be made.
          </p>
        </div>
      </div>
    </div>
  );
}
