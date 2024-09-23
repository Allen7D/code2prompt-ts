import he from 'he';

export function decodeHtmlEntities(text: string): string {
	return he.decode(text, {
	  isAttributeValue: false, // 如果是处理属性值，设为 true
	  strict: false // 使用宽松模式，可以处理更多类型的实体
	});
  }