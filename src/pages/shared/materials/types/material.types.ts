export interface Material {
  id: string;
  title: string;
  category: string;
  description: string;
  author: string;
  date: string;
  views: number;
  status?: "pending" | "approved" | "rejected";
}

export type MaterialCategory =
  | "Toán học"
  | "Vật lý"
  | "Tin học"
  | "Hóa học"
  | "Cơ khí";

export interface MaterialFormData {
  title: string;
  category: string;
  description: string;
  link: string;
}

export interface SubmittedMaterial extends Material {
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

