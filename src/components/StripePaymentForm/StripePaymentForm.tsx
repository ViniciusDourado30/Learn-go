import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, createPaymentIntent } from '../../lib/stripe';
import { Button } from '../ui/nextui-shim';

const CheckoutForm = ({ payload, onSuccess }: { payload: any; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      const clientSecret = await createPaymentIntent(payload);
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Erro no formulário de cartão');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) {
        setError(stripeError.message || 'Erro ao processar pagamento.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err: any) {
      setError('Falha na comunicação com o servidor de pagamentos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-zinc-200 rounded-xl bg-white shadow-sm">
        <CardElement
          options={{
            style: {
              base: { fontSize: '15px', color: '#3f3f46', '::placeholder': { color: '#a1a1aa' } },
              invalid: { color: '#ef4444' },
            },
            hidePostalCode: true,
          }}
        />
      </div>
      {error && <p className="text-[12px] text-red-500 font-bold">{error}</p>}
      <Button
        type="submit"
        color="primary"
        className="w-full h-11 font-bold text-[14px]"
        isLoading={loading}
        isDisabled={!stripe}
      >
        Confirmar Pagamento
      </Button>
    </form>
  );
};

export const StripePaymentForm = ({ payload, onSuccess }: { payload: any; onSuccess: () => void }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm payload={payload} onSuccess={onSuccess} />
    </Elements>
  );
};