import { minimatch } from 'minimatch';
import path from 'path';

/**
 * 判断一个文件是否应该被包含
 * @param filePath 文件路径
 * @param includePatterns 包含模式
 * @param excludePatterns 排除模式
 * @param includePriority 包含优先
 * @returns 是否应该包含该文件
 */
export function shouldIncludeFile(
  filePath: string,
  includePatterns: string[],
  excludePatterns: string[],
  includePriority: boolean
): boolean {
  const normalizedPath = path.normalize(filePath);
  const included = includePatterns.length === 0 || includePatterns.some(pattern => minimatch(normalizedPath, pattern));
  const excluded = excludePatterns.some(pattern => minimatch(normalizedPath, pattern));

  if (included && excluded) {
    return includePriority;
  }

  return included && !excluded;
}