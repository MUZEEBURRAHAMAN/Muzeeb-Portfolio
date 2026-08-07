/* Muzeeb Portfolio — UI SFX Module
   Engine: nachi-sfx (ported Web Audio synth from nachi.design, see nachi-sfx.js)
*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['nachiSFX'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./nachi-sfx.js'));
  } else {
    root.mzSFX = factory(root.nachiSFX);
  }
}(typeof self !== 'undefined' ? self : this, function (engine) {
  'use strict';

  var ENGINE_NAME = 'nachi-sfx';
  var DEFAULT_VOLUME = 0.7;
  var PREF_KEY = 'mz-sound';

  /* Every semantic cue used across the site, mapped to the nearest matching
     preset from nachi.design's sound set. */
  var CUE_MAP = {
    hover: 'tick',
    press: 'press',
    release: 'release',
    focus: 'droplet',
    typing: 'tick',
    select: 'sparkle',
    check: 'toggle',
    uncheck: 'toggle',
    open: 'page',
    close: 'page',
    forward: 'page',
    undo: 'release',
    error: 'error',
    receive: 'droplet',
    send: 'chime',
    success: 'success',
    processing: 'loading',
    'toggle-on': 'ready',
    'toggle-off': 'toggle'
  };

  var enabled = true;
  var isSSR = typeof window === 'undefined';
  var lastPlayedAt = {};
  var activeLoops = new Map();

  function getSavedSoundPreference() {
    if (isSSR || !window.localStorage) return true;
    try {
      var val = localStorage.getItem(PREF_KEY);
      return val !== null ? val === 'true' : true;
    } catch (e) {
      return true;
    }
  }

  function getEngine() {
    return engine || (typeof window !== 'undefined' ? window.nachiSFX : null);
  }

  var initialized = false;
  function ensureInit() {
    if (initialized) return;
    initialized = true;
    enabled = getSavedSoundPreference();
  }

  function unlockAudio() {
    if (isSSR) return Promise.resolve(false);
    var e = getEngine();
    if (e && typeof e.unlock === 'function') {
      return e.unlock().catch(function () { return false; });
    }
    return Promise.resolve(false);
  }

  function setupGestureUnlock() {
    if (isSSR) return;
    var events = ['pointerdown', 'keydown', 'touchstart'];
    function onGesture() {
      unlockAudio();
      events.forEach(function (ev) {
        window.removeEventListener(ev, onGesture, true);
      });
    }
    events.forEach(function (ev) {
      window.addEventListener(ev, onGesture, true);
    });
  }

  function playSFX(cue, options) {
    ensureInit();
    if (!enabled) return null;
    var e = getEngine();
    if (!e) return null;
    var preset = CUE_MAP[cue] || cue;
    if (e.presetNames && e.presetNames.indexOf(preset) === -1) return null;

    var cooldownMs = options && options.cooldownMs;
    if (cooldownMs) {
      var now = Date.now();
      var last = lastPlayedAt[cue] || 0;
      if (now - last < cooldownMs) return null;
      lastPlayedAt[cue] = now;
    }

    try {
      var ok = e.play(preset, { volume: DEFAULT_VOLUME });
      return ok ? { cue: cue, preset: preset } : null;
    } catch (err) {
      return null;
    }
  }

  function startLoop(cue, options) {
    ensureInit();
    if (!enabled) return null;
    if (activeLoops.has(cue)) return activeLoops.get(cue);
    var preset = CUE_MAP[cue] || cue;
    var intervalMs = (options && options.intervalMs) || 700;
    var e = getEngine();
    if (!e) return null;
    try { e.play(preset, { volume: DEFAULT_VOLUME }); } catch (err) {}
    var timer = setInterval(function () {
      try { e.play(preset, { volume: DEFAULT_VOLUME }); } catch (err) {}
    }, intervalMs);
    var handle = { stop: function () { clearInterval(timer); } };
    activeLoops.set(cue, handle);
    return handle;
  }

  function stopLoop(cue) {
    if (activeLoops.has(cue)) {
      var handle = activeLoops.get(cue);
      if (handle && typeof handle.stop === 'function') {
        try { handle.stop(); } catch (e) {}
      }
      activeLoops.delete(cue);
    }
  }

  function stopAllLoops() {
    activeLoops.forEach(function (handle) {
      if (handle && typeof handle.stop === 'function') {
        try { handle.stop(); } catch (e) {}
      }
    });
    activeLoops.clear();
  }

  function isSoundEnabled() {
    ensureInit();
    return enabled;
  }

  function setSoundEnabled(nextEnabled) {
    ensureInit();
    enabled = !!nextEnabled;
    if (!isSSR && window.localStorage) {
      try { localStorage.setItem(PREF_KEY, enabled ? 'true' : 'false'); } catch (e) {}
    }
    if (!enabled) {
      stopAllLoops();
    } else {
      playSFX('toggle-on');
    }
    updateToggleUI(enabled);
  }

  function updateToggleUI(isEnabled) {
    if (isSSR) return;
    var btns = document.querySelectorAll('.mz-sound-btn');
    btns.forEach(function (b) {
      b.setAttribute('aria-checked', isEnabled ? 'true' : 'false');
      if (typeof b.render === 'function') b.render();
    });
  }

  function initSoundToggle() {
    if (isSSR || !document.body) return;
    if (document.querySelector('.mz-sound-btn')) return;

    var SPEAKER_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
    var SPEAKER_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v6a1 1 0 0 0 1 1h4l5 5V4L15 9H9z"/><line x1="23" y1="1" x2="1" y2="23"/></svg>';

    var btn = document.createElement('button');
    btn.className = 'mz-sound-btn';
    btn.type = 'button';
    btn.setAttribute('role', 'switch');
    btn.setAttribute('aria-label', 'Toggle sound effects');
    btn.render = function () {
      var isEnabled = isSoundEnabled();
      btn.setAttribute('aria-checked', isEnabled ? 'true' : 'false');
      btn.innerHTML = isEnabled ? SPEAKER_ON : SPEAKER_OFF;
    };
    btn.render();
    btn.addEventListener('click', function () {
      setSoundEnabled(!isSoundEnabled());
    });
    document.body.appendChild(btn);
  }

  function destroy() {
    stopAllLoops();
    lastPlayedAt = {};
    initialized = false;
  }

  if (!isSSR) {
    setupGestureUnlock();
  }

  return {
    ENGINE: ENGINE_NAME,
    CUE_MAP: CUE_MAP,
    getEngine: getEngine,
    play: playSFX,
    startLoop: startLoop,
    stopLoop: stopLoop,
    stopAllLoops: stopAllLoops,
    isEnabled: isSoundEnabled,
    setEnabled: setSoundEnabled,
    unlock: unlockAudio,
    initSoundToggle: initSoundToggle,
    destroy: destroy
  };
}));
