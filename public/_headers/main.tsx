# Security Headers for Better SEO and Security
/*
  # Security Headers
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
  
  # HTTPS and SSL
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  
  # Caching Headers for Performance
  Cache-Control: public, max-age=31536000, immutable
  
  # Content Security (can be customized)
  X-Robots-Tag: index, follow

# Specific rules for static assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# HTML pages
/*.html
  Cache-Control: public, max-age=0, must-revalidate
  X-Robots-Tag: index, follow

# Sitemap
/sitemap.xml
  Content-Type: application/xml
  Cache-Control: public, max-age=3600
  X-Robots-Tag: noindex

# Robots.txt
/robots.txt
  Content-Type: text/plain
  Cache-Control: public, max-age=3600
  X-Robots-Tag: noindex

# Manifest
/manifest.json
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=86400
