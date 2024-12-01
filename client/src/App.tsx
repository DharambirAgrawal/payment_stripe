import './App.css'
// import PaymentForm from './components/payment/payment-form'
// function App() {

//   return (
//     <div className="container mx-auto px-4 py-8 justify-center flex flex-col items-center w-full">
//       <h1 className="text-3xl font-bold mb-6 text-center">Complete Your Payment</h1>
//       <PaymentForm />
//     </div>
//   )
// }

import CheckoutForm from './components/payment/stripe-payment';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);
function App() {
  const handleClick = async (e) => {
    e.preventDefault()
    console.log('hhh')

    const response = await fetch('https://urban-bassoon-vjwqprg79gv3wpqp-3000.app.github.dev/health');
  //   fetch('https://urban-bassoon-vjwqprg79gv3wpqp-3000.app.github.dev/health')
  // .then(response => response.json())
  // .then(data => console.log(data))
  // .catch(error => console.error(error));
    const a = await response.json()
    console.log(a)


  }
  return (
    <>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
      <button onClick={handleClick}>
        Click me
      </button>
    </>
  );
}
export default App
