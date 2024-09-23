import fs from 'fs';
import path from 'path';
import { shouldIncludeFile } from './filter';

interface TraverseResult {
  tree: string;
  files: Array<{ path: string; code: string }>;
}

interface TraverseOptions {
  include?: string[];
  exclude?: string[];
  includePriority?: boolean;
  relativePaths?: boolean;
  lineNumber?: boolean;
}

/**
 * 遍历目录
 * @param rootPath 根路径
 * @param options 选项
 * @returns 遍历结果
 */
export async function traverseDirectory(rootPath: string, options: TraverseOptions): Promise<TraverseResult> {
  const tree: string[] = [];
  const files: Array<{ path: string; code: string }> = [];

  function traverse(currentPath: string, depth: number = 0) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(rootPath, fullPath);

      if (shouldIncludeFile(relativePath, options.include || [], options.exclude || [], options.includePriority || false)) {
        const indent = '  '.repeat(depth);
        tree.push(`${indent}${entry.name}`);

        if (entry.isDirectory()) {
          traverse(fullPath, depth + 1);
        } else {
          const code = fs.readFileSync(fullPath, 'utf-8');
          files.push({
            path: options.relativePaths ? relativePath : fullPath,
            code: options.lineNumber ? addLineNumbers(code) : code
          });
        }
      }
    }
  }

  traverse(rootPath);

  return { tree: tree.join('\n'), files };
}

/**
 * 为代码添加行号
 * @param code 代码字符串
 * @returns 带行号的代码字符串
 */
function addLineNumbers(code: string): string {
  return code.split('\n').map((line, index) => `${index + 1} | ${line}`).join('\n');
}