import { sum } from "./assets/js/sum";
import * as _ from "lodash";

$(document).ready(() => {
  const param1 = document.getElementById("param1").dataset.param1;
  const param2 = document.getElementById("param2").dataset.param2;
  const result = document.getElementById("result");
  const resultStr = result.textContent;

  const resultSum = sum(parseInt(param1), parseInt(param2));

  result.innerHTML = `${resultStr + resultSum}`;

  const a = "my name is ";

  console.log(`${a}hatayuki`);
});
