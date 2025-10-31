// 1. Export an ASYNCHRONOUS function
// Eleventy will wait for this function to finish
module.exports = async function() {
  
  // 2. Use dynamic import() to load the 'd3' ES Module
  const d3 = await import("d3");

  // 3. Load your JSON data (require is fine for JSON)
  const familyTreeData = require("./family.json");

  // 4. Create the D3 hierarchy
  const root = d3.hierarchy(familyTreeData);

  // 5. Generate the flattened list
  const flattenedPeople = root.descendants().map((d, i) => {
    
    d.data.id = i;

    return {
      id: d.data.id,
      name: d.data.name,
      children: d.data.children || [] 
    };
  });

  // 6. RETURN the data from the function
  return flattenedPeople;
};