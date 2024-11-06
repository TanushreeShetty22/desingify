"use client";

import * as z from "zod";
import axios from "axios";
import Link from "next/link";
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
import { useState } from "react";
import { Loader } from "lucide-react";
import Link from "next/link";

const FormSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }),
});

export function CabientForm() {
  const { setCabinetData } = useCabinetData();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { isSubmitting } = form.formState;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the width threshold as needed
    };

    handleResize(); // Set the initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        className="w-full max-w-md space-y-6 mx-auto" // Adjusted width for responsiveness
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel style={{ color: "white" }}>Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="make a cabinet of..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          {/* Stack buttons on smaller screens with spacing */}
          <Button type="submit" className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader className="size-4 animate-spin mr-2" /> Generating
              </>
            ) : (
              "Make 3D Model"
            )}
          </Button>
          <Button type="button">
            <Link href="http://localhost:8501">Upload 2d image</Link>
          </Button>
          <Button type="button">
            <Link href="/cutlist" target="_blank">
              Make Cutlist
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
