import * as z from "zod";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import { useCabinetData } from "@/store/use-cabinet-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info } from "lucide-react"; // Import an info icon for tooltip trigger

const FormSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }),
});

export function CabinetForm() {
  const { setCabinetData } = useCabinetData();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const response = await axios.post("/api/openai", values);

      if (!response) {
        throw new Error("Something went wrong");
      }

      const data = response.data;

      setCabinetData({
        width: data.width,
        height: data.height,
        depth: data.depth,
        thickness: data.thickness,
        materialColor: data.material,
        shelves: data.shelves,
        totalQty: data.totalQty,
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 mx-auto"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-white gap-2">
                Prompt
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-white" />
                    </TooltipTrigger>
                    <TooltipContent className="w-[400px]">
                      <p>
                        Width and Height should be between 100 and 1000. Number
                        of Shelves should be less than 5. Available materials:
                        Oak, Pine, and Walnut.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Eg. Make a cabinet of width 600 height 700 thickness 18 with 2 shelves and made of Pine material. "
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          <Button type="submit" className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader className="size-4 animate-spin mr-2" /> Generating
              </>
            ) : (
              "Make 3D Model"
            )}
          </Button>

          <Button type="button" className="hidden lg:block" asChild>
            <Link href="http://localhost:8501">Upload 2d image</Link>
          </Button>

          {/* Tooltip for the 'Make Cutlist' button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" asChild>
                  <Link href="/cutlist" target="_blank">
                    Make Cut-list
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                A cut-list is a detailed list of material cuts required for
                making a furniture along with the estimated cost.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
    </Form>
  );
}
