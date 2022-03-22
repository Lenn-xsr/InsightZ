<template>
  <div
    :class="
      markers && markers[0] && screenCheck
        ? 'video-wrapper plyr__with_markers'
        : 'video-wrapper'
    "
  >
    <div class="markers-menu" v-if="definedMarkers">
      <input type="checkbox" id="expand-markers-menu" style="display: none" />
      <label for="expand-markers-menu" title="Marcadores">
        <i class="fas fa-thumbtack"></i>
      </label>
      <ul>
        <li
          v-for="marker in definedMarkers"
          :key="marker.time"
          :data-marker-time="marker.time"
          @click="jumpMarker"
        >
          {{ marker.text }}
        </li>
      </ul>
    </div>
    <video
      id="insightz-player"
      tabindex="-1"
      controls
      playsinline
      preload="auto"
      controlslist="nodownload"
    ></video>
  </div>
</template>

<script>
import 'plyr/dist/plyr.css';
let startInterval;

export default {
  name: 'Player',
  props: ['sources', 'markers', 'resetPlayer', 'poster', 'next', 'playing'],
  data() {
    return {
      player: null,
      preferences: null,
      definedMarkers: null,
    };
  },
  computed: {
    screenCheck() {
      return window.screen.width >= 920;
    },
  },
  methods: {
    async setPlayer() {
      const Plyr = (await import('plyr')).default;
      this.player = new Plyr('#insightz-player', {
        ratio: '16:9',
      });

      this.player.source = {
        type: 'video',
        sources: this.sources,
        poster: this.poster,
      };

      this.player.on('loadeddata', () => {
        this.setSecurity();
        if (this.preferences && this.playing) {
          if (
            this.preferences.hash &&
            this.preferences.hash == this.playing.hash &&
            this.preferences.currentTime &&
            this.preferences.currentTime < this.player.duration
          ) {
            this.player.currentTime = this.preferences.currentTime;
          }
        }

        let markers = this.markers;

        if (markers[0] && this.player.duration > 0 && this.screenCheck)
          this.setupMarkers(this.markers);
      });

      this.player.on('timeupdate', () => {
        if (this.playing && this.player.currentTime < this.player.duration)
          this.setLocalPreferences({
            currentTime: this.player.currentTime,
            hash: this.playing.hash,
          });
      });
    },
    jumpMarker({ target }) {
      const targetTime = Number(target.dataset.markerTime);
      if (this.player.currentTime != targetTime) this.player.currentTime = targetTime;
    },
    setSecurity() {
      try {
        const getAleatInfo = () => {
          if (document) {
            const content = document.querySelector('.plyr');
            let infoContent = document.querySelector('.aleatInfo');

            if (!infoContent && content) {
              infoContent = document.createElement('div');
              content.appendChild(infoContent);
              infoContent.classList.add('aleatInfo');
            }

            if (!infoContent) return;

            infoContent.style =
              'position: absolute; z-index: 99999; color: rgba(255, 255, 255, 0.05); font-weight: bold; font-size: small; pointer-events: none; user-select: none; font-weight: normal;';
            infoContent.innerHTML = this.$store.state.user._id || '';

            return infoContent;
          }
        };

        const randomPosition = element => {
          const randomNumber = (min, max) => Math.random() * (max - min) + min;

          if (element && element.parentElement) {
            const randomTop = randomNumber(0, element.parentElement.offsetHeight);
            const randomLeft = randomNumber(0, element.parentElement.offsetWidth);

            element.style.top = randomTop + 'px';
            element.style.left = randomLeft + 'px';
          } else {
            clearInterval(startInterval);
          }
        };

        startInterval = setInterval(() => randomPosition(getAleatInfo()), 3000);
      } catch {
        clearInterval(startInterval);
      }
    },
    getPreferences() {
      let data = localStorage.getItem('inz-player');
      if (data) {
        data = JSON.parse(data);
        this.preferences = data;
      }
    },
    setLocalPreferences(preferences) {
      localStorage.setItem('inz-player', JSON.stringify(preferences));
    },
    setupMarkers(mks) {
      let markers = JSON.parse(JSON.stringify(mks));

      markers[0].time = 0;
      markers = markers.map((mark, i) =>
        !isNaN(mark.time) ? mark : { time: markers[i - 1].endTime, ...mark }
      );

      markers[markers.length - 1].endTime = this.player.duration;

      let markersContainer = document.querySelector('.plyr__markers__container');
      const progressContainer = document.querySelector('.plyr__progress');

      if (!markersContainer) {
        markersContainer = document.createElement('div');
        markersContainer.className = 'plyr__markers__container';
        progressContainer.appendChild(markersContainer);
      }

      for (const marker of markers) {
        const createdMarker = document.querySelector(
          `div[data-marker-time="${marker.time}"]`
        );
        const markerLeft = (marker.time * 100) / this.player.duration;
        const tempMarker = document.createElement('div');

        tempMarker.className = 'plyr__marker';
        tempMarker.style.left = `${markerLeft}%`;
        tempMarker.style.setProperty(
          '--data-marker-width',
          `${((marker.endTime - marker.time) * 100) / this.player.duration}%`
        );

        tempMarker.setAttribute('data-marker-text', marker.text);
        tempMarker.setAttribute('data-marker-time', marker.time);
        if (!createdMarker) markersContainer.appendChild(tempMarker);
      }

      this.setMarkers(markers);
    },
    setMarkers(markers) {
      this.definedMarkers = JSON.parse(JSON.stringify(markers));

      const observer = callback =>
        new MutationObserver(mutations =>
          mutations.forEach(mutation => callback(mutation))
        );

      const playProgress = document.querySelector('input[data-plyr=seek]');
      const loadProgress = document.querySelector('.plyr__progress__buffer');

      const getCurrentMarker = duration =>
        markers.find(marker => duration >= marker.time && marker.endTime >= duration) ||
        markers[markers.length - 1];

      const setPastProgress = (markerIndex, type) => {
        markers.forEach((marker, index) => {
          const markerElement = document.querySelector(
            `div[data-marker-text="${marker.text}"]`
          );

          if (
            index < markerIndex &&
            !markerElement.style.cssText.match(`--data-marker-${type}: 100%;`) &&
            markerIndex > 0
          )
            markerElement.style.setProperty(`--data-marker-${type}`, `100%`);
          else if (index > markerIndex) {
            markerElement.style.setProperty(`--data-marker-${type}`, `0%`);
          }
        });
      };

      const setProgress = (marker, time, type) => {
        if (marker?.text) {
          const markerElement = document.querySelector(
            `div[data-marker-text="${marker.text}"]`
          );

          if (marker.endTime == 0) marker.endTime = this.player.duration;

          const markerIndex = markers.findIndex(mk => mk.text == marker.text);
          setPastProgress(markerIndex, type);

          markerElement.style.setProperty(
            `--data-marker-${type}`,
            `${((time - marker.time) * 100) / (marker.endTime - marker.time)}%`
          );
        }
      };

      /* Utils */

      const convertToSeconds = time => {
        let timeSplit = time.split(':');
        if (timeSplit.length < 3) timeSplit.unshift(0);

        return timeSplit[0] * 3600 + timeSplit[1] * 60 + Number(timeSplit[2]);
      };

      /* Setters */

      const changeMarkerProgress = () => {
        const marker = getCurrentMarker(this.player.currentTime);
        setProgress(marker, this.player.currentTime, 'progress');
      };

      const changeLoadProgress = () => {
        const loadCurrentTime =
          (parseFloat(loadProgress.value) * this.player.duration) / 100;
        const marker = getCurrentMarker(loadCurrentTime);

        setProgress(marker, loadCurrentTime, 'load-progress');
      };

      /* Setup observers */

      observer(changeMarkerProgress).observe(playProgress, {
        attributes: true,
        attributeFilter: ['style'],
      });

      observer(changeLoadProgress).observe(loadProgress, {
        attributes: true,
        attributeFilter: ['value'],
      });

      /* Seeker event */

      const playerTip = document.querySelector('.plyr__tooltip');

      const setMarkerText = marker => {
        if (marker) {
          const mouseDisplay = document.querySelector('.plyr__tooltip');
          let markerTip = document.querySelector('.plyr__marker__tooltip');

          if (!markerTip && mouseDisplay) {
            markerTip = document.createElement('span');
            markerTip.className = 'plyr__marker__tooltip';
            markerTip.innerText = marker.text;
            mouseDisplay.appendChild(markerTip);
          } else if (markerTip) markerTip.innerText = marker.text;
        }
      };

      const changeSeekEvent = () => {
        const currentMarker = getCurrentMarker(convertToSeconds(playerTip.innerText));
        const currentMarkerElement = document.querySelector(
          `div[data-marker-time="${currentMarker.time}"]`
        );

        currentMarkerElement.style.height = '12px';
        currentMarkerElement.style.top = '-2px';

        setMarkerText(currentMarker);

        markers.forEach(marker => {
          const markerElement = document.querySelector(
            `div[data-marker-time="${marker.time}"]`
          );

          if (currentMarker.time != marker.time) {
            markerElement.style.height = '';
            markerElement.style.top = '';
          }
        });
      };

      observer(changeSeekEvent).observe(playerTip, {
        attributes: true,
        attributeFilter: ['style'],
      });

      const progressContainer = document.querySelector('.plyr__progress__container');

      progressContainer.addEventListener('mouseleave', () => {
        markers.forEach(marker => {
          const markerElement = document.querySelector(
            `div[data-marker-time="${marker.time}"]`
          );
          markerElement.style.height = '';
          markerElement.style.top = '';

          setMarkerText({ text: '' });
        });
      });

      setTimeout(() => {
        const markersMenu = document.querySelector('.markers-menu');
        document.querySelector('.plyr').prepend(markersMenu);
      }, 500);
    },
  },
  mounted() {
    this.$nextTick(() => {
      clearInterval(startInterval);
      this.getPreferences();
      this.setPlayer();
    });
  },
  watch: {
    '$route.params.lid': {
      handler(data) {
        if (data) this.resetPlayer();
      },
      deep: true,
    },
    markers: {
      handler() {
        this.resetPlayer();
      },
      deep: true,
    },
  },
  beforeDestroy() {
    clearInterval(startInterval);
    if (this.player) this.player.destroy();
  },
};
</script>
<style>
video {
  width: 100%;
  min-width: 100%;
  max-width: 90vw;
  height: 100%;
}

.video-wrapper {
  position: relative;
}

.markers-menu {
  position: absolute;
  z-index: 2;
  right: 10px;
  text-align: right;
  display: none;
  opacity: 0;
  top: 10px;
  color: var(--text-primary);
  animation: menu-animation 0.3s ease-in-out;
}

.video-wrapper:hover .markers-menu {
  display: block;
  opacity: 1;
}

.markers-menu .fas {
  padding: 10px;
  background-color: var(--text-secondary);
  border-radius: 5px;
  font-size: 1.1rem;
  box-shadow: 0 0 10px 1px #242424fa;
  cursor: pointer;
}

.markers-menu .fas:hover {
  background-color: var(--lighted-secondary);
}

.markers-menu ul {
  display: none;
  opacity: 0;
  background-color: var(--text-secondary);
  box-shadow: 0 0 10px 1px #242424fa;
  margin-top: 10px;
  border-radius: 5px;
  animation: menu-animation 0.3s ease-in-out;
  max-height: 55vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--text-lighted) transparent;
}

.markers-menu input[type='checkbox']:checked ~ ul {
  display: block;
  opacity: 1;
}

.markers-menu input[type='checkbox']:checked ~ label .fas::before {
  content: '\f00d';
}

.markers-menu li {
  padding: 10px;
  max-width: 200px;
  text-align: center;
  user-select: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.markers-menu li:not(:last-child) {
  border-bottom: 1px solid #4d4d442b;
}

.markers-menu li:hover {
  background-color: #4d4d442b;
}

.plyr__markers__container {
  width: calc(100% - 4px);
  position: absolute;
  top: 0;
  box-sizing: border-box;
  height: 100%;
}

.plyr__marker {
  width: var(--data-marker-width);
  height: 100%;
  background-color: #717171a3;
  position: absolute;
}

.plyr__marker::after {
  content: '';
  position: absolute;
  z-index: 0;
  height: 100%;
  width: var(--data-marker-load-progress);
  background-color: #24242469;
  left: 0;
}

.plyr__marker::before {
  content: '';
  position: absolute;
  z-index: 1;
  height: 100%;
  width: var(--data-marker-progress);
  background-color: var(--lighted-secondary);
  left: 0;
}

.plyr__marker:not(:last-child) {
  width: calc(var(--data-marker-width) - 2px);
}

.plyr__marker__tooltip {
  width: max-content;
  text-align: center;
  display: block;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 16px;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 0.9rem;
  max-width: 300px;
  transform: translate(-50%, -100%);
  left: 50%;
  top: -10px;
}

.plyr__with_markers .plyr__controls__item.plyr__progress__container {
  position: relative;
}

.plyr__with_markers .plyr__progress .plyr__progress__buffer {
  height: 100%;
  margin-top: 0;
  top: 0;
  opacity: 0;
}

.plyr__with_markers .plyr__progress input[type='range']::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  background-color: transparent !important;
}

.plyr__with_markers .plyr__progress .plyr__progress__buffer::-moz-progress-bar {
  background: #ccc9c991;
  border-radius: 0 2px 2px 0;
}

.plyr__with_markers .plyr__progress input[type='range']::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  color: transparent;
}

.plyr__with_markers .plyr__progress input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  left: -1px;
}

.plyr__with_markers .plyr__tooltip {
  z-index: 5;
}

.plyr__with_markers .plyr__progress input[type='range'] {
  height: 8px;
  cursor: pointer;
}

.plyr__with_markers .plyr__controls__item.plyr__progress__container,
.plyr__with_markers .plyr__progress .plyr-seek-9502 {
  height: 8px;
}

.plyr__with_markers .plyr__progress input[type='range']::-moz-range-track,
.plyr__with_markers .plyr__progress input[type='range']::-moz-range-progress {
  background: transparent;
  background-color: transparent !important;
  height: var(--plyr-range-track-height, 8px) !important;
}

.plyr__with_markers
  .plyr__progress
  .plyr--full-ui.plyr--video
  input[type='range']::-moz-range-track {
  background-color: transparent;
}

@keyframes menu-animation {
  0% {
    display: none;
    opacity: 0;
  }
  100% {
    display: block;
    opacity: 1;
  }
}
</style>
