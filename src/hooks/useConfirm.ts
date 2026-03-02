import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: ((confirmed: boolean) => void) | null;
}

const INITIAL_STATE: ConfirmState = {
  isOpen: false,
  title: '',
  message: '',
  confirmLabel: 'Eliminar',
  resolve: null,
};

/**
 * Returns a `confirm` function that shows a ConfirmDialog and resolves
 * with `true` if the user confirms or `false` if they cancel.
 *
 * Usage:
 *   const { confirm, dialogProps } = useConfirm();
 *   const ok = await confirm({ title: '...', message: '...' });
 *   if (ok) { ... }
 *
 *   // In JSX:
 *   <ConfirmDialog {...dialogProps} />
 */
export function useConfirm() {
  const [state, setState] = useState<ConfirmState>(INITIAL_STATE);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ ...options, isOpen: true, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState(INITIAL_STATE);
  }, [state]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState(INITIAL_STATE);
  }, [state]);

  return {
    confirm,
    dialogProps: {
      isOpen: state.isOpen,
      title: state.title,
      message: state.message,
      confirmLabel: state.confirmLabel,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  };
}
