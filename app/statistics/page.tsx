'use client';

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SalesTable } from "@/components/statistics/sales-table";
import { PaymentsTable } from "@/components/statistics/payments-table";
import { ShipmentsTable } from "@/components/statistics/shipments-table";
import { SummaryTable } from "@/components/statistics/summary-table";
import { exportToExcel } from "@/lib/export-utils";

export default function StatisticsPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [activeTab, setActiveTab] = React.useState('statistics');

  const handleExport = async () => {
    if (!date?.from || !date?.to) return;

    try {
      const response = await fetch(
        `/api/${activeTab}?from=${date.from.toISOString()}&to=${date.to.toISOString()}`
      );
      const data = await response.json();

      console.log("data", data);
      
      if (data.success) {
        const exportConfig = {
          sales: {
            filename: '销售记录',
            headers: ['日期', '客户代码', '客户名称', '数量', '单价', '总金额'],
            columnKeys: ['date', 'customerCode', 'customer', 'quantity', 'price', 'total'],
          },
          payments: {
            filename: '收款记录',
            headers: ['日期', '客户代码', '客户名称', '收款金额'],
            columnKeys: ['date', 'customerCode', 'customer', 'amount'],
          },
          shipments: {
            filename: '出货记录',
            headers: ['日期', '客户代码', '客户名称', '出货数量'],
            columnKeys: ['date', 'customerCode', 'customer', 'quantity'],
          },
          statistics: {
            filename: '汇总统计',
            headers: ['客户代码', '客户名称', '总销售额', '总收款', '总出货', '应收货款结余'],
            columnKeys: ['customerCode', 'customerName', 'totalSales', 'totalPayments', 'totalShipments', 'balance'],
          },
        };

        const config = exportConfig[activeTab as keyof typeof exportConfig];

        exportToExcel({
          filename: config.filename,
          headers: config.headers,
          data: data[activeTab] || data.statistics,
          columnKeys: config.columnKeys,
        });
      }
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  return (
    <main className="min-h-[100dvh] p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">销售统计</h1>
        
        <div className="mb-6 flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "yyyy年MM月dd日")} -{" "}
                      {format(date.to, "yyyy年MM月dd日")}
                    </>
                  ) : (
                    format(date.from, "yyyy年MM月dd日")
                  )
                ) : (
                  <span>选择日期范围</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="statistics" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="statistics">统计汇总</TabsTrigger>
            <TabsTrigger value="sales">销售记录</TabsTrigger>
            <TabsTrigger value="payments">收款记录</TabsTrigger>
            <TabsTrigger value="shipments">出货记录</TabsTrigger>
          </TabsList>
          <TabsContent value="statistics">
            <SummaryTable dateRange={date} />
          </TabsContent>
          <TabsContent value="sales">
            <SalesTable dateRange={date} />
          </TabsContent>
          <TabsContent value="payments">
            <PaymentsTable dateRange={date} />
          </TabsContent>
          <TabsContent value="shipments">
            <ShipmentsTable dateRange={date} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
} 