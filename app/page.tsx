import Deck, { type Slide } from "./Deck";

/**
 * The five panels of the printed tri-fold brochure, in reading order.
 * (The blank middle panel of the outer sheet is deliberately left out.)
 */
const slides: Slide[] = [
  {
    src: "/slides/01-cover.jpg",
    label: "Discover the Soul of the Gobi",
    alt: "Olon Khond Tourist Camp. Discover the Soul of the Gobi — nature, culture, comfort, adventure. Unique landscape, clear star nights, nomadic culture, peaceful getaway.",
  },
  {
    src: "/slides/02-our-camp.jpg",
    label: "Our Camp",
    alt: "Our Camp. Comfortable gers and modern facilities with a spacious environment where you can feel the true freedom of the steppe. Comfortable gers, clean facilities, delicious food, friendly service.",
  },
  {
    src: "/slides/03-experience.jpg",
    label: "Experience the Gobi",
    alt: "Experience the Gobi: visit Bayanzag (the Flaming Cliffs), breathtaking sunsets, stargazing and wide open nature. About Olon Khond Tourist Camp, located in Bulgan sum, Ömnögovi province.",
  },
  {
    src: "/slides/04-location.jpg",
    label: "Location & Contact",
    alt: "Location map: Olon Khond Tourist Camp at 44.003659, 103.630321 — 20 km from Bayanzag, 80 km from Dalanzadgad and 125 km from Khongoryn Els. Contact: 89800465, 89951921, 91226226, info@olonkhond.mn, @olonkhond.",
  },
  {
    src: "/slides/05-back.jpg",
    label: "Wide Nature, Warm Hospitality",
    alt: "Wide Nature, Warm Hospitality — Olon Khond Tourist Camp, with a QR code linking to the camp.",
  },
];

export default function Home() {
  return <Deck slides={slides} />;
}
