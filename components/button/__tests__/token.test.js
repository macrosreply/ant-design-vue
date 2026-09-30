import { renderToString } from 'vue/server-renderer';
import { createCache, extractStyle, StyleProvider } from '../../_util/cssinjs';
import ConfigProvider from '../../config-provider';
import Button from '..';

const renderButtonCss = async (buttonToken = {}, globalToken = {}) => {
  const cache = createCache();
  await renderToString(
    <StyleProvider cache={cache}>
      <ConfigProvider theme={{ token: globalToken, components: { Button: buttonToken } }}>
        <Button>Button</Button>
      </ConfigProvider>
    </StyleProvider>,
  );
  return extractStyle(cache, true);
};

const findRules = (css, color) =>
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, , body]) => body.includes(color))
    .map(([, selector]) => selector.replace(/:where\([^)]*\)/g, '').trim());

describe('Button component token', () => {
  it('only applies an override to its own variant and state', async () => {
    const css = await renderButtonCss({ buttonPrimaryHoverBg: '#123456' });

    expect(findRules(css, '#123456')).toEqual(['.ant-btn-primary:not(:disabled):hover']);
  });

  it('keeps component-level alias token overrides working', async () => {
    const css = await renderButtonCss({
      colorTextLightSolid: '#abcdef',
      controlOutline: '#fedcba',
      controlTmpOutline: '#0a0b0c',
    });

    expect(findRules(css, '#abcdef')).toContain('.ant-btn-primary');
    expect(findRules(css, '#fedcba')).toContain('.ant-btn-primary');
    expect(findRules(css, '#0a0b0c')).toContain('.ant-btn-default');
  });

  it('prefers explicit state tokens over alias overrides', async () => {
    const css = await renderButtonCss({
      colorTextLightSolid: '#abcdef',
      buttonPrimaryHoverColor: '#123123',
    });

    expect(findRules(css, '#123123')).toEqual(['.ant-btn-primary:not(:disabled):hover']);
    expect(findRules(css, '#abcdef')).not.toContain('.ant-btn-primary:not(:disabled):hover');
  });

  it('keeps state tokens provided through the global theme token', async () => {
    const css = await renderButtonCss({}, { buttonTextColor: '#456456' });

    expect(findRules(css, '#456456')).toContain('.ant-btn-text');
  });

  it('separates states that share the same default color', async () => {
    const css = await renderButtonCss({
      buttonDefaultHoverBorderColor: '#111111',
      buttonDefaultActiveBorderColor: '#222222',
      buttonDashedHoverBorderColor: '#333333',
      buttonPrimaryGroupSeparatorColor: '#444444',
    });

    expect(findRules(css, '#111111')).toEqual(['.ant-btn-default:not(:disabled):hover']);
    expect(findRules(css, '#222222')).toEqual(['.ant-btn-default:not(:disabled):active']);
    expect(findRules(css, '#333333')).toEqual(['.ant-btn-dashed:not(:disabled):hover']);
    expect(findRules(css, '#444444').length).toBeGreaterThan(0);
    expect(findRules(css, '#444444').every(selector => selector.includes('-group'))).toBe(true);
  });
});
