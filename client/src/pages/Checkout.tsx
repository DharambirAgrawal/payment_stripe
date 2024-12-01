import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/payment/Card-form';

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);

const Checkout = () => {
    const options = {
        // passing the client secret obtained from the server
        clientSecret: 'pi_3QRGhdGGBE709rEn08C0nSLw_secret_sHKkOxSPjapD6MgdMCn3qvONh',
      };
      return (
        <>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        </>
      );
}

export default Checkout