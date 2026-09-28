import { loadStripe } from '@stripe/stripe-js';
import { api } from '../services/api';

// Inicializa o Stripe usando a sua chave pública do .env
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// Verifica se as chaves existem para saber se estamos no modo real ou demonstração
export const isBackendConfigured = !!import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export interface BookingPaymentPayload {
  amount: number;
  teacherName?: string;
  lessonType?: string;
  cursoId?: string;
}

export async function createPaymentIntent(payload: BookingPaymentPayload) {
  try {
    // Agora o Frontend chama a rota real que acabamos de criar no NestJS
    const response = await api.post('/pagamentos/create-payment-intent', {
      amount: payload.amount,
      metadata: {
        cursoId: payload.cursoId,
        teacherName: payload.teacherName,
        lessonType: payload.lessonType
      }
    });
    
    return response.data.clientSecret;
  } catch (error) {
    console.error("Erro ao criar intenção de pagamento:", error);
    throw error;
  }
}