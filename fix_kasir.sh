#!/bin/bash
# Create a backup
cp pages/pos/kasir.tsx pages/pos/kasir.tsx.backup

# Replace the end of the file with the correct structure
sed -i '' -e 's/  <\/div>\n);/  <\/div>\n  <\/KasirLayout>\n  );\n};/' pages/pos/kasir.tsx

# Check if the fix worked
tail -n 10 pages/pos/kasir.tsx
