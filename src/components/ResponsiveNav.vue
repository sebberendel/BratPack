<template>
  <nav>
    <div id="Logo">
      <router-link to="/">
        <img src="/img/logo_pwr_hour2.0.png" alt="Logo" />
      </router-link>
    </div>

    <div id="Timer" v-if="this.gameActive">
      <div class="timer-wrapper">
        <TimerComponent :gamePin="gamePin" />
      </div>
    </div>

    <div id="UserInfo" v-if="this.gamePin || this.userName">
      <div id="GamePin">Pin: {{ this.gamePin }}</div>
      <div id="UserName" v-if="this.userName">
        <h1>{{uiLabels.ResponsiveNav.name}} {{ this.userName }}</h1>
      </div>
    </div>

    <div v-if="showLangSwitch" id="Language">
      <LanguageSwitcher 
        :lang="lang" 
        :uiLabels="uiLabels"
        @language-changed="emitLanguageChangeToParent"
      />
    </div>
  </nav>
</template>

<script>
import LanguageSwitcher from './LanguageSwitcher.vue'
import TimerComponent from './TimerComponent.vue';

export default {
  name: 'ResponsiveNav',
  components: {
    LanguageSwitcher,
    TimerComponent
  },
  props: {
    uiLabels: {
      type: Object,
      default: () => ({ home: 'Home', about: 'About', changeLanguage: 'Change Language' })
    },
    lang: {
      type: String,
      default: 'en'
    },
    gamePin: {
      type: String
    },
    userName: {
      type: String
    },
    gameActive: {
      type: Boolean,
      default: false
    },
    showLangSwitch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}; 
  },
  methods: {
    emitLanguageChangeToParent(newLang) {
      this.$emit('language-changed', newLang);
    }
  }
};
</script>

<style scoped>

nav {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 70px; 
  box-sizing: border-box;
}
#Logo img {
  height: 100px;
  cursor: pointer;
}

#Timer {
  flex-grow: 1;
  display: flex;
  text-align: center;
  align-items: center;
}
.timer-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; 
}


#UserInfo {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

#GamePin {
  font-size: 1.2rem;
  color: #1d3557; 
  margin: 0;
  font-weight: bold;
}

#UserName h1 {
  font-size: 1.2rem;
  color: #1d3557; 
  font-weight: bold;
  margin: 0;
}

#Language {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.hide {
  display: none;
}
</style>