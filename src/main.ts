import type { default as HtmlWebpackPluginInstance } from "html-webpack-plugin";
import type { Compiler, WebpackPluginInstance } from "webpack";
import debug from "./debug";
import { PLUGIN_NAME } from "./const";

export type Env = string | undefined

export interface Options {
  content?: string;
  env?: Env[];
}

const DEFAULT_OPTIONS: Options = {
  content: "",
  env: []
};

export default class EnvInjectBodyPlugin implements WebpackPluginInstance {
  private options: Options = DEFAULT_OPTIONS;

  constructor(options: Options) {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  /**
   * Extract HTMLWebpack Plugin
   *
   * @param compiler
   */
  private extractHtmlWebpackPluginModule = (
    compiler: Compiler
  ): typeof HtmlWebpackPluginInstance | null => {
    const htmlWebpackPlugin = (compiler.options.plugins || []).find(
      (plugin) => {
        return plugin.constructor.name === "HtmlWebpackPlugin";
      }
    ) as typeof HtmlWebpackPluginInstance | undefined;
    if (!htmlWebpackPlugin) {
      return null;
    }
    const HtmlWebpackPlugin = htmlWebpackPlugin.constructor;
    if (!HtmlWebpackPlugin || !("getHooks" in HtmlWebpackPlugin)) {
      return null;
    }
    return HtmlWebpackPlugin as typeof HtmlWebpackPluginInstance;
  };

  apply(compiler: Compiler) {
    const acceptEnv = this.options.env;
    if (!Array.isArray(acceptEnv) || acceptEnv.length === 0) {
      debug("the env option is not specified, the plugin does nothing");
      return;
    }
    if (!(acceptEnv.includes(process.env.NODE_ENV!))) {
      debug(
        "%s needs to be one of the following values: %o",
        "process.env.NODE_ENV",
        acceptEnv
      );
      debug("does nothing");
      return;
    }

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      const HtmlWebpackPlugin = this.extractHtmlWebpackPluginModule(compiler);
      if (!HtmlWebpackPlugin) {
        throw new Error(
          "SceneSwitchInjectPlugin needs to be used with html-webpack-plugin 4 or 5"
        );
      }

      const hooks = HtmlWebpackPlugin.getHooks(compilation);
      hooks.beforeEmit.tapAsync(PLUGIN_NAME, (htmlPluginData, callback) => {
        try {
          htmlPluginData.html = htmlPluginData.html.replace(
            "</body>",
            this.options.content + "</body>"
          );
          callback(null, htmlPluginData);
        } catch (error) {
          callback(error as Error);
        }
      });
    });
  }
}
