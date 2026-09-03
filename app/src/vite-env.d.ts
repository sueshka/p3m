/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRIBUTE_URL?: string;
  readonly VITE_OVERLAYS_URL?: string;
  readonly VITE_LUTS_URL?: string;
  readonly VITE_OPEN_GATE_URL?: string;
  readonly VITE_SUPPORT_URL?: string;
  readonly VITE_COMMUNITY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
