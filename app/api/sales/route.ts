import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Sales");
    
    const body = await request.json();
    const { customerCode, quantity, price, total, date } = body;

    // 验证必填字段
    if (!customerCode || !quantity || !price || !date) {
      return NextResponse.json(
        { success: false, message: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 创建销售记录
    const sale = {
      customerCode,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      total: parseFloat(total),
      date: new Date(date),
      createdAt: new Date(),
    };

    const result = await db.collection("Sales").insertOne(sale);
    
    return NextResponse.json({
      success: true,
      message: '销售记录创建成功',
      sale: { ...sale, _id: result.insertedId }
    });
  } catch (error) {
    console.error('创建销售记录失败:', error);
    return NextResponse.json(
      { success: false, message: '创建销售记录失败' },
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

    // 获取销售记录
    const sales = await db.collection("Sales")
      .find(query)
      .sort({ date: -1 })
      .toArray();

    // 获取关联的客户信息
    const customerCodes = [...new Set(sales.map(sale => sale.customerCode))];
    const customers = await db.collection("Customers")
      .find({ code: { $in: customerCodes } })
      .toArray();

    // 将客户信息添加到销售记录中
    const salesWithCustomers = sales.map(sale => ({
      ...sale,
      customer: customers.find(c => c.code === sale.customerCode)
    }));

    return NextResponse.json({
      success: true,
      sales: salesWithCustomers,
    });
  } catch (error) {
    console.error('获取销售记录失败:', error);
    return NextResponse.json(
      { success: false, message: '获取销售记录失败' },
      { status: 500 }
    );
  }
} 