#!/usr/bin/env node

import { program } from 'commander';
import { traverseDirectory } from './path';
import { renderTemplate } from './template';
import { getGitDiff } from './git';
import { countTokens } from './token';
import fs from 'fs';
import path from 'path';
import ncp from 'copy-paste';
import { decodeHtmlEntities } from './decode';

// 定义CLI参数
program
  .version('2.0.0')
  .argument('<path>', '代码库目录路径')
  .option('-i, --include <patterns>', '包含的文件模式', (val) => val.split(','))
  .option('-e, --exclude <patterns>', '排除的文件模式', (val) => val.split(','))
  .option('--include-priority', '在包含和排除模式冲突时优先包含')
  .option('-t, --tokens', '显示生成的提示的token数量')
  .option('-c, --encoding <encoding>', '用于token计数的可选tokenizer')
  .option('-o, --output <file>', '可选的输出文件路径')
  .option('-d, --diff', '包含git diff')
  .option('-l, --line-number', '为源代码添加行号')
  .option('--no-codeblock', '禁用在markdown代码块内包装代码')
  .option('--relative-paths', '使用相对路径而不是绝对路径')
  .option('--no-clipboard', '禁用复制到剪贴板')
  .option('--template <file>', '可选的自定义Handlebars模板路径')
  .parse(process.argv);

const options = program.opts();
const codePath = program.args[0];

async function main() {
  try {
    // 遍历目录
    const { tree, files } = await traverseDirectory(codePath, {
      ...options,
      exclude: [
        ...(options.exclude || []),
        '.git/**',
        '**/*.png',
        '**/*.jpg',
        '**/*.jpeg'
      ]
    });

    // 获取git diff (如果需要)
    let gitDiff = '';
    if (options.diff) {
      gitDiff = await getGitDiff(codePath);
    }

    // 渲染模板
    const templatePath = options.template || path.join(__dirname, 'default_template.hbs');
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    let rendered = await renderTemplate(templateContent, {
      absolute_code_path: codePath,
      source_tree: tree,
      files,
      git_diff: gitDiff
    });
	rendered = decodeHtmlEntities(rendered);

    // 输出结果
    if (options.output) {
      fs.writeFileSync(options.output, rendered);
    //   console.log(`Prompt written to file: ${options.output}`);
    } else {
    //   console.log(rendered);
    }

    // 计算token数量 (如果需要)
    if (options.tokens) {
      const tokenCount = countTokens(rendered, options.encoding);
      console.log(`Token count: ${tokenCount}`);
    }

    // 复制到剪贴板 (如果需要)
    if (!options.noClipboard) {
      try {
        await ncp.copy(rendered);
        console.log('提示已复制到剪贴板');
      } catch (clipboardError) {
        console.error('复制到剪贴板失败:', clipboardError);
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}



main();