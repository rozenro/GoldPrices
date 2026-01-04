import { useState, useMemo } from "react";
import { ArrowUpDown, ExternalLink, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { PriceAlertDialog } from "@/components/PriceAlertDialog";

interface Product {
  id: number;
  name: string;
  url: string;
  priceEur: number;
  weightGrams: number;
  dealerName: string;
  type: "gold" | "silver";
}

interface PriceTableProps {
  data: Product[];
  lastUpdated: string;
  onRefresh: () => void;
  isLoading?: boolean;
}

// Fixed exchange rate BGN to EUR (approximately 1.96 BGN = 1 EUR)
const BGN_TO_EUR = 1.96;

export function PriceTable({ data, lastUpdated, onRefresh, isLoading }: PriceTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | 'pricePerGram';
    direction: "asc" | "desc";
  } | null>(null);

  // Convert BGN to EUR
  const convertToEur = (priceBgn: number) => {
    return Math.round((priceBgn / BGN_TO_EUR) * 100) / 100;
  };

  // Separate gold and silver
  const goldProducts = useMemo(() => data.filter((p) => p.type === "gold"), [data]);
  const silverProducts = useMemo(() => data.filter((p) => p.type === "silver"), [data]);

  // Sort function
  const sortProducts = (products: Product[]) => {
    if (!sortConfig) {
      return products.sort((a, b) => {
        const pricePerGramA = a.priceEur / a.weightGrams;
        const pricePerGramB = b.priceEur / b.weightGrams;
        return pricePerGramA - pricePerGramB;
      });
    }

    return [...products].sort((a, b) => {
      let aValue: number, bValue: number;
      
      // Special handling for pricePerGram sorting
      if (sortConfig.key === 'pricePerGram') {
        aValue = a.priceEur / a.weightGrams;
        bValue = b.priceEur / b.weightGrams;
      } else {
        aValue = a[sortConfig.key as keyof Product] as number;
        bValue = b[sortConfig.key as keyof Product] as number;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (key: keyof Product | 'pricePerGram') => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderProductTable = (products: Product[], title: string) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-primary">{title}</h2>
      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">Продавач</TableHead>
              <TableHead className="min-w-[300px]">Продукт</TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("priceEur")}
                  className="h-8 px-2 hover:bg-transparent font-semibold"
                >
                  Цена (EUR)
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("pricePerGram" as any)}
                  className="h-8 px-2 hover:bg-transparent font-semibold"
                >
                  Цена/грам (EUR)
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right w-[80px]">Alert</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortProducts(products).map((product, index) => {
              const priceEur = product.priceEur;
              const pricePerGramEur = product.priceEur / product.weightGrams;

              return (
                <TableRow key={index} className="group hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-none font-normal border-0 px-2 py-0.5 bg-slate-50 text-slate-700 ring-1 ring-slate-600/20"
                    >
                      {product.dealerName}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline decoration-blue-300 underline-offset-4"
                    >
                      {product.name}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </a>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-sm">
                    <div className="font-semibold">{priceEur.toFixed(2)} €</div>
                    <div className="text-xs text-muted-foreground">({product.weightGrams}g)</div>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums font-semibold">
                    {pricePerGramEur.toFixed(2)} €
                  </TableCell>
                  <TableCell className="text-right">
                    <PriceAlertDialog
                      productId={product.id}
                      productName={product.name}
                      currentPrice={priceEur}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0 flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Пазарни цени</CardTitle>
          <p className="text-sm text-muted-foreground">Последно обновяване: {lastUpdated}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-8 gap-2 border-border hover:bg-accent"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Обнови</span>
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        {goldProducts.length > 0 && renderProductTable(goldProducts, "Злато")}
        {silverProducts.length > 0 && renderProductTable(silverProducts, "Сребро")}
        {data.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Няма налични продукти</div>
        )}
      </CardContent>
    </Card>
  );
}
