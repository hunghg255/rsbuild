import type HtmlWebpackPlugin from 'html-webpack-plugin';
import type { ChainIdentifier, RspackChain } from '..';
import type { HtmlBasicTag, RsbuildConfig } from './config';
import type { RsbuildTarget } from './rsbuild';
import type { Rspack, RspackConfig } from './rspack';
import type { MultiStats, Stats } from './stats';
import type { WebpackConfig } from './thirdParty';
import type { MaybePromise, NodeEnv } from './utils';

export type OnBeforeBuildFn<B = 'rspack'> = (params: {
  bundlerConfigs?: B extends 'rspack' ? RspackConfig[] : WebpackConfig[];
}) => MaybePromise<void>;

export type OnAfterBuildFn = (params: {
  isFirstCompile: boolean;
  stats?: Stats | MultiStats;
}) => MaybePromise<void>;

export type OnCloseDevServerFn = () => MaybePromise<void>;

export type OnDevCompileDoneFn = (params: {
  isFirstCompile: boolean;
  stats: Stats | MultiStats;
}) => MaybePromise<void>;

export type OnBeforeStartDevServerFn = () => MaybePromise<void>;

export type OnBeforeStartProdServerFn = () => MaybePromise<void>;

export type Routes = Array<{
  entryName: string;
  pathname: string;
}>;

export type OnAfterStartDevServerFn = (params: {
  port: number;
  routes: Routes;
}) => MaybePromise<void>;

export type OnAfterStartProdServerFn = (params: {
  port: number;
  routes: Routes;
}) => MaybePromise<void>;

export type OnBeforeCreateCompilerFn<B = 'rspack'> = (params: {
  bundlerConfigs: B extends 'rspack' ? RspackConfig[] : WebpackConfig[];
}) => MaybePromise<void>;

export type OnAfterCreateCompilerFn<
  Compiler = Rspack.Compiler | Rspack.MultiCompiler,
> = (params: { compiler: Compiler }) => MaybePromise<void>;

export type OnExitFn = () => void;

type HTMLTags = {
  headTags: HtmlBasicTag[];
  bodyTags: HtmlBasicTag[];
};

export type ModifyHTMLTagsContext = {
  /**
   * The Compilation object of Rspack.
   */
  compilation: Rspack.Compilation;
  /**
   * URL prefix of assets.
   * @example 'https://example.com/'
   */
  assetPrefix: string;
  /**
   * The name of the HTML file, relative to the dist directory.
   * @example 'index.html'
   */
  filename: string;
  /** The name of the environment to which this build belongs. */
  environment: string;
};

export type ModifyHTMLTagsFn = (
  tags: HTMLTags,
  context: ModifyHTMLTagsContext,
) => MaybePromise<HTMLTags>;

export type ModifyRsbuildConfigUtils = {
  /** Merge multiple Rsbuild config objects into one. */
  mergeRsbuildConfig: (...configs: RsbuildConfig[]) => RsbuildConfig;
};

export type ModifyRsbuildConfigFn = (
  config: RsbuildConfig,
  utils: ModifyRsbuildConfigUtils,
) => MaybePromise<RsbuildConfig | void>;

export type ModifyChainUtils = {
  env: NodeEnv;
  isDev: boolean;
  isProd: boolean;
  target: RsbuildTarget;
  isServer: boolean;
  isWebWorker: boolean;
  CHAIN_ID: ChainIdentifier;
  environment: string;
  HtmlPlugin: typeof HtmlWebpackPlugin;
};

interface PluginInstance {
  apply: (compiler: any) => void;
  [k: string]: any;
}

export type ModifyBundlerChainUtils = ModifyChainUtils & {
  bundler: {
    BannerPlugin: PluginInstance;
    DefinePlugin: PluginInstance;
    IgnorePlugin: PluginInstance;
    ProvidePlugin: PluginInstance;
    HotModuleReplacementPlugin: PluginInstance;
  };
};

export type ModifyBundlerChainFn = (
  chain: RspackChain,
  utils: ModifyBundlerChainUtils,
) => MaybePromise<void>;

export type CreateAsyncHook<Callback extends (...args: any[]) => any> = {
  tap: (cb: Callback) => void;
  call: (...args: Parameters<Callback>) => Promise<Parameters<Callback>>;
};
