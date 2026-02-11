/**
 * Zip code to climate zone / grass type mapping.
 * Uses the first 3 digits of the zip to map to a region.
 * This is a simplified mapping — a full dataset would cover all 999 prefixes.
 */

type ClimateZone = "warm" | "cool" | "transition";

interface RegionInfo {
  zone: ClimateZone;
  region: string;
  suggestedGrass: string;
  suggestedGrassKey: string;
}

// First 3 digits of zip → region info
const zipPrefixMap: Record<string, RegionInfo> = {
  // Southeast - Warm season
  "300": { zone: "warm", region: "Atlanta, GA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "301": { zone: "warm", region: "Atlanta, GA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "303": { zone: "warm", region: "Atlanta, GA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "305": { zone: "warm", region: "Miami, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "321": { zone: "warm", region: "Orlando, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "322": { zone: "warm", region: "Jacksonville, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "326": { zone: "warm", region: "Central FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "327": { zone: "warm", region: "Orlando, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "328": { zone: "warm", region: "Orlando, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "330": { zone: "warm", region: "South FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "331": { zone: "warm", region: "South FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "332": { zone: "warm", region: "South FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "333": { zone: "warm", region: "Fort Lauderdale, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "334": { zone: "warm", region: "West Palm Beach, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "335": { zone: "warm", region: "Tampa, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "336": { zone: "warm", region: "Tampa, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "337": { zone: "warm", region: "St. Petersburg, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "338": { zone: "warm", region: "Lakeland, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "339": { zone: "warm", region: "Fort Myers, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "346": { zone: "warm", region: "Tampa, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "347": { zone: "warm", region: "Clearwater, FL", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "349": { zone: "warm", region: "Florida Panhandle", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "350": { zone: "warm", region: "Birmingham, AL", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "360": { zone: "warm", region: "Montgomery, AL", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "365": { zone: "warm", region: "Mobile, AL", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "370": { zone: "transition", region: "Nashville, TN", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "372": { zone: "transition", region: "Nashville, TN", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "376": { zone: "transition", region: "Chattanooga, TN", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "377": { zone: "transition", region: "Knoxville, TN", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "380": { zone: "warm", region: "Memphis, TN", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "386": { zone: "warm", region: "Mississippi", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "390": { zone: "warm", region: "Mississippi", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "394": { zone: "warm", region: "Mississippi", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "395": { zone: "warm", region: "Mississippi", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },

  // Texas - Warm
  "750": { zone: "warm", region: "Dallas, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "751": { zone: "warm", region: "Dallas, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "752": { zone: "warm", region: "Dallas, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "753": { zone: "warm", region: "Dallas, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "760": { zone: "warm", region: "Fort Worth, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "770": { zone: "warm", region: "Houston, TX", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "771": { zone: "warm", region: "Houston, TX", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "772": { zone: "warm", region: "Houston, TX", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "773": { zone: "warm", region: "Houston, TX", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "774": { zone: "warm", region: "Houston, TX", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "775": { zone: "warm", region: "Galveston, TX", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "780": { zone: "warm", region: "San Antonio, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "781": { zone: "warm", region: "San Antonio, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "782": { zone: "warm", region: "San Antonio, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "783": { zone: "warm", region: "Corpus Christi, TX", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "785": { zone: "warm", region: "McAllen, TX", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "786": { zone: "warm", region: "Austin, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "787": { zone: "warm", region: "Austin, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "789": { zone: "warm", region: "Austin, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "790": { zone: "warm", region: "Amarillo, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "791": { zone: "warm", region: "Amarillo, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "793": { zone: "warm", region: "Lubbock, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "797": { zone: "warm", region: "Midland, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "798": { zone: "warm", region: "El Paso, TX", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },

  // Carolinas / Virginia - Transition
  "270": { zone: "transition", region: "Charlotte, NC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "272": { zone: "transition", region: "Raleigh, NC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "274": { zone: "transition", region: "Greensboro, NC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "276": { zone: "transition", region: "Raleigh, NC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "277": { zone: "transition", region: "Durham, NC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "278": { zone: "transition", region: "Rocky Mount, NC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "280": { zone: "warm", region: "Coastal NC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "284": { zone: "warm", region: "Wilmington, NC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "290": { zone: "warm", region: "Columbia, SC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "292": { zone: "warm", region: "Columbia, SC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "293": { zone: "warm", region: "Charleston, SC", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "294": { zone: "warm", region: "Greenville, SC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "220": { zone: "transition", region: "Northern Virginia", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "221": { zone: "transition", region: "Northern Virginia", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "222": { zone: "transition", region: "Arlington, VA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "223": { zone: "transition", region: "Alexandria, VA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "230": { zone: "transition", region: "Richmond, VA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "231": { zone: "transition", region: "Richmond, VA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "232": { zone: "transition", region: "Richmond, VA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "234": { zone: "warm", region: "Virginia Beach, VA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "235": { zone: "warm", region: "Norfolk, VA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },

  // Louisiana / Georgia coast - Warm
  "700": { zone: "warm", region: "New Orleans, LA", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "701": { zone: "warm", region: "New Orleans, LA", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "703": { zone: "warm", region: "New Orleans, LA", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "704": { zone: "warm", region: "Shreveport, LA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "706": { zone: "warm", region: "Shreveport, LA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "707": { zone: "warm", region: "Baton Rouge, LA", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "708": { zone: "warm", region: "Baton Rouge, LA", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "310": { zone: "warm", region: "Savannah, GA", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "314": { zone: "warm", region: "Savannah, GA", suggestedGrass: "St. Augustine", suggestedGrassKey: "st_augustine" },
  "316": { zone: "warm", region: "Valdosta, GA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "318": { zone: "warm", region: "Columbus, GA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "319": { zone: "warm", region: "Augusta, GA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },

  // Northeast / Midwest — Cool season
  "010": { zone: "cool", region: "Massachusetts", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "011": { zone: "cool", region: "Massachusetts", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "012": { zone: "cool", region: "Massachusetts", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "013": { zone: "cool", region: "Springfield, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "014": { zone: "cool", region: "Worcester, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "015": { zone: "cool", region: "Worcester, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "016": { zone: "cool", region: "Worcester, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "017": { zone: "cool", region: "Framingham, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "018": { zone: "cool", region: "Woburn, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "019": { zone: "cool", region: "Lynn, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "020": { zone: "cool", region: "Boston, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "021": { zone: "cool", region: "Boston, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "022": { zone: "cool", region: "Boston, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "023": { zone: "cool", region: "Brockton, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "024": { zone: "cool", region: "Lexington, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "025": { zone: "cool", region: "Buzzards Bay, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "026": { zone: "cool", region: "Cape Cod, MA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "027": { zone: "cool", region: "Providence, RI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "028": { zone: "cool", region: "Providence, RI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "029": { zone: "cool", region: "Rhode Island", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "030": { zone: "cool", region: "New Hampshire", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "031": { zone: "cool", region: "Manchester, NH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "032": { zone: "cool", region: "New Hampshire", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "033": { zone: "cool", region: "Concord, NH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "034": { zone: "cool", region: "New Hampshire", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "035": { zone: "cool", region: "Vermont", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "036": { zone: "cool", region: "Vermont", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "037": { zone: "cool", region: "Vermont", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "038": { zone: "cool", region: "Vermont", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "039": { zone: "cool", region: "Maine", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "040": { zone: "cool", region: "Portland, ME", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "041": { zone: "cool", region: "Portland, ME", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "042": { zone: "cool", region: "Maine", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "043": { zone: "cool", region: "Maine", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "044": { zone: "cool", region: "Bangor, ME", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "045": { zone: "cool", region: "Bath, ME", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "046": { zone: "cool", region: "Maine", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "047": { zone: "cool", region: "Maine", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "048": { zone: "cool", region: "Maine", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "049": { zone: "cool", region: "Maine", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "050": { zone: "cool", region: "Vermont", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "054": { zone: "cool", region: "Burlington, VT", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "060": { zone: "cool", region: "Hartford, CT", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "061": { zone: "cool", region: "Hartford, CT", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "062": { zone: "cool", region: "Hartford, CT", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "063": { zone: "cool", region: "New London, CT", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "064": { zone: "cool", region: "New London, CT", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "065": { zone: "cool", region: "New Haven, CT", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "066": { zone: "cool", region: "Bridgeport, CT", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "067": { zone: "cool", region: "Waterbury, CT", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "068": { zone: "cool", region: "Stamford, CT", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "069": { zone: "cool", region: "Stamford, CT", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "070": { zone: "cool", region: "Newark, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "071": { zone: "cool", region: "Newark, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "072": { zone: "cool", region: "Elizabeth, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "073": { zone: "cool", region: "Jersey City, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "074": { zone: "cool", region: "Paterson, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "075": { zone: "cool", region: "Paterson, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "076": { zone: "cool", region: "Hackensack, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "077": { zone: "cool", region: "Red Bank, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "078": { zone: "cool", region: "New Brunswick, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "079": { zone: "cool", region: "Summit, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "080": { zone: "cool", region: "South NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "081": { zone: "cool", region: "Camden, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "082": { zone: "cool", region: "South NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "083": { zone: "cool", region: "Atlantic City, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "085": { zone: "cool", region: "Trenton, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "086": { zone: "cool", region: "Trenton, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "087": { zone: "cool", region: "South NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "088": { zone: "cool", region: "New Brunswick, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "089": { zone: "cool", region: "New Brunswick, NJ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "100": { zone: "cool", region: "New York, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "101": { zone: "cool", region: "New York, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "102": { zone: "cool", region: "New York, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "103": { zone: "cool", region: "Staten Island, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "104": { zone: "cool", region: "Bronx, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "105": { zone: "cool", region: "Westchester, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "106": { zone: "cool", region: "White Plains, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "107": { zone: "cool", region: "Yonkers, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "108": { zone: "cool", region: "New Rochelle, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "109": { zone: "cool", region: "Suffern, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "110": { zone: "cool", region: "Long Island, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "111": { zone: "cool", region: "Long Island City, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "112": { zone: "cool", region: "Brooklyn, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "113": { zone: "cool", region: "Flushing, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "114": { zone: "cool", region: "Jamaica, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "115": { zone: "cool", region: "Western Nassau, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "116": { zone: "cool", region: "Long Island, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "117": { zone: "cool", region: "Hicksville, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "118": { zone: "cool", region: "Hicksville, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "119": { zone: "cool", region: "Riverhead, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "120": { zone: "cool", region: "Albany, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "121": { zone: "cool", region: "Albany, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "122": { zone: "cool", region: "Albany, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "130": { zone: "cool", region: "Syracuse, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "131": { zone: "cool", region: "Syracuse, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "140": { zone: "cool", region: "Buffalo, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "141": { zone: "cool", region: "Buffalo, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "142": { zone: "cool", region: "Buffalo, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "143": { zone: "cool", region: "Niagara Falls, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "144": { zone: "cool", region: "Rochester, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "145": { zone: "cool", region: "Rochester, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "146": { zone: "cool", region: "Rochester, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "147": { zone: "cool", region: "Jamestown, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "148": { zone: "cool", region: "Elmira, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "149": { zone: "cool", region: "Binghamton, NY", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },

  // Pennsylvania
  "150": { zone: "cool", region: "Pittsburgh, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "151": { zone: "cool", region: "Pittsburgh, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "152": { zone: "cool", region: "Pittsburgh, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "153": { zone: "cool", region: "Pittsburgh, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "154": { zone: "cool", region: "Pittsburgh, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "155": { zone: "cool", region: "Johnstown, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "160": { zone: "cool", region: "New Castle, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "161": { zone: "cool", region: "New Castle, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "162": { zone: "cool", region: "New Castle, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "168": { zone: "cool", region: "Altoona, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "169": { zone: "cool", region: "Wellsboro, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "170": { zone: "cool", region: "Harrisburg, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "171": { zone: "cool", region: "Harrisburg, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "172": { zone: "cool", region: "Chambersburg, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "173": { zone: "cool", region: "York, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "174": { zone: "cool", region: "York, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "175": { zone: "cool", region: "Lancaster, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "176": { zone: "cool", region: "Lancaster, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "180": { zone: "cool", region: "Lehigh Valley, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "181": { zone: "cool", region: "Allentown, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "182": { zone: "cool", region: "Hazleton, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "183": { zone: "cool", region: "Stroudsburg, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "184": { zone: "cool", region: "Scranton, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "185": { zone: "cool", region: "Scranton, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "186": { zone: "cool", region: "Wilkes-Barre, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "187": { zone: "cool", region: "Wilkes-Barre, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "188": { zone: "cool", region: "Scranton, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "189": { zone: "cool", region: "Doylestown, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "190": { zone: "cool", region: "Philadelphia, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "191": { zone: "cool", region: "Philadelphia, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "192": { zone: "cool", region: "Philadelphia, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "193": { zone: "cool", region: "South Philly, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "194": { zone: "cool", region: "Norristown, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "195": { zone: "cool", region: "Reading, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "196": { zone: "cool", region: "Reading, PA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },

  // Maryland / DC
  "200": { zone: "transition", region: "Washington, DC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "201": { zone: "transition", region: "Dulles, VA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "202": { zone: "transition", region: "Washington, DC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "203": { zone: "transition", region: "Washington, DC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "204": { zone: "transition", region: "Washington, DC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "205": { zone: "transition", region: "Washington, DC", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "206": { zone: "transition", region: "Southern MD", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "207": { zone: "transition", region: "Southern MD", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "208": { zone: "transition", region: "Laurel, MD", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "209": { zone: "transition", region: "Silver Spring, MD", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "210": { zone: "transition", region: "Linthicum, MD", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "211": { zone: "transition", region: "Baltimore, MD", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "212": { zone: "transition", region: "Baltimore, MD", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "214": { zone: "transition", region: "Annapolis, MD", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "215": { zone: "transition", region: "Cumberland, MD", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "216": { zone: "transition", region: "Easton, MD", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "217": { zone: "transition", region: "Frederick, MD", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "218": { zone: "transition", region: "Salisbury, MD", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "219": { zone: "transition", region: "Elkton, MD", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },

  // Ohio / Midwest
  "430": { zone: "cool", region: "Columbus, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "431": { zone: "cool", region: "Columbus, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "432": { zone: "cool", region: "Columbus, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "440": { zone: "cool", region: "Cleveland, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "441": { zone: "cool", region: "Cleveland, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "442": { zone: "cool", region: "Akron, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "443": { zone: "cool", region: "Akron, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "444": { zone: "cool", region: "Youngstown, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "445": { zone: "cool", region: "Youngstown, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "446": { zone: "cool", region: "Canton, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "447": { zone: "cool", region: "Canton, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "448": { zone: "cool", region: "Mansfield, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "449": { zone: "cool", region: "Mansfield, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "450": { zone: "cool", region: "Cincinnati, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "451": { zone: "cool", region: "Cincinnati, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "452": { zone: "cool", region: "Cincinnati, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "453": { zone: "cool", region: "Dayton, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "454": { zone: "cool", region: "Dayton, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "455": { zone: "cool", region: "Springfield, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "456": { zone: "cool", region: "Chillicothe, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "457": { zone: "cool", region: "Athens, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "458": { zone: "cool", region: "Lima, OH", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },

  // Illinois / Indiana / Michigan / Wisconsin — Cool
  "460": { zone: "cool", region: "Indianapolis, IN", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "461": { zone: "cool", region: "Indianapolis, IN", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "462": { zone: "cool", region: "Indianapolis, IN", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "480": { zone: "cool", region: "Detroit, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "481": { zone: "cool", region: "Detroit, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "482": { zone: "cool", region: "Detroit, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "483": { zone: "cool", region: "Royal Oak, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "484": { zone: "cool", region: "Flint, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "485": { zone: "cool", region: "Flint, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "486": { zone: "cool", region: "Saginaw, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "487": { zone: "cool", region: "Saginaw, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "488": { zone: "cool", region: "Lansing, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "489": { zone: "cool", region: "Lansing, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "490": { zone: "cool", region: "Kalamazoo, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "491": { zone: "cool", region: "Kalamazoo, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "492": { zone: "cool", region: "Jackson, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "493": { zone: "cool", region: "Grand Rapids, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "494": { zone: "cool", region: "Muskegon, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "495": { zone: "cool", region: "Grand Rapids, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "496": { zone: "cool", region: "Traverse City, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "497": { zone: "cool", region: "Gaylord, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "498": { zone: "cool", region: "Iron Mountain, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "499": { zone: "cool", region: "Iron Mountain, MI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "530": { zone: "cool", region: "Milwaukee, WI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "531": { zone: "cool", region: "Milwaukee, WI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "532": { zone: "cool", region: "Milwaukee, WI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "534": { zone: "cool", region: "Racine, WI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "535": { zone: "cool", region: "Madison, WI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "537": { zone: "cool", region: "Madison, WI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "540": { zone: "cool", region: "St. Paul, MN", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "541": { zone: "cool", region: "Green Bay, WI", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "550": { zone: "cool", region: "Minneapolis, MN", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "551": { zone: "cool", region: "St. Paul, MN", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "553": { zone: "cool", region: "Minneapolis, MN", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "554": { zone: "cool", region: "Minneapolis, MN", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "555": { zone: "cool", region: "Minneapolis, MN", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "600": { zone: "cool", region: "Chicago, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "601": { zone: "cool", region: "Chicago, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "602": { zone: "cool", region: "Evanston, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "603": { zone: "cool", region: "Oak Park, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "604": { zone: "cool", region: "South Chicago, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "605": { zone: "cool", region: "Chicago suburbs, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "606": { zone: "cool", region: "Chicago, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "610": { zone: "cool", region: "Rockford, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "611": { zone: "cool", region: "Rockford, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "612": { zone: "cool", region: "Rock Island, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "613": { zone: "cool", region: "La Salle, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "614": { zone: "cool", region: "Galesburg, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "615": { zone: "cool", region: "Peoria, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "616": { zone: "cool", region: "Peoria, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "617": { zone: "cool", region: "Bloomington, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "618": { zone: "cool", region: "Champaign, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "619": { zone: "cool", region: "Champaign, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "620": { zone: "cool", region: "Springfield, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "622": { zone: "transition", region: "East St. Louis, IL", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "623": { zone: "cool", region: "Quincy, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "624": { zone: "cool", region: "Effingham, IL", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "625": { zone: "transition", region: "Southern IL", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "626": { zone: "transition", region: "Southern IL", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "627": { zone: "transition", region: "Southern IL", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "628": { zone: "transition", region: "Centralia, IL", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "629": { zone: "transition", region: "Carbondale, IL", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },

  // Missouri / Kansas — Transition/Cool
  "630": { zone: "transition", region: "St. Louis, MO", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "631": { zone: "transition", region: "St. Louis, MO", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "640": { zone: "transition", region: "Kansas City, MO", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "641": { zone: "transition", region: "Kansas City, MO", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "650": { zone: "transition", region: "Jefferson City, MO", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "651": { zone: "transition", region: "Jefferson City, MO", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "660": { zone: "transition", region: "Kansas City, KS", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "661": { zone: "transition", region: "Kansas City, KS", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "662": { zone: "transition", region: "Shawnee Mission, KS", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "664": { zone: "transition", region: "Topeka, KS", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "665": { zone: "transition", region: "Topeka, KS", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "666": { zone: "transition", region: "Topeka, KS", suggestedGrass: "Zoysia", suggestedGrassKey: "zoysia" },
  "670": { zone: "transition", region: "Wichita, KS", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "671": { zone: "transition", region: "Wichita, KS", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "672": { zone: "transition", region: "South KS", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },

  // Oklahoma / Arkansas — Warm/Transition
  "730": { zone: "warm", region: "Oklahoma City, OK", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "731": { zone: "warm", region: "Oklahoma City, OK", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "740": { zone: "warm", region: "Tulsa, OK", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "741": { zone: "warm", region: "Tulsa, OK", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "720": { zone: "warm", region: "Little Rock, AR", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "721": { zone: "warm", region: "Little Rock, AR", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "722": { zone: "warm", region: "Little Rock, AR", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "723": { zone: "warm", region: "West Memphis, AR", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "724": { zone: "warm", region: "Jonesboro, AR", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "725": { zone: "warm", region: "Batesville, AR", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "726": { zone: "transition", region: "Harrison, AR", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "727": { zone: "warm", region: "Fayetteville, AR", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "728": { zone: "warm", region: "Russellville, AR", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "729": { zone: "warm", region: "Fort Smith, AR", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },

  // Arizona — Warm
  "850": { zone: "warm", region: "Phoenix, AZ", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "851": { zone: "warm", region: "Phoenix, AZ", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "852": { zone: "warm", region: "Mesa, AZ", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "853": { zone: "warm", region: "Chandler, AZ", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "855": { zone: "warm", region: "Globe, AZ", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "856": { zone: "warm", region: "Tucson, AZ", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "857": { zone: "warm", region: "Tucson, AZ", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "859": { zone: "cool", region: "Flagstaff, AZ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "860": { zone: "cool", region: "Flagstaff, AZ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "863": { zone: "cool", region: "Prescott, AZ", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "864": { zone: "warm", region: "Kingman, AZ", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "865": { zone: "warm", region: "Gallup, NM", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },

  // California
  "900": { zone: "warm", region: "Los Angeles, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "901": { zone: "warm", region: "Los Angeles, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "902": { zone: "warm", region: "Inglewood, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "903": { zone: "warm", region: "Inglewood, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "904": { zone: "warm", region: "Santa Monica, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "905": { zone: "warm", region: "Torrance, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "906": { zone: "warm", region: "Whittier, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "907": { zone: "warm", region: "Long Beach, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "908": { zone: "warm", region: "Long Beach, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "910": { zone: "warm", region: "Pasadena, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "911": { zone: "warm", region: "Pasadena, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "912": { zone: "warm", region: "Glendale, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "913": { zone: "warm", region: "Van Nuys, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "914": { zone: "warm", region: "Van Nuys, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "915": { zone: "warm", region: "Burbank, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "916": { zone: "warm", region: "North Hollywood, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "917": { zone: "warm", region: "Alhambra, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "918": { zone: "warm", region: "Alhambra, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "919": { zone: "warm", region: "San Diego, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "920": { zone: "warm", region: "San Diego, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "921": { zone: "warm", region: "San Diego, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "922": { zone: "warm", region: "Palm Desert, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "923": { zone: "warm", region: "San Bernardino, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "924": { zone: "warm", region: "San Bernardino, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "925": { zone: "warm", region: "Riverside, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "926": { zone: "warm", region: "Anaheim, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "927": { zone: "warm", region: "Santa Ana, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "928": { zone: "warm", region: "Anaheim, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "930": { zone: "warm", region: "Oxnard, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "931": { zone: "warm", region: "Santa Barbara, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "932": { zone: "warm", region: "Bakersfield, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "933": { zone: "warm", region: "Bakersfield, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "934": { zone: "cool", region: "Santa Cruz, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "935": { zone: "warm", region: "Fresno, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "936": { zone: "warm", region: "Fresno, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "937": { zone: "warm", region: "Fresno, CA", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "939": { zone: "cool", region: "Salinas, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "940": { zone: "cool", region: "San Francisco, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "941": { zone: "cool", region: "San Francisco, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "942": { zone: "cool", region: "Sacramento, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "943": { zone: "cool", region: "Palo Alto, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "944": { zone: "cool", region: "San Mateo, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "945": { zone: "cool", region: "Oakland, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "946": { zone: "cool", region: "Oakland, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "947": { zone: "cool", region: "Berkeley, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "948": { zone: "cool", region: "Richmond, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "949": { zone: "cool", region: "San Rafael, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "950": { zone: "cool", region: "San Jose, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "951": { zone: "cool", region: "San Jose, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "952": { zone: "cool", region: "Stockton, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "953": { zone: "cool", region: "Stockton, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "954": { zone: "cool", region: "Santa Rosa, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "955": { zone: "cool", region: "Eureka, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "956": { zone: "cool", region: "Sacramento, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "957": { zone: "cool", region: "Sacramento, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "958": { zone: "cool", region: "Sacramento, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "959": { zone: "cool", region: "Marysville, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "960": { zone: "cool", region: "Redding, CA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "961": { zone: "cool", region: "Reno, NV", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },

  // Colorado
  "800": { zone: "cool", region: "Denver, CO", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "801": { zone: "cool", region: "Denver, CO", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "802": { zone: "cool", region: "Denver, CO", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "803": { zone: "cool", region: "Boulder, CO", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "804": { zone: "cool", region: "Denver, CO", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "805": { zone: "cool", region: "Longmont, CO", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "806": { zone: "cool", region: "Colorado Springs, CO", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "808": { zone: "cool", region: "Colorado Springs, CO", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "809": { zone: "cool", region: "Pueblo, CO", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "810": { zone: "cool", region: "Pueblo, CO", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },

  // Pacific NW — Cool
  "970": { zone: "cool", region: "Portland, OR", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "971": { zone: "cool", region: "Portland, OR", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "972": { zone: "cool", region: "Portland, OR", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "973": { zone: "cool", region: "Salem, OR", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "974": { zone: "cool", region: "Eugene, OR", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "975": { zone: "cool", region: "Medford, OR", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "976": { zone: "cool", region: "Klamath Falls, OR", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "977": { zone: "cool", region: "Bend, OR", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "978": { zone: "cool", region: "Pendleton, OR", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "979": { zone: "cool", region: "Boise, ID", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "980": { zone: "cool", region: "Seattle, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "981": { zone: "cool", region: "Seattle, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "982": { zone: "cool", region: "Everett, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "983": { zone: "cool", region: "Tacoma, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "984": { zone: "cool", region: "Tacoma, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "985": { zone: "cool", region: "Olympia, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "986": { zone: "cool", region: "Portland, OR", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "988": { zone: "cool", region: "Wenatchee, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "989": { zone: "cool", region: "Yakima, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "990": { zone: "cool", region: "Spokane, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "991": { zone: "cool", region: "Spokane, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "992": { zone: "cool", region: "Spokane, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "993": { zone: "cool", region: "Pasco, WA", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "994": { zone: "cool", region: "Lewiston, ID", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "995": { zone: "cool", region: "Anchorage, AK", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "996": { zone: "cool", region: "Anchorage, AK", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "997": { zone: "cool", region: "Fairbanks, AK", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "998": { zone: "cool", region: "Juneau, AK", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "999": { zone: "cool", region: "Ketchikan, AK", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" },
  "967": { zone: "warm", region: "Hawaii", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
  "968": { zone: "warm", region: "Hawaii", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" },
};

// Fallback by zone based on first digit grouping
function getDefaultByFirstDigit(zip: string): RegionInfo {
  const first = zip.charAt(0);
  // 0-1: Northeast (cool), 2-3: Southeast (warm/transition), 4-5: Midwest (cool)
  // 6: Central (transition), 7: South-Central (warm), 8: Mountain (cool/warm), 9: West (cool/warm)
  switch (first) {
    case "0":
    case "1":
      return { zone: "cool", region: "Northeast", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" };
    case "2":
      return { zone: "transition", region: "Mid-Atlantic", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" };
    case "3":
      return { zone: "warm", region: "Southeast", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" };
    case "4":
    case "5":
      return { zone: "cool", region: "Midwest", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" };
    case "6":
      return { zone: "cool", region: "Central US", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" };
    case "7":
      return { zone: "warm", region: "South-Central", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" };
    case "8":
      return { zone: "cool", region: "Mountain West", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" };
    case "9":
      return { zone: "cool", region: "West Coast", suggestedGrass: "Fescue, Bluegrass, Rye", suggestedGrassKey: "cool_season" };
    default:
      return { zone: "warm", region: "your area", suggestedGrass: "Bermuda", suggestedGrassKey: "bermuda" };
  }
}

export function getRegionInfo(zip: string): RegionInfo {
  const prefix = zip.substring(0, 3);
  return zipPrefixMap[prefix] || getDefaultByFirstDigit(zip);
}

// USDA Plant Hardiness Zone lookup by 3-digit zip prefix
// Zones range from 1a (coldest) to 13b (warmest)
const zipPrefixToHardinessZone: Record<string, string> = {
  // Northeast - Maine (040-049)
  "040": "5a", "041": "5a", "042": "4b", "043": "4b", "044": "4a", "045": "4b", "046": "4a", "047": "4b", "048": "3b", "049": "4b",
  // New Hampshire (030-038)
  "030": "5b", "031": "5b", "032": "5a", "033": "5a", "034": "4b", "035": "4b", "036": "4a", "037": "4b", "038": "5b",
  // Vermont (050-059)
  "050": "4b", "051": "4b", "052": "4b", "053": "4b", "054": "4a", "056": "4a", "057": "4a", "058": "4a", "059": "4b",
  // Massachusetts (010-027)
  "010": "6a", "011": "6a", "012": "5b", "013": "5b", "014": "6a", "015": "6a", "016": "6a", "017": "6b", "018": "6b", "019": "6b",
  "020": "6b", "021": "6b", "022": "7a", "023": "6b", "024": "6b", "025": "6b", "026": "7a", "027": "6b",
  // Rhode Island (028-029)
  "028": "6b", "029": "6b",
  // Connecticut (060-069)
  "060": "6b", "061": "6b", "062": "6b", "063": "6a", "064": "6b", "065": "6a", "066": "6b", "067": "6a", "068": "6b", "069": "6b",
  // New York (100-149)
  "100": "7b", "101": "7a", "102": "7a", "103": "7b", "104": "7a", "105": "7a", "106": "6b", "107": "6b", "108": "6b", "109": "6b",
  "110": "7b", "111": "7b", "112": "7b", "113": "7a", "114": "7a", "115": "7a", "116": "7a", "117": "7a", "118": "7a", "119": "7a",
  "120": "6a", "121": "5b", "122": "5b", "123": "5b", "124": "6a", "125": "6a", "126": "5b", "127": "5b", "128": "5a", "129": "5b",
  "130": "5b", "131": "5a", "132": "5a", "133": "5b", "134": "5b", "135": "5a", "136": "5a", "137": "5a", "138": "5a", "139": "5b",
  "140": "6a", "141": "6a", "142": "6a", "143": "6a", "144": "6a", "145": "5b", "146": "6a", "147": "5b", "148": "5a", "149": "5b",
  // New Jersey (070-089)
  "070": "7a", "071": "7a", "072": "7a", "073": "7a", "074": "6b", "075": "6b", "076": "7a", "077": "7a", "078": "6b", "079": "6b",
  "080": "7a", "081": "7a", "082": "7a", "083": "7a", "084": "7a", "085": "7a", "086": "7a", "087": "7a", "088": "7a", "089": "7a",
  // Pennsylvania (150-196)
  "150": "6b", "151": "6b", "152": "6b", "153": "6a", "154": "6a", "155": "6a", "156": "6a", "157": "6a", "158": "5b", "159": "6a",
  "160": "6a", "161": "6a", "162": "5b", "163": "6a", "164": "6a", "165": "5b", "166": "6a", "167": "6a", "168": "6a", "169": "6b",
  "170": "6b", "171": "6b", "172": "6b", "173": "6b", "174": "6a", "175": "6b", "176": "6b", "177": "6b", "178": "6a", "179": "6b",
  "180": "6b", "181": "6b", "182": "6a", "183": "5b", "184": "6a", "185": "6a", "186": "6a", "187": "6a", "188": "6a", "189": "7a",
  "190": "7a", "191": "7a", "192": "7a", "193": "7a", "194": "7a", "195": "6b", "196": "7a",
  // Delaware (197-199)
  "197": "7a", "198": "7a", "199": "7a",
  // Maryland / DC (200-219)
  "200": "7a", "201": "7a", "202": "7a", "203": "7a", "204": "7a", "205": "7a", "206": "7a", "207": "7b", "208": "7a", "209": "7a",
  "210": "7a", "211": "7a", "212": "7a", "214": "7a", "215": "7a", "216": "7a", "217": "6b", "218": "6b", "219": "7a",
  // Virginia (220-246)
  "220": "7a", "221": "7a", "222": "7a", "223": "7a", "224": "7a", "225": "7a", "226": "7a", "227": "7a", "228": "7b", "229": "7a",
  "230": "7b", "231": "7b", "232": "7b", "233": "8a", "234": "8a", "235": "8a", "236": "8a", "237": "7b", "238": "7a", "239": "7b",
  "240": "7a", "241": "6b", "242": "6b", "243": "6b", "244": "6b", "245": "7a", "246": "6b",
  // West Virginia (247-268)
  "247": "6b", "248": "6b", "249": "6b", "250": "6b", "251": "6b", "252": "6a", "253": "6b", "254": "6b", "255": "6b", "256": "6b",
  "257": "6a", "258": "6a", "259": "6a", "260": "6b", "261": "6b", "262": "6a", "263": "6b", "264": "6b", "265": "6a", "266": "6a", "267": "6a", "268": "6b",
  // North Carolina (270-289)
  "270": "7b", "271": "7b", "272": "7b", "273": "7b", "274": "7b", "275": "7b", "276": "7b", "277": "7b", "278": "8a", "279": "7b",
  "280": "7b", "281": "7b", "282": "7b", "283": "8a", "284": "8a", "285": "8a", "286": "8a", "287": "7b", "288": "7b", "289": "7b",
  // South Carolina (290-299)
  "290": "8a", "291": "8b", "292": "8a", "293": "8a", "294": "8a", "295": "8a", "296": "8a", "297": "8a", "298": "8b", "299": "8b",
  // Georgia (300-319, 398-399)
  "300": "7b", "301": "7b", "302": "8a", "303": "7b", "304": "8a", "305": "10b", "306": "8a", "307": "8a", "308": "8b", "309": "8a",
  "310": "8a", "311": "8a", "312": "8a", "313": "8a", "314": "8b", "315": "8a", "316": "8b", "317": "8b", "318": "8a", "319": "8a",
  // Florida (320-349)
  "320": "9a", "321": "9b", "322": "9a", "323": "9a", "324": "8b", "325": "9a", "326": "9a", "327": "9b", "328": "9a", "329": "9b",
  "330": "10b", "331": "10b", "332": "10a", "333": "10b", "334": "10a", "335": "9b", "336": "10a", "337": "9b", "338": "9b",
  "339": "10a", "340": "10a", "341": "10a", "342": "10a", "344": "10b", "346": "9b", "347": "10a", "349": "8b",
  // Alabama (350-369)
  "350": "7b", "351": "8a", "352": "8a", "354": "7b", "355": "7b", "356": "8a", "357": "7b", "358": "8a", "359": "8a",
  "360": "8a", "361": "8a", "362": "8a", "363": "8a", "364": "8b", "365": "8b", "366": "8b", "367": "8a", "368": "8a", "369": "8a",
  // Tennessee (370-385)
  "370": "7a", "371": "7a", "372": "7a", "373": "7a", "374": "7a", "375": "7a", "376": "7b", "377": "7a", "378": "7a", "379": "7a",
  "380": "7b", "381": "7b", "382": "7b", "383": "7a", "384": "7a", "385": "7a",
  // Mississippi (386-397)
  "386": "7b", "387": "8a", "388": "8a", "389": "8a", "390": "8a", "391": "8a", "392": "8b", "393": "8b", "394": "8a", "395": "8a", "396": "8a", "397": "8a",
  // Kentucky (400-427)
  "400": "6b", "401": "6b", "402": "6b", "403": "6b", "404": "6b", "405": "6b", "406": "6b", "407": "6b", "408": "6b", "409": "6b",
  "410": "6b", "411": "6b", "412": "6b", "413": "6b", "414": "6b", "415": "6a", "416": "6a", "417": "6b", "418": "6b",
  "420": "6b", "421": "6b", "422": "6b", "423": "7a", "424": "6b", "425": "6b", "426": "6b", "427": "6b",
  // Ohio (430-458)
  "430": "6a", "431": "6a", "432": "6a", "433": "6a", "434": "6a", "435": "6a", "436": "6a", "437": "6a", "438": "6a", "439": "5b",
  "440": "6a", "441": "6a", "442": "6a", "443": "6a", "444": "6a", "445": "6a", "446": "6a", "447": "6a", "448": "6a", "449": "6a",
  "450": "6b", "451": "6a", "452": "6b", "453": "6a", "454": "6a", "455": "6a", "456": "6a", "457": "6a", "458": "6a",
  // Indiana (460-479)
  "460": "6a", "461": "6a", "462": "5b", "463": "5b", "464": "5b", "465": "5b", "466": "5b", "467": "5b", "468": "5b", "469": "5b",
  "470": "6a", "471": "6a", "472": "6b", "473": "6a", "474": "6b", "475": "6a", "476": "6b", "477": "6b", "478": "6a", "479": "6a",
  // Michigan (480-499)
  "480": "6b", "481": "6b", "482": "6a", "483": "6a", "484": "6a", "485": "6a", "486": "5b", "487": "5b", "488": "5b", "489": "5b",
  "490": "6a", "491": "6a", "492": "6a", "493": "5b", "494": "5a", "495": "5a", "496": "5a", "497": "5a", "498": "4b", "499": "4b",
  // Iowa (500-528)
  "500": "5b", "501": "5a", "502": "5b", "503": "5a", "504": "5a", "505": "5a", "506": "5a", "507": "4b", "508": "4b", "509": "5a",
  "510": "5a", "511": "5a", "512": "5a", "513": "5a", "514": "5a", "515": "5a", "516": "5a", "520": "5b", "521": "5b", "522": "5b", "523": "5b", "524": "5a", "525": "5b", "526": "5b", "527": "5b", "528": "5b",
  // Wisconsin (530-549)
  "530": "5b", "531": "5b", "532": "5b", "534": "5a", "535": "5a", "537": "5a", "538": "4b", "539": "4b",
  "540": "4a", "541": "4a", "542": "4a", "543": "4a", "544": "3b", "545": "4a", "546": "4a", "547": "4b", "548": "4b", "549": "4b",
  // Minnesota (550-567)
  "550": "4b", "551": "4b", "553": "4b", "554": "4a", "555": "4a", "556": "4a", "557": "4a", "558": "4a", "559": "4b",
  "560": "4b", "561": "4b", "562": "4a", "563": "4b", "564": "3b", "565": "3a", "566": "3b", "567": "3b",
  // South Dakota (570-577)
  "570": "5a", "571": "4b", "572": "4b", "573": "4b", "574": "4a", "575": "4a", "576": "4a", "577": "4a",
  // North Dakota (580-588)
  "580": "4a", "581": "4a", "582": "3b", "583": "3b", "584": "4a", "585": "3b", "586": "3b", "587": "3b", "588": "4a",
  // Montana (590-599)
  "590": "4b", "591": "5a", "592": "4b", "593": "4b", "594": "5a", "595": "4b", "596": "4b", "597": "4a", "598": "4a", "599": "4b",
  // Illinois (600-629)
  "600": "5b", "601": "5b", "602": "5b", "603": "5b", "604": "5b", "605": "5b", "606": "6a", "607": "5b", "608": "5b", "609": "5b",
  "610": "5b", "611": "5a", "612": "5a", "613": "5b", "614": "5b", "615": "5b", "616": "5b", "617": "6a", "618": "6a", "619": "6a",
  "620": "6a", "622": "6b", "623": "6b", "624": "5b", "625": "5b", "626": "5b", "627": "6b", "628": "6a", "629": "6b",
  // Missouri (630-658)
  "630": "6a", "631": "6b", "633": "6a", "634": "6a", "635": "6a", "636": "6a", "637": "6a", "638": "6a", "639": "6a",
  "640": "6a", "641": "6a", "644": "6a", "645": "6a", "646": "6a", "647": "6b", "648": "6b", "649": "6a",
  "650": "6b", "651": "6b", "652": "6b", "653": "6b", "654": "6a", "655": "6a", "656": "6b", "657": "6b", "658": "6b",
  // Kansas (660-679)
  "660": "6a", "661": "6a", "662": "6a", "664": "6a", "665": "5b", "666": "6a", "667": "6a", "668": "5b", "669": "6a",
  "670": "6a", "671": "6a", "672": "6b", "673": "6b", "674": "6b", "675": "6a", "676": "6a", "677": "6b", "678": "6b", "679": "6b",
  // Nebraska (680-693)
  "680": "5b", "681": "5b", "683": "5a", "684": "5a", "685": "5a", "686": "5a", "687": "5a", "688": "5a", "689": "5a",
  "690": "5a", "691": "5a", "692": "4b", "693": "4b",
  // Louisiana (700-714)
  "700": "9a", "701": "9a", "703": "9a", "704": "8b", "705": "8b", "706": "8b", "707": "8b", "708": "8b", "710": "8b", "711": "8a", "712": "8a", "713": "8a", "714": "8a",
  // Arkansas (716-729)
  "716": "8a", "717": "7b", "718": "7b", "719": "7b", "720": "7b", "721": "7b", "722": "7b", "723": "7b", "724": "7b", "725": "7b", "726": "7a", "727": "7a", "728": "7b", "729": "7b",
  // Oklahoma (730-749)
  "730": "7b", "731": "7a", "734": "7a", "735": "7a", "736": "7a", "737": "7a", "738": "7a", "739": "7a",
  "740": "7a", "741": "7a", "743": "7a", "744": "7a", "745": "7a", "746": "7a", "747": "6b", "748": "7a", "749": "6b",
  // Texas (750-799, 885)
  "750": "8a", "751": "8a", "752": "8a", "753": "8a", "754": "8a", "755": "8b", "756": "8b", "757": "8b", "758": "8b", "759": "8b",
  "760": "8a", "761": "8a", "762": "8a", "763": "7b", "764": "7b", "765": "8a", "766": "8a", "767": "8a", "768": "8a", "769": "8a",
  "770": "9a", "771": "9a", "772": "9a", "773": "9a", "774": "9a", "775": "8b", "776": "9a", "778": "9b", "779": "9a",
  "780": "8b", "781": "8b", "782": "8b", "783": "9a", "784": "9a", "785": "9a", "786": "9b", "787": "8b", "788": "8b", "789": "8a",
  "790": "7b", "791": "7b", "792": "7b", "793": "7b", "794": "7a", "795": "7a", "796": "8a", "797": "8a", "798": "8a", "799": "8a",
  "885": "8a",
  // Colorado (800-816)
  "800": "5b", "801": "5b", "802": "5b", "803": "6a", "804": "5b", "805": "5b", "806": "5b", "807": "5a", "808": "5a", "809": "5a",
  "810": "5b", "811": "5a", "812": "5a", "813": "5a", "814": "4b", "815": "5a", "816": "5a",
  // Wyoming (820-831)
  "820": "5a", "821": "5a", "822": "5a", "823": "5a", "824": "4b", "825": "4b", "826": "4b", "827": "4a", "828": "4b", "829": "5a", "830": "4b", "831": "5a",
  // Idaho (832-838)
  "832": "6b", "833": "7a", "834": "5b", "835": "6b", "836": "5b", "837": "5a", "838": "5b",
  // Utah (840-847)
  "840": "7a", "841": "6b", "842": "6a", "843": "6b", "844": "5b", "845": "5b", "846": "6a", "847": "5a",
  // Nevada (889-898)
  "889": "9a", "890": "9a", "891": "8b", "893": "6b", "894": "6b", "895": "6b", "897": "6a", "898": "7a",
  // Arizona (850-865)
  "850": "9b", "851": "9b", "852": "9b", "853": "9b", "855": "9a", "856": "9a", "857": "8b", "859": "7a", "860": "9b", "863": "7a", "864": "8a", "865": "8a",
  // New Mexico (870-884)
  "870": "7b", "871": "7a", "873": "7a", "874": "6b", "875": "7a", "877": "6a", "878": "7a", "879": "7b", "880": "8a", "881": "7b", "882": "7b", "883": "7a", "884": "7a",
  // California (900-961)
  "900": "10b", "901": "10a", "902": "10b", "903": "10a", "904": "10a", "905": "10a", "906": "10a", "907": "10b", "908": "10a", "909": "9b",
  "910": "10a", "911": "10a", "912": "10a", "913": "10a", "914": "10a", "915": "10a", "916": "10a", "917": "10a", "918": "10a", "919": "10b",
  "920": "10b", "921": "10b", "922": "10a", "923": "10a", "924": "9b", "925": "9b", "926": "10b", "927": "10b", "928": "10a",
  "930": "10a", "931": "9b", "932": "9a", "933": "9a", "934": "10a", "935": "9a", "936": "9b", "937": "9b", "938": "9a", "939": "10a",
  "940": "10a", "941": "10b", "942": "10a", "943": "10a", "944": "10a", "945": "9b", "946": "10a", "947": "10a", "948": "10a", "949": "10a",
  "950": "9b", "951": "10a", "952": "9b", "953": "9b", "954": "10a", "955": "9b", "956": "9a", "957": "9a", "958": "9b", "959": "8b",
  "960": "9a", "961": "8b",
  // Oregon (970-979)
  "970": "8b", "971": "8b", "972": "8b", "973": "8b", "974": "8a", "975": "7b", "976": "6b", "977": "6b", "978": "6a", "979": "6b",
  // Washington (980-994)
  "980": "8b", "981": "8b", "982": "8b", "983": "8b", "984": "8b", "985": "8a", "986": "7b", "988": "6b", "989": "6b",
  "990": "6b", "991": "6b", "992": "6b", "993": "6a", "994": "6a",
  // Alaska (995-999)
  "995": "4b", "996": "4a", "997": "3b", "998": "3a", "999": "7a",
  // Hawaii (967-968)
  "967": "11a", "968": "11a",
};

// Fallback hardiness zone by first digit of zip
function getDefaultHardinessZone(zip: string): string {
  const first = zip.charAt(0);
  switch (first) {
    case "0": return "5b";  // Northeast
    case "1": return "6a";  // Northeast/Mid-Atlantic
    case "2": return "7a";  // Mid-Atlantic/Southeast
    case "3": return "8b";  // Southeast
    case "4": return "6a";  // Midwest/Great Lakes
    case "5": return "5a";  // Upper Midwest
    case "6": return "6a";  // Central US
    case "7": return "8a";  // South-Central
    case "8": return "6a";  // Mountain West
    case "9": return "9b";  // West Coast
    default: return "7a";
  }
}

/**
 * Get the USDA Plant Hardiness Zone for a given zip code.
 * Returns a zone string like "7a", "10b", etc.
 */
export function getHardinessZone(zip: string): string {
  const prefix = zip.substring(0, 3);
  return zipPrefixToHardinessZone[prefix] || getDefaultHardinessZone(zip);
}

export type { RegionInfo, ClimateZone };
