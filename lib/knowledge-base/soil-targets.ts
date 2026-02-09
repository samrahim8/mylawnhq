import { SoilTarget } from "@/types";

export const SOIL_TARGETS: SoilTarget[] = [
  {
    grass_type_id: "tall-fescue",
    ideal_ph: 6.5,
    ph_adjustment_product_up: "lime",
    ph_adjustment_product_down: "sulfur",
    ideal_npk_ratio: "4-1-2",
    testing_notes:
      "Recommended lab: Clemson University or local extension office. Focus on pH and phosphorus levels. Use the same lab year after year. Don't over-read results — focus on wild spikes and pH. If phosphorus is high, switch to PGF 16-0-8. If phosphorus is low, use PGF Balance 10-10-10. Florida residents: free soil test kits available from local UF/IFAS Extension offices — order at https://ifasbooks.ifas.ufl.edu/p-1761-soil-test-kit-powered-by-soilkit.aspx",
  },
  {
    grass_type_id: "fine-fescue",
    ideal_ph: 6.5,
    ph_adjustment_product_up: "lime",
    ph_adjustment_product_down: "sulfur",
    ideal_npk_ratio: "4-1-2",
    testing_notes:
      "Same testing approach as tall fescue. Fine fescues have lower nitrogen needs but same pH and phosphorus targets. Florida residents: free soil test kits available from local UF/IFAS Extension offices — order at https://ifasbooks.ifas.ufl.edu/p-1761-soil-test-kit-powered-by-soilkit.aspx",
  },
  {
    grass_type_id: "perennial-ryegrass",
    ideal_ph: 6.5,
    ph_adjustment_product_up: "lime",
    ph_adjustment_product_down: "sulfur",
    ideal_npk_ratio: "4-1-2",
    testing_notes:
      "Same testing approach. Perennial ryegrass is less drought tolerant — ensure adequate irrigation when adjusting soil amendments. Florida residents: free soil test kits available from local UF/IFAS Extension offices — order at https://ifasbooks.ifas.ufl.edu/p-1761-soil-test-kit-powered-by-soilkit.aspx",
  },
  {
    grass_type_id: "kentucky-bluegrass",
    ideal_ph: 6.5,
    ph_adjustment_product_up: "lime",
    ph_adjustment_product_down: "sulfur",
    ideal_npk_ratio: "4-1-2",
    testing_notes:
      "KBG has higher nitrogen needs (2-4 lb N/1000 sqft/season) and produces significant thatch. Soil test is especially important to avoid excess phosphorus which locks up other nutrients. Consider extra potassium only if soil test shows LOW levels — excessive potassium causes foliar burn and affects magnesium uptake. Florida residents: free soil test kits available from local UF/IFAS Extension offices — order at https://ifasbooks.ifas.ufl.edu/p-1761-soil-test-kit-powered-by-soilkit.aspx",
  },
];

export function getSoilTargetByGrassType(
  grassTypeId: string
): SoilTarget | undefined {
  return SOIL_TARGETS.find((s) => s.grass_type_id === grassTypeId);
}
