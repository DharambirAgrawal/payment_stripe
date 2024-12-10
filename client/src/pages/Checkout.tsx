import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
// import CheckoutForm from '../components/payment/Card-form';

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);

const Checkout = () => {
    const options = {
        // passing the client secret obtained from the server
        clientSecret: 'pi_3QULMZGGBE709rEn0owE23XN_secret_eliLapxqX3WLuURt7ikNyTHQg',
      };
      return (
        <>
          <Elements stripe={stripePromise} options={options}>
            <div>
              hhhhh
            </div>
            {/* <CheckoutForm /> */}
          </Elements>
        </>
      );
}

export default Checkout