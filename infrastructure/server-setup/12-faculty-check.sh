#!/usr/bin/env bash
set -uo pipefail
echo "=== faculties (id : level : name) ==="
sudo -u postgres psql -d tmtu_termiz -tAc "SELECT id||' : '||level||' : '||(name->>'uz') FROM faculties ORDER BY id;"
echo "=== directions per faculty ==="
sudo -u postgres psql -d tmtu_termiz -tAc "SELECT 'faculty '||faculty_id||' level '||level||' -> '||count(*)||' directions' FROM directions GROUP BY faculty_id, level ORDER BY faculty_id;"
echo "=== faculty pages (matching the seeded levels) ==="
for f in 1 2 3 4; do
  lvl=$(sudo -u postgres psql -d tmtu_termiz -tAc "SELECT level FROM faculties WHERE id=$f;")
  [ -z "$lvl" ] && { echo "faculty $f: (none)"; continue; }
  printf "faculty %s (%s) -> " "$f" "$lvl"
  curl -s -L --max-time 20 "http://127.0.0.1/uz/abiturientlarga/$lvl/fakultet/$f" | grep -oiE '<title>[^<]*</title>' | head -1
done
echo "FACCHECK_DONE_OK"
