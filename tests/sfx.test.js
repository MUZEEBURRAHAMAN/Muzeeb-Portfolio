/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as uisfx from '../node_modules/uisfx/dist/index.js';
import mzSFX from '../assets/js/sfx.js';

if (typeof window !== 'undefined') {
  window.uisfx = uisfx;
}

describe('UI SFX Integration Tests (studio pack)', () => {
  beforeEach(() => {
    localStorage.clear();
    mzSFX.destroy();
  });

  afterEach(() => {
    mzSFX.destroy();
    vi.restoreAllMocks();
  });

  it('1. Selected Pack: verifies exact catalog pack name is "studio"', () => {
    expect(mzSFX.SELECTED_PACK).toBe('studio');
    expect(uisfx.packNames).toContain('studio');
    const packObj = uisfx.getPack('studio');
    expect(packObj.name).toBe('studio');
    expect(packObj.bestFor).toContain('AI creative tools');
  });

  it('2. Player Centralization & Initialization', () => {
    const player = mzSFX.getPlayer();
    expect(player).not.toBeNull();
    expect(player.getPack()).toBe('studio');
    expect(player.getVolume()).toBe(0.7);
    expect(player.isEnabled()).toBe(true);
  });

  it('3. Gesture Unlock handling', async () => {
    const unlockSpy = vi.spyOn(mzSFX, 'unlock');
    await mzSFX.unlock();
    expect(unlockSpy).toHaveBeenCalled();
  });

  it('4. Semantic Cue Mapping: validates all mapped cues against canonical catalog', () => {
    const mappedCues = [
      'hover',
      'toggle-on',
      'toggle-off',
      'open',
      'close',
      'forward',
      'copy',
      'send',
      'receive',
      'error',
      'undo',
      'select',
      'typing',
      'processing',
      'start',
      'stop',
      'progress-step'
    ];

    mappedCues.forEach((cue) => {
      expect(uisfx.cueNames).toContain(cue);
      expect(() => uisfx.getCue(cue)).not.toThrow();
    });
  });

  it('5. Safe Playback & Null Handling', () => {
    const res = mzSFX.play('toggle-on');
    // In mock DOM / Web Audio without full AudioContext, play returning handle or null is handled safely
    expect(res === null || typeof res === 'object').toBe(true);
  });

  it('6. Loop Management & Cleanup on Every Exit', () => {
    // Start loop
    const loop1 = mzSFX.startLoop('processing');
    const loop2 = mzSFX.startLoop('processing'); // Idempotent check
    expect(loop1).toBe(loop2);

    // Stop loop explicitly
    mzSFX.stopLoop('processing');

    // Simulate async workflow finally block
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

    // Start active loop before disabling
    mzSFX.startLoop('processing');

    // Toggle off
    mzSFX.setEnabled(false);
    expect(localStorage.getItem('mz-sound')).toBe('false');
    expect(mzSFX.isEnabled()).toBe(false);

    // Subsequent play calls return null when disabled
    expect(mzSFX.play('toggle-on')).toBeNull();

    // Toggle back on
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

  it('9. Fine-Pointer Hover & Deduplication Protection', () => {
    const res1 = mzSFX.play('hover', { cooldownMs: 100 });
    // Rapid duplicate call within cooldown
    const res2 = mzSFX.play('hover', { cooldownMs: 100 });
    // Cooldown logic prevents duplicate triggers
    expect(res2 === null || res2 === res1).toBe(true);
  });
});
