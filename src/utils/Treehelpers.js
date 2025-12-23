export function convertTreeToJson(nodes, edges) {
  if (!nodes.length) return null;

  const allIds = nodes.map(n => n.id);
  const childIds = edges.map(e => e.to);
  const rootId = allIds.find(id => !childIds.includes(id)) || allIds[0];

  function makeTree(id) {
    const node = nodes.find(n => n.id === id);
    if (!node) return {};

    const childrenObj = {};
    edges
      .filter(e => e.from === id)
      .forEach(e => {
        childrenObj[e.to] = makeTree(e.to); // children as direct keys
      });

    // Root node
    if (id === rootId) {
      return {
        _id: node.id,
        assetsTreeObj: childrenObj,  // wrap first-level children under assetsTreeObj
        tag: node.data?.tag || "AssetTree",
        createdAt: node.data?.createdAt || new Date().toISOString(),
        updatedAt: node.data?.updatedAt || new Date().toISOString(),
        __v: node.data?.__v || 0,
      };
    }

    // Normal child node: merge properties + children directly
    return {
      properties: node.data?.properties || {},
      ...childrenObj
    };
  }

  return makeTree(rootId);
}




// node: the node object
// clickX, clickY: canvas coordinates of the click
// showProperties: whether detailed node mode is on
export function isClickedOnExpanded(node, clickX, clickY, showProperties) {
  console.log("isClickedOnExpanded called with: ", node, clickX, clickY, showProperties);
  const NODE_HEIGHT = showProperties ? 160 : 40;
  const NODE_WIDTH  = showProperties ? 260 : 90;

  const circleRadius = 10; // same as drawNodes
  const circleX = node.x + NODE_WIDTH / 2 - circleRadius - 4; // match the offset in drawNodes
  const circleY = node.y - NODE_HEIGHT / 2 + circleRadius + 4;

  const dx = clickX - circleX;
  const dy = clickY - circleY;

  return dx * dx + dy * dy <= circleRadius * circleRadius;
}

