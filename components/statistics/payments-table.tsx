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

interface PaymentRecord {
  _id: string;
  customerCode: string;
  customer: {
    name: string;
  };
  amount: number;
  date: string;
}

interface PaymentsTableProps {
  dateRange: DateRange | undefined;
}

export function PaymentsTable({ dateRange }: PaymentsTableProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchPayments();
    }
  }, [dateRange]);

  const fetchPayments = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/payments?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`
      );
      const data = await response.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('获取收款记录失败:', error);
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
            <TableHead className="text-right">收款金额</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                加载中...
              </TableCell>
            </TableRow>
          ) : payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                <TableCell>{payment.customerCode}</TableCell>
                <TableCell>{payment.customer.name}</TableCell>
                <TableCell className="text-right">
                  {payment.amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 