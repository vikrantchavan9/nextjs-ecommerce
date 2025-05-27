// app/payment/page.jsx
import RazorpayButton from '@/components/RazorpayButton';

export default function PaymentPage() {
  const productAmount = 500; // Example amount in your currency (e.g., INR 500)
  const productCurrency = 'INR'; // Example currency

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Complete Your Purchase
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          You are about to pay <span className="font-bold">{productCurrency} {productAmount}</span> for your order.
        </p>

        <RazorpayButton amount={productAmount} currency={productCurrency} />

        <p className="mt-8 text-gray-500 text-sm">
          Powered by Razorpay. Your payment is secure.
        </p>
      </div>
    </div>
  );
}
