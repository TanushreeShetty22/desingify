import { NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const client = new OpenAI({ apiKey });

const materials = [
  { value: "#D3B8AE", name: "Oak" },
  { value: "#F3D6C4", name: "Pine" },
  { value: "#D9B68C", name: "Walnut" },
  { value: "#6b7280", name: "Grey" },
  { value: "#f1f5f9", name: "White" },
];

const materialMap = new Map(
  materials.map((material) => [material.name.toLowerCase(), material.value])
);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    console.log("prompt", prompt);

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Extract the dimensions, material, and shelves from the following description. Only provide the numbers and material, separated by commas. If any dimension or material is not provided, use the default values: Width: 600, Depth: 500, Height: 720, Thickness: 18, Material: pine, Shelves: 2.
                    Description: "${prompt}"
                    Format: Width, Depth, Height, Thickness, Material, Shelves, totalQty`,
        },
      ],
      max_tokens: 100,
    });

    const text = response.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error("Failed to extract information from the response");
    }

    console.log("text", text);

    const defaultValues = {
      width: "600",
      depth: "500",
      height: "720",
      thickness: "18",
      material: "pine",
      shelves: "2",
      totalQty: "1",
    };

    const parts = text.split(",").map((part) => part.trim());

    const width = parts[0] && parts[0] !== "na" && parts[0] !== "n/a" ? parts[0] : defaultValues.width;
    const depth = parts[1] && parts[1] !== "na" && parts[1] !== "n/a" ? parts[1] : defaultValues.depth;
    const height = parts[2] && parts[2] !== "na" && parts[2] !== "n/a" ? parts[2] : defaultValues.height;
    const thickness = parts[3] && parts[3] !== "na" && parts[3] !== "n/a" ? parts[3] : defaultValues.thickness;
    let material = parts[4] && parts[4] !== "na" && parts[4] !== "n/a" ? parts[4] : defaultValues.material;
    const shelves = parts[5] && parts[5] !== "na" && parts[5] !== "n/a" ? parts[5] : defaultValues.shelves;
    const totalQty = parts[6] && parts[6] !== "na" && parts[6] !== "n/a" ? parts[6] : defaultValues.totalQty;

    if (material && materialMap.has(material.toLowerCase())) {
      material = materialMap.get(material.toLowerCase()) || defaultValues.material;
    }

    return NextResponse.json({
      name: "Cabinet",
      width,
      depth,
      height,
      thickness,
      material,
      shelves,
      totalQty,
    });
  } catch (error: any) {
    console.log(
      "[CHAT_ERROR]",
      error.response ? error.response.data : error.message
    );
    return new NextResponse("Internal Error", { status: 500 });
  }
}
