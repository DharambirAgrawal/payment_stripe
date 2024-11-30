import './App.css'
import PaymentForm from './components/payment/payment-form'
function App() {

  return (
    <div className="container mx-auto px-4 py-8 justify-center flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold mb-6 text-center">Complete Your Payment</h1>
      <PaymentForm />
    </div>
  )
}

export default App
