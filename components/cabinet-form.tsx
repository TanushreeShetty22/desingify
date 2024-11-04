import * as z from "zod";
import axios from "axios";
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

const FormSchema = z.object({
  prompt: z.string().min(2, {
    message: "prompt must be at least 2 characters.",
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
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6 mx-auto"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
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
        <div className="flex justify-center space-x-4 w-full">
          {" "}
          {/* Center and space buttons */}
          <Button type="submit">
            {" "}
            {isSubmitting ? (
              <>
                <Loader className="size-4 animate-spin mr-2" /> Generating{" "}
              </>
            ) : (
              "Make 3d Model"
            )}{" "}
          </Button>
          <Button type="button">Upload 2d image</Button>
          <Button type="button">Get Cutlist</Button>
        </div>
      </form>
    </Form>
  );
}
