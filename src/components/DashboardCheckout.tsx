import React, { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Lock, CreditCard, CheckCircle2, Shield, Zap } from "lucide-react";
import { Card, CardBody, Button, Avatar, Input } from "../components/ui/nextui-shim";

export const DashboardCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null); // TODO: fetch course
  const [step, setStep] = useState<"form" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const [loading, setLoading] = useState(false);

  const handleConfirm = (e: React.FormEvent) => { 
      e.preventDefault(); 
      setLoading(true); 
      // TODO: Mandar requisição para a API de pagamento
      setTimeout(() => { setLoading(false); setStep("success"); }, 1500); 
  };

  if (step === "success") return (
      <DashboardLayout>
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <CheckCircle2 size={50} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold">Compra realizada!</h2>
            <Button color="primary" onPress={() => navigate("/dashboard/courses")} className="mt-4">Começar agora</Button>
          </div>
      </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-[900px] mx-auto px-5 mt-6">
        <h1 className="text-xl font-bold mb-4">Finalizar Compra</h1>
        <form onSubmit={handleConfirm} className="space-y-4">
            <Card shadow="none" className="border border-zinc-100">
                <CardBody className="p-5">
                    <h2 className="font-bold mb-3">Método de Pagamento</h2>
                    <div className="flex gap-2 mb-4">
                        <Button variant={paymentMethod === "card" ? "solid" : "bordered"} color={paymentMethod === "card" ? "primary" : "default"} onPress={() => setPaymentMethod("card")}>Cartão</Button>
                        <Button variant={paymentMethod === "pix" ? "solid" : "bordered"} color={paymentMethod === "pix" ? "primary" : "default"} onPress={() => setPaymentMethod("pix")}>Pix</Button>
                    </div>
                    {paymentMethod === "card" && (
                        <div className="space-y-3">
                            <Input label="Número do Cartão" variant="bordered" />
                            <Input label="Nome no Cartão" variant="bordered" />
                        </div>
                    )}
                    <Button type="submit" color="primary" isLoading={loading} className="w-full mt-4">Confirmar Pagamento</Button>
                </CardBody>
            </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};