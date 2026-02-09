import { SoilTarget } from "@/types";

export const BERMUDA_SOIL_TARGETS: SoilTarget[] = [
  {
    grass_type_id: "bermuda-common",
    ideal_ph: 6.25,
    ph_adjustment_product_up: "Lime (see bag rates)",
    ph_adjustment_product_down:
      "Pelletized sulfur — 5 lbs per 1,000 sq ft. Only apply when air temps below 75°F. Recheck in 3 months.",
    ideal_npk_ratio: "4-1-2",
    testing_notes:
      "Get a soil test to identify deficiencies + pH level. 90% of people skip this. pH doesn't directly affect grass — it affects nutrient availability. High pH locks up iron. Preferred pH adjustment timing: dormant season. Florida residents: free soil test kits available from local UF/IFAS Extension offices — order at https://ifasbooks.ifas.ufl.edu/p-1761-soil-test-kit-powered-by-soilkit.aspx",
  },
  {
    grass_type_id: "bermuda-hybrid",
    ideal_ph: 6.25,
    ph_adjustment_product_up: "Lime (see bag rates)",
    ph_adjustment_product_down:
      "Pelletized sulfur — 5 lbs per 1,000 sq ft. Only apply when air temps below 75°F. Recheck in 3 months.",
    ideal_npk_ratio: "4-1-2",
    testing_notes:
      "Get a soil test to identify deficiencies + pH level. 90% of people skip this. pH doesn't directly affect grass — it affects nutrient availability. High pH locks up iron. Preferred pH adjustment timing: dormant season. Florida residents: free soil test kits available from local UF/IFAS Extension offices — order at https://ifasbooks.ifas.ufl.edu/p-1761-soil-test-kit-powered-by-soilkit.aspx",
  },
];

export function getBermudaSoilTarget(
  grassTypeId: string
): SoilTarget | undefined {
  return BERMUDA_SOIL_TARGETS.find((s) => s.grass_type_id === grassTypeId);
}
