import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getOccupationTypes } from "@/lib/utils";
import { Check, Loader2, ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
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

// Form validation schema using Yup
const loanFormSchema = Yup.object().shape({
  fullName: Yup.string().nullable(),
  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must not exceed 15 digits")
    .matches(/^[0-9+\s-]+$/, "Invalid mobile number format"),
  email: Yup.string().email("Invalid email address").nullable(),
  panCard: Yup.string()
    .nullable()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
      message: "Invalid PAN card format (e.g., ABCDE1234F)",
      excludeEmptyString: true,
    }),
  occupationType: Yup.string().required("Please select an occupation type"),
  companyName: Yup.string().nullable(),
  monthlySalary: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .positive("Monthly salary must be a positive number"),
});

// Define the form values type
interface FormValues {
  fullName: string;
  mobileNumber: string;
  email: string;
  panCard: string;
  occupationType: string;
  companyName: string;
  monthlySalary: string;
}

// Initial form values
const initialValues: FormValues = {
  fullName: "",
  mobileNumber: "",
  email: "",
  panCard: "",
  occupationType: "",
  companyName: "",
  monthlySalary: "",
};

export function FormikLoanForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToast();

  const occupationTypes = getOccupationTypes();

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
      setCurrentStep(1);
      setAcceptedTerms(false);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: FormValues, { resetForm }: any) => {
    if (currentStep < 3) {
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
      resetForm();
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
            
            {/* Formik Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={loanFormSchema}
              onSubmit={handleSubmit}
            >
              {(formik: FormikProps<FormValues>) => (
                <Form className="p-8">
                  {/* Step 1: Personal Details */}
                  {currentStep === 1 && (
                    <div className="form-step">
                      <h3 className="text-xl font-semibold mb-6">Personal Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                            Full Name (Optional)
                          </label>
                          <Field name="fullName">
                            {({ field }: any) => (
                              <Input {...field} id="fullName" placeholder="Enter your full name" />
                            )}
                          </Field>
                          <ErrorMessage name="fullName" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        
                        <div>
                          <label htmlFor="mobileNumber" className="block text-sm font-medium mb-2">
                            Mobile Number *
                          </label>
                          <Field name="mobileNumber">
                            {({ field }: any) => (
                              <Input {...field} id="mobileNumber" placeholder="Enter your mobile number" required />
                            )}
                          </Field>
                          <ErrorMessage name="mobileNumber" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email Address (Optional)
                          </label>
                          <Field name="email">
                            {({ field }: any) => (
                              <Input {...field} id="email" type="email" placeholder="Enter your email address" />
                            )}
                          </Field>
                          <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        
                        <div>
                          <label htmlFor="panCard" className="block text-sm font-medium mb-2">
                            PAN Card (Optional)
                          </label>
                          <Field name="panCard">
                            {({ field }: any) => (
                              <Input {...field} id="panCard" placeholder="Enter your PAN card number" />
                            )}
                          </Field>
                          <ErrorMessage name="panCard" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
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
                          <label htmlFor="occupationType" className="block text-sm font-medium mb-2">
                            Occupation Type *
                          </label>
                          <Field name="occupationType">
                            {({ field, form }: any) => (
                              <Select
                                onValueChange={(value) => form.setFieldValue('occupationType', value)}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select occupation type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {occupationTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage name="occupationType" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        
                        <div>
                          <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                            Company Name (Optional)
                          </label>
                          <Field name="companyName">
                            {({ field }: any) => (
                              <Input {...field} id="companyName" placeholder="Enter your company name" />
                            )}
                          </Field>
                          <ErrorMessage name="companyName" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        
                        <div>
                          <label htmlFor="monthlySalary" className="block text-sm font-medium mb-2">
                            Monthly Income (Optional)
                          </label>
                          <Field name="monthlySalary">
                            {({ field }: any) => (
                              <Input {...field} id="monthlySalary" type="number" placeholder="Enter your monthly salary" />
                            )}
                          </Field>
                          <ErrorMessage name="monthlySalary" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
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
                            <span className="font-medium">{formik.values.mobileNumber || "Not provided"}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Occupation Type:</span>
                            <span className="font-medium">
                              {occupationTypes.find(type => type.value === formik.values.occupationType)?.label || "Not provided"}
                            </span>
                          </div>

                          {formik.values.fullName && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Full Name:</span>
                              <span className="font-medium">{formik.values.fullName}</span>
                            </div>
                          )}

                          {formik.values.email && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Email:</span>
                              <span className="font-medium">{formik.values.email}</span>
                            </div>
                          )}

                          {formik.values.panCard && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">PAN Card:</span>
                              <span className="font-medium">{formik.values.panCard}</span>
                            </div>
                          )}

                          {formik.values.companyName && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Company:</span>
                              <span className="font-medium">{formik.values.companyName}</span>
                            </div>
                          )}

                          {formik.values.monthlySalary && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Monthly Income:</span>
                              <span className="font-medium">₹{formik.values.monthlySalary}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-start">
                          <Checkbox
                            id="termsCheckbox"
                            checked={acceptedTerms}
                            onCheckedChange={(checked: boolean) => setAcceptedTerms(checked)}
                            className="mt-1"
                          />
                          <label htmlFor="termsCheckbox" className="ml-2 text-sm text-muted-foreground">
                            I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>. I consent to the processing of my personal information as described in the Privacy Policy.
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
                        
                        <Button 
                          type="submit"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Submit Application
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
}