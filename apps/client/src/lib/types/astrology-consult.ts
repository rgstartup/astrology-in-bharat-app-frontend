export interface ConsultLocation {
  name: string;
  lat: string;
  lon: string;
}

export interface ConsultPersonDetails {
  name: string;
  date: string;
  time: string;
  lat: string;
  lon: string;
  locationName: string;
  tz?: number;
}

export interface MatchFormProps {
  boyDetails: ConsultPersonDetails;
  girlDetails: ConsultPersonDetails;
  handleInputChange: (
    gender: "boy" | "girl",
    field: keyof ConsultPersonDetails,
    value: string
  ) => void;
  handleLocationSelect: (
    gender: "boy" | "girl",
    location: ConsultLocation
  ) => void;
  handleMatch: () => void;
  handleSwap: () => void;
  loading: boolean;
  error: string | null;
}

export interface AstrologySign {
  id: string;
  title: string;
  image: string;
  date: string;
  nature?: string;
}

export interface NakshatraInfo {
  name: string;
  lord?: { name: string };
  pada?: number | string;
}

export interface RasiInfo {
  name: string;
  lord?: { name: string };
}

export interface AdditionalInfo {
  deity?: string;
  ganam?: string;
  animal_sign?: string;
  nadi?: string;
}

export interface PersonMatchResult {
  nakshatra?: NakshatraInfo;
  chandra_rasi?: RasiInfo;
  rasi?: RasiInfo;
  additional_info?: AdditionalInfo;
  koot?: Record<string, any>;
}

export interface GunaMilanResult {
  total_points: number;
  maximum_points: number;
  total?: { score: number };
  guna?: any[];
  conclusion?: any; // Can be string or { report: string }
  ashtakoot?: Record<string, { score: number; maximum_score: number }>;
}

export interface MatchResults {
  boy: PersonMatchResult;
  girl: PersonMatchResult;
  match: {
    guna_milan?: GunaMilanResult;
  };
}

export interface MangalDoshaDetails {
  has_dosha: boolean;
  description: string;
  has_exception: boolean;
}

export interface AdvancedMatchResults {
  boy_info?: PersonMatchResult;
  girl_info?: PersonMatchResult;
  guna_milan?: GunaMilanResult;
  boy_mangal_dosha_details?: MangalDoshaDetails;
  girl_mangal_dosha_details?: MangalDoshaDetails;
  message?: { description: string };
  conclusion?: any; // Can be string or { report: string }
  total_score?: number;
  total?: { score: number };
  ashtakoot?: Record<string, { score: number; maximum_score: number }>;
  ashtakoot_points?: Record<string, { score: number; maximum_score: number }>;
}

export interface ResultsSectionProps {
  resultsRef: React.RefObject<HTMLDivElement | null>;
  results: MatchResults;
  boyName: string;
  girlName: string;
}

export interface AdvancedResultsComponentProps {
  resultsRef: React.RefObject<HTMLDivElement | null>;
  matchingResult: AdvancedMatchResults;
  boyDetails: ConsultPersonDetails;
  girlDetails: ConsultPersonDetails;
}

export interface LoveCalculatorSimpleResult {
  type: "simple";
  score: number;
  message: string;
}

export interface LoveCalculatorAdvancedResult {
  type: "advanced";
  data: {
    guna_milan: {
      total_points: number;
      ashta_koot: Record<
        string,
        {
          received_points: number;
          maximum_points: number;
          description: string;
        }
      >;
    };
    message: string;
  };
}

export type LoveCalculatorResult =
  | LoveCalculatorSimpleResult
  | LoveCalculatorAdvancedResult;

export interface LoveCalculatorSimpleData {
  p1Name: string;
  p1Gender: string;
  p2Name: string;
  p2Gender: string;
}

export interface LoveCalculatorResultProps {
  result: LoveCalculatorResult | null;
  t: any;
}

export interface SimpleFormProps {
  t: any;
  loading: boolean;
  simpleData: LoveCalculatorSimpleData;
  handleSimpleInputChange: (field: keyof LoveCalculatorSimpleData, value: string) => void;
  calculateSimpleLove: (e: React.FormEvent) => Promise<void>;
}
