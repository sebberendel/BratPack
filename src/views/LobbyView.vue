<template>
  <Nav :hideNav="false"
  :uiLabels="uiLabels"
  :lang="lang"
  @language-changed="handleLanguageChange">
  </Nav>
  
  <div>
    <h3>Lobby ID: {{pollId}}</h3>
    <div class="usernameInput" v-if="!joined">
      <input type="text" v-model="userName" :placeholder=this.uiLabels.userName>
      <button v-on:click="participateInPoll">
        {{ this.uiLabels.participateInPoll }}
      </button>
    </div>
    <div class="waitingRoom" v-if="joined">
      <p>{{ this.uiLabels.waitingForHost }}</p>
      <div>
        <h3>{{ this.uiLabels.players }}</h3>
        <p v-for="participant in participants">{{ participant}}</p>
      </div>
  </div>
  </div>
</template>

<script>
import Nav from '@/components/ResponsiveNav.vue'
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'LobbyView',
  components: {Nav},
  data: function () {
    return {
      userName: "",
      pollId: "inactive game",
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      participants: [],
      uiLabels: {}
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => {
      this.participants = p;
      console.log("Socket ID: ", socket.id) // kanske spara ner socketID i dataobjektet ovan...? 
                                            // Eller spara userName: socketID som key value pairs i Data.js /sebbe
    });
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );
    socket.emit( "joinCustomGame", this.pollId );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    participateInPoll: function () {
      socket.emit( "participateInCustomGame", {gamePin: this.pollId, name: this.userName} )
      this.joined = true;
    },
    handleLanguageChange(newLang) {
      this.lang = newLang;
      localStorage.setItem("lang", newLang);
      socket.emit("getUILabels", this.lang);
    }
  }
}
</script>

<style scoped>
.usernameInput {
    position: fixed;  
    top: 50%;         
    left: 50%;        
    transform: translate(-50%, -50%); 
    background-color: rgb(199, 233, 199) !important; /*av nån anledning blir det inte rätt färg annars... */
    padding: 20px;
    border: 2px solid rgb(12, 66, 1);
    border-radius: 6px;
    z-index: 9999;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.7);
}
.usernameInput input {
  width: 200px;
  font-size: 1.5rem;
  outline: none;
  border: 2px solid rgb(12, 66, 1);
  border-radius: 6px;
  padding: 10px;
}
.usernameInput button {
  background-color: rgb(149, 235, 153);
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 6px;
  border: 2px solid rgb(12, 66, 1);
  padding: 10px;
  margin: 0;
}
button:hover {
  background-color: rgb(126, 201, 130);
}

.waitingRoom div{
  background-color: #ff8c42;
  border-radius: 15px;
  border: 4px solid #da6822;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.7);
  width: 20%;
  margin: 5% 0% 0% 40%
}

</style>
