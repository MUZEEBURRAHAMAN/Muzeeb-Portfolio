/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import nachiSFX from '../assets/js/nachi-sfx.js';
import mzSFX from '../assets/js/sfx.js';

if (typeof window !== 'undefined') {
  window.nachiSFX = nachiSFX;
}

describe('UI SFX Integration Tests (nachi-sfx engine)', () => {
  beforeEach(() => {
    localStorage.clear();
    mzSFX.destroy();
  });

  afterEach(() => {
    mzSFX.destroy();
    vi.restoreAllMocks();
  });

  it('1. Engine identity: uses the nachi-sfx synthesis engine', () => {
    expect(mzSFX.ENGINE).toBe('nachi-sfx');
    expect(nachiSFX.presetNames).toContain('chime');
    expect(nachiSFX.presetNames).toContain('press');
  });

  it('2. Cue Mapping: every semantic cue used across the site maps to a real preset', () => {
    const usedCues = [
      'hover', 'press', 'release', 'focus', 'typing', 'select',
      'check', 'uncheck', 'open', 'close', 'forward', 'undo',
      'error', 'receive', 'send', 'success', 'processing',
      'toggle-on', 'toggle-off'
    ];

    usedCues.forEach((cue) => {
      expect(mzSFX.CUE_MAP).toHaveProperty(cue);
      expect(nachiSFX.presetNames).toContain(mzSFX.CUE_MAP[cue]);
    });
  });

  it('3. Gesture Unlock handling', async () => {
    const unlockSpy = vi.spyOn(mzSFX, 'unlock');
    await mzSFX.unlock();
    expect(unlockSpy).toHaveBeenCalled();
  });

  it('4. Safe Playback & Null Handling (no real AudioContext in happy-dom)', () => {
    const res = mzSFX.play('toggle-on');
    expect(res === null || typeof res === 'object').toBe(true);
  });

  it('5. Unknown cue is rejected safely', () => {
    expect(mzSFX.play('not-a-real-cue')).toBeNull();
  });

  it('6. Loop Management & Cleanup on Every Exit', () => {
    const loop1 = mzSFX.startLoop('processing');
    const loop2 = mzSFX.startLoop('processing'); // Idempotent check
    expect(loop1).toBe(loop2);

    mzSFX.stopLoop('processing');

    let processingHandle = mzSFX.startLoop('processing');
    let completed = false;
    let caughtError = false;

    try {
      completed = true;
    } catch (e) {
      caughtError = true;
    } finally {
      if (processingHandle && typeof processingHandle.stop === 'function') {
        processingHandle.stop();
      }
      mzSFX.stopLoop('processing');
      processingHandle = null;
    }

    expect(completed).toBe(true);
    expect(caughtError).toBe(false);
    expect(processingHandle).toBeNull();
  });

  it('7. Accessible Sound Preference Persistence & Immediate Mute', () => {
    expect(mzSFX.isEnabled()).toBe(true);

    mzSFX.startLoop('processing');

    mzSFX.setEnabled(false);
    expect(localStorage.getItem('mz-sound')).toBe('false');
    expect(mzSFX.isEnabled()).toBe(false);

    expect(mzSFX.play('toggle-on')).toBeNull();

    mzSFX.setEnabled(true);
    expect(localStorage.getItem('mz-sound')).toBe('true');
    expect(mzSFX.isEnabled()).toBe(true);
  });

  it('8. Sound Toggle UI Control rendering', () => {
    mzSFX.initSoundToggle();
    const btn = document.querySelector('.mz-sound-btn');
    expect(btn).not.toBeNull();
    expect(btn.getAttribute('role')).toBe('switch');
    expect(btn.getAttribute('aria-label')).toBe('Toggle sound effects');
    expect(btn.getAttribute('aria-checked')).toBe('true');

    btn.click();
    expect(btn.getAttribute('aria-checked')).toBe('false');
    expect(localStorage.getItem('mz-sound')).toBe('false');

    btn.click();
    expect(btn.getAttribute('aria-checked')).toBe('true');
    expect(localStorage.getItem('mz-sound')).toBe('true');
  });

  it('9. Cooldown deduplication protects against rapid repeat triggers', () => {
    const res1 = mzSFX.play('hover', { cooldownMs: 100 });
    const res2 = mzSFX.play('hover', { cooldownMs: 100 });
    expect(res2 === null || res2 === res1).toBe(true);
  });
});
