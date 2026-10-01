import { useEffect, useRef, type RefObject } from 'react';

export interface BarcodeScannerOptions {
  minLength?: number;
  maxDelayBetweenKeys?: number;
  processingLockDuration?: number;
  enabled?: boolean;
  terminatorKey?: string;
  fallbackInput?: boolean;
}

export interface BarcodeScannerResult {
  fallbackInputRef: RefObject<HTMLInputElement | null>;
}

const DEFAULT_MIN_LENGTH = 4;
const DEFAULT_MAX_DELAY_BETWEEN_KEYS = 50;
const DEFAULT_PROCESSING_LOCK_DURATION = 300;
const enabledScannerTokens = new Set<symbol>();
let activeScannerToken: symbol | null = null;

const activateLatestScanner = () => {
  const tokens = Array.from(enabledScannerTokens);
  activeScannerToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
};

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.matches('input, textarea, select, [contenteditable="true"]') ||
    Boolean(target.closest('[contenteditable="true"]'))
  );
};

const isPrintableKey = (event: KeyboardEvent) =>
  event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

export const useBarcodeScanner = (
  onScan: (code: string) => void | Promise<void>,
  options: BarcodeScannerOptions = {}
): BarcodeScannerResult => {
  const {
    minLength = DEFAULT_MIN_LENGTH,
    maxDelayBetweenKeys = DEFAULT_MAX_DELAY_BETWEEN_KEYS,
    processingLockDuration = DEFAULT_PROCESSING_LOCK_DURATION,
    enabled = true,
    terminatorKey = 'Enter',
    fallbackInput = false,
  } = options;

  const onScanRef = useRef(onScan);
  const optionsRef = useRef({
    minLength,
    maxDelayBetweenKeys,
    processingLockDuration,
    enabled,
    terminatorKey,
  });
  const bufferRef = useRef('');
  const lastKeyTimeRef = useRef(0);
  const fastKeyCountRef = useRef(0);
  const processingRef = useRef(false);
  const processingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bufferTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackInputRef = useRef<HTMLInputElement | null>(null);
  const scannerTokenRef = useRef<symbol | null>(null);
  const resetBufferRef = useRef<() => void>(() => undefined);

  onScanRef.current = onScan;
  optionsRef.current = {
    minLength,
    maxDelayBetweenKeys,
    processingLockDuration,
    enabled,
    terminatorKey,
  };

  useEffect(() => {
    const resetBuffer = () => {
      bufferRef.current = '';
      lastKeyTimeRef.current = 0;
      fastKeyCountRef.current = 0;
      if (bufferTimerRef.current) {
        clearTimeout(bufferTimerRef.current);
        bufferTimerRef.current = null;
      }
    };

    const releaseProcessingLock = () => {
      processingRef.current = false;
      if (processingTimerRef.current) {
        clearTimeout(processingTimerRef.current);
        processingTimerRef.current = null;
      }
    };

    resetBufferRef.current = resetBuffer;
    scannerTokenRef.current = Symbol('barcode-scanner');
    if (optionsRef.current.enabled) {
      enabledScannerTokens.add(scannerTokenRef.current);
      activeScannerToken = scannerTokenRef.current;
    }

    const scheduleBufferReset = () => {
      if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
      bufferTimerRef.current = setTimeout(resetBuffer, optionsRef.current.maxDelayBetweenKeys * 2);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentOptions = optionsRef.current;
      if (
        !currentOptions.enabled ||
        scannerTokenRef.current !== activeScannerToken ||
        event.isComposing
      ) return;

      if (event.key === currentOptions.terminatorKey) {
        const code = bufferRef.current;
        const shouldIntercept = code.length >= currentOptions.minLength && fastKeyCountRef.current > 0;
        resetBuffer();

        if (!shouldIntercept || processingRef.current) return;

        event.preventDefault();
        event.stopPropagation();
        processingRef.current = true;
        void Promise.resolve(onScanRef.current(code)).finally(() => {
          if (processingTimerRef.current) clearTimeout(processingTimerRef.current);
          processingTimerRef.current = setTimeout(
            releaseProcessingLock,
            currentOptions.processingLockDuration
          );
        });
        return;
      }

      if (!isPrintableKey(event)) return;

      const now = performance.now();
      const elapsed = lastKeyTimeRef.current ? now - lastKeyTimeRef.current : 0;
      const isFast = elapsed > 0 && elapsed <= currentOptions.maxDelayBetweenKeys;
      const editableTarget = isEditableTarget(event.target);

      if (lastKeyTimeRef.current && !isFast) {
        resetBuffer();
      }

      if (isFast) fastKeyCountRef.current += 1;
      bufferRef.current += event.key;
      lastKeyTimeRef.current = now;
      scheduleBufferReset();

      const isFallbackTarget = event.target === fallbackInputRef.current;
      if (editableTarget && !isFallbackTarget && fastKeyCountRef.current > 0) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleWindowBlur = () => {
      resetBuffer();
      releaseProcessingLock();
    };

    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('blur', handleWindowBlur);
      resetBuffer();
      releaseProcessingLock();
      resetBufferRef.current = () => undefined;
      if (scannerTokenRef.current) enabledScannerTokens.delete(scannerTokenRef.current);
      if (activeScannerToken === scannerTokenRef.current) activateLatestScanner();
    };
  }, []);

  useEffect(() => {
    if (enabled) {
      if (scannerTokenRef.current) enabledScannerTokens.add(scannerTokenRef.current);
      activeScannerToken = scannerTokenRef.current;
    } else {
      if (scannerTokenRef.current) enabledScannerTokens.delete(scannerTokenRef.current);
      if (activeScannerToken === scannerTokenRef.current) activateLatestScanner();
      resetBufferRef.current();
    }
  }, [enabled]);

  useEffect(() => {
    if (fallbackInput && enabled) {
      fallbackInputRef.current?.focus();
    }
  }, [fallbackInput, enabled]);

  return { fallbackInputRef };
};
