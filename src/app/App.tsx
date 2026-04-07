import { RouterProvider } from "react-router";
import { router } from "./routes";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { FaviconSetter } from "./components/FaviconSetter";
import { AdditionalMetaTags } from "./components/AdditionalMetaTags";

export default function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>MUXION - Best UI/UX Design Course in India & Pakistan | Learn from Expert Mariam Parvez</title>
        <meta name="description" content="Master UI/UX design, Figma, Adobe Photoshop & Illustrator with MUXION. India & Pakistan's top online learning platform. Affordable courses starting ₹299 with lifetime access. Enroll now!" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="theme-color" content="#3b82f6" />
      </Helmet>
      <FaviconSetter />
      <AdditionalMetaTags />
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}