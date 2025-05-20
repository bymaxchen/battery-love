import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Sales");
    
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json(
        { success: false, message: '缺少日期参数' },
        { status: 400 }
      );
    }

    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);
    startDate.setHours(0, 0, 0, 0);

    // 获取所有客户
    const customers = await db.collection("Customers").find({}).toArray();

    // 获取时间范围内的销售记录
    const sales = await db.collection("Sales")
      .find({
        date: {
          $gte: startDate,
          $lte: endDate,
        }
      })
      .toArray();

    // 获取时间范围内的收款记录
    const payments = await db.collection("Payments")
      .find({
        date: {
          $gte: startDate,
          $lte: endDate,
        }
      })
      .toArray();

    // 获取时间范围内的出货记录
    const shipments = await db.collection("Shipments")
      .find({
        date: {
          $gte: startDate,
          $lte: endDate,
        }
      })
      .toArray();

    // 计算每个客户的统计数据
    const statistics = customers.map(customer => {
      const customerSales = sales.filter(sale => sale.customerCode === customer.code);
      const customerPayments = payments.filter(payment => payment.customerCode === customer.code);
      const customerShipments = shipments.filter(shipment => shipment.customerCode === customer.code);

      const totalSales = customerSales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);
      const totalPayments = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalShipments = customerShipments.reduce((sum, shipment) => sum + shipment.quantity, 0);

      return {
        customerCode: customer.code,
        customerName: customer.name,
        totalSales,
        totalPayments,
        balance: totalSales - totalPayments,
        totalShipments,
      };
    });

    return NextResponse.json({
      success: true,
      statistics,
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json(
      { success: false, message: '获取统计数据失败' },
      { status: 500 }
    );
  }
} 