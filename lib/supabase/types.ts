export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type SjcDailyPricePayloadItem = {
  Id: number;
  Buy: string;
  Sell: string;
  BuyValue: number;
  TypeName: string;
  BuyDiffer: string | null;
  GroupDate: string;
  SellValue: number;
  BranchName: string;
  SellDiffer: string | null;
  BuyDifferValue: number;
  SellDifferValue: number;
};

export type SjcDailyPricePayload = {
  data: SjcDailyPricePayloadItem[];
  success: boolean;
  latestDate: string;
};

export type Database = {
  public: {
    Tables: {
      sjc_daily_prices: {
        Row: {
          id: string;
          data: Json;
          latest_day: string | null;
          created_at?: string | null;
        };
        Insert: {
          id?: string;
          data: Json;
          latest_day?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          data?: Json;
          latest_day?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
