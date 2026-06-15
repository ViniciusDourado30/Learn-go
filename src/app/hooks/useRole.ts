import { useState, useEffect } from "react";

export const useRole = () => {
  const [role, setRole] = useState<"aluno" | "professor">(
    () => (localStorage.getItem("userRole") as "aluno" | "professor") || "aluno"
  );

  const toggleRole = () => {
    const newRole = role === "aluno" ? "professor" : "aluno";
    localStorage.setItem("userRole", newRole);
    setRole(newRole);
    window.dispatchEvent(new Event("roleChange"));
  };

  useEffect(() => {
    const handleRoleChange = () => {
      setRole((localStorage.getItem("userRole") as "aluno" | "professor") || "aluno");
    };
    window.addEventListener("roleChange", handleRoleChange);
    return () => window.removeEventListener("roleChange", handleRoleChange);
  }, []);

  return { role, toggleRole };
};