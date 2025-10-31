import { getAllBanners } from "@/services/banners";
import BannerSlider2 from "@/slider/BannerSlider/BannerSlider2";

export default async function Banner2() {
  const { data: banners } = await getAllBanners();

  // Filter MAIN BANNER type
  const mainBanner = banners?.filter(
    (banner: { type: string }) => banner.type === "MAIN BANNER"
  );

  return <BannerSlider2 banners={mainBanner} />;
}
