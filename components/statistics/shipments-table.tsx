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

interface ShipmentRecord {
  _id: string;
  customerCode: string;
  customer: {
    name: string;
  };
  quantity: number;
  date: string;
}

interface ShipmentsTableProps {
  dateRange: DateRange | undefined;
}

export function ShipmentsTable({ dateRange }: ShipmentsTableProps) {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchShipments();
    }
  }, [dateRange]);

  const fetchShipments = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/shipments?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`
      );
      const data = await response.json();
      if (data.success) {
        setShipments(data.shipments);
      }
    } catch (error) {
      console.error('获取出货记录失败:', error);
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
            <TableHead className="text-right">出货数量</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                加载中...
              </TableCell>
            </TableRow>
          ) : shipments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            shipments.map((shipment) => (
              <TableRow key={shipment._id}>
                <TableCell>{new Date(shipment.date).toLocaleDateString()}</TableCell>
                <TableCell>{shipment.customerCode}</TableCell>
                <TableCell>{shipment.customer.name}</TableCell>
                <TableCell className="text-right">
                  {shipment.quantity.toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 