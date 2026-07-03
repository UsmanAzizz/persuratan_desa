const fs = require('fs');

let layout = fs.readFileSync('src/components/layout/PublicLayout.jsx', 'utf8');
layout = layout.replace(
  "import React from 'react';\nimport { Outlet, Link } from 'react-router-dom';",
  "import React, { useEffect } from 'react';\nimport { Outlet, Link, useLocation } from 'react-router-dom';"
);
layout = layout.replace(
  "import React from 'react';\r\nimport { Outlet, Link } from 'react-router-dom';",
  "import React, { useEffect } from 'react';\r\nimport { Outlet, Link, useLocation } from 'react-router-dom';"
);
layout = layout.replace(
  "export const PublicLayout = () => {",
  "export const PublicLayout = () => {\n  const { pathname } = useLocation();\n\n  useEffect(() => {\n    window.scrollTo(0, 0);\n  }, [pathname]);\n"
);
fs.writeFileSync('src/components/layout/PublicLayout.jsx', layout);

let track = fs.readFileSync('src/pages/public/TrackStatus.jsx', 'utf8');
track = track.replace('<div className="max-w-3xl mx-auto mb-20">', '<div className="max-w-3xl mx-auto mt-6 mb-20">');
fs.writeFileSync('src/pages/public/TrackStatus.jsx', track);

console.log("Edit berhasil dengan script Node.js!");
