import { describe, expect, it } from 'vitest';

describe('скелет проекта', () => {
  it('имеет рабочее окружение тестов', () => {
    expect('Emoji Wasteland Arena').toContain('Arena');
  });
});
