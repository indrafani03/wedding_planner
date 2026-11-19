import type { MetadataRoute } from "next";

/** Lets the planner be installed to the home screen with the PNC logo. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wedding Planner",
    short_name: "Wedding",
    description:
      "Aplikasi perencanaan pernikahan: cash flow, budget, seserahan, dokumen, tamu, dan checklist vendor.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdece8",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
