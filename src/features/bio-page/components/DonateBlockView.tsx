// =============================================================================
// DONATE BLOCK PUBLIC VIEW COMPONENT
// =============================================================================
// Displays donate button and handles QR modal / payment link

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { DonateBlockData } from '@/shared/types/donate';

interface DonateBlockViewProps {
  data: DonateBlockData;
  onClick?: () => void;
  buttonStyle?: 'rounded' | 'square' | 'pill';
  buttonColor?: string;
  buttonTextColor?: string;
  buttonShadow?: boolean;
}

export default function DonateBlockView({
  data,
  onClick,
  buttonStyle = 'rounded',
  buttonColor = '#8129d9',
  buttonTextColor = '#ffffff',
  buttonShadow = false,
}: DonateBlockViewProps) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleClick = () => {
    // Track click
    onClick?.();

    if (data.method === 'vietqr' && data.qrImage) {
      // Open QR modal
      setIsQRModalOpen(true);
    } else if (data.paymentLink) {
      // Open payment link in new tab
      window.open(data.paymentLink, '_blank', 'noopener,noreferrer');
    }
  };

  const getButtonRadius = () => {
    switch (buttonStyle) {
      case 'square': return 'rounded-none';
      case 'pill': return 'rounded-full';
      default: return 'rounded-lg';
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`w-full p-4 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] ${getButtonRadius()}`}
        style={{
          backgroundColor: buttonColor,
          color: buttonTextColor,
          boxShadow: buttonShadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        <Heart className="w-5 h-5" />
        <span className="font-medium">{data.title}</span>
      </button>

      {/* QR Code Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{data.title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {data.qrImage && (
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img
                  src={data.qrImage}
                  alt="QR Code for payment"
                  className="w-64 h-64 object-contain"
                />
              </div>
            )}
            <p className="text-sm text-gray-500 text-center">
              Scan this QR code to make a donation
            </p>
            <Button
              variant="outline"
              onClick={() => setIsQRModalOpen(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
