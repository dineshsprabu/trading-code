// How to use this script?
// Open a new sheet on docs.google.com and use formula like below
// =GOOGLEFINANCE("NSE:TATAMOTORS", "all", TODAY()-100, TODAY(), "daily")
// Copy an paste the content to the variable data.
// The output will be visible on the console.

function getAsJSON(data) {
  var lines = data.split("\n");
  var keys = [];
  var rows = [];
  for (var i = 0; i < lines.length; i++) {
    var tokens = lines[i].split("\t");
    if (i === 0) {
      keys = tokens;
      continue;
    }

    var row = {};
    for (let k = 0; k < tokens.length; k++) {
      row[keys[k]] = tokens[k];
    }
    rows.push(row);
  }

  return rows;
}

// How long does it take to reach the percentage of profit given?
function getTimetakenForProfitPercentageFromAnyDay(data, percent) {
  var result = "";
  var dataObjs = getAsJSON(data);
  // Loop to start from each day of given set.
  for (let i = 0; i < dataObjs.length; i++) {
    // Inner loop to calculate the percentage from a start day
    // till a specific day till it hits the change expected.
    for (let j = i; j < dataObjs.length; j++) {
      let prevOpen = Number(dataObjs[i].Open);
      let currClose = Number(dataObjs[j].Close);
      let change = ((currClose - prevOpen) / prevOpen) * 100;
      if (change >= percent) {
        // Expected loss between the percentage chagne.
        // Min of open or close price between the
        // percentage change.
        let min = prevOpen;
        for (let m = i; m < j; m++) {
          let currMinOpen = Number(dataObjs[m].Open);
          if (currMinOpen < min) {
            min = currMinOpen;
          }
          let currMinClose = Number(dataObjs[m].Close);
          if (currMinClose < min) {
            min = currMinClose;
          }
        }

        let lossPercentage = ((prevOpen - min) / prevOpen) * 100;

        let days = j - i;
        result =
          result +
          "<div> Profit of " +
          change.toFixed(2) +
          "% took " +
          days +
          " trading days from " +
          dataObjs[i].Date.split(" ")[0] +
          " till " +
          dataObjs[j].Date.split(" ")[0] +
          " with price change from " +
          prevOpen +
          " to " +
          currClose +
          " with max unrealized loss of " +
          lossPercentage.toFixed(2) +
          "% - (" +
          min +
          ") </div>";
        break;
      }
    }
  }

  return result;
}

document.querySelector("button").onclick = () => {
  var data = document.querySelector("textarea").value;
  var percentage = document.querySelector("input").value;
  var result = getTimetakenForProfitPercentageFromAnyDay(
    data,
    Number(percentage)
  );
  console.log(result);
  document.querySelector("div#result").innerHTML = "<div>" + result + "</div>";
};
