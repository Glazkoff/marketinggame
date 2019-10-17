<template>
  <div id="playground">
    <div id="play-field">
      <div
        class="play-information"
        :class="{'dragstart': dragstart, 'dragover': dragover}"
        @dragenter.prevent="dragov"
        @dragover.prevent
        @drop.prevent="altdrop"
        @dragleave="dragleave"
      ></div>
    </div>
    <div id="card-field">
      <div id="card-wrap" @mosedown="console.log('WTF>>')">
        <div
          class="card-box"
          v-for="(card, count) in cards"
          :key="count"
          draggable
          @dragstart.self="altdragstart"
          @dragend="altdragend"
        >
          <h6 class="card-title text-center">{{card.title}}</h6>
          <div class="card-image"></div>
          <small class="card-text text-center">{{card.text}}</small>
        </div>
      </div>
    </div>
    <div id="enemy-field"></div>
  </div>
</template>

<script>
import { log } from "util";
export default {
  name: "PlayGround",
  data() {
    return {
      dragstart: false,
      dragover: false,
      dragnode: undefined,
      cards: [
        {
          title: "Название карты 1!",
          text: "Описание карточки, описание карточки"
        },
        {
          title: "Название карты 2!",
          text: "Описание карточки, описание карточки"
        },
        {
          title: "Название карты 3!",
          text: "Описание карточки, описание карточки"
        },
        {
          title: "Название карты 4!",
          text: "Описание карточки, описание карточки"
        },
        {
          title: "Название карты 5!",
          text: "Описание карточки, описание карточки"
        }
      ]
    };
  },
  methods: {
    altdrop(e) {
      e.preventDefault();
      console.log("drop");
      console.log(e);
      this.dragovered = false;
      this.dragstart = false;
      if (typeof this.dragnode != undefined) {
        document.getElementById("card-wrap").removeChild(this.dragnode);
      }
    },
    altdragstart(e) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("text/plain", null);
      e.target.style.opacity = 0.5;
      e.target.style.transform = "scale(0.8)";
      this.dragstart = true;
      this.dragnode = e.target;
    },
    altdragend(e) {
      e.target.style.opacity = "";
      e.target.style.transform = "";
      this.dragover = false;
      this.dragstart = false;
    },
    dragov(e) {
      console.log("over");
      e.dataTransfer.dropEffect = "move";
      this.dragover = true;
    },
    dragleave(e) {
      console.log("leave");
      this.dragover = false;
    }
  }
};
</script>

<style>
#playground {
  background-color: #fff;
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 80px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 2fr 1fr;
}
#play-field,
#card-field {
  margin: auto auto;
  width: 100%;
  height: 100%;
}
#play-field {
  background-color: rgba(123, 45, 64, 0.3);
  grid-area: 1/1/2/2;
  display: flex;
}
#card-field {
  grid-area: 2/1/3/2;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 96%;
  height: 96%;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
}
.play-information {
  transition: background-color 0.25s;
  width: 96%;
  height: 96%;
  background-color: #fff;
  margin: auto auto;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
}
.dragstart {
  border: 8px dashed gray;
}
.dragover {
  background-color: #d8d8d8;
}
#card-wrap {
  display: flex;
  height: 100%;
  /* transition: all 0.5s;v -   */
}
.card-box {
  transition: all 0.4s;
  width: 124px;
  min-width: 124px;
  margin-right: 16px;
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background-color: #fff;
  border-radius: 8px;
}
.card-image {
  background-color: rgba(0, 0, 0, 0.3);
  width: 80%;
  height: 40%;
  min-height: 60px;
  margin: 0 auto;
}
#enemy-field {
  background-color: rgba(1, 24, 202, 0.3);
  grid-area: 1/2/3/3;
  height: 100%;
}

#card-field::-webkit-scrollbar {
  width: 4px;
  height: 8px;
  background-color: #f5f5f5;
}
#card-field::-webkit-scrollbar-track {
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}

#card-field::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: linear-gradient(top, #fff, #e4e4e4);
  border: 1px solid #aaa;
}

#card-field::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

#card-field::-webkit-scrollbar-thumb:active {
  background: linear-gradient(left, #0079fb, #1e98ba);
}
</style>