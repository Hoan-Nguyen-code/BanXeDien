import api from "../../services/api";

import news1 from "../images/news/news1.jpg";
import news2 from "../images/news/news2.jpg";
import news3 from "../images/news/news3.jpg";
import news4 from "../images/news/news4.jpg";
import news5 from "../images/news/news5.jpg";
import news6 from "../images/news/news6.jpg";
import news7 from "../images/news/news7.jpg";
import news8 from "../images/news/news8.jpg";
import news9 from "../images/news/news9.jpg";
import news10 from "../images/news/news10.jpg";
import news11 from "../images/news/news11.jpg";
import news12 from "../images/news/news12.jpg";
import news13 from "../images/news/news13.jpg";
import news14 from "../images/news/news14.jpg";
import news15 from "../images/news/news15.jpg";

export interface NewsItem {
  title: string;
  content: string;
  image: string | null;
  link: string;
  created_at: string;
}

export function stripHTML(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");

  return doc.body.textContent || "";
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

export const fallbackImages: string[] = [
  news1,
  news2,
  news3,
  news4,
  news5,
  news6,
  news7,
  news8,
  news9,
  news10,
  news11,
  news12,
  news13,
  news14,
  news15,
];

export const largeImages: string[] = shuffleArray([
  news7,
  news8,
  news9,
  news12,
]);

export const smallImages: string[] = shuffleArray([
  news1,
  news2,
  news3,
  news4,
  news5,
  news6,
  news10,
  news11,
  news12,
  news13,
  news14,
  news15,
]);

export function getImage(
  apiImage: string | null,
  fallbackImage: string,
): string {
  return apiImage || fallbackImage;
}

export async function loadNews(): Promise<NewsItem[]> {
  try {
    const response = await api.get("/news/");

    return response.data;
  } catch (error) {
    console.error("Lỗi tải Google News:", error);

    return [];
  }
}
