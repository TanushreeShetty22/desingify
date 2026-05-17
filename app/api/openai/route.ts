import { NextResponse } from "next/server";

const materialMap: Record<string, string> = {
  oak: "#D3B8AE",
  pine: "#F3D6C4",
  walnut: "#D9B68C",
  grey: "#6b7280",
  white: "#f1f5f9",
};

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const defaultValues = {
      width: "600",
      depth: "500",
      height: "720",
      thickness: "18",
      material: "#F3D6C4",
      shelves: "2",
      totalQty: "1",
    };

    const extract = (pattern: RegExp) => {
      const match = prompt.match(pattern);
      return match ? match[1] : null;
    };

    const width = extract(/width[:\s]+(\d+)/i) || defaultValues.width;
    const depth = extract(/depth[:\s]+(\d+)/i) || defaultValues.depth;
    const height = extract(/height[:\s]+(\d+)/i) || defaultValues.height;
    const thickness = extract(/thickness[:\s]+(\d+)/i) || defaultValues.thickness;
    const shelves =
      extract(/(\d+)\s+shelves?/i) ||
      extract(/shelves?[:\s]+(\d+)/i) ||
      defaultValues.shelves;

    const materialMatch = prompt.match(/\b(oak|pine|walnut|grey|white)\b/i);
    const material = materialMatch
      ? materialMap[materialMatch[1].toLowerCase()]
      : defaultValues.material;

    return NextResponse.json({
      name: "Cabinet",
      width,
      depth,
      height,
      thickness,
      material,
      shelves,
      totalQty: "1",
    });
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
