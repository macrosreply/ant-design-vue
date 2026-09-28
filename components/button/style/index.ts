import type { CSSInterpolation, CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import type { GlobalToken } from '../../theme/interface';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import genGroupStyle from './group';
import { genFocusStyle } from '../../style';
import { genCompactItemStyle } from '../../style/compact-item';
import { genCompactItemVerticalStyle } from '../../style/compact-item-vertical';

type ButtonStateToken<Prefix extends string> = Record<
  `${Prefix}Color` | `${Prefix}Bg` | `${Prefix}BorderColor`,
  string
>;

type OutlinedButtonToken<Variant extends 'Default' | 'Dashed'> =
  ButtonStateToken<`button${Variant}`> &
    ButtonStateToken<`button${Variant}Hover`> &
    ButtonStateToken<`button${Variant}Active`> &
    ButtonStateToken<`button${Variant}Disabled`> &
    ButtonStateToken<`button${Variant}Danger`> &
    ButtonStateToken<`button${Variant}DangerHover`> &
    ButtonStateToken<`button${Variant}DangerActive`> &
    ButtonStateToken<`button${Variant}DangerDisabled`> &
    Record<
      | `button${Variant}Shadow`
      | `button${Variant}GhostColor`
      | `button${Variant}GhostBorderColor`
      | `button${Variant}GhostHoverColor`
      | `button${Variant}GhostHoverBorderColor`
      | `button${Variant}GhostActiveColor`
      | `button${Variant}GhostActiveBorderColor`
      | `button${Variant}GhostDisabledColor`
      | `button${Variant}GhostDisabledBorderColor`
      | `button${Variant}DangerGhostColor`
      | `button${Variant}DangerGhostBorderColor`
      | `button${Variant}DangerGhostHoverColor`
      | `button${Variant}DangerGhostHoverBorderColor`
      | `button${Variant}DangerGhostActiveColor`
      | `button${Variant}DangerGhostActiveBorderColor`
      | `button${Variant}DangerGhostDisabledColor`
      | `button${Variant}DangerGhostDisabledBorderColor`,
      string
    >;

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken
  extends OutlinedButtonToken<'Default'>,
    OutlinedButtonToken<'Dashed'> {
  // Primary
  buttonPrimaryColor: string;
  buttonPrimaryBg: string;
  buttonPrimaryBorderColor: string;
  buttonPrimaryShadow: string;
  buttonPrimaryHoverColor: string;
  buttonPrimaryHoverBg: string;
  buttonPrimaryHoverBorderColor: string;
  buttonPrimaryActiveColor: string;
  buttonPrimaryActiveBg: string;
  buttonPrimaryActiveBorderColor: string;
  buttonPrimaryDisabledColor: string;
  buttonPrimaryDisabledBg: string;
  buttonPrimaryDisabledBorderColor: string;
  buttonPrimaryGhostColor: string;
  buttonPrimaryGhostBorderColor: string;
  buttonPrimaryGhostHoverColor: string;
  buttonPrimaryGhostHoverBorderColor: string;
  buttonPrimaryGhostActiveColor: string;
  buttonPrimaryGhostActiveBorderColor: string;
  buttonPrimaryGhostDisabledColor: string;
  buttonPrimaryGhostDisabledBorderColor: string;

  // Primary danger
  buttonPrimaryDangerColor: string;
  buttonPrimaryDangerBg: string;
  buttonPrimaryDangerBorderColor: string;
  buttonPrimaryDangerShadow: string;
  buttonPrimaryDangerHoverColor: string;
  buttonPrimaryDangerHoverBg: string;
  buttonPrimaryDangerHoverBorderColor: string;
  buttonPrimaryDangerActiveColor: string;
  buttonPrimaryDangerActiveBg: string;
  buttonPrimaryDangerActiveBorderColor: string;
  buttonPrimaryDangerDisabledColor: string;
  buttonPrimaryDangerDisabledBg: string;
  buttonPrimaryDangerDisabledBorderColor: string;
  buttonPrimaryDangerGhostColor: string;
  buttonPrimaryDangerGhostBorderColor: string;
  buttonPrimaryDangerGhostHoverColor: string;
  buttonPrimaryDangerGhostHoverBorderColor: string;
  buttonPrimaryDangerGhostActiveColor: string;
  buttonPrimaryDangerGhostActiveBorderColor: string;
  buttonPrimaryDangerGhostDisabledColor: string;
  buttonPrimaryDangerGhostDisabledBorderColor: string;

  // Text
  buttonTextColor: string;
  buttonTextHoverColor: string;
  buttonTextHoverBg: string;
  buttonTextActiveColor: string;
  buttonTextActiveBg: string;
  buttonTextDisabledColor: string;
  buttonTextDangerColor: string;
  buttonTextDangerHoverColor: string;
  buttonTextDangerHoverBg: string;
  buttonTextDangerActiveColor: string;
  buttonTextDangerActiveBg: string;
  buttonTextDangerDisabledColor: string;

  // Link
  buttonLinkColor: string;
  buttonLinkHoverColor: string;
  buttonLinkActiveColor: string;
  buttonLinkDisabledColor: string;
  buttonLinkDangerColor: string;
  buttonLinkDangerHoverColor: string;
  buttonLinkDangerActiveColor: string;
  buttonLinkDangerDisabledColor: string;

  // Disabled `.ant-btn-disabled` (e.g. disabled button with href)
  buttonDisabledColor: string;
  buttonDisabledBg: string;
  buttonDisabledBorderColor: string;

  // Separators between adjacent buttons
  buttonPrimaryCompactSeparatorColor: string;
  buttonPrimaryGroupSeparatorColor: string;
  buttonDangerGroupSeparatorColor: string;
}

export interface ButtonToken extends FullToken<'Button'> {
  // FIXME: should be removed
  colorOutlineDefault: string;
  buttonPaddingHorizontal: number;
}

// ============================== Shared ==============================
const genSharedButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token): CSSObject => {
  const { componentCls, iconCls } = token;

  return {
    [componentCls]: {
      outline: 'none',
      position: 'relative',
      display: 'inline-block',
      fontWeight: 400,
      whiteSpace: 'nowrap',
      textAlign: 'center',
      backgroundImage: 'none',
      backgroundColor: 'transparent',
      border: `${token.lineWidth}px ${token.lineType} transparent`,
      cursor: 'pointer',
      transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
      userSelect: 'none',
      touchAction: 'manipulation',
      lineHeight: token.lineHeight,
      color: token.colorText,

      '> span': {
        display: 'inline-block',
      },

      // Leave a space between icon and text.
      [`> ${iconCls} + span, > span + ${iconCls}`]: {
        marginInlineStart: token.marginXS,
      },

      '> a': {
        color: 'currentColor',
      },

      '&:not(:disabled)': {
        ...genFocusStyle(token),
      },

      // make `btn-icon-only` not too narrow
      [`&-icon-only${componentCls}-compact-item`]: {
        flex: 'none',
      },
      // Special styles for Primary Button
      [`&-compact-item${componentCls}-primary`]: {
        [`&:not([disabled]) + ${componentCls}-compact-item${componentCls}-primary:not([disabled])`]:
          {
            position: 'relative',

            '&:before': {
              position: 'absolute',
              top: -token.lineWidth,
              insetInlineStart: -token.lineWidth,
              display: 'inline-block',
              width: token.lineWidth,
              height: `calc(100% + ${token.lineWidth * 2}px)`,
              backgroundColor: token.buttonPrimaryCompactSeparatorColor,
              content: '""',
            },
          },
      },
      // Special styles for Primary Button
      '&-compact-vertical-item': {
        [`&${componentCls}-primary`]: {
          [`&:not([disabled]) + ${componentCls}-compact-vertical-item${componentCls}-primary:not([disabled])`]:
            {
              position: 'relative',

              '&:before': {
                position: 'absolute',
                top: -token.lineWidth,
                insetInlineStart: -token.lineWidth,
                display: 'inline-block',
                width: `calc(100% + ${token.lineWidth * 2}px)`,
                height: token.lineWidth,
                backgroundColor: token.buttonPrimaryCompactSeparatorColor,
                content: '""',
              },
            },
        },
      },
    },
  };
};

const genHoverActiveButtonStyle = (hoverStyle: CSSObject, activeStyle: CSSObject): CSSObject => ({
  '&:not(:disabled)': {
    '&:hover': hoverStyle,
    '&:active': activeStyle,
  },
});

// ============================== Shape ===============================
const genCircleButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  minWidth: token.controlHeight,
  paddingInlineStart: 0,
  paddingInlineEnd: 0,
  borderRadius: '50%',
});

const genRoundButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  borderRadius: token.controlHeight,
  paddingInlineStart: token.controlHeight / 2,
  paddingInlineEnd: token.controlHeight / 2,
});

// =============================== Type ===============================
interface DisabledColors {
  color: string;
  bg: string;
  borderColor: string;
}

const genDisabledStyle = ({ color, bg, borderColor }: DisabledColors): CSSObject => ({
  cursor: 'not-allowed',
  borderColor,
  color,
  backgroundColor: bg,
  boxShadow: 'none',
});

const genGhostButtonStyle = (
  btnCls: string,
  textColor: string | false,
  borderColor: string | false,
  textColorDisabled: string | false,
  borderColorDisabled: string | false,
  hoverStyle?: CSSObject,
  activeStyle?: CSSObject,
): CSSObject => ({
  [`&${btnCls}-background-ghost`]: {
    color: textColor || undefined,
    backgroundColor: 'transparent',
    borderColor: borderColor || undefined,
    boxShadow: 'none',

    ...genHoverActiveButtonStyle(
      {
        backgroundColor: 'transparent',
        ...hoverStyle,
      },
      {
        backgroundColor: 'transparent',
        ...activeStyle,
      },
    ),

    '&:disabled': {
      cursor: 'not-allowed',
      color: textColorDisabled || undefined,
      borderColor: borderColorDisabled || undefined,
    },
  },
});

const genSolidDisabledButtonStyle = (colors: DisabledColors): CSSObject => ({
  '&:disabled': {
    ...genDisabledStyle(colors),
  },
});

const genPureDisabledButtonStyle = (color: string): CSSObject => ({
  '&:disabled': {
    cursor: 'not-allowed',
    color,
  },
});

// Type: Default & Dashed
const genOutlinedButtonStyle = (token: ButtonToken, variant: 'Default' | 'Dashed'): CSSObject => {
  const t = (name: string): string =>
    (token as unknown as Record<string, string>)[`button${variant}${name}`];

  return {
    ...genSolidDisabledButtonStyle({
      color: t('DisabledColor'),
      bg: t('DisabledBg'),
      borderColor: t('DisabledBorderColor'),
    }),

    color: t('Color'),
    backgroundColor: t('Bg'),
    borderColor: t('BorderColor'),

    boxShadow: t('Shadow'),

    ...genHoverActiveButtonStyle(
      {
        color: t('HoverColor'),
        backgroundColor: t('HoverBg'),
        borderColor: t('HoverBorderColor'),
      },
      {
        color: t('ActiveColor'),
        backgroundColor: t('ActiveBg'),
        borderColor: t('ActiveBorderColor'),
      },
    ),

    ...genGhostButtonStyle(
      token.componentCls,
      t('GhostColor'),
      t('GhostBorderColor'),
      t('GhostDisabledColor'),
      t('GhostDisabledBorderColor'),
      {
        color: t('GhostHoverColor'),
        borderColor: t('GhostHoverBorderColor'),
      },
      {
        color: t('GhostActiveColor'),
        borderColor: t('GhostActiveBorderColor'),
      },
    ),

    [`&${token.componentCls}-dangerous`]: {
      color: t('DangerColor'),
      backgroundColor: t('DangerBg'),
      borderColor: t('DangerBorderColor'),

      ...genHoverActiveButtonStyle(
        {
          color: t('DangerHoverColor'),
          backgroundColor: t('DangerHoverBg'),
          borderColor: t('DangerHoverBorderColor'),
        },
        {
          color: t('DangerActiveColor'),
          backgroundColor: t('DangerActiveBg'),
          borderColor: t('DangerActiveBorderColor'),
        },
      ),

      ...genGhostButtonStyle(
        token.componentCls,
        t('DangerGhostColor'),
        t('DangerGhostBorderColor'),
        t('DangerGhostDisabledColor'),
        t('DangerGhostDisabledBorderColor'),
        {
          color: t('DangerGhostHoverColor'),
          borderColor: t('DangerGhostHoverBorderColor'),
        },
        {
          color: t('DangerGhostActiveColor'),
          borderColor: t('DangerGhostActiveBorderColor'),
        },
      ),
      ...genSolidDisabledButtonStyle({
        color: t('DangerDisabledColor'),
        bg: t('DangerDisabledBg'),
        borderColor: t('DangerDisabledBorderColor'),
      }),
    },
  };
};

const genDefaultButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genOutlinedButtonStyle(token, 'Default'),
});

const genDashedButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genOutlinedButtonStyle(token, 'Dashed'),
  borderStyle: 'dashed',
});

// Type: Primary
const genPrimaryButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genSolidDisabledButtonStyle({
    color: token.buttonPrimaryDisabledColor,
    bg: token.buttonPrimaryDisabledBg,
    borderColor: token.buttonPrimaryDisabledBorderColor,
  }),

  color: token.buttonPrimaryColor,
  backgroundColor: token.buttonPrimaryBg,
  borderColor: token.buttonPrimaryBorderColor,

  boxShadow: token.buttonPrimaryShadow,

  ...genHoverActiveButtonStyle(
    {
      color: token.buttonPrimaryHoverColor,
      backgroundColor: token.buttonPrimaryHoverBg,
      borderColor: token.buttonPrimaryHoverBorderColor,
    },
    {
      color: token.buttonPrimaryActiveColor,
      backgroundColor: token.buttonPrimaryActiveBg,
      borderColor: token.buttonPrimaryActiveBorderColor,
    },
  ),

  ...genGhostButtonStyle(
    token.componentCls,
    token.buttonPrimaryGhostColor,
    token.buttonPrimaryGhostBorderColor,
    token.buttonPrimaryGhostDisabledColor,
    token.buttonPrimaryGhostDisabledBorderColor,
    {
      color: token.buttonPrimaryGhostHoverColor,
      borderColor: token.buttonPrimaryGhostHoverBorderColor,
    },
    {
      color: token.buttonPrimaryGhostActiveColor,
      borderColor: token.buttonPrimaryGhostActiveBorderColor,
    },
  ),

  [`&${token.componentCls}-dangerous`]: {
    color: token.buttonPrimaryDangerColor,
    backgroundColor: token.buttonPrimaryDangerBg,
    borderColor: token.buttonPrimaryDangerBorderColor,
    boxShadow: token.buttonPrimaryDangerShadow,

    ...genHoverActiveButtonStyle(
      {
        color: token.buttonPrimaryDangerHoverColor,
        backgroundColor: token.buttonPrimaryDangerHoverBg,
        borderColor: token.buttonPrimaryDangerHoverBorderColor,
      },
      {
        color: token.buttonPrimaryDangerActiveColor,
        backgroundColor: token.buttonPrimaryDangerActiveBg,
        borderColor: token.buttonPrimaryDangerActiveBorderColor,
      },
    ),

    ...genGhostButtonStyle(
      token.componentCls,
      token.buttonPrimaryDangerGhostColor,
      token.buttonPrimaryDangerGhostBorderColor,
      token.buttonPrimaryDangerGhostDisabledColor,
      token.buttonPrimaryDangerGhostDisabledBorderColor,
      {
        color: token.buttonPrimaryDangerGhostHoverColor,
        borderColor: token.buttonPrimaryDangerGhostHoverBorderColor,
      },
      {
        color: token.buttonPrimaryDangerGhostActiveColor,
        borderColor: token.buttonPrimaryDangerGhostActiveBorderColor,
      },
    ),
    ...genSolidDisabledButtonStyle({
      color: token.buttonPrimaryDangerDisabledColor,
      bg: token.buttonPrimaryDangerDisabledBg,
      borderColor: token.buttonPrimaryDangerDisabledBorderColor,
    }),
  },
});

// Type: Link
const genLinkButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  color: token.buttonLinkColor,

  ...genHoverActiveButtonStyle(
    {
      color: token.buttonLinkHoverColor,
    },
    {
      color: token.buttonLinkActiveColor,
    },
  ),

  ...genPureDisabledButtonStyle(token.buttonLinkDisabledColor),

  [`&${token.componentCls}-dangerous`]: {
    color: token.buttonLinkDangerColor,

    ...genHoverActiveButtonStyle(
      {
        color: token.buttonLinkDangerHoverColor,
      },
      {
        color: token.buttonLinkDangerActiveColor,
      },
    ),

    ...genPureDisabledButtonStyle(token.buttonLinkDangerDisabledColor),
  },
});

// Type: Text
const genTextButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  color: token.buttonTextColor,

  ...genHoverActiveButtonStyle(
    {
      color: token.buttonTextHoverColor,
      backgroundColor: token.buttonTextHoverBg,
    },
    {
      color: token.buttonTextActiveColor,
      backgroundColor: token.buttonTextActiveBg,
    },
  ),

  ...genPureDisabledButtonStyle(token.buttonTextDisabledColor),

  [`&${token.componentCls}-dangerous`]: {
    color: token.buttonTextDangerColor,

    ...genPureDisabledButtonStyle(token.buttonTextDangerDisabledColor),
    ...genHoverActiveButtonStyle(
      {
        color: token.buttonTextDangerHoverColor,
        backgroundColor: token.buttonTextDangerHoverBg,
      },
      {
        color: token.buttonTextDangerActiveColor,
        backgroundColor: token.buttonTextDangerActiveBg,
      },
    ),
  },
});

// Href and Disabled
const genDisabledButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => {
  const colors = {
    color: token.buttonDisabledColor,
    bg: token.buttonDisabledBg,
    borderColor: token.buttonDisabledBorderColor,
  };

  return {
    ...genDisabledStyle(colors),
    [`&${token.componentCls}:hover`]: {
      ...genDisabledStyle(colors),
    },
  };
};

const genTypeButtonStyle: GenerateStyle<ButtonToken> = token => {
  const { componentCls } = token;

  return {
    [`${componentCls}-default`]: genDefaultButtonStyle(token),
    [`${componentCls}-primary`]: genPrimaryButtonStyle(token),
    [`${componentCls}-dashed`]: genDashedButtonStyle(token),
    [`${componentCls}-link`]: genLinkButtonStyle(token),
    [`${componentCls}-text`]: genTextButtonStyle(token),
    [`${componentCls}-disabled`]: genDisabledButtonStyle(token),
  };
};

// =============================== Size ===============================
const genSizeButtonStyle = (token: ButtonToken, sizePrefixCls: string = ''): CSSInterpolation => {
  const {
    componentCls,
    iconCls,
    controlHeight,
    fontSize,
    lineHeight,
    lineWidth,
    borderRadius,
    buttonPaddingHorizontal,
  } = token;

  const paddingVertical = Math.max(0, (controlHeight - fontSize * lineHeight) / 2 - lineWidth);
  const paddingHorizontal = buttonPaddingHorizontal - lineWidth;

  const iconOnlyCls = `${componentCls}-icon-only`;

  return [
    // Size
    {
      [`${componentCls}${sizePrefixCls}`]: {
        fontSize,
        height: controlHeight,
        padding: `${paddingVertical}px ${paddingHorizontal}px`,
        borderRadius,

        [`&${iconOnlyCls}`]: {
          width: controlHeight,
          paddingInlineStart: 0,
          paddingInlineEnd: 0,
          [`&${componentCls}-round`]: {
            width: 'auto',
          },
          '> span': {
            transform: 'scale(1.143)', // 14px -> 16px
          },
        },

        // Loading
        [`&${componentCls}-loading`]: {
          opacity: token.opacityLoading,
          cursor: 'default',
        },

        [`${componentCls}-loading-icon`]: {
          transition: `width ${token.motionDurationSlow} ${token.motionEaseInOut}, opacity ${token.motionDurationSlow} ${token.motionEaseInOut}`,
        },

        [`&:not(${iconOnlyCls}) ${componentCls}-loading-icon > ${iconCls}`]: {
          marginInlineEnd: token.marginXS,
        },
      },
    },

    // Shape - patch prefixCls again to override solid border radius style
    {
      [`${componentCls}${componentCls}-circle${sizePrefixCls}`]: genCircleButtonStyle(token),
    },
    {
      [`${componentCls}${componentCls}-round${sizePrefixCls}`]: genRoundButtonStyle(token),
    },
  ];
};

const genSizeBaseButtonStyle: GenerateStyle<ButtonToken> = token => genSizeButtonStyle(token);

const genSizeSmallButtonStyle: GenerateStyle<ButtonToken> = token => {
  const smallToken = mergeToken<ButtonToken>(token, {
    controlHeight: token.controlHeightSM,
    padding: token.paddingXS,
    buttonPaddingHorizontal: 8, // Fixed padding
    borderRadius: token.borderRadiusSM,
  });

  return genSizeButtonStyle(smallToken, `${token.componentCls}-sm`);
};

const genSizeLargeButtonStyle: GenerateStyle<ButtonToken> = token => {
  const largeToken = mergeToken<ButtonToken>(token, {
    controlHeight: token.controlHeightLG,
    fontSize: token.fontSizeLG,
    borderRadius: token.borderRadiusLG,
  });

  return genSizeButtonStyle(largeToken, `${token.componentCls}-lg`);
};

const genBlockButtonStyle: GenerateStyle<ButtonToken> = token => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      [`&${componentCls}-block`]: {
        width: '100%',
      },
    },
  };
};

// ============================== Export ==============================
const genOutlinedDefaultToken = <Variant extends 'Default' | 'Dashed'>(
  token: GlobalToken,
  variant: Variant,
): OutlinedButtonToken<Variant> => {
  const values: Record<string, string> = {
    Color: token.colorText,
    Bg: token.colorBgContainer,
    BorderColor: token.colorBorder,
    Shadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlTmpOutline}`,
    HoverColor: token.colorPrimaryHover,
    HoverBg: token.colorBgContainer,
    HoverBorderColor: token.colorPrimaryHover,
    ActiveColor: token.colorPrimaryActive,
    ActiveBg: token.colorBgContainer,
    ActiveBorderColor: token.colorPrimaryActive,
    DisabledColor: token.colorTextDisabled,
    DisabledBg: token.colorBgContainerDisabled,
    DisabledBorderColor: token.colorBorder,
    GhostColor: token.colorBgContainer,
    GhostBorderColor: token.colorBgContainer,
    GhostHoverColor: token.colorPrimaryHover,
    GhostHoverBorderColor: token.colorPrimaryHover,
    GhostActiveColor: token.colorPrimaryActive,
    GhostActiveBorderColor: token.colorPrimaryActive,
    GhostDisabledColor: token.colorTextDisabled,
    GhostDisabledBorderColor: token.colorBorder,
    DangerColor: token.colorError,
    DangerBg: token.colorBgContainer,
    DangerBorderColor: token.colorError,
    DangerHoverColor: token.colorErrorHover,
    DangerHoverBg: token.colorBgContainer,
    DangerHoverBorderColor: token.colorErrorBorderHover,
    DangerActiveColor: token.colorErrorActive,
    DangerActiveBg: token.colorBgContainer,
    DangerActiveBorderColor: token.colorErrorActive,
    DangerDisabledColor: token.colorTextDisabled,
    DangerDisabledBg: token.colorBgContainerDisabled,
    DangerDisabledBorderColor: token.colorBorder,
    DangerGhostColor: token.colorError,
    DangerGhostBorderColor: token.colorError,
    DangerGhostHoverColor: token.colorErrorHover,
    DangerGhostHoverBorderColor: token.colorErrorBorderHover,
    DangerGhostActiveColor: token.colorErrorActive,
    DangerGhostActiveBorderColor: token.colorErrorActive,
    DangerGhostDisabledColor: token.colorTextDisabled,
    DangerGhostDisabledBorderColor: token.colorBorder,
  };

  return Object.keys(values).reduce(
    (acc, key) => ({ ...acc, [`button${variant}${key}`]: values[key] }),
    {} as OutlinedButtonToken<Variant>,
  );
};

const genButtonDefaultToken = (token: GlobalToken): ComponentToken => ({
  ...genOutlinedDefaultToken(token, 'Default'),
  ...genOutlinedDefaultToken(token, 'Dashed'),

  buttonPrimaryColor: token.colorTextLightSolid,
  buttonPrimaryBg: token.colorPrimary,
  buttonPrimaryBorderColor: 'transparent',
  buttonPrimaryShadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlOutline}`,
  buttonPrimaryHoverColor: token.colorTextLightSolid,
  buttonPrimaryHoverBg: token.colorPrimaryHover,
  buttonPrimaryHoverBorderColor: 'transparent',
  buttonPrimaryActiveColor: token.colorTextLightSolid,
  buttonPrimaryActiveBg: token.colorPrimaryActive,
  buttonPrimaryActiveBorderColor: 'transparent',
  buttonPrimaryDisabledColor: token.colorTextDisabled,
  buttonPrimaryDisabledBg: token.colorBgContainerDisabled,
  buttonPrimaryDisabledBorderColor: token.colorBorder,
  buttonPrimaryGhostColor: token.colorPrimary,
  buttonPrimaryGhostBorderColor: token.colorPrimary,
  buttonPrimaryGhostHoverColor: token.colorPrimaryHover,
  buttonPrimaryGhostHoverBorderColor: token.colorPrimaryHover,
  buttonPrimaryGhostActiveColor: token.colorPrimaryActive,
  buttonPrimaryGhostActiveBorderColor: token.colorPrimaryActive,
  buttonPrimaryGhostDisabledColor: token.colorTextDisabled,
  buttonPrimaryGhostDisabledBorderColor: token.colorBorder,

  buttonPrimaryDangerColor: token.colorTextLightSolid,
  buttonPrimaryDangerBg: token.colorError,
  buttonPrimaryDangerBorderColor: 'transparent',
  buttonPrimaryDangerShadow: `0 ${token.controlOutlineWidth}px 0 ${token.colorErrorOutline}`,
  buttonPrimaryDangerHoverColor: token.colorTextLightSolid,
  buttonPrimaryDangerHoverBg: token.colorErrorHover,
  buttonPrimaryDangerHoverBorderColor: 'transparent',
  buttonPrimaryDangerActiveColor: token.colorTextLightSolid,
  buttonPrimaryDangerActiveBg: token.colorErrorActive,
  buttonPrimaryDangerActiveBorderColor: 'transparent',
  buttonPrimaryDangerDisabledColor: token.colorTextDisabled,
  buttonPrimaryDangerDisabledBg: token.colorBgContainerDisabled,
  buttonPrimaryDangerDisabledBorderColor: token.colorBorder,
  buttonPrimaryDangerGhostColor: token.colorError,
  buttonPrimaryDangerGhostBorderColor: token.colorError,
  buttonPrimaryDangerGhostHoverColor: token.colorErrorHover,
  buttonPrimaryDangerGhostHoverBorderColor: token.colorErrorHover,
  buttonPrimaryDangerGhostActiveColor: token.colorErrorActive,
  buttonPrimaryDangerGhostActiveBorderColor: token.colorErrorActive,
  buttonPrimaryDangerGhostDisabledColor: token.colorTextDisabled,
  buttonPrimaryDangerGhostDisabledBorderColor: token.colorBorder,

  buttonTextColor: token.colorText,
  buttonTextHoverColor: token.colorText,
  buttonTextHoverBg: token.colorBgTextHover,
  buttonTextActiveColor: token.colorText,
  buttonTextActiveBg: token.colorBgTextActive,
  buttonTextDisabledColor: token.colorTextDisabled,
  buttonTextDangerColor: token.colorError,
  buttonTextDangerHoverColor: token.colorErrorHover,
  buttonTextDangerHoverBg: token.colorErrorBg,
  buttonTextDangerActiveColor: token.colorErrorHover,
  buttonTextDangerActiveBg: token.colorErrorBg,
  buttonTextDangerDisabledColor: token.colorTextDisabled,

  buttonLinkColor: token.colorLink,
  buttonLinkHoverColor: token.colorLinkHover,
  buttonLinkActiveColor: token.colorLinkActive,
  buttonLinkDisabledColor: token.colorTextDisabled,
  buttonLinkDangerColor: token.colorError,
  buttonLinkDangerHoverColor: token.colorErrorHover,
  buttonLinkDangerActiveColor: token.colorErrorActive,
  buttonLinkDangerDisabledColor: token.colorTextDisabled,

  buttonDisabledColor: token.colorTextDisabled,
  buttonDisabledBg: token.colorBgContainerDisabled,
  buttonDisabledBorderColor: token.colorBorder,

  buttonPrimaryCompactSeparatorColor: token.colorPrimaryHover,
  buttonPrimaryGroupSeparatorColor: token.colorPrimaryHover,
  buttonDangerGroupSeparatorColor: token.colorErrorHover,
});

export default genComponentStyleHook('Button', token => {
  const { controlTmpOutline, paddingContentHorizontal } = token;
  // Derive state defaults from the merged token so alias overrides (e.g. `colorTextLightSolid`)
  // still apply, and only fill tokens that are not already provided by the theme.
  const buttonToken = mergeToken<ButtonToken>(
    token,
    {
      colorOutlineDefault: controlTmpOutline,
      buttonPaddingHorizontal: paddingContentHorizontal,
    },
    genButtonDefaultToken(token),
    { preserveExisting: true },
  );

  return [
    // Shared
    genSharedButtonStyle(buttonToken),

    // Size
    genSizeSmallButtonStyle(buttonToken),
    genSizeBaseButtonStyle(buttonToken),
    genSizeLargeButtonStyle(buttonToken),

    // Block
    genBlockButtonStyle(buttonToken),

    // Group (type, ghost, danger, disabled, loading)
    genTypeButtonStyle(buttonToken),

    // Button Group
    genGroupStyle(buttonToken),

    // Space Compact
    genCompactItemStyle(token, { focus: false }),
    genCompactItemVerticalStyle(token),
  ];
});
