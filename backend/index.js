const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const USER_ID = "Revanth naidu bevara";
const EMAIL_ID = "revanthnaidu_bevara@srmap.edu.in";
const COLLEGE_ROLL = "AP23110010701";

function parseAndProcess(data) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const validEdges = [];
  const seenEdges = new Set();

  const edgePattern = /^[A-Z]->[A-Z]$/;

  for (let raw of data) {
    const entry = typeof raw === 'string' ? raw.trim() : String(raw).trim();

    if (!edgePattern.test(entry)) {
      invalidEntries.push(raw);
      continue;
    }

    const [parent, child] = entry.split('->');
    if (parent === child) {
      invalidEntries.push(raw);
      continue;
    }

    if (seenEdges.has(entry)) {
      if (!duplicateEdges.includes(entry)) {
        duplicateEdges.push(entry);
      }
      continue;
    }

    seenEdges.add(entry);
    validEdges.push({ parent, child, raw: entry });
  }

  const allNodes = new Set([
    ...validEdges.map(e => e.parent),
    ...validEdges.map(e => e.child),
  ]);

  const adjList = {};
  const parentCount = {};

  for (const node of allNodes) {
    adjList[node] = [];
    parentCount[node] = 0;
  }

  const assignedParent = new Set();

  for (const { parent, child } of validEdges) {
    if (assignedParent.has(child)) continue;
    adjList[parent].push(child);
    parentCount[child] = (parentCount[child] || 0) + 1;
    assignedParent.add(child);
  }

  const visited = new Set();

  function getGroup(start) {
    const group = new Set();
    const queue = [start];
    while (queue.length) {
      const node = queue.shift();
      if (group.has(node)) continue;
      group.add(node);
      for (const neighbor of adjList[node]) {
        if (!group.has(neighbor)) queue.push(neighbor);
      }
    }
    return group;
  }

  function hasCycle(nodes) {
    const inDegree = {};
    const subAdj = {};
    for (const n of nodes) {
      inDegree[n] = 0;
      subAdj[n] = [];
    }
    for (const n of nodes) {
      for (const child of adjList[n]) {
        if (nodes.has(child)) {
          subAdj[n].push(child);
          inDegree[child]++;
        }
      }
    }
    const queue = [];
    for (const n of nodes) {
      if (inDegree[n] === 0) queue.push(n);
    }
    let processed = 0;
    while (queue.length) {
      const node = queue.shift();
      processed++;
      for (const child of subAdj[node]) {
        inDegree[child]--;
        if (inDegree[child] === 0) queue.push(child);
      }
    }
    return processed !== nodes.size;
  }

  function buildTree(root, nodes) {
    function recurse(node) {
      const obj = {};
      for (const child of adjList[node]) {
        if (nodes.has(child)) obj[child] = recurse(child);
      }
      return obj;
    }
    return { [root]: recurse(root) };
  }

  function calcDepth(root) {
    function dfs(node) {
      const children = adjList[node];
      if (!children || children.length === 0) return 1;
      return 1 + Math.max(...children.map(dfs));
    }
    return dfs(root);
  }

  const roots = [];
  for (const node of allNodes) {
    if (!assignedParent.has(node)) roots.push(node);
  }

  const groupRoots = new Set(roots);
  const groupedNodes = new Map();

  for (const root of roots) {
    const group = getGroup(root);
    groupedNodes.set(root, group);
    for (const n of group) visited.add(n);
  }

  for (const node of allNodes) {
    if (!visited.has(node)) {
      const group = getGroup(node);
      const cycleRoot = [...group].sort()[0];
      groupedNodes.set(cycleRoot, group);
      groupRoots.add(cycleRoot);
      for (const n of group) visited.add(n);
    }
  }

  const hierarchies = [];
  let totalTrees = 0;
  let totalCycles = 0;

  for (const root of [...groupRoots].sort()) {
    const group = groupedNodes.get(root);
    const cyclic = hasCycle(group);

    if (cyclic) {
      totalCycles++;
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      totalTrees++;
      const tree = buildTree(root, group);
      const depth = calcDepth(root);
      hierarchies.push({ root, tree, depth });
    }
  }

  let largestRoot = '';
  let maxDepth = -1;
  for (const h of hierarchies) {
    if (!h.has_cycle) {
      if (
        h.depth > maxDepth ||
        (h.depth === maxDepth && h.root < largestRoot)
      ) {
        maxDepth = h.depth;
        largestRoot = h.root;
      }
    }
  }

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestRoot,
    },
  };
}

app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'data must be an array' });
    }
    const result = parseAndProcess(data);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/bfhl', (req, res) => {
  res.status(405).json({ error: 'Use POST /bfhl' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
