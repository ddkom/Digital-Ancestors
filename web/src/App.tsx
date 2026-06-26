import { Route, Routes } from "react-router-dom";
import { ShaderBackground } from "./components/ShaderBackground";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { HomePage } from "./pages/HomePage";
import { ResourcesPage } from "./pages/ResourcesPage";

const shaderPalette = {
  deep: "#6D88C9",
  light: "#F2AAB0",
  accent: "#97CAF1",
  highlight: "#8EA52A",
};

export default function App() {
  return (
    <>
      <ShaderBackground palette={shaderPalette} />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage shaderPalette={shaderPalette} />} />
        <Route path="/resources" element={<ResourcesPage shaderPalette={shaderPalette} />} />
      </Routes>
      <SiteFooter />
    </>
  );
}
