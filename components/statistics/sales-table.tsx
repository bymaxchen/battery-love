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

interface SalesRecord {
  _id: string;
  customerCode: string;
  customer: {
    name: string;
  };
  quantity: number;
  price: number;
  total: number;
  date: string;
}

interface SalesTableProps {
  dateRange: DateRange | undefined;
}

export function SalesTable({ dateRange }: SalesTableProps) {
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchSales();
    }
  }, [dateRange]);

  const fetchSales = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/sales?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`
      );
      const data = await response.json();
      if (data.success) {
        setSales(data.sales);
      }
    } catch (error) {
      console.error('获取销售记录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日期</TableHead>
            <TableHead>客户代码</TableHead>
            <TableHead>客户名称</TableHead>
            <TableHead className="text-right">数量</TableHead>
            <TableHead className="text-right">单价</TableHead>
            <TableHead className="text-right">总金额</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                加载中...
              </TableCell>
            </TableRow>
          ) : sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale._id}>
                <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                <TableCell>{sale.customerCode}</TableCell>
                <TableCell>{sale.customer.name}</TableCell>
                <TableCell className="text-right">
                  {sale.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {sale.price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {sale.total.toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 