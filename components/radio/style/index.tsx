import { Keyframes } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { genFocusOutline, resetComponent } from '../../style';

// ============================== Tokens ==============================
export interface ComponentToken {
  radioButtonHoverColor: string;
  radioButtonCheckedColor: string;
  radioButtonCheckedBg: string;
  radioButtonCheckedBorderColor: string;
  radioButtonCheckedHoverColor: string;
  radioButtonCheckedHoverBg: string;
  radioButtonCheckedHoverBorderColor: string;
  radioButtonCheckedActiveColor: string;
  radioButtonCheckedActiveBg: string;
  radioButtonCheckedActiveBorderColor: string;
  radioButtonSolidCheckedColor: string;
  radioButtonSolidCheckedBg: string;
  radioButtonSolidCheckedBorderColor: string;
  radioButtonSolidCheckedHoverColor: string;
  radioButtonSolidCheckedHoverBg: string;
  radioButtonSolidCheckedHoverBorderColor: string;
  radioButtonSolidCheckedActiveColor: string;
  radioButtonSolidCheckedActiveBg: string;
  radioButtonSolidCheckedActiveBorderColor: string;
  radioButtonDisabledCheckedColor: string;
  radioButtonDisabledCheckedBg: string;
  radioButtonDisabledCheckedBorderColor: string;
}

interface RadioToken extends FullToken<'Radio'> {
  radioFocusShadow: string;
  radioButtonFocusShadow: string;

  radioSize: number;
  radioTop: number;
  radioDotSize: number;
  radioDotDisabledSize: number;
  radioCheckedColor: string;
  radioDotDisabledColor: string;

  radioButtonBg: string;
  radioButtonColor: string;
  radioButtonPaddingHorizontal: number;
  radioWrapperMarginRight: number;
}

// ============================== Styles ==============================
const antRadioEffect = new Keyframes('antRadioEffect', {
  '0%': { transform: 'scale(1)', opacity: 0.5 },
  '100%': { transform: 'scale(1.6)', opacity: 0 },
});

// styles from RadioGroup only
const getGroupRadioStyle: GenerateStyle<RadioToken> = token => {
  const { componentCls, antCls } = token;
  const groupPrefixCls = `${componentCls}-group`;

  return {
    [groupPrefixCls]: {
      ...resetComponent(token),
      display: 'inline-block',
      fontSize: 0,

      // RTL
      [`&${groupPrefixCls}-rtl`]: {
        direction: 'rtl',
      },

      [`${antCls}-badge ${antCls}-badge-count`]: {
        zIndex: 1,
      },

      [`> ${antCls}-badge:not(:first-child) > ${antCls}-button-wrapper`]: {
        borderInlineStart: 'none',
      },
    },
  };
};

// Styles from radio-wrapper
const getRadioBasicStyle: GenerateStyle<RadioToken> = token => {
  const {
    componentCls,
    radioWrapperMarginRight,
    radioCheckedColor,
    radioSize,
    motionDurationSlow,
    motionDurationMid,
    motionEaseInOut,
    motionEaseInOutCirc,
    radioButtonBg,
    colorBorder,
    lineWidth,
    radioDotSize,
    colorBgContainerDisabled,
    colorTextDisabled,
    paddingXS,
    radioDotDisabledColor,
    lineType,
    radioDotDisabledSize,
    wireframe,
    colorWhite,
  } = token;
  const radioInnerPrefixCls = `${componentCls}-inner`;

  return {
    [`${componentCls}-wrapper`]: {
      ...resetComponent(token),
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'baseline',
      marginInlineStart: 0,
      marginInlineEnd: radioWrapperMarginRight,
      cursor: 'pointer',

      // RTL
      [`&${componentCls}-wrapper-rtl`]: {
        direction: 'rtl',
      },

      '&-disabled': {
        cursor: 'not-allowed',
        color: token.colorTextDisabled,
      },

      '&::after': {
        display: 'inline-block',
        width: 0,
        overflow: 'hidden',
        content: '"\\a0"',
      },

      // hashId 在 wrapper 上，只能铺平
      [`${componentCls}-checked::after`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        width: '100%',
        height: '100%',
        border: `${lineWidth}px ${lineType} ${radioCheckedColor}`,
        borderRadius: '50%',
        visibility: 'hidden',
        animationName: antRadioEffect,
        animationDuration: motionDurationSlow,
        animationTimingFunction: motionEaseInOut,
        animationFillMode: 'both',
        content: '""',
      },

      [componentCls]: {
        ...resetComponent(token),
        position: 'relative',
        display: 'inline-block',
        outline: 'none',
        cursor: 'pointer',
        alignSelf: 'center',
      },

      [`${componentCls}-wrapper:hover &,
        &:hover ${radioInnerPrefixCls}`]: {
        borderColor: radioCheckedColor,
      },

      [`${componentCls}-input:focus-visible + ${radioInnerPrefixCls}`]: {
        ...genFocusOutline(token),
      },

      [`${componentCls}:hover::after, ${componentCls}-wrapper:hover &::after`]: {
        visibility: 'visible',
      },

      [`${componentCls}-inner`]: {
        '&::after': {
          boxSizing: 'border-box',
          position: 'absolute',
          insetBlockStart: '50%',
          insetInlineStart: '50%',
          display: 'block',
          width: radioSize,
          height: radioSize,
          marginBlockStart: radioSize / -2,
          marginInlineStart: radioSize / -2,
          backgroundColor: wireframe ? radioCheckedColor : colorWhite,
          borderBlockStart: 0,
          borderInlineStart: 0,
          borderRadius: radioSize,
          transform: 'scale(0)',
          opacity: 0,
          transition: `all ${motionDurationSlow} ${motionEaseInOutCirc}`,
          content: '""',
        },

        boxSizing: 'border-box',
        position: 'relative',
        insetBlockStart: 0,
        insetInlineStart: 0,
        display: 'block',
        width: radioSize,
        height: radioSize,
        backgroundColor: radioButtonBg,
        borderColor: colorBorder,
        borderStyle: 'solid',
        borderWidth: lineWidth,
        borderRadius: '50%',
        transition: `all ${motionDurationMid}`,
      },

      [`${componentCls}-input`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineEnd: 0,
        insetBlockEnd: 0,
        insetInlineStart: 0,
        zIndex: 1,
        cursor: 'pointer',
        opacity: 0,
      },

      // 选中状态
      [`${componentCls}-checked`]: {
        [radioInnerPrefixCls]: {
          borderColor: radioCheckedColor,
          backgroundColor: wireframe ? radioButtonBg : radioCheckedColor,

          '&::after': {
            transform: `scale(${radioDotSize / radioSize})`,
            opacity: 1,
            transition: `all ${motionDurationSlow} ${motionEaseInOutCirc}`,
          },
        },
      },

      [`${componentCls}-disabled`]: {
        cursor: 'not-allowed',

        [radioInnerPrefixCls]: {
          backgroundColor: colorBgContainerDisabled,
          borderColor: colorBorder,
          cursor: 'not-allowed',

          '&::after': {
            backgroundColor: radioDotDisabledColor,
          },
        },

        [`${componentCls}-input`]: {
          cursor: 'not-allowed',
        },

        [`${componentCls}-disabled + span`]: {
          color: colorTextDisabled,
          cursor: 'not-allowed',
        },

        [`&${componentCls}-checked`]: {
          [radioInnerPrefixCls]: {
            '&::after': {
              transform: `scale(${radioDotDisabledSize / radioSize})`,
            },
          },
        },
      },

      [`span${componentCls} + *`]: {
        paddingInlineStart: paddingXS,
        paddingInlineEnd: paddingXS,
      },
    },
  };
};

// Styles from radio-button
const getRadioButtonStyle: GenerateStyle<RadioToken> = token => {
  const {
    radioButtonColor,
    controlHeight,
    componentCls,
    lineWidth,
    lineType,
    colorBorder,
    motionDurationSlow,
    motionDurationMid,
    radioButtonPaddingHorizontal,
    fontSize,
    radioButtonBg,
    fontSizeLG,
    controlHeightLG,
    controlHeightSM,
    paddingXS,
    borderRadius,
    borderRadiusSM,
    borderRadiusLG,
    radioButtonHoverColor,
    radioButtonCheckedColor,
    radioButtonCheckedBg,
    radioButtonCheckedBorderColor,
    radioButtonCheckedHoverColor,
    radioButtonCheckedHoverBg,
    radioButtonCheckedHoverBorderColor,
    radioButtonCheckedActiveColor,
    radioButtonCheckedActiveBg,
    radioButtonCheckedActiveBorderColor,
    radioButtonSolidCheckedColor,
    radioButtonSolidCheckedBg,
    radioButtonSolidCheckedBorderColor,
    radioButtonSolidCheckedHoverColor,
    radioButtonSolidCheckedHoverBg,
    radioButtonSolidCheckedHoverBorderColor,
    radioButtonSolidCheckedActiveColor,
    radioButtonSolidCheckedActiveBg,
    radioButtonSolidCheckedActiveBorderColor,
    colorTextDisabled,
    colorBgContainerDisabled,
    radioButtonDisabledCheckedColor,
    radioButtonDisabledCheckedBg,
    radioButtonDisabledCheckedBorderColor,
  } = token;
  return {
    [`${componentCls}-button-wrapper`]: {
      position: 'relative',
      display: 'inline-block',
      height: controlHeight,
      margin: 0,
      paddingInline: radioButtonPaddingHorizontal,
      paddingBlock: 0,
      color: radioButtonColor,
      fontSize,
      lineHeight: `${controlHeight - lineWidth * 2}px`,
      background: radioButtonBg,
      border: `${lineWidth}px ${lineType} ${colorBorder}`,
      // strange align fix for chrome but works
      // https://gw.alipayobjects.com/zos/rmsportal/VFTfKXJuogBAXcvfAUWJ.gif
      borderBlockStartWidth: lineWidth + 0.02,
      borderInlineStartWidth: 0,
      borderInlineEndWidth: lineWidth,
      cursor: 'pointer',
      transition: [
        `color ${motionDurationMid}`,
        `background ${motionDurationMid}`,
        `border-color ${motionDurationMid}`,
        `box-shadow ${motionDurationMid}`,
      ].join(','),

      a: {
        color: radioButtonColor,
      },

      [`> ${componentCls}-button`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
      },

      '&:not(:first-child)': {
        '&::before': {
          position: 'absolute',
          insetBlockStart: -lineWidth,
          insetInlineStart: -lineWidth,
          display: 'block',
          boxSizing: 'content-box',
          width: 1,
          height: '100%',
          paddingBlock: lineWidth,
          paddingInline: 0,
          backgroundColor: colorBorder,
          transition: `background-color ${motionDurationSlow}`,
          content: '""',
        },
      },

      '&:first-child': {
        borderInlineStart: `${lineWidth}px ${lineType} ${colorBorder}`,
        borderStartStartRadius: borderRadius,
        borderEndStartRadius: borderRadius,
      },

      '&:last-child': {
        borderStartEndRadius: borderRadius,
        borderEndEndRadius: borderRadius,
      },

      '&:first-child:last-child': {
        borderRadius,
      },

      [`${componentCls}-group-large &`]: {
        height: controlHeightLG,
        fontSize: fontSizeLG,
        lineHeight: `${controlHeightLG - lineWidth * 2}px`,

        '&:first-child': {
          borderStartStartRadius: borderRadiusLG,
          borderEndStartRadius: borderRadiusLG,
        },

        '&:last-child': {
          borderStartEndRadius: borderRadiusLG,
          borderEndEndRadius: borderRadiusLG,
        },
      },

      [`${componentCls}-group-small &`]: {
        height: controlHeightSM,
        paddingInline: paddingXS - lineWidth,
        paddingBlock: 0,
        lineHeight: `${controlHeightSM - lineWidth * 2}px`,

        '&:first-child': {
          borderStartStartRadius: borderRadiusSM,
          borderEndStartRadius: borderRadiusSM,
        },

        '&:last-child': {
          borderStartEndRadius: borderRadiusSM,
          borderEndEndRadius: borderRadiusSM,
        },
      },

      '&:hover': {
        position: 'relative',
        color: radioButtonHoverColor,
      },

      '&:has(:focus-visible)': {
        ...genFocusOutline(token),
      },

      [`${componentCls}-inner, input[type='checkbox'], input[type='radio']`]: {
        width: 0,
        height: 0,
        opacity: 0,
        pointerEvents: 'none',
      },

      [`&-checked:not(${componentCls}-button-wrapper-disabled)`]: {
        zIndex: 1,
        color: radioButtonCheckedColor,
        background: radioButtonCheckedBg,
        borderColor: radioButtonCheckedBorderColor,

        '&::before': {
          backgroundColor: radioButtonCheckedBorderColor,
        },

        '&:first-child': {
          borderColor: radioButtonCheckedBorderColor,
        },

        '&:hover': {
          color: radioButtonCheckedHoverColor,
          background: radioButtonCheckedHoverBg,
          borderColor: radioButtonCheckedHoverBorderColor,

          '&::before': {
            backgroundColor: radioButtonCheckedHoverBorderColor,
          },
        },

        '&:active': {
          color: radioButtonCheckedActiveColor,
          background: radioButtonCheckedActiveBg,
          borderColor: radioButtonCheckedActiveBorderColor,

          '&::before': {
            backgroundColor: radioButtonCheckedActiveBorderColor,
          },
        },
      },

      [`${componentCls}-group-solid &-checked:not(${componentCls}-button-wrapper-disabled)`]: {
        color: radioButtonSolidCheckedColor,
        background: radioButtonSolidCheckedBg,
        borderColor: radioButtonSolidCheckedBorderColor,

        '&::before': {
          backgroundColor: radioButtonSolidCheckedBorderColor,
        },

        '&:hover': {
          color: radioButtonSolidCheckedHoverColor,
          background: radioButtonSolidCheckedHoverBg,
          borderColor: radioButtonSolidCheckedHoverBorderColor,

          '&::before': {
            backgroundColor: radioButtonSolidCheckedHoverBorderColor,
          },
        },

        '&:active': {
          color: radioButtonSolidCheckedActiveColor,
          background: radioButtonSolidCheckedActiveBg,
          borderColor: radioButtonSolidCheckedActiveBorderColor,

          '&::before': {
            backgroundColor: radioButtonSolidCheckedActiveBorderColor,
          },
        },
      },

      '&-disabled': {
        color: colorTextDisabled,
        backgroundColor: colorBgContainerDisabled,
        borderColor: colorBorder,
        cursor: 'not-allowed',

        '&:first-child, &:hover': {
          color: colorTextDisabled,
          backgroundColor: colorBgContainerDisabled,
          borderColor: colorBorder,
        },
      },

      [`&-disabled${componentCls}-button-wrapper-checked`]: {
        color: radioButtonDisabledCheckedColor,
        backgroundColor: radioButtonDisabledCheckedBg,
        borderColor: radioButtonDisabledCheckedBorderColor,
        boxShadow: 'none',

        '&::before': {
          backgroundColor: radioButtonDisabledCheckedBorderColor,
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook('Radio', token => {
  const {
    padding,
    lineWidth,
    controlItemBgActiveDisabled,
    colorTextDisabled,
    colorBgContainer,
    fontSizeLG,
    controlOutline,
    colorPrimaryHover,
    colorPrimaryActive,
    colorText,
    colorPrimary,
    marginXS,
    controlOutlineWidth,
    colorTextLightSolid,
    wireframe,
  } = token;

  // Radio
  const radioFocusShadow = `0 0 0 ${controlOutlineWidth}px ${controlOutline}`;
  const radioButtonFocusShadow = radioFocusShadow;

  const radioSize = fontSizeLG;
  const dotPadding = 4; // Fixed value
  const radioDotDisabledSize = radioSize - dotPadding * 2;
  const radioDotSize = wireframe ? radioDotDisabledSize : radioSize - (dotPadding + lineWidth) * 2;
  const radioCheckedColor = colorPrimary;

  // Radio buttons
  const radioButtonColor = colorText;
  const radioButtonPaddingHorizontal = padding - lineWidth;
  const radioWrapperMarginRight = marginXS;

  const radioToken = mergeToken<RadioToken>(
    token,
    {
      radioFocusShadow,
      radioButtonFocusShadow,
      radioSize,
      radioDotSize,
      radioDotDisabledSize,
      radioCheckedColor,
      radioDotDisabledColor: colorTextDisabled,
      radioButtonBg: colorBgContainer,
      radioButtonHoverColor: colorPrimary,
      radioButtonCheckedColor: colorPrimary,
      radioButtonCheckedBg: colorBgContainer,
      radioButtonCheckedBorderColor: colorPrimary,
      radioButtonCheckedHoverColor: colorPrimaryHover,
      radioButtonCheckedHoverBg: colorBgContainer,
      radioButtonCheckedHoverBorderColor: colorPrimaryHover,
      radioButtonCheckedActiveColor: colorPrimaryActive,
      radioButtonCheckedActiveBg: colorBgContainer,
      radioButtonCheckedActiveBorderColor: colorPrimaryActive,
      radioButtonSolidCheckedColor: colorTextLightSolid,
      radioButtonSolidCheckedBg: colorPrimary,
      radioButtonSolidCheckedBorderColor: colorPrimary,
      radioButtonSolidCheckedHoverColor: colorTextLightSolid,
      radioButtonSolidCheckedHoverBg: colorPrimaryHover,
      radioButtonSolidCheckedHoverBorderColor: colorPrimaryHover,
      radioButtonSolidCheckedActiveColor: colorTextLightSolid,
      radioButtonSolidCheckedActiveBg: colorPrimaryActive,
      radioButtonSolidCheckedActiveBorderColor: colorPrimaryActive,
      radioButtonDisabledCheckedColor: colorTextDisabled,
      radioButtonDisabledCheckedBg: controlItemBgActiveDisabled,
      radioButtonDisabledCheckedBorderColor: token.colorBorder,
      radioButtonColor,
      radioButtonPaddingHorizontal,
      radioWrapperMarginRight,
    },
    {
      preserveExisting: true,
    },
  );

  return [
    getGroupRadioStyle(radioToken),
    getRadioBasicStyle(radioToken),
    getRadioButtonStyle(radioToken),
  ];
});
