export type Publication = {
  title: string;
  venue: string;
  year: string;
  status: "published" | "in-preparation";
  description: string;
  link: string;
};

export const publications: Publication[] = [
  {
    title:
      "Automatic Tunnel Lighting System for Road Traffic with Auto Exhaust Fan",
    venue:
      "International Journal for Research in Applied Science & Engineering Technology (IJRASET)",
    year: "2022",
    status: "published",
    description:
      "Published undergraduate research exploring intelligent automation for road safety using embedded systems and sensor-based control.",
    link: "",
  },
  {
    title:
      "Deep Learning Based Telugu Optical Character Recognition using CNN and ResNet",
    venue: "CVIP 2026 (Under Preparation)",
    year: "2026",
    status: "in-preparation",
    description:
      "Current research focused on Telugu OCR using deep learning architectures with emphasis on preprocessing, feature extraction, and classification of Telugu script.",
    link: "",
  },
];
