import { defineConfig } from 'dumi'

export default defineConfig({
  outputPath: 'docs-dist',
  resolve: {
    // 设置横向导航栏
    atomDirs: [
      { type: 'component', dir: 'src/components' },
      { type: 'tool', dir: 'src/tools' },
    ],
  },
  themeConfig: {
    name: 'dumi2-demo',
  },
  styles: [
    `.dumi-default-header-left {
      width: 220px !important;
    }`,
    `.dumi-default-features-item {
      text-align: center;
    }
    body .dumi-default-sidebar>dl>dt {
      font-size: 16px;
    }
    body .dumi-default-sidebar>dl>dd>a {
      color: #717484;
      font-size: 14px;
    }
    `,
  ],
})
