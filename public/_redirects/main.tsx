# Redirects for MUXION

# Force HTTPS (when deployed)
http://muxion.in/* https://muxion.in/:splat 301!
http://www.muxion.in/* https://muxion.in/:splat 301!

# Redirect www to non-www
https://www.muxion.in/* https://muxion.in/:splat 301!

# Handle old URLs (if migrating from old site)
/courses /course 301
/classes /course 301
/about /# 200

# Catch-all for SPA (must be last)
/* /index.html 200
