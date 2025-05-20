'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import toast, { Toaster } from 'react-hot-toast'

interface Customer {
  code: string;
  name: string;
  shortName: string;
  storeName: string;
  region: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('获取客户列表失败', {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const newCustomer = {
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      shortName: formData.get('shortName') as string,
      storeName: formData.get('storeName') as string,
      region: formData.get('region') as string,
    };

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('客户创建成功', {
          duration: 4000,
          position: 'top-right',
        });
        setIsCreateDialogOpen(false);
        fetchCustomers();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('创建客户失败', {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  const handleUpdateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCustomer) return;

    const formData = new FormData(event.currentTarget);
    
    const updatedCustomer = {
      code: editingCustomer.code, // Keep the original code
      name: formData.get('update-name') as string,
      shortName: formData.get('update-shortName') as string,
      storeName: formData.get('update-storeName') as string,
      region: formData.get('update-region') as string,
    };

    try {
      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCustomer),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('客户信息更新成功', {
          duration: 4000,
          position: 'top-right',
        });
        setIsUpdateDialogOpen(false);
        fetchCustomers();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('更新客户信息失败', {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">客户管理</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              新建客户
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateSubmit}>
              <DialogHeader>
                <DialogTitle>新建客户</DialogTitle>
                <DialogDescription>
                  请填写客户信息。点击保存完成创建。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    代码
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="F-Kxxx"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    名称
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="客户名称"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shortName" className="text-right">
                    简称
                  </Label>
                  <Input
                    id="shortName"
                    name="shortName"
                    placeholder="客户简称"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="storeName" className="text-right">
                    店名
                  </Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    placeholder="店铺名称"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="region" className="text-right">
                    地区
                  </Label>
                  <Input
                    id="region"
                    name="region"
                    placeholder="所在地区"
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">保存</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>代码</TableHead>
            <TableHead>名称</TableHead>
            <TableHead>简称</TableHead>
            <TableHead>店名</TableHead>
            <TableHead>地区</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.code}>
              <TableCell>{customer.code}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.shortName}</TableCell>
              <TableCell>{customer.storeName}</TableCell>
              <TableCell>{customer.region}</TableCell>
              <TableCell className="text-right">
                <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingCustomer(customer)}
                    >
                      更新
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleUpdateSubmit}>
                      <DialogHeader>
                        <DialogTitle>更新客户信息</DialogTitle>
                        <DialogDescription>
                          修改客户信息。点击保存完成更新。
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="update-code" className="text-right">
                            代码
                          </Label>
                          <Input
                            id="update-code"
                            defaultValue={editingCustomer?.code}
                            className="col-span-3"
                            disabled
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="update-name" className="text-right">
                            名称
                          </Label>
                          <Input
                            id="update-name"
                            name="update-name"
                            defaultValue={editingCustomer?.name}
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="update-shortName" className="text-right">
                            简称
                          </Label>
                          <Input
                            id="update-shortName"
                            name="update-shortName"
                            defaultValue={editingCustomer?.shortName}
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="update-storeName" className="text-right">
                            店名
                          </Label>
                          <Input
                            id="update-storeName"
                            name="update-storeName"
                            defaultValue={editingCustomer?.storeName}
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="update-region" className="text-right">
                            地区
                          </Label>
                          <Input
                            id="update-region"
                            name="update-region"
                            defaultValue={editingCustomer?.region}
                            className="col-span-3"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">保存更改</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 