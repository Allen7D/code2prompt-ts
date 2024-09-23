import Handlebars from 'handlebars';

/**
 * 渲染模板
 * @param template 模板字符串
 * @param data 数据
 * @returns 渲染后的字符串
 */
export function renderTemplate(template: string, data: any): string {
  const compiledTemplate = Handlebars.compile(template);
  return compiledTemplate(data);
}