
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { validateNetworkEndpoint } from '@/config/security';

const formSchema = z.object({
  cameraUrl: z.string().url({ message: "Please enter a valid URL (e.g., http://example.com)." })
    .refine(url => validateNetworkEndpoint(url), {
      message: "URL must use http or https protocol.",
    }),
});

interface ConfigureCameraDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentUrl: string;
  onSave: (newUrl: string) => void;
}

const ConfigureCameraDialog: React.FC<ConfigureCameraDialogProps> = ({ isOpen, onOpenChange, currentUrl, onSave }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cameraUrl: currentUrl,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ cameraUrl: currentUrl });
    }
  }, [isOpen, currentUrl, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values.cameraUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Camera Stream</DialogTitle>
          <DialogDescription>
            Enter the URL for your camera stream. Make sure it's a valid and accessible endpoint.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="cameraUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Camera Stream URL</FormLabel>
                  <FormControl>
                    <Input placeholder="http://192.168.1.100:8000/stream" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureCameraDialog;

