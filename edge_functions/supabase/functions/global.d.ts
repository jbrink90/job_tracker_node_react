declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
    function toObject(): Record<string, string>;
    function set(key: string, value: string): void;
    function remove(key: string): void;
  }

  interface BuildInfo {
    target: string;
    arch: string;
    os: string;
    vendor: string;
  }

  interface VersionInfo {
    deno: string;
    v8: string;
    typescript: string;
  }

  const build: BuildInfo;
  const version: VersionInfo;
  const platform: { os: string; arch: string };
}

declare module "resend";