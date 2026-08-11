// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
// import { CredentialType } from "@/generated/prisma/enums";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import Image from "next/image";

// const formSchema = z.object({
//   variableName: z
//     .string()
//     .min(1, { message: "Variable name is required" })
//     .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, { 
//       message: "Variable name must start with a letter or underscore and container only letters, numbers, and underscores",
//     }),
//   credentialId: z.string().min(1, "Credential is required"),
//   systemPrompt: z.string().optional(),
//   userPrompt: z.string().min(1, "User prompt is required"),
// });

// export type GeminiFormValues = z.infer<typeof formSchema>;

// interface Props {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSubmit: (values: z.infer<typeof formSchema>) => void;
//   defaultValues?: Partial<GeminiFormValues>;
// };

// export const GeminiDialog = ({
//   open,
//   onOpenChange,
//   onSubmit,
//   defaultValues = {},
// }: Props) => {
//   const { 
//     data: credentials,
//     isLoading: isLoadingCredentials,
//   } = useCredentialsByType(CredentialType.GEMINI);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       variableName: defaultValues.variableName || "",
//       credentialId: defaultValues.credentialId || "",
//       systemPrompt: defaultValues.systemPrompt || "",
//       userPrompt: defaultValues.userPrompt || "",
//     },
//   });

//   // Reset form values when dialog opens with new defaults
//   useEffect(() => {
//     if (open) {
//       form.reset({
//         variableName: defaultValues.variableName || "",
//         credentialId: defaultValues.credentialId || "",
//         systemPrompt: defaultValues.systemPrompt || "",
//         userPrompt: defaultValues.userPrompt || "",
//       });
//     }
//   }, [open, defaultValues, form]);

//   const watchVariableName = form.watch("variableName") || "myGemini";

//   const handleSubmit = (values: z.infer<typeof formSchema>) => {
//     onSubmit(values);
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Gemini Configuration</DialogTitle>
//           <DialogDescription>
//             Configure the AI model and prompts for this node.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-8 mt-4"
//           >
//             <FormField
//               control={form.control}
//               name="variableName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Variable Name</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="myGemini"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Use this name to reference the result in other nodes:{" "}
//                     {`{{${watchVariableName}.text}}`}
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="credentialId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Gemini Credential</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                     disabled={
//                       isLoadingCredentials
//                       || !credentials?.length
//                     }
//                   >
//                     <FormControl>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select a credential" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {credentials?.map((credential) => (
//                         <SelectItem
//                           key={credential.id}
//                           value={credential.id}
//                         >
//                           <div className="flex items-center gap-2">
//                             <Image
//                               src="/logos/gemini.svg"
//                               alt="Gemini"
//                               width={16}
//                               height={16}
//                             />
//                             {credential.name}
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="systemPrompt"
//               render={({ field }) => (
//               <FormItem>
//                 <FormLabel>System Prompt (Optional)</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="You are a helpful assistant."
//                     className="min-h-[80px] font-mono text-sm"
//                     {...field}
//                   />
//                 </FormControl>
//                   <FormDescription>
//                     Sets the behavior of the assistant. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
//                   </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//             />
//             <FormField
//               control={form.control}
//               name="userPrompt"
//               render={({ field }) => (
//               <FormItem>
//                 <FormLabel>User Prompt</FormLabel>
//                 <FormControl>
//                   <Textarea
//                      placeholder="Summarize this text: {{json httpResponse.data}}"
//                     className="min-h-[120px] font-mono text-sm"
//                     {...field}
//                   />
//                 </FormControl>
//                   <FormDescription>
//                     The prompt to send to the AI. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
//                   </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//             />
//             <DialogFooter className="mt-4">
//               <Button type="submit">Save</Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };




"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  Sparkles,
} from "lucide-react";


// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, {
      message: "Variable name is required",
    })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter, underscore, or $ and contain only letters, numbers, underscores, or $.",
    }),

  credentialId: z.string().min(1, {
    message: "Credential is required",
  }),

  systemPrompt: z.string().optional(),

  userPrompt: z.string().min(1, {
    message: "User prompt is required",
  }),
});

export type GeminiFormValues = z.infer<typeof formSchema>;


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GeminiFormValues) => void;
  defaultValues?: Partial<GeminiFormValues>;
}


// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const {
    data: credentials,
    isLoading: isLoadingCredentials,
  } = useCredentialsByType(CredentialType.GEMINI);

  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      variableName: defaultValues.variableName ?? "",
      credentialId: defaultValues.credentialId ?? "",
      systemPrompt: defaultValues.systemPrompt ?? "",
      userPrompt: defaultValues.userPrompt ?? "",
    },
  });


  // ---------------------------------------------------------------------------
  // Reset form when opening / changing node
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!open) return;

    form.reset({
      variableName: defaultValues.variableName ?? "",
      credentialId: defaultValues.credentialId ?? "",
      systemPrompt: defaultValues.systemPrompt ?? "",
      userPrompt: defaultValues.userPrompt ?? "",
    });
  }, [
    open,
    defaultValues.variableName,
    defaultValues.credentialId,
    defaultValues.systemPrompt,
    defaultValues.userPrompt,
    form,
  ]);


  // ---------------------------------------------------------------------------
  // Watch values
  // ---------------------------------------------------------------------------

  const variableName = form.watch("variableName") || "myGemini";

  const systemPrompt = form.watch("systemPrompt") ?? "";

  const userPrompt = form.watch("userPrompt") ?? "";


  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = (values: GeminiFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };


  // ---------------------------------------------------------------------------
  // Keyboard shortcut
  // Ctrl + Enter / Cmd + Enter
  // ---------------------------------------------------------------------------

  const handlePromptKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();

      form.handleSubmit(handleSubmit)();
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[calc(100%-2rem)]
          max-w-2xl
          max-h-[90vh]
          p-0
          overflow-hidden
          flex
          flex-col
        "
      >
        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}

        <DialogHeader
          className="
            shrink-0
            border-b
            px-6
            py-5
            pr-12
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                bg-muted/40
              "
            >
              <Image
                src="/logos/gemini.svg"
                alt="Gemini"
                width={22}
                height={22}
              />
            </div>

            <div className="min-w-0">
              <DialogTitle className="text-lg">
                Gemini Configuration
              </DialogTitle>

              <DialogDescription className="mt-1">
                Configure the AI model, credentials, and prompts for this node.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>


        {/* ================================================================= */}
        {/* SCROLLABLE FORM AREA */}
        {/* ================================================================= */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="
              flex
              min-h-0
              flex-1
              flex-col
            "
          >
            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                overscroll-contain
                px-6
                py-6
                [scrollbar-width:thin]
              "
            >
              <div className="space-y-6">


                {/* ========================================================= */}
                {/* VARIABLE NAME */}
                {/* ========================================================= */}

                <FormField
                  control={form.control}
                  name="variableName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variable Name</FormLabel>

                      <FormControl>
                        <Input
                          placeholder="myGemini"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>

                      <FormDescription>
                        Use this name to reference the result in other nodes:
                      </FormDescription>

                      <div
                        className="
                          rounded-md
                          border
                          bg-muted/40
                          px-3
                          py-2
                          font-mono
                          text-xs
                          text-muted-foreground
                        "
                      >
                        {`{{${variableName}.text}}`}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* ========================================================= */}
                {/* CREDENTIAL */}
                {/* ========================================================= */}

                <FormField
                  control={form.control}
                  name="credentialId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gemini Credential</FormLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          isLoadingCredentials ||
                          !credentials?.length
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                isLoadingCredentials
                                  ? "Loading credentials..."
                                  : "Select a credential"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {credentials?.map((credential) => (
                            <SelectItem
                              key={credential.id}
                              value={credential.id}
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src="/logos/gemini.svg"
                                  alt=""
                                  width={16}
                                  height={16}
                                />

                                <span>{credential.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {!isLoadingCredentials &&
                        !credentials?.length && (
                          <FormDescription className="text-amber-600">
                            No Gemini credentials found. Add a Gemini
                            credential before running this node.
                          </FormDescription>
                        )}

                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* ========================================================= */}
                {/* SYSTEM PROMPT */}
                {/* ========================================================= */}

                <FormField
                  control={form.control}
                  name="systemPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-3">
                        <FormLabel>System Prompt</FormLabel>

                        <span className="text-[11px] text-muted-foreground">
                          Optional
                        </span>
                      </div>

                      <FormControl>
                        <Textarea
                          placeholder="You are a helpful assistant."
                          className="
                            min-h-[140px]
                            max-h-[320px]
                            resize-y
                            overflow-y-auto
                            font-mono
                            text-sm
                            leading-6
                          "
                          spellCheck={false}
                          {...field}
                        />
                      </FormControl>

                      <div className="flex items-start justify-between gap-4">
                        <FormDescription className="max-w-[85%]">
                          Sets the behavior of the assistant. Use{" "}
                          <code className="rounded bg-muted px-1 font-mono text-xs">
                            {"{{variable}}"}
                          </code>{" "}
                          for simple values or{" "}
                          <code className="rounded bg-muted px-1 font-mono text-xs">
                            {"{{json variable}}"}
                          </code>{" "}
                          to stringify objects.
                        </FormDescription>

                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {systemPrompt.length}
                        </span>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* ========================================================= */}
                {/* USER PROMPT */}
                {/* ========================================================= */}

                <FormField
                  control={form.control}
                  name="userPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-3">
                        <FormLabel>User Prompt</FormLabel>

                        <span className="text-[11px] text-muted-foreground">
                          Required
                        </span>
                      </div>

                      <FormControl>
                        <Textarea
                          placeholder={
                            "Summarize this text:\n{{json httpResponse.data}}"
                          }
                          className="
                            min-h-[260px]
                            max-h-[520px]
                            resize-y
                            overflow-y-auto
                            font-mono
                            text-sm
                            leading-6
                            whitespace-pre-wrap
                          "
                          spellCheck={false}
                          onKeyDown={handlePromptKeyDown}
                          {...field}
                        />
                      </FormControl>

                      <div className="flex items-start justify-between gap-4">
                        <FormDescription className="max-w-[85%]">
                          The prompt sent to Gemini. Use{" "}
                          <code className="rounded bg-muted px-1 font-mono text-xs">
                            {"{{variable}}"}
                          </code>{" "}
                          for simple values or{" "}
                          <code className="rounded bg-muted px-1 font-mono text-xs">
                            {"{{json variable}}"}
                          </code>{" "}
                          for objects.
                        </FormDescription>

                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {userPrompt.length}
                        </span>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* ========================================================= */}
                {/* VARIABLE REFERENCE */}
                {/* ========================================================= */}

                <div
                  className="
                    rounded-xl
                    border
                    bg-muted/30
                    p-4
                  "
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="
                        flex
                        size-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-background
                        ring-1
                        ring-border
                      "
                    >
                      <Sparkles className="size-4 text-primary" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        Variable Reference
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        The Gemini response can be accessed by other nodes
                        using:
                      </p>

                      <code
                        className="
                          mt-2
                          block
                          overflow-x-auto
                          rounded-md
                          border
                          bg-background
                          px-3
                          py-2
                          font-mono
                          text-xs
                        "
                      >
                        {`{{${variableName}.text}}`}
                      </code>
                    </div>
                  </div>
                </div>


                {/* ========================================================= */}
                {/* PROMPT TIP */}
                {/* ========================================================= */}

                <div
                  className="
                    rounded-lg
                    border
                    border-blue-200
                    bg-blue-50/60
                    p-3
                    dark:border-blue-900
                    dark:bg-blue-950/30
                  "
                >
                  <p className="text-xs leading-5 text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Tip:
                    </span>{" "}
                    Large prompts can be written normally. The editor is
                    scrollable, so long prompts will not expand the dialog
                    beyond the screen.
                  </p>
                </div>

              </div>
            </div>


            {/* ================================================================= */}
            {/* FOOTER */}
            {/* ================================================================= */}

            <DialogFooter
              className="
                shrink-0
                border-t
                bg-background
                px-6
                py-4
              "
            >
              <div className="flex w-full items-center justify-between gap-3">
                <p className="hidden text-[11px] text-muted-foreground sm:block">
                  Ctrl + Enter to save
                </p>

                <div className="ml-auto flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
