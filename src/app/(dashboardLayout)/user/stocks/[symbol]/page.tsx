import type { Metadata } from "next";
import StockDetailView from "@/components/user/StockDetailView";

interface Props {
  params: { symbol: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const sym = params.symbol.toUpperCase();
  return {
    title: `${sym} Stock Analysis & AI Insights | StockSense AI`,
    description: `Real-time AI price analysis, trading signals, and interactive chart for ${sym}.`,
  };
}

export default function StockDetailPage({ params }: Props) {
  return <StockDetailView initialSymbol={params.symbol} />;
}
