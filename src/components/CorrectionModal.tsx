'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const correctionSchema = z.object({
  userType: z.enum(['owner', 'public']),
  email: z.string().email('Please enter a valid email address'),
  correction: z.string().min(10, 'Please provide more details about the correction'),
});

type CorrectionFormData = z.infer<typeof correctionSchema>;

interface CorrectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
  companyDomain?: string;
}

export function CorrectionModal({ open, onOpenChange, companyName, companyDomain }: CorrectionModalProps) {
  const [submitted, setSubmitted] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<CorrectionFormData>({
    resolver: zodResolver(correctionSchema),
    defaultValues: {
      userType: 'public',
    },
  });

  const userType = watch('userType');
  const email = watch('email');

  const isOwnerEmailValid = userType === 'owner' && companyDomain 
    ? email?.endsWith(`@${companyDomain}`) 
    : true;

  const onSubmit = (data: CorrectionFormData) => {
    if (userType === 'owner' && companyDomain && !email?.endsWith(`@${companyDomain}`)) {
      toast.error(`Owner verification requires an email from @${companyDomain}`);
      return;
    }

    console.log('Correction submitted:', data);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      reset();
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-950 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Report Incorrect Data</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Submit a correction request for {companyName}. All requests are reviewed by our team.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <p className="text-center text-lg font-medium">Request Submitted</p>
            <p className="text-center text-sm text-zinc-400">
              Your correction request has been queued for admin review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-zinc-300">I am...</Label>
              <RadioGroup 
                defaultValue="public" 
                onValueChange={(value) => register('userType').onChange({ target: { value } })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="owner" id="owner" className="border-zinc-600" />
                  <Label htmlFor="owner" className="cursor-pointer text-sm text-zinc-300">
                    The Company Owner
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" className="border-zinc-600" />
                  <Label htmlFor="public" className="cursor-pointer text-sm text-zinc-300">
                    A Public User
                  </Label>
                </div>
              </RadioGroup>
              <input type="hidden" {...register('userType')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Your Email
                {userType === 'owner' && companyDomain && (
                  <span className="ml-2 text-xs text-amber-500">
                    (Must be @{companyDomain})
                  </span>
                )}
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder={userType === 'owner' ? `you@${companyDomain || 'company.com'}` : 'your@email.com'}
                className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500"
              />
              {errors.email && (
                <p className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
              {userType === 'owner' && email && companyDomain && !email.endsWith(`@${companyDomain}`) && (
                <p className="flex items-center gap-1 text-xs text-amber-400">
                  <AlertCircle className="h-3 w-3" />
                  Email must end with @{companyDomain} for owner verification
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="correction" className="text-sm font-medium text-zinc-300">
                What needs to be corrected?
              </Label>
              <Textarea
                id="correction"
                {...register('correction')}
                placeholder="Please describe the incorrect data and provide the correct information..."
                rows={4}
                className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500"
              />
              {errors.correction && (
                <p className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.correction.message}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-amber-500 text-black hover:bg-amber-400"
              >
                Submit Request
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
