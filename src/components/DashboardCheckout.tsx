import React, { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCurso, getImageUrl, useMatricular } from "../hooks/useDashboard";
import { StripePaymentForm } from "./StripePaymentForm/StripePaymentForm";
import { ChevronLeft, Shield, Award, Infinity, Star, Clock, BookOpen, Zap, CheckCircle2, RotateCcw } from "lucide-react";
import { Card, CardBody, Button, Avatar } from "../components/ui/nextui-shim";

const SuccessScreen = ({ courseTitle, onGo }: { courseTitle: string; onGo: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
      <CheckCircle2 size={40} className="text-green-500" />
    </div>
    <h2 className="text-[24px] mb-2" style={{ color: "#09090b", fontWeight: 700 }}>Compra realizada!</h2>
    <p className="text-[14px] text-zinc-500 max-w-sm mb-6">
      Acesso completo a <strong>"{courseTitle}"</strong>. Bons estudos!
    </p>
    <Button color="primary" onPress={onGo} startContent={<Zap size={16} />} className="mb-2 h-11 text-[14px]" style={{ fontWeight: 600 }}>
      Começar agora
    </Button>
    <Button as={Link} to="/dashboard/my-courses" variant="bordered" className="border-zinc-200 text-[13px]">Ir para Meus Cursos</Button>
  </div>
);

export const DashboardCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCurso(id!);
  const { mutate: matricular } = useMatricular();
  
  const [step, setStep] = useState<"form" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const [loadingPix, setLoadingPix] = useState(false);

  if (isLoading) return <DashboardLayout><div className="p-8 text-center">A carregar checkout...</div></DashboardLayout>;
  if (!course) return <DashboardLayout><div className="p-8 text-center text-zinc-500">Curso não encontrado.</div></DashboardLayout>;

  const price = course.preco ?? 0;
  const total = price.toFixed(2).replace(".", ",");

  const handlePaymentSuccess = () => {
    matricular(course.id, {
      onSuccess: () => setStep("success")
    });
  };

  const handleSimulatePix = () => {
    setLoadingPix(true);
    setTimeout(() => {
      setLoadingPix(false);
      handlePaymentSuccess();
    }, 2000);
  };

  if (step === "success") return <DashboardLayout><SuccessScreen courseTitle={course.titulo} onGo={() => navigate(`/dashboard/courses/${course.id}`)} /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="pb-10">
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)" }}>
          <div className="relative z-10 max-w-[900px] mx-auto px-5 md:px-8 py-6 flex items-center gap-3">
            <Button isIconOnly variant="light" size="sm" className="text-white/40 hover:text-white/70" onPress={() => navigate(-1)} aria-label="Voltar">
              <ChevronLeft size={18} />
            </Button>
            <div>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>Cursos / Checkout</p>
              <h1 className="text-[18px]" style={{ color: "white", fontWeight: 700 }}>Finalizar Compra</h1>
            </div>
          </div>
        </div>

        <div className="max-w-[900px] mx-auto px-5 md:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
            <div className="space-y-4">
              <Card shadow="none" className="border border-zinc-100">
                <CardBody className="p-5">
                  <h2 className="text-[14px] mb-3" style={{ color: "#09090b", fontWeight: 700 }}>Pagamento</h2>
                  <div className="flex gap-2">
                    {(["card", "pix"] as const).map(m => (
                      <Button key={m} variant={paymentMethod === m ? "solid" : "bordered"} color={paymentMethod === m ? "primary" : "default"}
                        className="flex-1 text-[12px]" onPress={() => setPaymentMethod(m)} style={{ fontWeight: 600 }}>
                        {m === "card" ? "Cartão" : "Pix"}
                      </Button>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {paymentMethod === "card" ? (
                <Card shadow="none" className="border border-zinc-100">
                  <CardBody className="p-5 space-y-4">
                    <p className="text-[13px] text-zinc-500 mb-2">Insira os dados do seu cartão para pagamento seguro.</p>
                    <StripePaymentForm 
                      payload={{ cursoId: course.id, amount: price, type: "curso" }} 
                      onSuccess={handlePaymentSuccess} 
                    />
                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 mt-4">
                      <Shield size={11} className="text-green-500" /> Pagamento seguro com Stripe
                    </p>
                  </CardBody>
                </Card>
              ) : (
                <Card shadow="none" className="border border-zinc-100">
                  <CardBody className="p-6 text-center space-y-4">
                    <h2 className="text-[14px]" style={{ color: "#09090b", fontWeight: 700 }}>Pagar com Pix</h2>
                    <div className="w-40 h-40 mx-auto border-2 border-zinc-200 rounded-xl bg-white flex items-center justify-center p-2">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020126330014BR.GOV.BCB.PIX0111123456789005204000053039865405${(price).toFixed(2)}5802BR5913LEARNGO TESTE6009SAO PAULO62070503***63041234`} alt="QR Code Pix" className="w-full h-full" />
                    </div>
                    <p className="text-[12px] text-zinc-400">Escaneie o QR Code com a aplicação do seu banco</p>
                    <div className="flex items-center gap-2 justify-center text-[12px] text-zinc-400">
                      <RotateCcw size={12} className="text-green-500 animate-spin" style={{ animationDuration: "3s" }} />
                      A aguardar pagamento...
                    </div>
                    <Button color="success" variant="flat" size="sm" className="mt-4" isLoading={loadingPix} onPress={handleSimulatePix}>
                      Simular Pagamento Pix (Teste)
                    </Button>
                  </CardBody>
                </Card>
              )}
            </div>

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
                    <span className="text-[11px] text-zinc-600">{course.professor?.nome}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1"><Star size={10} className="fill-amber-400 text-amber-400" />5.0</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{course.duracao_total_minutos} min</span>
                    <span className="flex items-center gap-1"><BookOpen size={10} />{course.modulos?.length || 0}</span>
                  </div>
                </CardBody>
              </Card>

              <Card shadow="none" className="border border-zinc-100">
                <CardBody className="p-4 space-y-3">
                  <h3 className="text-[13px]" style={{ color: "#09090b", fontWeight: 700 }}>Resumo</h3>
                  <div className="flex justify-between text-[12px] text-zinc-600"><span>Subtotal</span><span style={{ fontWeight: 600 }}>R$ {total}</span></div>
                  <div className="border-t border-zinc-100 pt-2 flex justify-between">
                    <span className="text-[13px]" style={{ color: "#09090b", fontWeight: 700 }}>Total</span>
                    <span className="text-[20px]" style={{ color: "#09090b", fontWeight: 800 }}>R$ {total}</span>
                  </div>
                </CardBody>
              </Card>

              <Card shadow="none" className="border border-zinc-100">
                <CardBody className="p-4 space-y-2">
                  {[
                    { icon: <Infinity size={13} className="text-primary" />, text: "Acesso vitalício" },
                    { icon: <Award size={13} className="text-primary" />, text: "Certificado incluído" },
                    { icon: <Shield size={13} className="text-green-500" />, text: "7 dias de garantia" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px] text-zinc-600">{item.icon}{item.text}</div>
                  ))}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};