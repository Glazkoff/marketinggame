<template>
  <div id="playground">
    <div id="play-field"></div>
    <div id="card-field">
      <div id="card-wrap">
        <div class="card" v-for="(card, count) in cards" :key="count">
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
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
  target: document.querySelector(".card"),
  // If the container is null, the position is fixed. (default: parentElement(document.body))
  container: document.body,
  draggable: true
});

export default {
  name: "PlayGround",
  data() {
    return {
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
  }
};
</script>

<style>
#playground {
  background-color: #fff;
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 90px;
  /* display: flex; */
  /* flex-direction: column; */
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 2fr 1fr;
}
#play-field,
#card-field {
  margin: auto auto;
  width: 100%;
  height: 100%;
  /* min-height: 180px; */
}
#play-field {
  background-color: rgba(123, 45, 64, 0.3);
  grid-area: 1/1/2/2;
}
#card-field {
  /* background-color: rgba(44, 244, 32, 0.3); */
  grid-area: 2/1/3/2;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 96%;
  height: 96%;
  /* border-radius: 8px; */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
}
#card-wrap {
  display: flex;
  height: 100%;
}
.card {
  width: 124px;
  min-width: 124px;
  margin-right: 16px;
  user-select: none;
  cursor: pointer;
}
.card-image {
  background-color: rgba(0, 0, 0, 0.3);
  width: 80%;
  height: 40%;
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