import { Lato, Rajdhani, Fjalla_One } from "next/font/google";

export const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
});

export const fjallaOne = Fjalla_One({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
