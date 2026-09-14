import type { InjectionKey, Ref } from 'vue';
import { shallowRef, inject, provide } from 'vue';

export interface HoverContextProps {
  startRow: Ref<number>;
  endRow: Ref<number>;
  onHover: (start: number, end: number) => void;
  /** Whether the row-hover highlighting (including rowSpan-aware hover) is enabled */
  rowHoverable?: Ref<boolean>;
}
export const HoverContextKey: InjectionKey<HoverContextProps> = Symbol('HoverContextProps');

export const useProvideHover = (props: HoverContextProps) => {
  provide(HoverContextKey, props);
};

export const useInjectHover = () => {
  return inject(HoverContextKey, {
    startRow: shallowRef(-1),
    endRow: shallowRef(-1),
    onHover() {},
    rowHoverable: shallowRef(true),
  } as HoverContextProps);
};
