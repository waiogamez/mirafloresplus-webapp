/**
 * Build-Time Protection - Miraflores Plus
 * 
 * Configuraciones para proteger el código en producción
 * Estas son instrucciones para el proceso de build
 */

/**
 * Configuración de Vite para Obfuscation
 * 
 * Agregar a vite.config.ts:
 */

export const viteObfuscationConfig = {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,        // Remover console.log
        drop_debugger: true,       // Remover debugger
        pure_funcs: ['console.info', 'console.debug', 'console.warn'], // Remover funciones específicas
        passes: 3,                 // Múltiples pasadas de optimización
      },
      mangle: {
        toplevel: true,            // Renombrar variables top-level
        properties: {
          regex: /^_/,             // Renombrar props que empiezan con _
        },
      },
      format: {
        comments: false,           // Remover comentarios
      },
    },
    sourcemap: false,              // NO generar sourcemaps
    rollupOptions: {
      output: {
        manualChunks: undefined,   // Un solo chunk (más difícil de analizar)
      },
    },
  },
};

/**
 * Instrucciones para agregar Obfuscation real
 * 
 * PASO 1: Instalar paquete de obfuscation
 * ```bash
 * npm install --save-dev javascript-obfuscator vite-plugin-javascript-obfuscator
 * ```
 * 
 * PASO 2: Agregar a vite.config.ts
 * ```typescript
 * import { obfuscator } from 'vite-plugin-javascript-obfuscator';
 * 
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     obfuscator({
 *       include: ['src/**\/*.tsx', 'src/**\/*.ts'],
 *       exclude: [/node_modules/],
 *       apply: 'build',
 *       options: {
 *         compact: true,
 *         controlFlowFlattening: true,
 *         controlFlowFlatteningThreshold: 0.75,
 *         deadCodeInjection: true,
 *         deadCodeInjectionThreshold: 0.4,
 *         debugProtection: true,
 *         debugProtectionInterval: 4000,
 *         disableConsoleOutput: true,
 *         identifierNamesGenerator: 'hexadecimal',
 *         log: false,
 *         numbersToExpressions: true,
 *         renameGlobals: false,
 *         selfDefending: true,
 *         simplify: true,
 *         splitStrings: true,
 *         splitStringsChunkLength: 10,
 *         stringArray: true,
 *         stringArrayCallsTransform: true,
 *         stringArrayEncoding: ['base64'],
 *         stringArrayIndexShift: true,
 *         stringArrayRotate: true,
 *         stringArrayShuffle: true,
 *         stringArrayWrappersCount: 2,
 *         stringArrayWrappersChainedCalls: true,
 *         stringArrayWrappersParametersMaxCount: 4,
 *         stringArrayWrappersType: 'function',
 *         stringArrayThreshold: 0.75,
 *         transformObjectKeys: true,
 *         unicodeEscapeSequence: false,
 *       },
 *     }),
 *   ],
 * });
 * ```
 */

/**
 * Configuración de Headers de Seguridad para Nginx
 */
export const nginxSecurityHeaders = `
# /etc/nginx/sites-available/miraflores-plus

server {
    listen 443 ssl http2;
    server_name mirafloresplus.com www.mirafloresplus.com;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.mirafloresplus.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;

    # Disable Directory Listing
    autoindex off;

    # Block access to sensitive files
    location ~ /\\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ \\.(env|log|sql|bak)$ {
        deny all;
    }

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Main app
    location / {
        root /var/www/miraflores-plus/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API proxy (si aplica)
    location /api/ {
        proxy_pass https://api-backend.mirafloresplus.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name mirafloresplus.com www.mirafloresplus.com;
    return 301 https://$server_name$request_uri;
}
`;

/**
 * Configuración para Vercel
 */
export const vercelConfig = {
  // vercel.json
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(), microphone=(), camera=()',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload',
        },
        {
          key: 'Content-Security-Policy',
          value:
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.mirafloresplus.com; frame-ancestors 'none';",
        },
      ],
    },
  ],
  rewrites: [
    {
      source: '/api/:path*',
      destination: 'https://api-backend.mirafloresplus.com/:path*',
    },
  ],
};

/**
 * Configuración para Cloudflare
 */
export const cloudflareConfig = `
// _headers file para Cloudflare Pages

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.mirafloresplus.com; frame-ancestors 'none';

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`;

/**
 * Environment Variables de Producción
 */
export const productionEnvExample = `
# .env.production

# NO incluir claves reales aquí
# Usar variables de entorno del servidor

VITE_APP_NAME=Miraflores Plus
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# Domain Lock
VITE_ALLOWED_DOMAINS=mirafloresplus.com,www.mirafloresplus.com

# API
VITE_API_URL=https://api.mirafloresplus.com
VITE_API_KEY=USE_SERVER_ENV_VAR

# Protection
VITE_ENABLE_CODE_PROTECTION=true
VITE_ENABLE_DEVTOOLS_DETECTION=true
VITE_ENABLE_DOMAIN_LOCK=true

# Supabase (usar server-side)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=USE_SERVER_ENV_VAR
`;

/**
 * .gitignore crítico
 */
export const criticalGitignore = `
# Crítico - NUNCA commitear

# Environment variables
.env
.env.local
.env.production
.env.*.local

# API Keys
**/api-keys.json
**/secrets.json
**/credentials.json

# Build artifacts con sourcemaps
dist/**/*.map
build/**/*.map

# Database
*.db
*.sqlite

# Logs
logs/
*.log

# Sensitive configs
**/config.production.json
**/firebase-admin-key.json
**/service-account.json

# IDE
.vscode/settings.json
.idea/

# System
.DS_Store
Thumbs.db

# Backup files
*.bak
*.backup
*.old
`;

/**
 * Licencia y Copyright
 */
export const licenseText = `
/**
 * Miraflores Plus - Sistema de Gestión de Salud
 * 
 * Copyright © ${new Date().getFullYear()} Miraflores Plus. Todos los derechos reservados.
 * 
 * LICENCIA PROPIETARIA
 * 
 * Este software y todo su código fuente son propiedad exclusiva de Miraflores Plus.
 * 
 * ESTÁ PROHIBIDO:
 * - Copiar, modificar o distribuir este código sin autorización escrita
 * - Realizar ingeniería inversa o descompilar el código
 * - Usar este código en proyectos competidores
 * - Extraer o reutilizar componentes sin permiso
 * 
 * VIOLACIONES:
 * Cualquier violación de esta licencia será procesada legalmente bajo las
 * leyes de propiedad intelectual de Guatemala y tratados internacionales.
 * 
 * CONTACTO:
 * legal@mirafloresplus.com
 * 
 * ID de Licencia: ${btoa(Date.now().toString())}
 */
`;

/**
 * Watermark HTML
 */
export const htmlWatermark = `
<!-- 
  SISTEMA PROTEGIDO POR COPYRIGHT
  Miraflores Plus © ${new Date().getFullYear()}
  Uso no autorizado está prohibido
  ID: ${btoa(Date.now().toString())}
-->
`;

/**
 * Package.json scripts de protección
 */
export const protectionScripts = {
  scripts: {
    // Build con protección
    'build:protected': 'npm run build && npm run add-protection',
    
    // Agregar protección post-build
    'add-protection': 'node scripts/add-protection.js',
    
    // Verificar integridad
    'verify:integrity': 'node scripts/verify-integrity.js',
    
    // Limpiar sourcemaps
    'clean:sourcemaps': 'find dist -name "*.map" -type f -delete',
    
    // Deploy seguro
    'deploy:production': 'npm run build:protected && npm run clean:sourcemaps && npm run deploy',
  },
};

/**
 * Script para agregar protección post-build
 */
export const addProtectionScript = `
// scripts/add-protection.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const distPath = path.join(__dirname, '../dist');

// 1. Agregar watermark a HTML
const indexPath = path.join(distPath, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

const watermark = \`
<!-- PROTECTED BY MIRAFLORES PLUS -->
<!-- © ${new Date().getFullYear()} - All Rights Reserved -->
<!-- Unauthorized use is prohibited -->
<!-- License ID: \${crypto.randomBytes(16).toString('hex')} -->
\`;

html = html.replace('</head>', \`\${watermark}</head>\`);
fs.writeFileSync(indexPath, html);

console.log('✅ Watermark agregado');

// 2. Remover sourcemaps
const removeSourcemaps = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      removeSourcemaps(filePath);
    } else if (file.endsWith('.map')) {
      fs.unlinkSync(filePath);
      console.log('Removed:', filePath);
    }
  });
};

removeSourcemaps(distPath);
console.log('✅ Sourcemaps removidos');

// 3. Generar hash de integridad
const generateHash = (filePath) => {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
};

const jsFiles = [];
const findJsFiles = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findJsFiles(filePath);
    } else if (file.endsWith('.js')) {
      jsFiles.push({
        file: path.relative(distPath, filePath),
        hash: generateHash(filePath),
      });
    }
  });
};

findJsFiles(distPath);

const integrityFile = path.join(distPath, 'integrity.json');
fs.writeFileSync(integrityFile, JSON.stringify(jsFiles, null, 2));

console.log('✅ Archivo de integridad generado');
console.log('✅ Protección completa aplicada');
`;

/**
 * Robots.txt para proteger páginas
 */
export const robotsTxt = `
# robots.txt - Miraflores Plus

User-agent: *
Disallow: /dashboard
Disallow: /admin
Disallow: /api
Disallow: /assets
Disallow: /*.json
Disallow: /*.js
Disallow: /*.css

# Solo permitir páginas públicas
Allow: /
Allow: /login
Allow: /about
Allow: /contact

# Prevenir scraping agresivo
Crawl-delay: 10

# Bloquear scrapers comunes
User-agent: HTTrack
User-agent: WebCopier
User-agent: WebZIP
User-agent: wget
User-agent: curl
Disallow: /

# Sitemap (si aplica)
Sitemap: https://mirafloresplus.com/sitemap.xml
`;

/**
 * Instrucciones finales
 */
export const deploymentInstructions = `
# 🚀 INSTRUCCIONES DE DEPLOYMENT SEGURO

## 1. Pre-requisitos

- [ ] Instalar obfuscator: npm install --save-dev javascript-obfuscator vite-plugin-javascript-obfuscator
- [ ] Configurar vite.config.ts con obfuscation
- [ ] Configurar variables de entorno de producción
- [ ] Revisar .gitignore (NO commitear .env)

## 2. Build de Producción

\`\`\`bash
# Build con protección
npm run build:protected

# Verificar que NO haya sourcemaps
ls dist/**/*.map  # Debe retornar vacío

# Verificar integridad
npm run verify:integrity
\`\`\`

## 3. Configurar Servidor

### Opción A: Nginx
- Copiar configuración de nginxSecurityHeaders a /etc/nginx/sites-available/
- Reiniciar nginx: sudo systemctl restart nginx

### Opción B: Vercel
- Crear vercel.json con la configuración de vercelConfig
- Deploy: vercel --prod

### Opción C: Cloudflare Pages
- Crear archivo _headers con cloudflareConfig
- Deploy: wrangler pages publish dist

## 4. Configurar DNS

- Agregar registros A/CNAME
- Configurar SSL/TLS (Let's Encrypt o Cloudflare)
- Habilitar HSTS

## 5. Post-Deployment

- [ ] Verificar que la app carga correctamente
- [ ] Probar DevTools detection (debe bloquear)
- [ ] Verificar domain lock (solo dominios autorizados)
- [ ] Probar click derecho (debe estar bloqueado)
- [ ] Verificar console (debe estar limpio)
- [ ] Test con Lighthouse (Security audit)

## 6. Monitoreo

- Configurar logging de eventos sospechosos
- Revisar logs de intentos de acceso no autorizado
- Monitorear violaciones CSP
- Alertas de actividad inusual

## 7. Legal

- [ ] Registrar copyright del código
- [ ] Agregar términos de uso
- [ ] Preparar documentos legales para violaciones
- [ ] Consultar abogado de propiedad intelectual

## 8. Backup

- Guardar código fuente en repositorio privado
- Backup de base de datos
- Documentar configuraciones de servidor
- Plan de recuperación ante desastres

---

⚠️ IMPORTANTE: Estas protecciones NO son 100% infalibles, pero dificultan
significativamente la copia y el sabotaje. La mejor protección es legal.
`;

export default {
  viteObfuscationConfig,
  nginxSecurityHeaders,
  vercelConfig,
  cloudflareConfig,
  productionEnvExample,
  criticalGitignore,
  licenseText,
  htmlWatermark,
  protectionScripts,
  addProtectionScript,
  robotsTxt,
  deploymentInstructions,
};
