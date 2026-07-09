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

declare module "axios" {
  interface AxiosRequestConfig {
    headers?: Record<string, string>;
  }
  interface AxiosResponse<T = any> {
    data: T;
    status: number;
  }
  interface AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  }
  const axios: {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  };
  export default axios;
}

declare module "cheerio" {
  interface CheerioAPI {
    (selector: string, context?: any, root?: any): Cheerio<any>;
    load: (html: string) => CheerioAPI;
  }
  interface Cheerio<T> {
    html(): string;
    text(): string;
    first(): Cheerio<T>;
    length: number;
  }
  const cheerio: CheerioAPI;
  export = cheerio;
}
