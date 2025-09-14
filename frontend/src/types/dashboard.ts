export interface DashboardData {
  gridStatus: {
    totalLoad: number;
    totalSupply: number;
    stability: string;
    efficiency: number;
  };
  households: {
    id: string;
    name: string;
    generation: number;
    consumption: number;
    storage: number;
    status: string;
  }[];
  trading: {
    activeTrades: number;
    totalVolume: number;
    averagePrice: number;
    revenue: number;
  };
}

export interface Tab {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ComponentProps {
  data: DashboardData | null;
}
