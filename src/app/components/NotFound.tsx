import { useNavigate } from "react-router";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "./ui/nextui-shim";
import { isAuthenticated } from "../hooks/useAuth";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6"
      style={{ background: "#fafafa" }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
          style={{ background: "#eff6ff" }}>
          <Compass size={28} style={{ color: "#006FEE" }} strokeWidth={2} />
        </div>

        <p className="text-[64px] leading-none mb-2"
          style={{ color: "#006FEE", fontWeight: 800, letterSpacing: "-0.03em" }}>
          404
        </p>
        <h1 className="text-[22px] mb-3"
          style={{ color: "#09090b", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Página não encontrada
        </h1>
        <p className="text-[14px] mb-8 leading-relaxed" style={{ color: "#71717a" }}>
          O endereço que você tentou acessar não existe ou foi movido. Vamos te levar
          de volta para um lugar conhecido.
        </p>

        <Button
          color="primary"
          className="h-12 px-6 text-[14px]"
          style={{ fontWeight: 600, borderRadius: "12px" }}
          startContent={<ArrowLeft size={16} />}
          onClick={() => navigate(isAuthenticated() ? "/dashboard" : "/")}
        >
          {isAuthenticated() ? "Voltar ao dashboard" : "Voltar ao início"}
        </Button>
      </div>
    </div>
  );
};
