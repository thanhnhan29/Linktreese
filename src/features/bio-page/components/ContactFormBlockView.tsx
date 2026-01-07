// =============================================================================
// CONTACT FORM BLOCK PUBLIC VIEW COMPONENT
// =============================================================================
// Displays contact form for visitors to send messages

import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contactService } from '../services/contactService';
import type { ContactBlockData, ContactFormSubmission } from '@/shared/types/contact';

interface ContactFormBlockViewProps {
  data: ContactBlockData;
  onClick?: () => void;
  buttonStyle?: 'rounded' | 'square' | 'pill';
  buttonColor?: string;
  buttonTextColor?: string;
}

export default function ContactFormBlockView({
  data,
  onClick,
  buttonStyle = 'rounded',
  buttonColor = '#8129d9',
  buttonTextColor = '#ffffff',
}: ContactFormBlockViewProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<ContactFormSubmission>({
    name: '',
    email: '',
    message: '',
  });
  
  // Form errors (only shown after submit attempt)
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const getButtonRadius = () => {
    switch (buttonStyle) {
      case 'square': return 'rounded-none';
      case 'pill': return 'rounded-full';
      default: return 'rounded-lg';
    }
  };

  const handleOpenForm = () => {
    onClick?.();
    setIsFormVisible(true);
  };

  const handleInputChange = (field: keyof ContactFormSubmission, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear submit error
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form using contactService
    const validation = contactService.validateForm(formData);
    
    if (!validation.isValid && validation.errors) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Send message using contactService (mock API)
      const result = await contactService.sendMessage(formData, data.receiverEmail);
      
      if (result.success) {
        setIsSuccess(true);
        // Reset form after success
        setFormData({ name: '', email: '', message: '' });
        setErrors({});
      } else {
        setSubmitError(result.error || 'Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('[ContactForm] Submit error:', error);
      setSubmitError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsFormVisible(false);
    setIsSuccess(false);
    setSubmitError(null);
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
  };

  // Success state
  if (isSuccess) {
    return (
      <div className={`w-full p-6 bg-white border border-gray-200 ${getButtonRadius()}`}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Message Sent!</h3>
            <p className="text-sm text-gray-500 mt-1">
              {contactService.getSuccessMessage(data.successMessage)}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleReset}
            className="mt-2"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  // Form view
  if (isFormVisible) {
    return (
      <div className={`w-full p-6 bg-white border border-gray-200 ${getButtonRadius()}`}>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5" style={{ color: buttonColor }} />
          <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div className="space-y-1">
            <Label htmlFor="contact-name">Name *</Label>
            <Input
              id="contact-name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isSubmitting}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-1">
            <Label htmlFor="contact-email">Email *</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isSubmitting}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Message field */}
          <div className="space-y-1">
            <Label htmlFor="contact-message">Message *</Label>
            <Textarea
              id="contact-message"
              placeholder="Your message..."
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              disabled={isSubmitting}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-xs text-red-500">{errors.message}</p>
            )}
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* Submit button */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
              style={{ backgroundColor: buttonColor, color: buttonTextColor }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Button view (default)
  return (
    <button
      onClick={handleOpenForm}
      className={`w-full p-4 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] ${getButtonRadius()}`}
      style={{
        backgroundColor: buttonColor,
        color: buttonTextColor,
      }}
    >
      <Mail className="w-5 h-5" />
      <span className="font-medium">{data.title}</span>
    </button>
  );
}
