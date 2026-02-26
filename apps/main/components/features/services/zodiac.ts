import zodiacData from "../../../public/data/zodiac.json";

export interface ZodiacData {
  id: number;
  image: string;
  title: string;
  date: string;
  nature: string;
}

export const ZodiacSignsData: ZodiacData[] = zodiacData;
