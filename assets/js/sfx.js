/* Muzeeb Portfolio — UI SFX Module (uisfx)
   Selected Sound Pack: studio
   Tactile editing precision with warm cinematic restraint for AI & SaaS portfolio.
*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['uisfx'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('uisfx'));
  } else {
    root.mzSFX = factory(root.uisfx);
  }
}(typeof self !== 'undefined' ? self : this, function (uisfx) {
  'use strict';

  var SELECTED_PACK = 'studio';
  var DEFAULT_VOLUME = 0.7;
  var PREF_KEY = 'mz-sound';

  var player = null;
  var unlocked = false;
  var activeLoops = new Map();
  var isSSR = typeof window === 'undefined';

  function getSavedSoundPreference() {
    if (isSSR || !window.localStorage) return true;
    try {
      var val = localStorage.getItem(PREF_KEY);
      return val !== null ? val === 'true' : true;
    } catch (e) {
      return true;
    }
  }

  function getPlayer() {
    if (isSSR) return null;
    var lib = uisfx || (typeof window !== 'undefined' ? window.uisfx : null);
    if (!player && lib && typeof lib.createUISFX === 'function') {
      var enabled = getSavedSoundPreference();
      player = lib.createUISFX({
        pack: SELECTED_PACK,
        volume: DEFAULT_VOLUME,
        enabled: enabled
      });
    }
    return player;
  }

  function unlockAudio() {
    if (unlocked || isSSR) return Promise.resolve(false);
    var p = getPlayer();
    if (p && typeof p.unlock === 'function') {
      return p.unlock().then(function (res) {
        if (res) unlocked = true;
        return res;
      }).catch(function () { return false; });
    }
    return Promise.resolve(false);
  }

  function setupGestureUnlock() {
    if (isSSR) return;
    var events = ['pointerdown', 'keydown', 'touchstart'];
    function onGesture() {
      unlockAudio();
      events.forEach(function (e) {
        window.removeEventListener(e, onGesture, true);
      });
    }
    events.forEach(function (e) {
      window.addEventListener(e, onGesture, true);
    });
  }

  function playSFX(cue, options) {
    var p = getPlayer();
    if (!p || !p.isEnabled()) return null;
    try {
      return p.play(cue, options) || null;
    } catch (err) {
      return null;
    }
  }

  function startLoop(cue, options) {
    var p = getPlayer();
    if (!p || !p.isEnabled()) return null;
    if (activeLoops.has(cue)) {
      return activeLoops.get(cue);
    }
    try {
      var handle = p.play(cue, Object.assign({ loop: true }, options));
      if (handle) {
        activeLoops.set(cue, handle);
      }
      return handle;
    } catch (err) {
      return null;
    }
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
    var p = getPlayer();
    if (p && typeof p.stopAll === 'function') {
      try { p.stopAll(); } catch (e) {}
    }
  }

  function isSoundEnabled() {
    var p = getPlayer();
    return p ? p.isEnabled() : getSavedSoundPreference();
  }

  function setSoundEnabled(enabled) {
    if (!isSSR && window.localStorage) {
      try { localStorage.setItem(PREF_KEY, enabled ? 'true' : 'false'); } catch (e) {}
    }
    var p = getPlayer();
    if (!enabled) {
      stopAllLoops();
      if (p) p.setEnabled(false);
    } else {
      if (p) p.setEnabled(true);
      playSFX('toggle-on');
    }
    updateToggleUI(enabled);
  }

  function updateToggleUI(enabled) {
    if (isSSR) return;
    var btns = document.querySelectorAll('.mz-sound-btn');
    btns.forEach(function (b) {
      b.setAttribute('aria-checked', enabled ? 'true' : 'false');
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
      var enabled = isSoundEnabled();
      btn.setAttribute('aria-checked', enabled ? 'true' : 'false');
      btn.innerHTML = enabled ? SPEAKER_ON : SPEAKER_OFF;
    };
    btn.render();
    btn.addEventListener('click', function () {
      setSoundEnabled(!isSoundEnabled());
    });
    document.body.appendChild(btn);
  }

  function destroy() {
    stopAllLoops();
    if (player && typeof player.destroy === 'function') {
      player.destroy();
    }
    player = null;
    unlocked = false;
  }

  if (!isSSR) {
    setupGestureUnlock();
  }

  return {
    SELECTED_PACK: SELECTED_PACK,
    getPlayer: getPlayer,
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
