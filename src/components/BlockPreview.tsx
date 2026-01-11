import { useState } from "react";
import { ShoppingBag, Heart, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import type { Block } from "@/shared/types";
import { contactService } from "@/features/bio-page/services/contactService";

// Type definitions for block data
interface EcommerceData {
  url: string;
  image: string;
  title: string;
  price: string;
  platform: string;
}

interface DonateData {
  title: string;
  method: 'vietqr' | 'momo' | 'zalopay';
  qrImage?: string;
  paymentLink?: string;
}

interface ContactData {
  title: string;
  receiverEmail: string;
}

interface ChatData {
  title?: string;
  phoneNumber: string;
  message?: string;
}

interface BlockPreviewProps {
  block: Block;
  buttonStyle: any;
  fontFamily: string;
  onBlockClick?: (blockId: string) => void;
}

export default function BlockPreview({
  block,
  buttonStyle,
  fontFamily,
  onBlockClick,
}: BlockPreviewProps) {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact form states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using contactService
    const validation = contactService.validateForm({
      name: contactName,
      email: contactEmail,
      message: contactMessage,
    });

    if (!validation.isValid && validation.errors) {
      // Show first error
      const firstError = validation.errors.name || validation.errors.email || validation.errors.message;
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Send message using contactService (real API)
      const result = await contactService.sendMessage(
        {
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        },
        block.data.receiverEmail as string
      );

      if (result.success) {
        // Clear form
        setContactName("");
        setContactEmail("");
        setContactMessage("");

        // Show success message
        setShowSuccessMessage(true);
        toast.success("Message sent successfully!");

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
          setShowContactModal(false);
        }, 3000);
      } else {
        toast.error(result.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("[BlockPreview] Contact submit error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonateClick = () => {
    // Track click
    onBlockClick?.(block.id);
    
    const donateData = block.data as unknown as DonateData;

    if (donateData.method === "vietqr") {
      // Show modal with QR code
      setShowDonateModal(true);
    } else {
      // Open payment link (Momo or ZaloPay)
      window.open(donateData.paymentLink, "_blank");
    }
  };

  switch (block.type) {
    case "ecommerce": {
      const ecommerceData = block.data as unknown as EcommerceData;
      return (
        <a
          href={ecommerceData.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onBlockClick?.(block.id)}
          className="w-full px-6 py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
          style={{
            ...buttonStyle,
            fontFamily,
          }}
        >
          <img
            src={ecommerceData.image}
            alt={ecommerceData.title}
            className="w-5 h-5 rounded object-cover flex-shrink-0"
          />
          <span style={{ color: buttonStyle.color }}>{ecommerceData.title}</span>
        </a>
      );
    }

    case "donate": {
      const donateData = block.data as unknown as DonateData;
      return (
        <>
          <button
            onClick={handleDonateClick}
            className="w-full px-6 py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
            style={{
              ...buttonStyle,
              fontFamily,
            }}
          >
            <Heart className="w-5 h-5" style={{ color: buttonStyle.color }} />
            <span style={{ color: buttonStyle.color }}>{donateData.title}</span>
          </button>

          {/* QR Code Modal for VietQR */}
          <Dialog open={showDonateModal} onOpenChange={setShowDonateModal}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>{donateData.title}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-center text-sm text-[#676b5f] mb-4">
                  Scan the QR code below to support
                </p>
                {donateData.qrImage && (
                  <div className="flex justify-center">
                    <img
                      src={donateData.qrImage}
                      alt="Payment QR Code"
                      className="w-64 h-64 object-contain rounded-lg border-2 border-[#e0e2d9]"
                    />
                  </div>
                )}
                <p className="text-center text-xs text-[#676b5f] mt-4">
                  Use your banking app to scan and complete payment
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    case "contact": {
      const contactData = block.data as unknown as ContactData;
      return (
        <>
          <button
            onClick={() => {
              onBlockClick?.(block.id);
              setShowContactModal(true);
            }}
            className="w-full px-6 py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
            style={{
              ...buttonStyle,
              fontFamily,
            }}
          >
            <Mail className="w-5 h-5" style={{ color: buttonStyle.color }} />
            <span style={{ color: buttonStyle.color }}>{contactData.title}</span>
          </button>

          {/* Contact Form Modal */}
          <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{contactData.title}</DialogTitle>
              </DialogHeader>

              {showSuccessMessage ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg text-black mb-2">Message Sent!</h3>
                  <p className="text-[#676b5f]">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="visitor-name">Name</Label>
                    <Input
                      id="visitor-name"
                      type="text"
                      placeholder="Your name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitor-email">Email *</Label>
                    <Input
                      id="visitor-email"
                      type="email"
                      placeholder="your@email.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitor-message">Message *</Label>
                    <Textarea
                      id="visitor-message"
                      placeholder="Your message..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      disabled={isSubmitting}
                      required
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowContactModal(false)}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#8129d9] hover:bg-[#6920b0] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </>
      );
    }

    case "chat": {
      const chatData = block.data as unknown as ChatData;
      return (
        <a
          href={`https://zalo.me/${chatData.phoneNumber}?text=${encodeURIComponent(chatData.message || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onBlockClick?.(block.id)}
          className="w-full px-6 py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
          style={{
            ...buttonStyle,
            fontFamily,
          }}
        >
          {/* Zalo Logo SVG */}
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.477 2 2 6.145 2 11.243c0 2.854 1.434 5.408 3.678 7.113L5 22l4.084-2.042c.928.259 1.915.399 2.916.399 5.523 0 10-4.145 10-9.243S17.523 2 12 2z"
              fill={buttonStyle.color}
            />
            <path
              d="M8.5 9.5h7M8.5 12.5h5.5M8.5 15.5h7"
              stroke={buttonStyle.backgroundColor || "#fff"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ color: buttonStyle.color }}>
            {chatData.title || "Chat on Zalo"}
          </span>
        </a>
      );
    }

    default:
      return null;
  }
}
