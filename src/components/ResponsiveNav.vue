<template>
  <nav :class="{'hide': hideNav}">
    <div id="Logo">
      <router-link to="/">
        <img src="/public/img/logo.png" alt="Logo" />
      </router-link>
    </div>
    <div id="Language">
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

export default {
  name: 'ResponsiveNav',
  components: {
    LanguageSwitcher
  },
  props: {
    hideNav: {
      type: Boolean,
      default: false
    },
    uiLabels: {
      type: Object,
      default: () => ({ home: 'Home', about: 'About', changeLanguage: 'Change Language' })
    },
    lang: {
      type: String,
      default: 'en'
    }
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
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 3rem;
  background-color: rgba(0,0,0,0);
  color: #000;
  padding: 0 1rem;
  box-sizing: border-box;
}

#Logo img {
  height: 40px;
  cursor: pointer;
}

#Links {
  display: flex;
  gap: 1.5rem;
}

#Links a {
  color: black;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  cursor: pointer;
}


.hide {
  display: none;
}
</style>





