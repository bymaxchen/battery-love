'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";

interface CustomerStats {
  customerCode: string;
  customerName: string;
  totalSales: number;
  totalPayments: number;
  totalShipments: number;
  balance: number;
}

interface SummaryTableProps {
  dateRange: DateRange | undefined;
}

export function SummaryTable({ dateRange }: SummaryTableProps) {
  const [stats, setStats] = useState<CustomerStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchStats();
    }
  }, [dateRange]);

  const fetchStats = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/statistics?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`
      );
      const data = await response.json();
      if (data.success) {
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>客户代码</TableHead>
            <TableHead>客户名称</TableHead>
            <TableHead className="text-right">总销售额</TableHead>
            <TableHead className="text-right">总收款</TableHead>
            <TableHead className="text-right">总出货</TableHead>
            <TableHead className="text-right">应收款结余</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                加载中...
              </TableCell>
            </TableRow>
          ) : stats.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            stats.map((stat) => (
              <TableRow key={stat.customerCode}>
                <TableCell>{stat.customerCode}</TableCell>
                <TableCell>{stat.customerName}</TableCell>
                <TableCell className="text-right">
                  {stat.totalSales.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {stat.totalPayments.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {stat.totalShipments.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {stat.balance.toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 