
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { toast } = useToast();

  const handleUpgrade = () => {
    // In a real app, this would redirect to a payment page (e.g., Stripe Checkout)
    // For this simulation, we'll just show a toast.
    toast({
      title: "Función en desarrollo",
      description: "La pasarela de pago se implementará próximamente.",
    });
    onClose();
  };
  
  const features = [
    "Mensajería directa con vendedores",
    "Acceso prioritario a nuevos listados",
    "Soporte premium al cliente"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Star className="h-8 w-8 text-primary" />
            </div>
          <DialogTitle className="text-2xl font-headline">Actualiza a VENDRA Pro</DialogTitle>
          <DialogDescription className="text-md">
            Desbloquea la comunicación directa con los vendedores y más funciones exclusivas.
          </DialogDescription>
        </DialogHeader>
        <div className="my-6">
            <ul className="space-y-3">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button type="button" size="lg" onClick={handleUpgrade} className="w-full">
            Actualizar a Pro - $3.99/mes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
