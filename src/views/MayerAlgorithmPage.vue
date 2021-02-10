<template>
  <div class="about">
    <p>
      Mayer
      algorithm主要的目的在於讓產生的差異內容最小化。以字串舉例，ABC字串變為BCD字串，會走完變化前和變化後的字串，變化前的部分就是刪除、變化後的部分就是新增、兩者內容相同時可以同時略過。
      還有幾個目前沒處理的特色，就是刪除優先於新增等
    </p>
    <div>
      <div class="editBox">
        <h3>舊的版本</h3>
        <textarea v-model="oriText" class="textEdit"></textarea>
      </div>
      <div class="editBox">
        <h3>新的版本</h3>
        <textarea v-model="afterText" class="textEdit"></textarea>
      </div>
    </div>
    <div class="displayDiffBox">
      <h3>差異</h3>
      <div id="diffDisplay"></div>
      <!-- <p v-html="diffContent"></p> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import {
  mayerDiffVer1,
  ProgressDiffInfo
} from "@/diff_algorithm/mayerAlgorithm";
@Component
export default class MayerAlgorithmPage extends Vue {
  diffContent = "";
  oriText = "";
  afterText = "";
  diffDisplay: HTMLDivElement | undefined;

  updateDiffHTMLDisplay(info: ProgressDiffInfo) {
    if (this.diffDisplay) {
      this.diffDisplay.innerHTML = "";
      for (const line of info.diffInfo) {
        const newDiv = document.createElement("div");
        if (line.state === "NONE") {
          newDiv.textContent = line.content;
          this.diffDisplay.append(newDiv);
        } else if (line.state === "INSERT") {
          newDiv.textContent = "+ " + line.content;
          newDiv.classList.add("insertText");
          this.diffDisplay.append(newDiv);
        } else if (line.state === "DELETE") {
          newDiv.classList.add("deleteText");

          newDiv.textContent = "- " + line.content;
          this.diffDisplay.append(newDiv);
        }
      }
    } else {
      throw Error("no dom");
    }
  }

  getDiffString(info: ProgressDiffInfo) {
    let result = "";
    for (const line of info.diffInfo) {
      if (line.state === "NONE") {
        result += line.content + "<br>";
      } else if (line.state === "INSERT") {
        result += "+ " + line.content + "<br>";
      } else if (line.state === "DELETE") {
        result += "- " + line.content + "<br>";
      }
    }
    return result;
  }
  updateDiff() {
    const diffInfo = mayerDiffVer1(
      this.oriText.split("\n").filter(ele => ele.length > 0),
      this.afterText.split("\n").filter(ele => ele.length > 0)
    );
    // console.log("diffInfo : ", diffInfo);
    // this.diffContent = this.getDiffString(diffInfo);
    this.updateDiffHTMLDisplay(diffInfo);
  }
  mounted() {
    this.diffDisplay = document.getElementById("diffDisplay") as HTMLDivElement;
  }
  @Watch("oriText")
  onOriTextChange() {
    this.updateDiff();
  }
  @Watch("afterText")
  onAfterTextChange() {
    this.updateDiff();
  }
}
</script>

<style>
.insertText {
  background-color: rgba(30, 151, 56, 0.63);
}
.deleteText {
  background-color: rgba(190, 27, 27, 0.404);
}
.editBox {
  display: inline-block;
}
.textEdit {
  width: 200px;
  height: 200px;
}
.displayDiffBox {
  margin: auto;
  width: 400px;
}
</style>
