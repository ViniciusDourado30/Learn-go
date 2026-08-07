export type Level = "Iniciante" | "Intermediário" | "Avançado";
export type Category = "Programação" | "Design" | "Marketing" | "Business" | "Idiomas" | "Matemática" | "Ciências" | "Música";

export interface Course {
  id: string | number;
  title: string;
  description?: string;
  instructor: string;
  instructorAvatar?: string;
  level: Level;
  category: Category;
  price?: number;
  duration?: string;
  rating?: number;
  students?: number;
  lessons?: number;
  thumb?: string;
  enrolled?: boolean;
  progress?: number;
  isBestseller?: boolean;
  isNew?: boolean;
  tags?: string[];
  syllabus?: any[];
  includes?: string[];
}