// ALPHA-HELP - Main Entry Point
import '@/styles/global.css';
import '@/styles/variables.css';
import '@/styles/typography.css';
import '@/styles/landing.css';
import { initApp } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('ALPHA-HELP: Inicializando aplicación...');
  initApp();
});
