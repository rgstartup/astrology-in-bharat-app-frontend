export interface IPlatformStat {
  clients: number;
  verified_experts: number;
  successful_orders: number;
  chat_sessions: number;
}

export interface IPlatformStatsResponse {
  success: boolean;
  data: IPlatformStat;
}
