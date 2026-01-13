import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Server,
  Layers,
  Bell,
  TrendingUp,
  Table2,
  Globe,
  GitBranch,
  Package,
  Settings
} from "lucide-react";

export default function ProjectVisualization() {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const blocks = {
    frontend: [
      { id: "home", name: "Home Page", icon: Layers, desc: "Основна страница със списък цени" },
      { id: "table", name: "PriceTable", icon: Table2, desc: "Таблица с цени на продукти" },
      { id: "chart", name: "PriceChart", icon: TrendingUp, desc: "Графика за ценова история" },
      { id: "alert", name: "PriceAlertDialog", icon: Bell, desc: "Известия за цени" },
    ],
    backend: [
      { id: "prices-router", name: "Prices Router", icon: Server, desc: "API за продукти и цени" },
      { id: "alerts-router", name: "Alerts Router", icon: Bell, desc: "API за известия" },
      { id: "scraper-router", name: "Scraper Router", icon: Globe, desc: "Web scraping система" },
    ],
    database: [
      { id: "dealers", name: "dealers", icon: Database, desc: "Продавачи (Top Gold, Tavex, iGold)" },
      { id: "products", name: "products", icon: Package, desc: "Продукти (злато, сребро)" },
      { id: "price-history", name: "price_history", icon: TrendingUp, desc: "Ценова история" },
      { id: "price-alerts", name: "price_alerts", icon: Bell, desc: "Потребителски известия" },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">GoldPrices - Архитектура</h1>
          <p className="text-muted-foreground text-lg">
            Система за проследяване на цени на благородни метали в България
          </p>
        </div>

        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="architecture">Архитектура</TabsTrigger>
            <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
            <TabsTrigger value="features">Функционалности</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-8 mt-8">
            <div className="grid gap-8">
              {/* Frontend Layer */}
              <Card className="border-2 border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-500" />
                    Frontend Layer (React + TypeScript)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {blocks.frontend.map((block) => {
                      const Icon = block.icon;
                      return (
                        <div
                          key={block.id}
                          onMouseEnter={() => setHoveredBlock(block.id)}
                          onMouseLeave={() => setHoveredBlock(null)}
                          className="p-4 border rounded-lg transition-all cursor-pointer hover:shadow-lg hover:scale-105 hover:border-blue-400"
                        >
                          <div className="flex flex-col items-center text-center gap-3">
                            <Icon className="h-8 w-8 text-blue-500" />
                            <div>
                              <div className="font-semibold text-sm">{block.name}</div>
                              {hoveredBlock === block.id && (
                                <div className="text-xs text-muted-foreground mt-2">
                                  {block.desc}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* API Layer */}
              <div className="flex justify-center">
                <div className="w-1 h-12 bg-gradient-to-b from-blue-200 to-green-200 dark:from-blue-900 dark:to-green-900" />
              </div>

              <Card className="border-2 border-green-200 dark:border-green-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-green-500" />
                    API Layer (tRPC + Express)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {blocks.backend.map((block) => {
                      const Icon = block.icon;
                      return (
                        <div
                          key={block.id}
                          onMouseEnter={() => setHoveredBlock(block.id)}
                          onMouseLeave={() => setHoveredBlock(null)}
                          className="p-4 border rounded-lg transition-all cursor-pointer hover:shadow-lg hover:scale-105 hover:border-green-400"
                        >
                          <div className="flex flex-col items-center text-center gap-3">
                            <Icon className="h-8 w-8 text-green-500" />
                            <div>
                              <div className="font-semibold text-sm">{block.name}</div>
                              {hoveredBlock === block.id && (
                                <div className="text-xs text-muted-foreground mt-2">
                                  {block.desc}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Database Layer */}
              <div className="flex justify-center">
                <div className="w-1 h-12 bg-gradient-to-b from-green-200 to-purple-200 dark:from-green-900 dark:to-purple-900" />
              </div>

              <Card className="border-2 border-purple-200 dark:border-purple-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-purple-500" />
                    Database Layer (PostgreSQL via Supabase)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {blocks.database.map((block) => {
                      const Icon = block.icon;
                      return (
                        <div
                          key={block.id}
                          onMouseEnter={() => setHoveredBlock(block.id)}
                          onMouseLeave={() => setHoveredBlock(null)}
                          className="p-4 border rounded-lg transition-all cursor-pointer hover:shadow-lg hover:scale-105 hover:border-purple-400"
                        >
                          <div className="flex flex-col items-center text-center gap-3">
                            <Icon className="h-8 w-8 text-purple-500" />
                            <div>
                              <div className="font-semibold text-sm">{block.name}</div>
                              {hoveredBlock === block.id && (
                                <div className="text-xs text-muted-foreground mt-2">
                                  {block.desc}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dataflow" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Поток на данни
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="flex-1 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                      <div className="font-semibold mb-1">Web Scraping</div>
                      <div className="text-sm text-muted-foreground">
                        Scraper извлича цени от топ дилъри (Top Gold, Tavex, iGold) чрез Puppeteer
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center font-bold">
                      2
                    </div>
                    <div className="flex-1 p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                      <div className="font-semibold mb-1">Запазване в БД</div>
                      <div className="text-sm text-muted-foreground">
                        Цените се записват в products и price_history таблиците
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="flex-1 p-4 border rounded-lg bg-purple-50 dark:bg-purple-950">
                      <div className="font-semibold mb-1">API заявка</div>
                      <div className="text-sm text-muted-foreground">
                        Frontend прави tRPC заявка към prices.getAll endpoint
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center font-bold">
                      4
                    </div>
                    <div className="flex-1 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                      <div className="font-semibold mb-1">Визуализация</div>
                      <div className="text-sm text-muted-foreground">
                        PriceTable показва данните с възможност за сортиране и филтриране
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center font-bold">
                      5
                    </div>
                    <div className="flex-1 p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                      <div className="font-semibold mb-1">Известия</div>
                      <div className="text-sm text-muted-foreground">
                        При промяна на цена се проверяват активни алерти и се изпращат email известия
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Реализирани функционалности</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="default" className="mt-0.5">✓</Badge>
                    <div>
                      <div className="font-semibold">Таблица с цени</div>
                      <div className="text-sm text-muted-foreground">
                        Показване на цени от множество дилъри с филтриране по тип метал
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="default" className="mt-0.5">✓</Badge>
                    <div>
                      <div className="font-semibold">Автоматично обновяване</div>
                      <div className="text-sm text-muted-foreground">
                        Web scraping на цени на всеки 6 часа или при ръчно обновяване
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="default" className="mt-0.5">✓</Badge>
                    <div>
                      <div className="font-semibold">Сравнение на цени</div>
                      <div className="text-sm text-muted-foreground">
                        Цена на грам за лесно сравнение между продукти
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="default" className="mt-0.5">✓</Badge>
                    <div>
                      <div className="font-semibold">Price Alerts</div>
                      <div className="text-sm text-muted-foreground">
                        Email известия при достигане на целева цена
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Технологичен стек</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-semibold">Frontend</div>
                      <div className="text-sm text-muted-foreground">
                        React, TypeScript, TailwindCSS, Shadcn/ui
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-semibold">Backend</div>
                      <div className="text-sm text-muted-foreground">
                        tRPC, Express, Node.js
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-semibold">База данни</div>
                      <div className="text-sm text-muted-foreground">
                        PostgreSQL (Supabase), Drizzle ORM
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-semibold">Web Scraping</div>
                      <div className="text-sm text-muted-foreground">
                        Puppeteer, Cheerio, Node-cron
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="border-2 border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
              <TrendingUp className="h-5 w-5" />
              Основна цел на проекта
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-900 dark:text-yellow-100">
              Платформата позволява на инвеститорите в благородни метали да проследяват и сравняват цени
              от различни български дилъри в реално време, като получават автоматични известия при
              достигане на желани ценови нива.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
