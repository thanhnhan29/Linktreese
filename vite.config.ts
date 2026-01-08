import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { imageUploadPlugin } from "./vite-plugin-image-upload";

export default defineConfig({
  plugins: [react(), imageUploadPlugin()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      // Path alias for clean imports
      "@": path.resolve(__dirname, "./src"),

      // Legacy package aliases
      "vaul@1.1.2": "vaul",
      "sonner@2.0.3": "sonner",
      "recharts@2.15.2": "recharts",
      "react-resizable-panels@2.1.7": "react-resizable-panels",
      "react-hook-form@7.55.0": "react-hook-form",
      "react-day-picker@8.10.1": "react-day-picker",
      "lucide-react@0.487.0": "lucide-react",
      "input-otp@1.4.2": "input-otp",
      "embla-carousel-react@8.6.0": "embla-carousel-react",
      "cmdk@1.1.1": "cmdk",
      "class-variance-authority@0.7.1": "class-variance-authority",

      // Figma asset aliases
      "figma:asset/e3e16090ef427afe6805db5954e01ebc3866df1a.png": path.resolve(
        __dirname,
        "./src/assets/e3e16090ef427afe6805db5954e01ebc3866df1a.png"
      ),
      "figma:asset/c90ce150cadadbf43701707ec7b4d936059b0c93.png": path.resolve(
        __dirname,
        "./src/assets/c90ce150cadadbf43701707ec7b4d936059b0c93.png"
      ),
      "figma:asset/b0f6d28e195f931e82f04198829c8b0d30dad3c9.png": path.resolve(
        __dirname,
        "./src/assets/b0f6d28e195f931e82f04198829c8b0d30dad3c9.png"
      ),
      "figma:asset/a3d78743adbd2d2160e019486919a6bb2862cbcd.png": path.resolve(
        __dirname,
        "./src/assets/a3d78743adbd2d2160e019486919a6bb2862cbcd.png"
      ),
      "figma:asset/8e86d8941a922ad4c5fcfdd33b3c0268173eb46a.png": path.resolve(
        __dirname,
        "./src/assets/8e86d8941a922ad4c5fcfdd33b3c0268173eb46a.png"
      ),
      "figma:asset/8cb7949f7e3fc877354d5c51f139c7112c1b4676.png": path.resolve(
        __dirname,
        "./src/assets/8cb7949f7e3fc877354d5c51f139c7112c1b4676.png"
      ),
      "figma:asset/8b7f5e1e916ac5832ee2a76a7a530cf37d6bcee9.png": path.resolve(
        __dirname,
        "./src/assets/8b7f5e1e916ac5832ee2a76a7a530cf37d6bcee9.png"
      ),
      "figma:asset/72d2e738aeade86ac832b76f0e9134a397a8e2f2.png": path.resolve(
        __dirname,
        "./src/assets/72d2e738aeade86ac832b76f0e9134a397a8e2f2.png"
      ),
      "figma:asset/5916266c37ccbd37ae74574d8596b4716b8fa959.png": path.resolve(
        __dirname,
        "./src/assets/5916266c37ccbd37ae74574d8596b4716b8fa959.png"
      ),

      // Radix UI aliases
      "@radix-ui/react-tooltip@1.1.8": "@radix-ui/react-tooltip",
      "@radix-ui/react-toggle@1.1.2": "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group@1.1.2": "@radix-ui/react-toggle-group",
      "@radix-ui/react-tabs@1.1.3": "@radix-ui/react-tabs",
      "@radix-ui/react-switch@1.1.3": "@radix-ui/react-switch",
      "@radix-ui/react-slot@1.1.2": "@radix-ui/react-slot",
      "@radix-ui/react-slider@1.2.3": "@radix-ui/react-slider",
      "@radix-ui/react-separator@1.1.2": "@radix-ui/react-separator",
      "@radix-ui/react-select@2.1.6": "@radix-ui/react-select",
      "@radix-ui/react-scroll-area@1.2.3": "@radix-ui/react-scroll-area",
      "@radix-ui/react-radio-group@1.2.3": "@radix-ui/react-radio-group",
      "@radix-ui/react-progress@1.1.2": "@radix-ui/react-progress",
      "@radix-ui/react-popover@1.1.6": "@radix-ui/react-popover",
      "@radix-ui/react-navigation-menu@1.2.5":
        "@radix-ui/react-navigation-menu",
      "@radix-ui/react-menubar@1.1.6": "@radix-ui/react-menubar",
      "@radix-ui/react-label@2.1.2": "@radix-ui/react-label",
      "@radix-ui/react-hover-card@1.1.6": "@radix-ui/react-hover-card",
      "@radix-ui/react-dropdown-menu@2.1.6": "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog@1.1.6": "@radix-ui/react-dialog",
      "@radix-ui/react-context-menu@2.2.6": "@radix-ui/react-context-menu",
      "@radix-ui/react-collapsible@1.1.3": "@radix-ui/react-collapsible",
      "@radix-ui/react-checkbox@1.1.4": "@radix-ui/react-checkbox",
      "@radix-ui/react-avatar@1.1.3": "@radix-ui/react-avatar",
      "@radix-ui/react-aspect-ratio@1.1.2": "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-alert-dialog@1.1.6": "@radix-ui/react-alert-dialog",
      "@radix-ui/react-accordion@1.2.3": "@radix-ui/react-accordion",
    },
  },
  build: {
    target: "esnext",
    outDir: "build",
  },
  server: {
    port: 3000,
    open: true,
    allowedHosts: [
      ".trycloudflare.com",
      ".ngrok.io",
      ".ngrok-free.app",
      ".loca.lt",
    ],
  },
});
