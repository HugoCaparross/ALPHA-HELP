import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import { readdirSync, statSync } from 'fs';

// Helper function to recursively find all HTML files in a directory
function getHtmlFiles(dir, files = {}) {
  try {
    const list = readdirSync(dir);
    list.forEach(file => {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        getHtmlFiles(filePath, files);
      } else if (file.endsWith('.html')) {
        // Create a unique key for rollup input
        const relativePath = filePath.replace(join(__dirname, 'src/pages'), '').replace(/^\/|\\/, '');
        const key = relativePath.replace(/\.html$/, '').replace(/[\\/]/g, '_') || 'index';
        files[key] = filePath;
      }
    });
  } catch (e) {
    // Directory might not exist yet during initialization
  }
  return files;
}

export default defineConfig(() => {
  // We'll collect all HTML pages from src/pages
  const pagesDir = resolve(__dirname, 'src/pages');
  const inputFiles = {
    main: resolve(__dirname, 'index.html'),
    ...getHtmlFiles(pagesDir)
  };

  return {
    root: resolve(__dirname),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: inputFiles
      }
    },
    server: {
      port: 3000,
      host: true
    }
  };
});
