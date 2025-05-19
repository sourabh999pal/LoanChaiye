import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loanFormSchema } from "@/lib/validationSchema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getOccupationTypes } from "@/lib/utils";
import { Check, Loader2, ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type FormValues = z.infer<typeof loanFormSchema>;

export function LoanForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToast();

  const occupationTypes = getOccupationTypes();

  const form = useForm<FormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      panCard: "",
      occupationType: "",
      companyName: "",
      monthlySalary: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await apiRequest("POST", "/api/leads", values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "We'll contact you soon to discuss your loan options.",
        variant: "default",
      });
      form.reset();
      setCurrentStep(1);
      setAcceptedTerms(false);
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    if (currentStep < 3) {
      if (currentStep === 1) {
        // Validate mobile number before proceeding
        if (!form.getValues("mobileNumber")) {
          form.setError("mobileNumber", {
            type: "required",
            message: "Mobile number is required",
          });
          return;
        }
      } else if (currentStep === 2) {
        // Validate occupation type before proceeding
        if (!form.getValues("occupationType")) {
          form.setError("occupationType", {
            type: "required",
            message: "Occupation type is required",
          });
          return;
        }
      }
      setCurrentStep((prev) => prev + 1);
    } else {
      if (!acceptedTerms) {
        toast({
          title: "Please Accept Terms",
          description: "You must accept the terms and conditions to proceed.",
          variant: "destructive",
        });
        return;
      }
      mutate(values);
    }
  };

  return (
    <section id="apply" className="py-20 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Apply For Your Loan</h2>
            <p className="text-muted-foreground">
              Complete the form below to start your application. It only takes a few minutes!
            </p>
          </div>
          
          <div className="bg-background dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 dark:bg-gray-700 h-2">
              <div 
                className="bg-primary h-2 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
            
            {/* Steps Indicator */}
            <div className="flex justify-between px-8 pt-6">
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                    currentStep >= 1 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  )}
                >
                  1
                </div>
                <span className="text-sm mt-2">Personal Details</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                    currentStep >= 2 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  )}
                >
                  2
                </div>
                <span className="text-sm mt-2">Employment Info</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                    currentStep >= 3 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  )}
                >
                  3
                </div>
                <span className="text-sm mt-2">Review & Submit</span>
              </div>
            </div>
            
            {/* Form Steps */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
                {/* Step 1: Personal Details */}
                {currentStep === 1 && (
                  <div className="form-step">
                    <h3 className="text-xl font-semibold mb-6">Personal Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter your full name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="mobileNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter your mobile number" required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="Enter your email address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="panCard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PAN Card (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter your PAN card number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button type="submit">
                        Continue
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Employment Information */}
                {currentStep === 2 && (
                  <div className="form-step">
                    <h3 className="text-xl font-semibold mb-6">Employment Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="col-span-1 md:col-span-2">
                        <FormField
                          control={form.control}
                          name="occupationType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Occupation Type *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select occupation type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {occupationTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter your company name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="monthlySalary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Income (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Enter your monthly salary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setCurrentStep(1)} 
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      
                      <Button type="submit">
                        Continue
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Review & Submit */}
                {currentStep === 3 && (
                  <div className="form-step">
                    <h3 className="text-xl font-semibold mb-6">Review & Submit</h3>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                      <p className="text-sm text-muted-foreground mb-4">Please review your information before submitting:</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mobile Number:</span>
                          <span className="font-medium">{form.getValues("mobileNumber") || "Not provided"}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Occupation Type:</span>
                          <span className="font-medium">
                            {occupationTypes.find(type => type.value === form.getValues("occupationType"))?.label || "Not provided"}
                          </span>
                        </div>

                        {form.getValues("fullName") && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Full Name:</span>
                            <span className="font-medium">{form.getValues("fullName")}</span>
                          </div>
                        )}

                        {form.getValues("email") && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{form.getValues("email")}</span>
                          </div>
                        )}

                        {form.getValues("panCard") && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">PAN Card:</span>
                            <span className="font-medium">{form.getValues("panCard")}</span>
                          </div>
                        )}

                        {form.getValues("companyName") && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Company:</span>
                            <span className="font-medium">{form.getValues("companyName")}</span>
                          </div>
                        )}

                        {form.getValues("monthlySalary") && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Monthly Income:</span>
                            <span className="font-medium">₹{form.getValues("monthlySalary")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-start">
                        <Checkbox
                          id="termsCheckbox"
                          checked={acceptedTerms}
                          onCheckedChange={(checked) => {
                            setAcceptedTerms(checked as boolean);
                          }}
                          className="mt-1"
                        />
                        <label htmlFor="termsCheckbox" className="ml-2 text-sm text-muted-foreground">
                          I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setCurrentStep(2)} 
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      
                      <Button type="submit" disabled={isPending}>
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <span>Submit Application</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Your data is secure and will only be used to process your loan application. 
            <a href="#" className="text-primary hover:underline ml-1">Learn more</a>
          </p>
        </div>
      </div>
    </section>
  );
}
