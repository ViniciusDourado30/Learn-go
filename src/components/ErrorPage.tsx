import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "./ui/nextui-shim";
import { useAuthStore } from "../store/authStore";

export const ErrorPage = ({
  code = "500",
  title = "Algo deu errado",
  message = "Ocorreu um erro inesperado. Tente novamente ou volte para a página anterior.",
}: {
  code?: string;
  title?: string;
  message?: string;
}) => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const isAuth = !!token;

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6" style={{ background: "#fafafa" }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ background: "#fef2f2" }}>
          <AlertTriangle size={28} style={{ color: "#ef4444" }} strokeWidth={2} />
        </div>
        <p className="text-[64px] leading-none mb-2" style={{ color: "#ef4444", fontWeight: 800, letterSpacing: "-0.03em" }}>{code}</p>
        <h1 className="text-[22px] mb-3" style={{ color: "#09090b", fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</h1>
        <p className="text-[14px] mb-8 leading-relaxed" style={{ color: "#71717a" }}>{message}</p>
        <div className="flex items-center justify-center gap-3">
          <Button color="primary" className="h-12 px-6 text-[14px]" style={{ fontWeight: 600, borderRadius: "12px" }} startContent={<ArrowLeft size={16} />} onClick={() => navigate(isAuth ? "/dashboard" : "/")}>
            {isAuth ? "Voltar ao dashboard" : "Voltar ao início"}
          </Button>
          <Button variant="bordered" className="h-12 px-6 text-[14px] border-zinc-200" style={{ fontWeight: 600, borderRadius: "12px" }} startContent={<RefreshCw size={16} />} onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  );
};
