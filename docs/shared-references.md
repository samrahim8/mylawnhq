<!--
  APP LAYER INSTRUCTION — CONDITIONAL INJECTION
  This file should NOT be included in every LLM call.
  Only inject when the user's question is about products, links, resources, or equipment.
  Detection signals: user mentions a product name, asks "what should I buy", "where can I find",
  "what product", "link to", "equipment", "tools", "resources", etc.
  For basic care questions (mowing height, watering, fertilizer timing), this file is NOT needed.
  Saves ~800-1,000 tokens per call when excluded.
-->

# Shared References — Lawn HQ Knowledge Base

---

## Product Websites

| Product | URL |
|---------|-----|
| PGF Complete | https://www.pgfcomplete.com |
| Super Juice Fertilizer | https://www.superjuicefertilizer.com/ |
| HUMICHAR | https://www.humichar.com/ |
| GreenShocker | https://www.greenshocker.com/ |
| DirtBooster | https://www.dirtbooster.com/ |
| Dark Green Lawn (DGL) | https://darkgreenlawn.com/ |
| McLane Reel Mowers | https://mclanelawnmowers.com/ |

---

## Grass-Specific Guides (Doc's Sites)

| Grass Type | URL |
|-----------|-----|
| Bermuda | https://www.bermudalawnguide.com/ |
| Zoysia | https://www.zoysialawnguide.com/ |
| Cool Season (Fescue, KBG, Rye) | https://www.freelawncareguide.com/ |

---

## Educational & University Sources

| Resource | URL |
|----------|-----|
| GreenCast Soil Temp Map | https://www.greencastonline.com/tools/soil-temperature |
| GreenCast Disease Guide | https://www.greencastonline.com/diseaseguide |
| Weed Alert — Weed ID by Region | https://www.weedalert.com/ |
| Illinois Extension — Choosing Fertilizers | https://extension.illinois.edu/lawntalk/planting/choosing_fertilizers_for_home_lawns.cfm |
| Missouri Extension — Fertilizer Calculator | http://agebb.missouri.edu/fertcalc/ |
| Texas A&M — Lawn Fertilization | https://www.austintexas.gov/sites/default/files/files/Watershed/growgreen/3_7_12_2011_lawn_fertilization_in_tx_E-437_handout_3_Chalmers.pdf |
| Purdue — Lawn Disease Guide | https://www.extension.purdue.edu/extmedia/BP/BP-124-W.pdf |
| Aeration + PE Study (Walter Reeves) | https://www.walterreeves.com/landscaping/aerate-instructions/ |
| MSU — Grass Mixing Article | https://archive.lib.msu.edu/tic/holen/article/2000jul23.pdf |
| Pitchcare — Thatch Article | https://www.pitchcare.com/news-media/thatch-your-friend-and-food-for-fine-grass.html |

---

## UF/IFAS Extension Publications (St. Augustine Focus)

| Publication | URL |
|-------------|-----|
| ENH5 — St. Augustinegrass for Florida Lawns | https://edis.ifas.ufl.edu/LH010 |
| ENH02 — Preparing to Plant a Florida Lawn | https://edis.ifas.ufl.edu/lh012 |
| ENH3 — Establishing Your Florida Lawn | https://edis.ifas.ufl.edu/lh013 |
| ENH10 — Mowing Your Florida Lawn | https://edis.ifas.ufl.edu/lh028 |
| ENH9 — Watering Your Florida Lawn | https://edis.ifas.ufl.edu/lh025 |
| ENH1089 — Urban Turf Fertilizer Rule | https://edis.ifas.ufl.edu/ep353 |
| ENH884 — Weed Management in Home Lawns | https://edis.ifas.ufl.edu/ep141 |
| ENY300 — Insect Pest Management on Turfgrass | https://edis.ifas.ufl.edu/ig001 |
| SS-PLP-14 — Turfgrass Disease Management | https://edis.ifas.ufl.edu/lh040 |
| PP-233 — Homeowner's Guide to Fungicides | https://edis.ifas.ufl.edu/pp154 |
| Clemson HGIC — St. Augustine Maintenance Calendar | https://hgic.clemson.edu/factsheet/st-augustinegrass-maintenance-calendar/ |

---

## External References (St. Augustine)

| Source | URL |
|--------|-----|
| OtO Lawn — Lawn Care 101 | https://otolawn.com/blogs/lawn-care-101/lawn-care-101-a-new-homeowner-s-guide-to-modern-lawn-care |
| DoMyOwn — St. Augustine Care | https://www.domyown.com/how-to-care-for-st-augustine-grass-a-796.html |
| Super-Sod — St. Augustine Maintenance | https://info.supersod.com/lawn-care/st.-augustine-lawn-maintenance |
| UF/IFAS — Homeowners Guide (PDF) | https://turf.ifas.ufl.edu/media/hortifasufledu/turf-science/turf-science-pdfs/home-owners-guide/EH_HomeownersGuideToStAugustinegrassManagement_Factsheet_Final.pdf |

---

## Video References

| Topic | Grass Type | URL |
|-------|-----------|-----|
| Lawn Transformation | Bermuda | https://www.youtube.com/watch?v=KUbIYAPb5xA |
| Bermuda Seed Basics | Bermuda | https://www.youtube.com/watch?v=B1yUzHYbyZU |
| Over-seeding Bermuda | Bermuda | https://www.youtube.com/watch?v=7GqwoSSAnPc |
| Fixing Bare Spots (Runners) | Bermuda | https://www.youtube.com/watch?v=dPeIIfYrZoE |
| Scalp Marks Explained | Bermuda | https://www.youtube.com/watch?v=l493elKIHnI |
| Lawn Leveling | Bermuda | https://www.youtube.com/watch?v=aQ0hmssW6eM |
| Nutsedge Treatment | All | https://www.youtube.com/watch?v=fwg0jGZlikI |
| Low-Cut Rotary Mower | Zoysia | https://www.youtube.com/watch?v=IK9xbOwxQSs |
| Leveling Zoysia Lawn | Zoysia | https://www.youtube.com/watch?v=rpdZpM3vLqk |
| How To with Doc (Channel) | All | https://www.youtube.com/c/HowTowithDoc/videos |

---

## Bermuda Seed Varieties

| Variety | Price/lb | Notes |
|---------|----------|-------|
| Arden 15 | $22-$32 | Pennington's upgrade to Princess 77, improved cold tolerance, dark green |
| LaPrima XD | $16-$29 | Blend of Yukon + Royal Bengal, fast establishment |
| Black Jack | $7-$9 | Fine-textured, dark green, cold tolerant, good for overseeding |
| Yukon | $20-$29 | Oklahoma State developed, most cold tolerant seeded Bermuda |

All Bermuda seed at Lowe's/Home Depot is COMMON Bermuda. Quality seed runs $7-$35/lb.

---

## Weed Killer Products (Cross-Grass Reference)

| Product | Type | Use | St. Aug Safe? |
|---------|------|-----|---------------|
| Q4 Plus | Concentrate spray | Broadleaf + grassy weeds | Check label |
| Southern Ag 2,4-D | Concentrate | Affordable broadleaf | NO — damages St. Augustine |
| BioAdvanced All-In-One | Concentrate | Broadleaf + crabgrass (200+ weeds) | NO — label excludes St. Aug |
| BioAdvanced Kill & Prevent | 2-in-1 | Post + pre-emergent (6mo prevention) | Check label |
| Drive (Quinclorac) | Professional | Heavy crabgrass | Check label |
| Image Herbicide | Concentrate | Poa annua + nutsedge | Yes |
| Atrazine | Post-emergent | Broadleaf + some grassy | Yes — commonly used on St. Aug |
| Celsius | Thiencarbazone + dicamba | Nearly all broadleaf | Bermuda/Zoysia only |
| Certainty | Sulfosulfuron | Grassy + nutsedge | Bermuda/Zoysia only |
| Dismiss | Sulfentrazone | Nutsedge + resistant weeds | Check label |

---

## Fungicide Products (Cross-Grass Reference)

| Product | Active Ingredient | Best For |
|---------|------------------|----------|
| Heritage | Azoxystrobin | Brown patch, dollar spot (broad spectrum) |
| Banner MAXX | Propiconazole | Brown patch, spring dead spot |
| Insignia | Pyraclostrobin | Dollar spot (preventive) |
| Eagle 20EW | Myclobutanil | Dollar spot, brown patch |
| Cleary's 3336F | Thiophanate-methyl | Bermuda decline, brown patch, dollar spot |
| Prophesy | Propiconazole (DG Pro) | Broad spectrum — zoysia/bermuda rec |
| P-DG Fungicide | DG technology | Preventive — bermuda rec |

---

## Advanced Pre-Emergent Reference (Bermuda/Zoysia)

### Prodiamine (Barricade) — Spring
| Timing | Rate |
|--------|------|
| Soil 50°F (~end Feb DFW) | 0.3 oz/1,000 sqft |
| 30-60 days later | 0.3 oz/1,000 sqft |
| Optional summer | 0.2 oz/1,000 sqft |
| Annual max | 0.83 oz/1,000 sqft/year |

### Indaziflam (Specticle Flo) — Fall
| Timing | Rate |
|--------|------|
| Soil 80°F (~Labor Day DFW) | 2-3 mL/1,000 sqft |
| 30-45 days later | 2-3 mL/1,000 sqft |
| 30-45 days later (~Dec 1) | 2-3 mL/1,000 sqft |

### PE Comparison
| Product | Active | Best For | Notes |
|---------|--------|----------|-------|
| Barricade | Prodiamine | Spring, broad weed prevention | Gentlest on bermuda |
| Specticle Flo | Indaziflam | Fall, poa annua | Best residual, most expensive |
| Dimension | Dithiopyr | Spring, early crabgrass | Also post-emergent on young crabgrass |
| Pendimethalin | Pendimethalin | Annual grasses | 8-16% more bermuda suppression than prodiamine |

---

## Post-Emergent Reference (Bermuda/Zoysia — Celsius + Certainty System)

Celsius + Certainty kills 99.9% of weeds in Bermuda/Zoysia without harming grass.

### Mix Recipe (per 1 gallon water)
| Component | Amount |
|-----------|--------|
| Surfactant | 1/3 fl oz (2 tsp) |
| Blue dye | 1-2 tsp |
| Acidifier (white vinegar) | couple tablespoons |
| Celsius | 0.085 oz (2.4 grams) |
| Certainty | 0.3 grams (2 small scoops) |

Application: spot spray (don't broadcast unless 40%+ infestation). Must DRY on leaves — do NOT water in.

---

## Equipment Quick Reference

| Product | Use Case |
|---------|----------|
| McLane 25" Reel Mower | Bermuda/Zoysia under 1.5" |
| Sun Joe AJ801E | Bladed dethatcher (last resort on warm-season) |
| ProGrade Lawn Spreader | 15-gallon hopper, 100 lb capacity |
| Hose End Spray Bottles (20:1) | Super Juice + liquid sprays |
| Core pulling aerator | Annual aeration (NOT spike units) |
