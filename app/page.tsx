'use client';

import { Button } from "@/components/ui/button";
import { SalesForm } from "@/components/sales-form";
import { PaymentForm } from "@/components/payment-form";
import { ShipmentForm } from "@/components/shipment-form";
import { useState } from "react";

export default function Home() {
  const [isSalesFormOpen, setIsSalesFormOpen] = useState(false);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [isShipmentFormOpen, setIsShipmentFormOpen] = useState(false);

  return (
    <main className="min-h-[100dvh] flex flex-col items-center p-4">
      <div className="flex flex-col gap-4 w-full max-w-sm mt-8">
        <Button 
          size="lg" 
          className="h-16 text-lg"
          onClick={() => setIsSalesFormOpen(true)}
        >
          销售
        </Button>
        <Button 
          size="lg"
          className="h-16 text-lg"
          onClick={() => setIsPaymentFormOpen(true)}
        >
          收款
        </Button>
        <Button 
          size="lg" 
          className="h-16 text-lg"
          onClick={() => setIsShipmentFormOpen(true)}
        >
          出货
        </Button>
        <Button 
          variant="outline"
          size="lg" 
          className="h-16 text-lg"
        >
          退货
        </Button>
      </div>
      <SalesForm 
        isOpen={isSalesFormOpen} 
        onOpenChange={setIsSalesFormOpen} 
      />
      <PaymentForm
        isOpen={isPaymentFormOpen}
        onOpenChange={setIsPaymentFormOpen}
      />
      <ShipmentForm
        isOpen={isShipmentFormOpen}
        onOpenChange={setIsShipmentFormOpen}
      />
    </main>
  );
}
