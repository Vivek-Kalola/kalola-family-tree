// 1. Export an ASYNCHRONOUS function
// Eleventy will wait for this function to finish
module.exports = async function() {
  
  // 2. Use dynamic import() to load the 'd3' ES Module
  const d3 = await import("d3");

  // 3. Load your JSON data (require is fine for JSON)
  const familyTreeData = require("./family.json");

  // 4. Create the D3 hierarchy
  const root = d3.hierarchy(familyTreeData);

  // 5. Get all nodes
  const allNodes = root.descendants();

  // 6. --- NEW: Assign IDs to all nodes first ---
  // This ensures that when we process a parent, the child nodes
  // already have their IDs assigned.
  allNodes.forEach((d, i) => {
    d.id = i; // Assign the ID directly to the D3 node
  });

  // 7. --- MODIFIED: Generate the flattened list ---
  const flattenedPeople = allNodes.map(d => {
    
    // --- NEW: Get ancestors for breadcrumbs ---
    // d.ancestors() returns [current, parent, grandparent, root]
    // We slice(1) to remove the current person
    // We reverse() to get [root, grandparent, parent]
    const ancestors = d.ancestors()
      .slice(1)
      .reverse()
      .map(node => ({
        name: node.data.name,
        id: node.id // Use the ID we assigned in step 6
      }));

    // --- FIX: Map children to include their IDs ---
    // This creates a new array of simple child objects
    // that include the ID for linking.
    const children = (d.children || []).map(childNode => ({
      name: childNode.data.name,
      id: childNode.id // Use the ID from step 6
    }));

    // 8. Return the complete object for this person
    return {
      id: d.id,
      name: d.data.name,
      spouse: d.data.spouse,
      daughter: d.data.daughter,
      children: children,    // The fixed children array
      ancestors: ancestors   // The new ancestors array
    };
  });

  // 9. RETURN the data from the function
  return flattenedPeople;
};