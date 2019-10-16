<template>
  <div id="playground">
    <div id="play-field">
      <div class="play-information" :class="{'dragover': overed}" @dragenter="dragov"></div>
    </div>
    <div id="card-field">
      <div id="card-wrap">
        <div
          class="card-box"
          v-for="(card, count) in cards"
          :key="count"
          @mousedown="dragMouseDown"
          @dragstart.prevent
          @dragover="dragov"
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
export default {
  name: "PlayGround",
  data() {
    return {
      overed: false,
      cards: [
        {
          title: "Название карты!",
          text: "Описание карточки, описание карточки"
        },
        {
          title: "Название карты!",
          text: "Описание карточки, описание карточки"
        },
        {
          title: "Название карты!",
          text: "Описание карточки, описание карточки"
        },
        {
          title: "Название карты!",
          text: "Описание карточки, описание карточки"
        },
        {
          title: "Название карты!",
          text: "Описание карточки, описание карточки"
        },
        {
          title: "Название карты!",
          text: "Описание карточки, описание карточки"
        },
        {
          title: "Название карты!",
          text: "Описание карточки, описание карточки"
        }
      ]
    };
  },
  methods: {
    dragov(e) {
      console.log(e);
      console.log("!!!");
    },
    dragMouseDown(e) {
      let card = e.target;
      if (e.target.className != "card-box") {
        card = e.target.parentElement;
      }
      let shiftX = e.pageX - card.getBoundingClientRect().left;
      let shiftY = e.pageY - card.getBoundingClientRect().top;
      card.style.position = "absolute";
      moveAt(e);
      document.body.appendChild(card);

      card.style.zIndex = 1000;
      card.style.minHeight =
        document.querySelector("#card-field").clientHeight + "px";
      function moveAt(e) {
        card.style.left = e.pageX - shiftX / 2 + "px";
        card.style.top = e.pageY - shiftY / 2 + "px";
      }
      document.onmousemove = function(e) {
        moveAt(e);
      };

      card.onmouseup = function() {
        document.onmousemove = null;
        card.onmouseup = null;
      };
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
  /* background-color: rgba(44, 244, 32, 0.3); */
  grid-area: 2/1/3/2;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 96%;
  height: 96%;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
}
.play-information {
  width: 96%;
  height: 96%;
  background-color: #fff;
  margin: auto auto;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
}
.dragover {
  border: 8px dashed gray;
}
#card-wrap {
  display: flex;
  height: 100%;
}
.card-box {
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
  /* -khtml-user-drag: element;
  -webkit-user-drag: element; */
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