import { encode } from 'gpt-3-encoder';

/**
 * 计算token数量
 * @param text 文本
 * @param encoding 编码方式
 * @returns token数量
 */
export function countTokens(text: string, encoding?: string): number {
  // 注意: gpt-3-encoder 只支持 GPT-2 和 GPT-3 的编码
  // 对于其他编码方式,可能需要使用不同的库或实现
  return encode(text).length;
}