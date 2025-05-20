import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Sales");
    
    const body = await request.json();
    const { customerCode, amount, date } = body;

    // 验证必填字段
    if (!customerCode || !amount || !date) {
      return NextResponse.json(
        { success: false, message: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 创建收款记录
    const payment = {
      customerCode,
      amount: parseFloat(amount),
      date: new Date(date),
      createdAt: new Date(),
    };

    const result = await db.collection("Payments").insertOne(payment);
    
    return NextResponse.json({
      success: true,
      message: '收款记录创建成功',
      payment: { ...payment, _id: result.insertedId }
    });
  } catch (error) {
    console.error('创建收款记录失败:', error);
    return NextResponse.json(
      { success: false, message: '创建收款记录失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Sales");
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const customerCode = searchParams.get('customerCode');

    // 构建查询条件
    const query: Record<string, any> = {};
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }
    if (customerCode) {
      query.customerCode = customerCode;
    }

    // 获取收款记录
    const payments = await db.collection("Payments")
      .find(query)
      .sort({ date: -1 })
      .toArray();

    // 获取关联的客户信息
    const customerCodes = [...new Set(payments.map(payment => payment.customerCode))];
    const customers = await db.collection("Customers")
      .find({ code: { $in: customerCodes } })
      .toArray();

    // 将客户信息添加到收款记录中
    const paymentsWithCustomers = payments.map(payment => ({
      ...payment,
      customer: customers.find(c => c.code === payment.customerCode)
    }));

    return NextResponse.json({
      success: true,
      payments: paymentsWithCustomers,
    });
  } catch (error) {
    console.error('获取收款记录失败:', error);
    return NextResponse.json(
      { success: false, message: '获取收款记录失败' },
      { status: 500 }
    );
  }
} 