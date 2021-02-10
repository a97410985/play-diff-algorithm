export interface ProgressDiffInfo {
  curOriIndex: number;
  curAfterIndex: number;
  diffInfo: { state: diffState; content: string }[];
}

type diffState = "NONE" | "INSERT" | "DELETE";

function updateDiagonalMove(
  info: ProgressDiffInfo,
  oriLines: string[],
  afterLines: string[]
) {
  // would continuously move diagonal if can move diagonal
  while (oriLines[info.curOriIndex] === afterLines[info.curAfterIndex]) {
    if (
      info.curOriIndex === oriLines.length &&
      info.curAfterIndex === afterLines.length
    ) {
      break;
    }
    info.diffInfo.push({ state: "NONE", content: oriLines[info.curOriIndex] });
    info.curAfterIndex++;
    info.curOriIndex++;
  }
  return info;
}

export function mayerDiffVer1(oriLines: string[], afterLines: string[]) {
  // make a table-like graph, has horizontal line and vertical line and diagonal line
  // top is original content, left is after changed content
  // right move and down move would be considered as move 1 step, !!! and diagonal move would be considered move 0 step
  const targetCol = oriLines.length;
  const targetRow = afterLines.length;
  const queue: ProgressDiffInfo[] = [
    { curAfterIndex: 0, curOriIndex: 0, diffInfo: [] }
  ];
  while (true) {
    const nextQueue: ProgressDiffInfo[] = [];
    while (queue.length > 0) {
      const curDiffInfo = queue.shift()!;
      // check can right move, if can add right move result
      if (curDiffInfo.curOriIndex < targetCol) {
        let newDiffInfo = JSON.parse(
          JSON.stringify(curDiffInfo)
        ) as ProgressDiffInfo;
        newDiffInfo.diffInfo.push({
          state: "DELETE",
          content: oriLines[newDiffInfo.curOriIndex]
        });
        newDiffInfo.curOriIndex++;
        // if meet diagonal move!!!
        newDiffInfo = updateDiagonalMove(newDiffInfo, oriLines, afterLines);
        nextQueue.push(newDiffInfo);
      }

      // check can down move, if can add down move result
      if (curDiffInfo.curAfterIndex < targetRow) {
        let newDiffInfo = JSON.parse(
          JSON.stringify(curDiffInfo)
        ) as ProgressDiffInfo;
        newDiffInfo.diffInfo.push({
          state: "INSERT",
          content: afterLines[newDiffInfo.curAfterIndex]
        });
        newDiffInfo.curAfterIndex++;
        // if meet diagonal move!!!
        newDiffInfo = updateDiagonalMove(newDiffInfo, oriLines, afterLines);
        nextQueue.push(newDiffInfo);
      }

      if (
        oriLines[curDiffInfo.curOriIndex] ===
        afterLines[curDiffInfo.curAfterIndex]
      ) {
        // can move diagonal
        nextQueue.push(updateDiagonalMove(curDiffInfo, oriLines, afterLines));
      }
    }
    for (const info of nextQueue) {
      if (info.curAfterIndex === targetRow && info.curOriIndex === targetCol) {
        return info;
      }
    }
    queue.push(...nextQueue);
  }
}

// console.log(mayerDiffVer1(["a", "b", "c"], ["b", "c"]));
console.log(mayerDiffVer1(["a", "a", "a"], ["a", "a"]));
