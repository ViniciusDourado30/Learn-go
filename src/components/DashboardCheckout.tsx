import React, { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCurso, useMatricular, getImageUrl } from '../hooks/useDashboard';
import { ChevronLeft, Lock, CreditCard, CheckCircle2, Shield, Award, Infinity, Star, Clock, BookOpen, RotateCcw, Zap } from 'lucide-react';
import { Card, CardBody, Button, Avatar, Input, Skeleton } from '../components/ui/nextui-shim';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, createPaymentIntent } from '../lib/stripe';

const ELEMENT_OPTIONS = {
  style: {
    base: { fontSize: '13px', color: '#09090b', letterSpacing: '0.02em', '::placeholder': { color: '#a1a1aa' }, fontFamily: 'Inter, sans-serif' },
    invalid: { color: '#ef4444' },
  },
};

const CheckoutContent = ({ course, onGo }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { mutate: matricular } = useMatricular();
  
  const [step, setStep] = useState('form');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [simCardNum, setSimCardNum] = useState('');
  const [simExp, setSimExp] = useState('');

  const price = course.preco ?? 0;
  const total = price.toFixed(2).replace('.', ',');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'pix') {
      setLoading(true);
      setTimeout(() => {
        matricular(course.id, { onSuccess: () => setStep('success') });
      }, 2000);
      return;
    }

    if (!stripe || !elements) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const clientSecret = await createPaymentIntent({ cursoId: course.id, amount: price, type: 'curso' });
      const cardElement = elements.getElement(CardNumberElement);
      
      if (!cardElement) throw new Error('Elemento de cartão não encontrado');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement, billing_details: { name: cardName } },
      });

      if (stripeError) {
        setErrorMsg(stripeError.message || 'Erro ao processar pagamento.');
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        matricular(course.id, { onSuccess: () => setStep('success') });
      }
    } catch (err: any) {
      setErrorMsg('Falha na comunicação com o servidor de pagamentos.');
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h2 className="text-[24px] mb-2" style={{ color: '#09090b', fontWeight: 700 }}>Compra realizada!</h2>
        <p className="text-[14px] text-zinc-500 max-w-sm mb-6">Acesso completo a <strong>"{course.titulo}"</strong>. Bons estudos!</p>
        <Button color="primary" onPress={onGo} startContent={<Zap size={16} />} className="mb-2 h-11 text-[14px]" style={{ fontWeight: 600 }}>Começar agora</Button>
        <Button as={Link} to="/dashboard/my-courses" variant="bordered" className="border-zinc-200 text-[13px]">Ir para Meus Cursos</Button>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)' }}>
        <div className="relative z-10 max-w-[900px] mx-auto px-5 md:px-8 py-6 flex items-center gap-3">
          <Button isIconOnly variant="light" size="sm" className="text-white/40 hover:text-white/70" onPress={() => navigate(-1)} aria-label="Voltar">
            <ChevronLeft size={18} />
          </Button>
          <div>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Cursos / Checkout</p>
            <h1 className="text-[18px]" style={{ color: 'white', fontWeight: 700 }}>Finalizar Compra</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-5 md:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card shadow="none" className="border border-zinc-100">
              <CardBody className="p-5">
                <h2 className="text-[14px] mb-3" style={{ color: '#09090b', fontWeight: 700 }}>Pagamento</h2>
                <div className="flex gap-2">
                  {(['card', 'pix'] as const).map(m => (
                    <Button key={m} variant={paymentMethod === m ? 'solid' : 'bordered'} color={paymentMethod === m ? 'primary' : 'default'}
                      className="flex-1 text-[12px]" onPress={() => setPaymentMethod(m)} style={{ fontWeight: 600 }}>
                      {m === 'card' ? 'Cartão' : 'Pix'}
                    </Button>
                  ))}
                </div>
              </CardBody>
            </Card>

            {paymentMethod === 'card' ? (
              <Card shadow="none" className="border border-zinc-100">
                <CardBody className="p-5 space-y-3">
                  <div className="h-[160px] rounded-xl p-5 flex flex-col justify-between relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #006FEE, #0055cc)' }}>
                    <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="flex justify-between relative z-10">
                      <div className="w-10 h-7 border border-white/20 rounded bg-white/10" />
                      <div className="flex -space-x-2 opacity-60">
                        <div className="w-6 h-6 rounded-full bg-red-500/80" />
                        <div className="w-6 h-6 rounded-full bg-yellow-500/80" />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <p className="text-white/90 font-mono text-[16px] tracking-[0.12em] mb-3">{simCardNum || '•••• •••• •••• ••••'}</p>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-blue-200 text-[9px] uppercase tracking-wider mb-0.5">Titular</p>
                          <p className="text-white text-[12px] uppercase tracking-wider">{cardName || 'NOME'}</p>
                        </div>
                        <div>
                          <p className="text-blue-200 text-[9px] uppercase tracking-wider mb-0.5">Validade</p>
                          <p className="text-white text-[12px] font-mono">{simExp || 'MM/AA'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Input label="Nome no cartão" value={cardName} onValueChange={(v) => setCardName(v.toUpperCase())} placeholder="ALEX SILVA"
                    variant="bordered" isRequired classNames={{ inputWrapper: 'border-zinc-200 shadow-none' }} />
                  
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-zinc-700 ml-1">Número do Cartão</label>
                    <div className="border border-zinc-200 rounded-xl px-3 py-3.5 shadow-sm bg-white">
                      <CardNumberElement options={ELEMENT_OPTIONS} onChange={(e) => setSimCardNum(e.empty ? '' : '•••• •••• •••• ' + (e.brand !== 'unknown' ? '1234' : '••••'))} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[12px] font-medium text-zinc-700 ml-1">Validade</label>
                      <div className="border border-zinc-200 rounded-xl px-3 py-3.5 shadow-sm bg-white">
                        <CardExpiryElement options={ELEMENT_OPTIONS} onChange={(e) => setSimExp(e.empty ? '' : 'XX/XX')} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-medium text-zinc-700 ml-1">CVV</label>
                      <div className="border border-zinc-200 rounded-xl px-3 py-3.5 shadow-sm bg-white">
                        <CardCvcElement options={ELEMENT_OPTIONS} />
                      </div>
                    </div>
                  </div>

                  {errorMsg && <p className="text-[12px] text-red-500 font-medium text-center">{errorMsg}</p>}

                  <Button type="submit" color="primary" isLoading={loading} className="w-full h-11 text-[14px] mt-2"
                    style={{ fontWeight: 600 }} startContent={!loading && <Lock size={14} />}>
                    {loading ? 'Processando...' : `Pagar R$ ${total}`}
                  </Button>
                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
                    <Shield size={11} className="text-green-500" /> Pagamento seguro com Stripe
                  </p>
                </CardBody>
              </Card>
            ) : (
              <Card shadow="none" className="border border-zinc-100">
                <CardBody className="p-6 text-center space-y-4">
                  <h2 className="text-[14px]" style={{ color: '#09090b', fontWeight: 700 }}>Pagar com Pix</h2>
                  <div className="w-40 h-40 mx-auto border-2 border-zinc-200 rounded-xl bg-zinc-50 flex items-center justify-center">
                    <span className="text-zinc-300 text-[12px]">QR Code Simulado</span>
                  </div>
                  <p className="text-[12px] text-zinc-400">Simulando processamento...</p>
                  <Button type="submit" color="primary" isLoading={loading} className="w-full max-w-[200px] mx-auto h-11 text-[14px]" style={{ fontWeight: 600 }}>
                    Confirmar Pagamento Simulado
                  </Button>
                </CardBody>
              </Card>
            )}
          </form>

          {/* Summary */}
          <div className="space-y-4">
            <Card shadow="none" className="border border-zinc-100 overflow-hidden">
              <div className="relative h-[120px]">
                <img src={getImageUrl(course.capa_url) || "https://images.unsplash.com/photo-1524178232363"} alt={course.titulo} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-3 left-3 right-3 text-white text-[13px] line-clamp-2" style={{ fontWeight: 700 }}>{course.titulo}</p>
              </div>
              <CardBody className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Avatar src={getImageUrl(course.professor?.foto_url)} className="w-6 h-6" size="sm" />
                  <span className="text-[11px] text-zinc-600">{course.professor?.nome} {course.professor?.sobrenome}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1"><Star size={10} className="fill-amber-400 text-amber-400" />{course.professor?.rating || '5.0'}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{(course.modulos?.reduce((acc:any, m:any) => acc + m.aulas?.length, 0) * 15) || 120}m</span>
                  <span className="flex items-center gap-1"><BookOpen size={10} />{course.modulos?.reduce((acc:any, m:any) => acc + m.aulas?.length, 0) || 10}</span>
                </div>
              </CardBody>
            </Card>

            <Card shadow="none" className="border border-zinc-100">
              <CardBody className="p-4 space-y-3">
                <h3 className="text-[13px]" style={{ color: '#09090b', fontWeight: 700 }}>Resumo</h3>
                <div className="flex justify-between text-[12px] text-zinc-600"><span>Subtotal</span><span style={{ fontWeight: 600 }}>R$ {total}</span></div>
                <div className="flex justify-between text-[12px] text-green-600" style={{ fontWeight: 600 }}><span>Desconto</span><span>- R$ 0,00</span></div>
                <div className="border-t border-zinc-100 pt-2 flex justify-between">
                  <span className="text-[13px]" style={{ color: '#09090b', fontWeight: 700 }}>Total</span>
                  <span className="text-[20px]" style={{ color: '#09090b', fontWeight: 800 }}>R$ {total}</span>
                </div>
              </CardBody>
            </Card>

            <Card shadow="none" className="border border-zinc-100">
              <CardBody className="p-4 space-y-2">
                {[
                  { icon: <Infinity size={13} className="text-primary" />, text: 'Acesso vitalício' },
                  { icon: <Award size={13} className="text-primary" />, text: 'Certificado incluído' },
                  { icon: <Shield size={13} className="text-green-500" />, text: '7 dias de garantia' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-zinc-600">{item.icon}{item.text}</div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCurso(id!);

  if (isLoading) return <DashboardLayout><div className="p-8 text-center">A carregar checkout...</div></DashboardLayout>;
  if (!course) return <DashboardLayout><div className="flex flex-col items-center justify-center min-h-[50vh]"><p className="text-zinc-500">Curso não encontrado.</p><Button as={Link} to="/dashboard/courses" variant="light" color="primary" className="mt-3">← Voltar</Button></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <Elements stripe={stripePromise}>
        <CheckoutContent course={course} onGo={() => navigate(`/dashboard/courses/${course.id}`)} />
      </Elements>
    </DashboardLayout>
  );
};