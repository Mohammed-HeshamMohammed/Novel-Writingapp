import { useFloating, offset, flip, shift, autoUpdate, useDismiss, useClick, useInteractions, type Placement } from '@floating-ui/react';

interface UseFloatingDropdownOptions {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: Placement;
  offsetPx?: number;
  padding?: number;
}

/**
 * Shared setup for click-to-open dropdown/menu panels: viewport-aware
 * placement (flips/shifts to stay on screen) plus click-outside and
 * Escape-key dismissal, via @floating-ui/react instead of hand-rolled
 * position math and document mousedown listeners.
 */
export const useFloatingDropdown = ({
  open,
  onOpenChange,
  placement = 'bottom-start',
  offsetPx = 8,
  padding = 16,
}: UseFloatingDropdownOptions) => {
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange,
    placement,
    middleware: [offset(offsetPx), flip({ padding }), shift({ padding })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  return { refs, floatingStyles, context, getReferenceProps, getFloatingProps };
};
