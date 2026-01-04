import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { PriceTable } from "@/components/PriceTable";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Product {
  id: number;
  dealerId: number;
  name: string;
  type: "gold" | "silver";
  weightGrams: number;
  priceEur: number;
  url: string;
  status: string;
  dealerName: string;
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [autoUpdateTriggered, setAutoUpdateTriggered] = useState(false);
  const [scrapingStatus, setScrapingStatus] = useState<string>("");
  const [showProgress, setShowProgress] = useState(false);

  // Fetch all products
  const { data: products = [], isLoading, refetch } = trpc.prices.getAll.useQuery();

  // Get last update time from server
  const { data: lastUpdateInfo } = trpc.prices.getLastUpdateTime.useQuery();

  // Scraper mutation
  const updatePricesMutation = trpc.scraper.updatePrices.useMutation();

  const handleRefresh = useCallback(async () => {
    try {
      setShowProgress(true);
      setScrapingStatus("Стартиране на обновяване...");
      
      // Simulate progress updates
      setTimeout(() => setScrapingStatus("Извличане на цени от Top Gold..."), 500);
      setTimeout(() => setScrapingStatus("Извличане на цени от Tavex..."), 6000);
      setTimeout(() => setScrapingStatus("Извличане на цени от iGold..."), 12000);
      
      const result = await updatePricesMutation.mutateAsync();
      
      // Wait for refetch to complete
      await refetch();
      
      // Update last updated time
      const now = new Date();
      setLastUpdated(
        now.toLocaleString("bg-BG", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      
      setShowProgress(false);
      setScrapingStatus("");
      
      if (result.success) {
        toast.success(`✅ Цените са обновени успешно!\n📊 Обновени продукти: ${result.updated}\n⏱️ Време: ${new Date().toLocaleTimeString("bg-BG")}`, {
          duration: 5000,
        });
      } else {
        toast.error(`Грешка при обновяване: ${result.message}`, {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error refreshing prices:", error);
      setShowProgress(false);
      setScrapingStatus("");
      toast.error("Грешка при обновяване на цените", {
        duration: 5000,
      });
    }
  }, [updatePricesMutation, refetch]);

  // Process products with dealer names - memoized to prevent infinite loops
  const displayData = useMemo(() => {
    if (products && Array.isArray(products)) {
      return (products as any[]).map((product: any) => ({
        id: product.id,
        dealerId: product.dealerId,
        name: product.name,
        url: product.url,
        priceEur: product.priceEur ? product.priceEur / 100 : 0,
        weightGrams: product.weightGrams,
        dealerName: product.dealerName || "Unknown",
        type: product.type,
        status: product.status,
      }));
    }
    return [];
  }, [products]);

  // Set initial last updated time - only once when data is loaded
  useEffect(() => {
    if (!lastUpdated && displayData.length > 0) {
      const now = new Date();
      setLastUpdated(
        now.toLocaleString("bg-BG", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  }, [displayData.length, lastUpdated]);

  // Auto-update prices if last update was more than 6 hours ago
  useEffect(() => {
    if (!autoUpdateTriggered && lastUpdateInfo && !updatePricesMutation.isPending) {
      const lastUpdate = new Date(lastUpdateInfo.lastUpdated);
      const now = new Date();
      const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
      
      // If more than 6 hours since last update, trigger automatic scraping
      if (hoursSinceUpdate > 6) {
        console.log(`Last update was ${hoursSinceUpdate.toFixed(1)} hours ago. Triggering automatic update...`);
        setAutoUpdateTriggered(true);
        handleRefresh().catch(err => console.error('Auto-update failed:', err));
      }
    }
  }, [autoUpdateTriggered, lastUpdateInfo, updatePricesMutation.isPending, handleRefresh]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10">
      <div className="container max-w-7xl py-12 md:py-20">
        <header className="mb-12 space-y-4">
          <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Precious Metals Tracker
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Ежедневни цени на инвестиционно злато и сребро от водещи дилъри в България
          </p>
        </header>

        <main>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">⏳</div>
              <p className="mt-4 text-muted-foreground">Зареждане на цени...</p>
            </div>
          ) : (
            <>
              {showProgress && (
                <div className="mb-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-600 dark:text-yellow-400">
                        {scrapingStatus}
                      </p>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-yellow-500/20">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 animate-pulse" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <PriceTable
                data={displayData}
                lastUpdated={lastUpdated}
                onRefresh={handleRefresh}
                isLoading={updatePricesMutation.isPending}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
